from typing import List

from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType, MutationType, SubscriptionType

from src.services.bible_helper import update_bible_slide_usage
from src.services.database_helpers.bible import get_bible_books_by_bible_id, get_chapter_verses, get_bible_slide_by_id, \
    get_bibles
from src.services.database_helpers.psalm.psalm import get_psalms_books, get_psalms_dicts, get_psalm_by_id, \
    PsalmsSortingKeys, \
    add_psalm_to_favourites, remove_psalm_from_favourites, delete_psalm_book, update_psalm_transposition, \
    get_psalm_slide_by_id, reorder_psalms_in_psalms_book, get_favourite_psalms_dicts, is_psalm_in_favourite, \
    create_psalm, get_psalm_with_transposition, get_real_transposition
from src.services.database_helpers.psalm.update_psalm import update_psalm
from src.services.database_helpers.sermon import get_sermons, get_sermon_by_id, get_sermon_paragraph_by_id, \
    add_slide_audio_mapping
from src.services.elasticsearch.search.bible.bible_getters import get_bible_history
from src.services.elasticsearch.search.bible.bible_search_engine.bible_search_engine import bible_search
from src.services.elasticsearch.search.psalm.psalm import psalm_search
from src.services.elasticsearch.sync.psalm import sync_psalms
from src.services.elasticsearch.sync.sermon import sync_sermons
from src.services.parsers.bibleParsers.sog_parser import SimpleBibleParser
from asyncio import Queue

from src.services.elasticsearch.search.sermon.sermon import sermon_search
from src.services.elasticsearch.sync.bible import sync_bible
from src.services.parsers.psalmsParsers.importer import PsalmsJsonImporter
from src.services.parsers.psalmsParsers.nova_piesn_parser import NovaPiesnPsalmParser
from src.services.parsers.psalmsParsers.sog_parser import SimplePsalmParser
from src.services.parsers.psalmsParsers.utils import import_song_images
from src.services.parsers.sermonParsers.tableJSONParser import TableJSONParser
from src.types.commonTypes import SortingDirection

active_slide_queue = Queue()
query = QueryType()
mutation = MutationType()
subscription = SubscriptionType()
current_active_slide = None
current_active_psalm_chords = None
current_favourite_psalms = []
slide_subscribers_queues = []
psalm_chords_subscribers_queues = []
favourite_psalms_subscribers_queues = []


@query.field("search")
@convert_kwargs_to_snake_case
def resolve_search(*_, search_pattern: str, tab_type: str, **kwargs):
    if tab_type == 'Bible':
        return bible_search(search_pattern,
                            kwargs["id"] if kwargs.get("id") else "607e6be1-dc31-498e-ba8b-f73ddd8806fb")
    if tab_type == 'Sermon':
        return sermon_search(search_pattern, "0", kwargs.get("id"))
    if tab_type == 'Psalm':
        return psalm_search(search_pattern, kwargs.get("id"))
    return []


@query.field("sermon")
@convert_kwargs_to_snake_case
def sermon(*_, sermon_id: str):
    return get_sermon_by_id(sermon_id)


@query.field("sermons")
@convert_kwargs_to_snake_case
def sermons(*_, sermons_collection_id: str):
    return get_sermons(sermons_collection_id)


@query.field("psalmsBooks")
@convert_kwargs_to_snake_case
def resolve_psalms_books(*_):
    return get_psalms_books()


@query.field("psalms")
@convert_kwargs_to_snake_case
def resolve_psalms(*_, psalms_book_id: str, **kwargs):
    psalms_sorting = kwargs.get('psalms_sorting')
    return get_psalms_dicts(
        psalms_book_id,
        PsalmsSortingKeys[psalms_sorting["sorting_key"]] if psalms_sorting else None,
        SortingDirection[psalms_sorting["sort_direction"]] if psalms_sorting else SortingDirection.ASC,
    )


@query.field("psalm")
@convert_kwargs_to_snake_case
def resolve_psalm(*_, psalm_id: str):
    return get_psalm_by_id(psalm_id)


@query.field("bibles")
@convert_kwargs_to_snake_case
def resolve_bibles(*_):
    return get_bibles()


@query.field("bibleBooks")
@convert_kwargs_to_snake_case
def resolve_bible_books(*_, bible_id: str | None):
    return get_bible_books_by_bible_id(bible_id)


@query.field("bibleVerses")
@convert_kwargs_to_snake_case
def resolve_bible_verses(*_, bible_id: str, book_id: str | None, chapter: int):
    return get_chapter_verses(bible_id, book_id, chapter)


@query.field("bibleHistory")
@convert_kwargs_to_snake_case
def resolve_bible_history(*_, bible_id: str, **kwargs):
    return get_bible_history(bible_id, **kwargs)


