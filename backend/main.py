import elasticsearch
from ariadne import make_executable_schema, snake_case_fallback_resolvers
from ariadne.asgi import GraphQL
from starlette.middleware.cors import CORSMiddleware
from time import sleep

from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.search.bible import get_bible_books_by_bible_id, bible_search, get_chapter_verses, \
    get_bible_slide_by_id, el, get_bible_history
from src.services.elasticsearch.search.sermon import sermon_search
from src.typedefs.main_typedefs import type_defs
from src.resolvers.resolvers import resolvers

while True:
    if el.ping():
        try:
            print(sermon_search("Это настолько подобно небесному", "0"))
            print(bible_search("1 и 4 2 при", "0")[1]["search_content"])
            # print(get_bible_books_by_bible_id("0"))
            # print(get_chapter_verses('0', '0', 1))
            # print(get_bible_slide_by_id('28270'))
            # print(get_bible_history(0))
            break
        except elasticsearch.ApiError as e:
            sleep(0.5)
    else:
        print('elastic ping fail')
        sleep(0.5)


schema = make_executable_schema(type_defs, resolvers, snake_case_fallback_resolvers)
app = CORSMiddleware(GraphQL(schema, debug=True), allow_origins=['*'], allow_methods=("GET", "POST", "OPTIONS"))
