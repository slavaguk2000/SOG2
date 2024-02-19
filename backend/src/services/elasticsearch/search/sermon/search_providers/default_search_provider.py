from src.services.elasticsearch.search.sermon.SearchQuery import SearchQuery
from src.services.elasticsearch.search.sermon.search_providers.abstract_seacrh_provider import SearchProvider


MAX_SLOP = 10


class DefaultSearchProvider(SearchProvider):

    def match(self, search_request: str) -> bool:
        return True

    def __get_phrase_queries(self, search_request: str):
        phrase_queries = []

        for i in range(MAX_SLOP):
            phrase_queries.append(
                {
                    "match_phrase": {
                        "chapter_content.standard": {
                            "query": search_request,
                            "slop": i,
                            "boost": MAX_SLOP - i
                        }
                    }
                }
            )

        return phrase_queries

    def get_query(self, search_request: str) -> SearchQuery:
        search_query = SearchQuery()
        search_query.fields = [
            "chapter_content",
            "chapter_content.standard"
        ]

        search_request = search_request.strip()

        if len(search_request):
            for content_word in search_request.split():
                search_query.should.append({
                  "dis_max": {
                    "queries": [
                      {
                        "query_string": {
                          "default_field": "chapter_content.standard",
                          "query": f"{content_word}*",
                          "boost": 3
                        }
                      },
                      {
                        "query_string": {
                          "default_field": "chapter_content",
                          "query": f"{content_word}*"
                        }
                      }
                    ]
                  }
                })

            search_query.should.append({
                "dis_max": {
                    "queries": self.__get_phrase_queries(search_request)
                }
            })

        return search_query
