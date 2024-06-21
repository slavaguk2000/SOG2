from typing import List, Optional
from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.common_search_queries import get_phrase_queries
from src.services.elasticsearch.search.sermon.search_providers.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.sermon.search_providers.common_parts import get_sermon_name_query_strings


class Pattern:
    def __init__(self, pattern_string: str):
        self.pattern_string = pattern_string
        self.is_number = pattern_string.isdigit()
        self.can_be_sermon_name = True
        self.can_be_date = self.is_number
        self.can_be_chapter = self.is_number
        self.can_be_paragraph_content = not self.is_number


class PatternsArray:
    def __init__(self, search_patterns: List[str]):
        self.__patterns_array = [Pattern(search_pattern) for search_pattern in search_patterns]

    def get_as_array(self):
        return self.__patterns_array


class NewDefaultSearchProvider(SearchProvider):
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
        external_boost = len(search_request.split())
        return [
            *get_phrase_queries(search_request, self.__standard_field, self.__max_slop, external_boost=external_boost),
            *get_phrase_queries(search_request, self.__russian_field, self.__max_slop),
            # *get_phrase_queries(search_request, self.__russian_field, self.__max_slop, prefix=True),
        ]

    def get_query(self, search_request: str, context: Optional[List[str]]) -> SearchQuery:
        search_query = SearchQuery()
        search_query.fields = [
            self.__russian_field,
            self.__standard_field
        ]

        search_patterns_array = PatternsArray(search_request.strip().split()).get_as_array()

        name_variants_queries = []
        for i in range(len(search_patterns_array) + 1):
            current_name_variants_query_should = []
            current_sermon_name_patterns = search_patterns_array[:i]
            current_not_sermon_name_patterns = search_patterns_array[i:]

            for sermon_name_pattern in current_sermon_name_patterns:
                current_name_variants_query_should.append({
                    "dis_max": {
                        "queries": get_sermon_name_query_strings(sermon_name_pattern.pattern_string),
                    }
                })

            if len(current_sermon_name_patterns) > 1:
                current_name_variants_query_should.append({
                    "dis_max": {
                        "queries": get_phrase_queries(" ".join(
                            [pattern.pattern_string for pattern in current_sermon_name_patterns]
                        ), "sermon_name")
                    }
                })

            for content_pattern in current_not_sermon_name_patterns:
                queries = []

                if self.__standard_field:
                    queries.append({
                        "query_string": {
                          "default_field": self.__standard_field,
                          "query": f"{content_pattern.pattern_string}*",
                          "boost": 3
                        }
                      })

                if self.__russian_field:
                    queries.append({
                        "query_string": {
                          "default_field": self.__russian_field,
                          "query": f"{content_pattern.pattern_string}*"
                        }
                      })

                current_name_variants_query_should.append({
                  "dis_max": {
                    "queries": queries
                  }
                })

            if len(current_not_sermon_name_patterns) > 1:
                current_name_variants_query_should.append({
                    "dis_max": {
                        "queries": self.__get_phrase_queries(" ".join([
                            pattern.pattern_string for pattern in current_not_sermon_name_patterns
                        ]))
                    }
                })

            if context and context[0] and not i:
                current_name_variants_query_should.append({
                    "term": {
                        "sermon_id": {
                            "value": context[0],
                            "boost": 0.3,
                            "_name": "context_sermon"
                        }
                    }
                })

            name_variants_queries.append({
                "bool": {
                    "should": current_name_variants_query_should,
                    "must": [
                        {
                            "range": {
                                "sermon_name_length": {
                                    "gte": i,
                                }
                            }
                        }
                    ]
                }
            })

        search_query.should.append({
            "dis_max": {
                "queries": name_variants_queries
            }
        })

        return search_query
