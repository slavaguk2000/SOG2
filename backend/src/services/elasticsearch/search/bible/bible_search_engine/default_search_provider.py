from typing import List, Optional
from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.bible.bible_elastic_constants import MAX_BOOK_PATTERNS_COUNT
from src.services.elasticsearch.search.bible.bible_search_engine.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.bible.bible_search_engine.common_parts import get_book_name_query_strings, \
    get_verse_content_pattern_dis_max


class DefaultSearchProvider(SearchProvider):
    def match(self, search_patterns: List[str]) -> bool:
        return True

    def get_query(self, search_patterns: List[str], context: Optional[List[str]]) -> SearchQuery:
        search_query = SearchQuery()

        queries = []
        for i in range(min(len(search_patterns), MAX_BOOK_PATTERNS_COUNT) + 1):
            current_books_patterns = search_patterns[:i]
            current_verse_content_patterns = search_patterns[i:]

            must = []

            if len(current_books_patterns):
                current_books_pattern = " ".join(current_books_patterns)
                must.append({
                    "dis_max": {
                        "queries": get_book_name_query_strings(current_books_pattern)
                    }
                })

            if len(current_verse_content_patterns):
                must.append({
                    "bool": {
                        "should": [
                            get_verse_content_pattern_dis_max(current_verse_content_pattern)
                            for current_verse_content_pattern in current_verse_content_patterns
                        ]
                    }
                })

            queries.append({
                "bool": {
                    "must": must
                }
            })

        search_query.should.append({
            "dis_max": {
                "queries": queries
            }
        })

        return search_query
