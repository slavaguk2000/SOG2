from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType, MutationType, SubscriptionType
from src.services.elasticsearch.search.bible import bible_search, get_bible_books_by_bible_id, get_chapter_verses, \
    get_bible_slide_by_id, update_bible_slide_usage
from asyncio import Queue

active_slide_queue = Queue()
query = QueryType()
mutation = MutationType()
subscription = SubscriptionType()
current_active_slide = None


@query.field("search")
@convert_kwargs_to_snake_case
def resolve_search(*_, search_pattern: str):
    return bible_search(search_pattern, "0")


@query.field("bibleBooks")
@convert_kwargs_to_snake_case
def resolve_bible_books(*_, bible_id: str):
    return get_bible_books_by_bible_id(bible_id)


@query.field("bibleVerses")
@convert_kwargs_to_snake_case
def resolve_bible_verses(*_, bible_id: str, book_id: str, chapter: int):
    return get_chapter_verses(bible_id, book_id, chapter)


@mutation.field("setActiveSlide")
@convert_kwargs_to_snake_case
def resolve_set_active_slide(*_, slide_id=None):
    global current_active_slide
    active_slide = get_bible_slide_by_id(slide_id) if slide_id else None
    current_active_slide = active_slide
    print(current_active_slide)
    active_slide_queue.put_nowait(active_slide)

    if slide_id:
        update_bible_slide_usage(slide_id)
    return True


@subscription.source("activeSlideSubscription")
async def resolve_active_slide_subscription(*_):
    while True:
        active_slide = await active_slide_queue.get()
        yield active_slide


@subscription.field("activeSlideSubscription")
def resolve_active_slide_subscription_slide(active_slide, *_):
    return active_slide


slide = ObjectType("Slide")

#
# @slide.field("content")
# def resolve_content(obj, *_):
#     return obj["content"]


resolvers = [query, mutation, subscription, slide]
