from ariadne import convert_kwargs_to_snake_case, ObjectType, QueryType

query = QueryType()


@query.field("search")
@convert_kwargs_to_snake_case
def resolve_search(*_, search_pattern: str):
    return [search_pattern + " " + str(i) for i in range(5)]


slide = ObjectType("Slide")


@slide.field("content")
def resolve_content(obj, *_):
    return f'{obj}'


resolvers = [query, slide]
