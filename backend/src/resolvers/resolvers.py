from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType
from src.services.elasticsearch.search.bible import bible_search

query = QueryType()


@query.field("search")
@convert_kwargs_to_snake_case
def resolve_search(*_, search_pattern: str):
    return bible_search(search_pattern)


slide = ObjectType("Slide")


@slide.field("content")
def resolve_content(obj, *_):
    return f'{obj}'


resolvers = [query, slide]