@mutation.field("setActiveSlide")
@convert_kwargs_to_snake_case
def resolve_set_active_slide(*_, slide_id=None, **kwargs):
    global current_active_slide
    active_slide = None
    if slide_id:
        if kwargs.get('type') == 'Sermon':
            active_slide = get_sermon_paragraph_by_id(slide_id)
            slide_audio_mapping = kwargs.get('slide_audio_mapping')
            if slide_audio_mapping:
                add_slide_audio_mapping(
                    slide_audio_mapping['slide_collection_audio_mapping_id'],
                    slide_id,
                    slide_audio_mapping['time_point'],
                    offset=0,
                )
        elif kwargs.get('type') == 'Bible':
            active_slide = get_bible_slide_by_id(slide_id)
            update_bible_slide_usage(slide_id)
        elif kwargs.get('type') == 'Psalm':
            active_slide = get_psalm_slide_by_id(slide_id)
            if 'location' in active_slide and len(active_slide['location']) > 1:
                [psalms_book_id, psalm_id] = active_slide['location'][:2]
                if current_active_psalm_chords and psalm_id and psalms_book_id \
                        and current_active_psalm_chords["psalm_data"]["id"] != psalm_id:
                    transposition_steps = get_psalm_with_transposition(psalm_id, psalms_book_id)[1]
                    resolve_set_active_psalm(psalm_id=psalm_id, psalms_book_id=psalms_book_id, transposition=transposition_steps)

    current_active_slide = active_slide

    for subscriber_queue in slide_subscribers_queues:
        subscriber_queue.put_nowait(active_slide)

    return True


def notify_psalm_chords_subscribers():
    for subscriber_queue in psalm_chords_subscribers_queues:
        subscriber_queue.put_nowait(current_active_psalm_chords)


@mutation.field("setActivePsalm")
@convert_kwargs_to_snake_case
def resolve_set_active_psalm(*_, psalm_id: str | None = None, psalms_book_id: str | None = None, transposition: int = 0):
    global current_active_psalm_chords
    active_psalm_chords = None
    if psalm_id:
        raw_active_psalm_chords = get_psalm_by_id(psalm_id)
        active_psalm_chords = {
            "psalm_data": {
                "psalms_book_id": psalms_book_id,
                **raw_active_psalm_chords,
                "couplets": [item["couplet"] for item in raw_active_psalm_chords["couplets"]],
            },
            "root_transposition": transposition
        }

    current_active_psalm_chords = active_psalm_chords

    notify_psalm_chords_subscribers()

    return True


@mutation.field("setActiveSlideOffset")
@convert_kwargs_to_snake_case
def resolve_set_active_slide_offset(*_, slide_id=None, **kwargs):
    if slide_id:
        slide_audio_mapping = kwargs.get('slide_audio_mapping')
        offset = kwargs.get('offset')
        if kwargs.get('type') == 'Sermon' and slide_audio_mapping and offset:
            add_slide_audio_mapping(
                slide_audio_mapping['slide_collection_audio_mapping_id'],
                slide_id,
                slide_audio_mapping['time_point'],
                offset,
            )
            return True
    return False


@mutation.field("setFreeSlide")
@convert_kwargs_to_snake_case
def resolve_set_active_free_slide(*_, text: str, title: str):
    global current_active_slide
    current_active_slide = {"content": text, "title": title}

    for subscriber_queue in slide_subscribers_queues:
        subscriber_queue.put_nowait(current_active_slide)

    return True


@mutation.field("addBibleFromSog")
@convert_kwargs_to_snake_case
def resolve_add_bible_from_sog(*_, sog_file_src: str, language: str, translation: str):
    SimpleBibleParser.parse(sog_file_src, language, translation)
    return True


@mutation.field("addPsalmsFromSog")
@convert_kwargs_to_snake_case
def resolve_add_psalms_from_sog(*_, sog_file_src: str, language: str):
    return SimplePsalmParser.parse(sog_file_src, language)


@mutation.field("addPsalmsFromNavaPiesnJSONPL")
@convert_kwargs_to_snake_case
def resolve_add_psalms_from_sog(*_, file_src: str, language: str):
    return NovaPiesnPsalmParser.parse(file_src, language)


@mutation.field("importPsalms")
@convert_kwargs_to_snake_case
def resolve_import_psalms(*_, file_src: str, language: str):
    return PsalmsJsonImporter.import_psalms(file_src, language)


@mutation.field("importSermons")
@convert_kwargs_to_snake_case
def resolve_import_sermons(*_):
    return TableJSONParser().parse(delete_previous=True)


def notify_favourite_changed():
    global current_favourite_psalms
    current_favourite_psalms = get_favourite_psalms_dicts()

    for subscriber_queue in favourite_psalms_subscribers_queues:
        subscriber_queue.put_nowait(current_favourite_psalms)


