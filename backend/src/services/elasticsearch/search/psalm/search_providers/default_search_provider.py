from typing import List, Optional
from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.common_search_queries import get_phrase_queries
from src.services.elasticsearch.search.psalm.search_providers.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.psalm.search_providers.common_parts import get_psalm_name_query_strings, \
    get_psalm_number_query_strings, get_couplet_content_query_strings


class Pattern:
    def __init__(self, pattern_string: str):
        self.pattern_string = pattern_string
        self.is_number = pattern_string.isdigit()
        self.can_be_psalm_name = not self.is_number
        self.can_be_couplet_content = not self.is_number
        self.can_be_psalm_number = True


class PatternsArray:
    def __init__(self, search_patterns: List[str]):
        self.__patterns_array = [Pattern(search_pattern) for search_pattern in search_patterns]

    def get_as_array(self):
        return self.__patterns_array


class DefaultSearchProvider(SearchProvider):
    def __init__(
            self, max_slop=10,
    ):
        self.__max_slop = max_slop

    def match(self, search_request: str) -> bool:
        return True

    def get_query(self, search_request: str, context: Optional[List[str]]) -> SearchQuery:
        search_query = SearchQuery()

        search_patterns_array = PatternsArray(search_request.strip().split()).get_as_array()

        number_variants_queries = []
        for i in range(2):
            current_number_variants_query_should = []
            current_psalm_number_patterns = search_patterns_array[:i]
            current_not_psalm_number_patterns = search_patterns_array[i:]

            for psalm_number_pattern in current_psalm_number_patterns:
                current_number_variants_query_should.append({
                    "dis_max": {
                        "queries": get_psalm_number_query_strings(psalm_number_pattern.pattern_string),
                    }
                })

            psalm_name_variants_queries = []
            for j in range(len(search_patterns_array) + 1):
                current_psalm_name_variants_query_should = []
                current_psalm_name_patterns = current_not_psalm_number_patterns[:j]
                current_couplet_content_patterns = current_not_psalm_number_patterns[j:]

                for psalm_name_pattern in current_psalm_name_patterns:
                    current_psalm_name_variants_query_should.append({
                        "dis_max": {
                            "queries": get_psalm_name_query_strings(psalm_name_pattern.pattern_string),
                        }
                    })

                if len(current_psalm_name_patterns) > 1:
                    current_psalm_name_variants_query_should.append({
                        "dis_max": {
                            "queries": get_phrase_queries(" ".join(
                                [pattern.pattern_string for pattern in current_psalm_name_patterns]
                            ), "psalm_name")
                        }
                    })

                for couplet_content_pattern in current_couplet_content_patterns:
                    current_psalm_name_variants_query_should.append({
                        "dis_max": {
                            "queries": get_couplet_content_query_strings(couplet_content_pattern.pattern_string),
                        }
                    })

                if len(current_couplet_content_patterns) > 1:
                    current_psalm_name_variants_query_should.append({
                        "dis_max": {
                            "queries": get_phrase_queries(" ".join(
                                [pattern.pattern_string for pattern in current_psalm_name_patterns]
                            ), "couplet_content")
                        }
                    })

                psalm_name_variants_queries.append({
                    "bool": {
                        "should": current_psalm_name_variants_query_should,
                        "must": [
                            {
                                "range": {
                                    "psalm_name_length": {
                                        "gte": i,
                                    }
                                }
                            }
                        ]
                    }
                })

            current_number_variants_query_should.append({
                "dis_max": {
                    "queries": psalm_name_variants_queries
                }
            })

            number_variants_queries.append({
                "bool": {
                    "should": current_number_variants_query_should
                }
            })

        search_query.should.append({
            "dis_max": {
                "queries": number_variants_queries
            }
        })

        return search_query
