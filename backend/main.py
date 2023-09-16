from ariadne import make_executable_schema, snake_case_fallback_resolvers
from ariadne.asgi import GraphQL
from starlette.middleware.cors import CORSMiddleware

from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.search.bible import get_bible_books_by_bible_id, bible_search, get_chapter_verses
from src.typedefs.main_typedefs import type_defs
from src.resolvers.resolvers import resolvers

print(bible_search("Ирод"))
print(get_bible_books_by_bible_id("0"))
print(get_chapter_verses('0', '0', 1))


schema = make_executable_schema(type_defs, resolvers, snake_case_fallback_resolvers)
app = CORSMiddleware(GraphQL(schema, debug=True), allow_origins=['*'], allow_methods=("GET", "POST", "OPTIONS"))
