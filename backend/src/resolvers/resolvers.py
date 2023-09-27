from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType, MutationType, SubscriptionType
from src.services.elasticsearch.search.bible import bible_search, get_bible_books_by_bible_id, get_chapter_verses, \
    get_bible_slide_by_id, update_bible_slide_usage
from asyncio import Queue

active_slide_queue = Queue()
query = QueryType()
mutation = MutationType()
subscription = SubscriptionType()
current_active_slide = None
subscribers_queues = []


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

    if slide_id:
        update_bible_slide_usage(slide_id)

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


@subscription.source("activeSlideSubscription")
async def resolve_active_slide_subscription(*_):
    queue = Queue()
    subscribers_queues.append(queue)
    print(current_active_slide)
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
