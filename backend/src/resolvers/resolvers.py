from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType
from src.services.elasticsearch.search.bible import bible_search, get_bible_books_by_bible_id, get_chapter_verses

query = QueryType()


@query.field("search")
@convert_kwargs_to_snake_case
def resolve_search(*_, search_pattern: str):
    return bible_search(search_pattern)


@query.field("bibleBooks")
@convert_kwargs_to_snake_case
def resolve_bible_books(*_, bible_id: str):
    return get_bible_books_by_bible_id(bible_id)


@query.field("bibleVerses")
@convert_kwargs_to_snake_case
def resolve_bible_verses(*_, bible_id: str, book_id: str, chapter: int):
    return get_chapter_verses(bible_id, book_id, chapter)


slide = ObjectType("Slide")

#
# @slide.field("content")
# def resolve_content(obj, *_):
#     return obj["content"]


resolvers = [query, slide]
