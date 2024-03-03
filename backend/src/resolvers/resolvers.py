from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType, MutationType, SubscriptionType

from src.services.bible_helper import update_bible_slide_usage
from src.services.elasticsearch.search.bible import bible_search, get_bible_history
from src.services.database_helpers.bible import get_bible_books_by_bible_id, get_chapter_verses, get_bible_slide_by_id
from src.services.database_helpers.sermon import get_sermons, get_sermon_by_id, get_sermon_paragraph_by_id, \
    add_slide_audio_mapping
from src.services.elasticsearch.sync.sermon import sync_sermons
from src.services.parsers.bibleParsers.sog_parser import SimpleBibleParser
from asyncio import Queue

from src.services.elasticsearch.search.sermon.sermon import sermon_search
from src.services.elasticsearch.sync.bible import sync_bible

active_slide_queue = Queue()
query = QueryType()
mutation = MutationType()
subscription = SubscriptionType()
current_active_slide = None
subscribers_queues = []


@query.field("search")
@convert_kwargs_to_snake_case
def resolve_search(*_, search_pattern: str, tab_type: str, **kwargs):
    if tab_type == 'Bible':
        return bible_search(search_pattern, kwargs["id"] if kwargs.get("id") else "607e6be1-dc31-498e-ba8b-f73ddd8806fb")
    if tab_type == 'Sermon':
        return sermon_search(search_pattern, "0")
    return []


@query.field("sermon")
@convert_kwargs_to_snake_case
def sermon(*_, sermon_id: str):
    return get_sermon_by_id(sermon_id)


@query.field("sermons")
@convert_kwargs_to_snake_case
def sermons(*_, sermons_collection_id: str):
    return get_sermons(sermons_collection_id)


@query.field("bibleBooks")
@convert_kwargs_to_snake_case
def resolve_bible_books(*_, bible_id: str):
    return get_bible_books_by_bible_id(bible_id)


@query.field("bibleVerses")
@convert_kwargs_to_snake_case
def resolve_bible_verses(*_, bible_id: str, book_id: str, chapter: int):
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
                )
        else:
            active_slide = get_bible_slide_by_id(slide_id)
            update_bible_slide_usage(slide_id)

    current_active_slide = active_slide
    print(current_active_slide)

    for subscriber_queue in subscribers_queues:
        subscriber_queue.put_nowait(active_slide)

    return True


@mutation.field("setFreeSlide")
@convert_kwargs_to_snake_case
def resolve_set_active_slide(*_, text: str, title: str):
    global current_active_slide
    current_active_slide = {"content": text, "title": title}

    for subscriber_queue in subscribers_queues:
        subscriber_queue.put_nowait(current_active_slide)

    return True


@mutation.field("addBibleFromSog")
@convert_kwargs_to_snake_case
def resolve_set_active_slide(*_, sog_file_src: str, language: str, translation: str):
    SimpleBibleParser.parse(sog_file_src, language, translation)
    return True


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
    sync_sermons()


@subscription.source("activeSlideSubscription")
async def resolve_active_slide_subscription(*_):
    queue = Queue()
    subscribers_queues.append(queue)
    yield current_active_slide

    try:
        while True:
            active_slide = await queue.get()
            yield active_slide
    finally:
        subscribers_queues.remove(queue)


@subscription.field("activeSlideSubscription")
def resolve_active_slide_subscription_slide(active_slide, *_):
    return active_slide


slide = ObjectType("Slide")

#
# @slide.field("content")
# def resolve_content(obj, *_):
#     return obj["content"]


resolvers = [query, mutation, subscription, slide]
