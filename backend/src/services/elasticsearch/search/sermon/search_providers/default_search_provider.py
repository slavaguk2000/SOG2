from typing import List, Optional
from src.services.elasticsearch.search.sermon.SearchQuery import SearchQuery
from src.services.elasticsearch.search.sermon.search_providers.abstract_seacrh_provider import SearchProvider


class DefaultSearchProvider(SearchProvider):
    def __init__(
            self, max_slop=10,
            russian_field="chapter_content",
            standard_field="chapter_content.standard"
    ):
        self.__max_slop = max_slop
        self.__russian_field = russian_field
        self.__standard_field = standard_field

    def match(self, search_request: str) -> bool:
        return True

    def __get_phrase_queries(self, search_request: str):
        phrase_queries = []

        if self.__standard_field:
            for i in range(self.__max_slop):
                phrase_queries.append(
                    {
                        "match_phrase": {
                            self.__standard_field: {
                                "query": search_request,
                                "slop": i,
                                "boost": 2 - i / self.__max_slop
                            }
                        }
                    }
                )

        return phrase_queries

    def get_query(self, search_request: str, context: Optional[List[str]]) -> SearchQuery:
        search_query = SearchQuery()
        search_query.fields = [
            self.__russian_field,
            self.__standard_field
        ]

        search_request = search_request.strip()

        if len(search_request):
            for content_word in search_request.split():
                queries = []

                if self.__standard_field:
                    queries.append({
                        "query_string": {
                          "default_field": self.__standard_field,
                          "query": f"{content_word}*",
                          "boost": 3
                        }
                      })

                if self.__russian_field:
                    queries.append({
                        "query_string": {
                          "default_field": self.__russian_field,
                          "query": f"{content_word}*"
                        }
                      })

                search_query.should.append({
                  "dis_max": {
                    "queries": queries
                  }
                })

            search_query.should.append({
                "dis_max": {
                    "queries": self.__get_phrase_queries(search_request)
                }
            })

        if context and context[0]:
            search_query.should.append({
                "term": {
                    "sermon_id": {
                        "value": context[0],
                        "boost": 0.3,
                        "_name": "context_sermon"
                    }
                }
            })

        return search_query