@mutation.field("addPsalmToFavourite")
@convert_kwargs_to_snake_case
def resolve_add_psalm_to_favourite(
        *_,
        psalm_id: str,
        psalms_book_id: str | None = None,
        transposition: int | None = None
):
    res = add_psalm_to_favourites(psalm_id, get_real_transposition(psalm_id, transposition, psalms_book_id))

    if res:
        notify_favourite_changed()
    return res


@mutation.field("updatePsalm")
@convert_kwargs_to_snake_case
def resolve_update_psalm(*_, psalm_data: dict):
    return update_psalm(psalm_data)


@mutation.field("updatePsalmTransposition")
@convert_kwargs_to_snake_case
def resolve_update_psalm_transposition(*_, psalms_book_id: str, psalm_id: str, transposition: int):
    global current_active_psalm_chords
    res = update_psalm_transposition(psalms_book_id, psalm_id, transposition)

    if current_active_psalm_chords is not None \
            and current_active_psalm_chords["psalm_data"]["id"] == psalm_id \
            and current_active_psalm_chords["psalm_data"]["psalms_book_id"] == psalms_book_id:
        current_active_psalm_chords["root_transposition"] = transposition
        notify_psalm_chords_subscribers()

    if is_psalm_in_favourite(psalm_id):
        notify_favourite_changed()

    return res


@mutation.field("removePsalmFromFavourite")
@convert_kwargs_to_snake_case
def resolve_remove_psalm_from_favourite(*_, psalm_id: str):
    res = remove_psalm_from_favourites(psalm_id)
    if res:
        notify_favourite_changed()
    return res


@mutation.field("parseSermonsFromBranhamRu")
@convert_kwargs_to_snake_case
def parse_sermons_from_branham_ru(*_):
    return True


@mutation.field("syncBibleToElastic")
@convert_kwargs_to_snake_case
def sync_bible_to_elastic(*_, bible_id: str):
    return sync_bible(bible_id)


@mutation.field("syncSermonsToElastic")
@convert_kwargs_to_snake_case
def sync_sermons_to_elastic(*_):
    return sync_sermons()


@mutation.field("syncPsalmsToElastic")
@convert_kwargs_to_snake_case
def sync_psalms_to_elastic(*_):
    return sync_psalms()


@mutation.field("deletePsalmsBook")
@convert_kwargs_to_snake_case
def resolve_delete_psalm_book(*_, psalms_book_id: str):
    return delete_psalm_book(psalms_book_id)


@mutation.field("importSongImages")
@convert_kwargs_to_snake_case
def resolve_import_song_images(*_, psalms_book_id: str):
    return import_song_images(psalms_book_id)


@mutation.field("reorderPsalmsInPsalmsBook")
@convert_kwargs_to_snake_case
def resolve_reorder_psalms_in_psalms_book(*_, psalms_book_id: str, psalms_ids: List[str]):
    return reorder_psalms_in_psalms_book(psalms_book_id, psalms_ids)


@mutation.field("addPsalm")
@convert_kwargs_to_snake_case
def resolve_add_psalm(*_, psalms_book_id: str, psalm_number: str, psalm_name: str, tonality):
    return create_psalm(psalms_book_id, psalm_number, psalm_name, tonality)


@subscription.source("activeSlideSubscription")
async def resolve_active_slide_subscription(*_):
    queue = Queue()
    slide_subscribers_queues.append(queue)
    yield current_active_slide

    try:
        while True:
            active_slide = await queue.get()
            yield active_slide
    finally:
        slide_subscribers_queues.remove(queue)


@subscription.field("activeSlideSubscription")
def resolve_active_slide_subscription_slide(active_slide, *_):
    return active_slide


@subscription.source("activePsalmChordsSubscription")
async def resolve_active_psalm_chords_subscription(*_):
    queue = Queue()
    psalm_chords_subscribers_queues.append(queue)
    yield current_active_psalm_chords

    try:
        while True:
            psalm_data = await queue.get()
            yield psalm_data
    finally:
        psalm_chords_subscribers_queues.remove(queue)


@subscription.field("activePsalmChordsSubscription")
def resolve_active_psalm_chords_subscription_psalm_chords(psalm_data, *_):
    return psalm_data


@subscription.source("favouritePsalms")
async def resolve_favourite_psalms_subscription(*_):
    queue = Queue()
    favourite_psalms_subscribers_queues.append(queue)
    yield current_favourite_psalms

    try:
        while True:
            psalms_data = await queue.get()
            yield psalms_data
    finally:
        favourite_psalms_subscribers_queues.remove(queue)


@subscription.field("favouritePsalms")
def resolve_favourite_psalms_subscription_psalms_data(psalms_data, *_):
    return psalms_data


slide = ObjectType("Slide")


#
# @slide.field("content")
# def resolve_content(obj, *_):
#     return obj["content"]


resolvers = [query, mutation, subscription, slide]

notify_favourite_changed()
