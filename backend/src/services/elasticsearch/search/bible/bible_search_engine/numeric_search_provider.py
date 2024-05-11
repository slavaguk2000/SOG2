from typing import List, Optional
from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.bible.bible_elastic_constants import MAX_BOOK_PATTERNS_COUNT, \
    MAX_NOT_VERSE_CONTENT_POSITION
from src.services.elasticsearch.search.bible.bible_search_engine.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.bible.bible_search_engine.common_parts import get_book_name_query_strings, \
    get_verse_content_pattern_dis_max
from src.utils.common_utils import generate_combinations


class Pattern:
    def __init__(self, pattern_string: str):
        self.pattern_string = pattern_string
        self.is_number = pattern_string.isdigit()
        self.can_be_book = True
        self.can_be_chapter = self.is_number
        self.can_be_verse_number = self.is_number
        self.can_be_verse_content = not self.is_number
        self.preferably_chapter = False
        self.preferably_verse_number = False


class PatternsArray:
    @staticmethod
    def is_can_be_book(pattern: Pattern, position: int):
        return position < MAX_BOOK_PATTERNS_COUNT and not (position == 1 and pattern.is_number)

    def is_can_be_chapter_or_verse_number(self, pattern: Pattern, position: int):
        if not pattern.is_number:
            return False

        if position >= MAX_NOT_VERSE_CONTENT_POSITION:
            return False

        if position == 0 and len(self.__patterns_array) > 2 and self.__patterns_array[2].is_number:
            return False
        return True

    def is_can_be_verse_content(self, position: int):
        if position >= MAX_NOT_VERSE_CONTENT_POSITION:
            return True

        for current_or_further_pattern in self.__patterns_array[position:MAX_NOT_VERSE_CONTENT_POSITION]:
            if current_or_further_pattern.is_number:
                return False

        return True

    def is_preferably_chapter(self, pattern: Pattern, position: int):
        return pattern.can_be_chapter and \
               len(self.__patterns_array) > position + 1 and \
               self.__patterns_array[position + 1].is_number

    def is_preferably_verse_number(self, pattern: Pattern, position: int):
        return pattern.can_be_verse_number and \
               position > 0 and \
               self.__patterns_array[position - 1].is_number and (
                       len(self.__patterns_array) <= position + 1
                       or not self.__patterns_array[position + 1].is_number
               )

    def __init__(self, search_patterns: List[str]):
        self.__patterns_array = [Pattern(search_pattern) for search_pattern in search_patterns]
        for i, pattern in enumerate(self.__patterns_array):
            pattern.can_be_book = PatternsArray.is_can_be_book(pattern, i)
            pattern.can_be_chapter = self.is_can_be_chapter_or_verse_number(pattern, i)
            pattern.can_be_verse_number = pattern.can_be_chapter
            pattern.can_be_verse_content = self.is_can_be_verse_content(i)
            pattern.preferably_chapter = self.is_preferably_chapter(pattern, i)
            pattern.preferably_verse_number = self.is_preferably_verse_number(pattern, i)

    def get_as_array(self):
        return self.__patterns_array


class NumericSearchProvider(SearchProvider):
    def match(self, search_patterns: List[str]) -> bool:
        return any(pattern.isdigit() for pattern in search_patterns)

    @staticmethod
    def __get_chapter_verse_queries(chapter_verse_number_patterns: List[Pattern]):
        chapter_verse_queries = []
        chapter_verse_combinations = generate_combinations(chapter_verse_number_patterns, ["verse", "chapter"])
        for chapter_verse_combination in chapter_verse_combinations:
            chapter_verse_must = []
            if "chapter" in chapter_verse_combination:
                chapter_pattern = chapter_verse_combination["chapter"]
                chapter_verse_must.append({
                    "term": {
                        "chapter": {
                            "value": chapter_pattern.pattern_string,
                            "boost": 2.1 if chapter_pattern.preferably_chapter else 1.3,
                        }
                    }
                })

            if "verse" in chapter_verse_combination:
                chapter_pattern = chapter_verse_combination["verse"]
                chapter_verse_must.append({
                    "term": {
                        "verse_number": {
                            "value": chapter_pattern.pattern_string,
                            "boost": 2 if chapter_pattern.preferably_verse_number else 1.2,
                        }
                    }
                })

            if len(chapter_verse_must):
                chapter_verse_queries.append({
                    "bool": {
                        # should for testing
                        "should": chapter_verse_must,
                    }
                })

        return chapter_verse_queries

    def get_query(self, search_patterns: List[str], context: Optional[List[str]]) -> SearchQuery:
        search_query = SearchQuery()

        search_patterns_array = PatternsArray(search_patterns).get_as_array()

        queries = []
        current_max_book_patterns = min(len(search_patterns_array), MAX_BOOK_PATTERNS_COUNT)
        for i in range(current_max_book_patterns + 1):
            current_books_patterns = search_patterns_array[:i]
            current_not_books_patterns = search_patterns_array[i:]

            if any(not book_pattern.can_be_book for book_pattern in current_books_patterns):
                continue

            if any(
                    not (
                            not_book_pattern.can_be_verse_number or
                            not_book_pattern.can_be_chapter or
                            not_book_pattern.can_be_verse_content)
                    for not_book_pattern in current_not_books_patterns):
                continue

            must = []

            # if len(current_books_patterns):
            #     current_books_pattern = " ".join(book_pattern.pattern_string for book_pattern in current_books_patterns)
            #     must.append({
            #         "dis_max": {
            #             "queries": get_book_name_query_strings(current_books_pattern),
            #             "boost": len(current_books_patterns)
            #         }
            #     })
            for book_pattern in current_books_patterns:
                must.append({
                    "dis_max": {
                        "queries": get_book_name_query_strings(book_pattern.pattern_string),
                        "boost": 1 / current_max_book_patterns
                    }
                })
            ###

            verse_content_patterns = []
            chapter_verse_number_patterns = []

            for current_not_books_pattern in current_not_books_patterns:
                if current_not_books_pattern.can_be_verse_content:
                    verse_content_patterns.append(current_not_books_pattern)
                elif current_not_books_pattern.can_be_verse_number and current_not_books_pattern.can_be_chapter:
                    chapter_verse_number_patterns.append(current_not_books_pattern)

            for current_not_books_pattern in verse_content_patterns:
                must.append(get_verse_content_pattern_dis_max(current_not_books_pattern.pattern_string))

            chapter_verse_queries = self.__get_chapter_verse_queries(chapter_verse_number_patterns)

            if len(chapter_verse_queries):
                must.append({
                    "dis_max": {
                        "queries": chapter_verse_queries
                    }
                })

            queries.append({
                "bool": {
                    # should for testing
                    "should": must,
                    "must": [
                        {
                            "range": {
                                "book_name_length": {
                                    "gte": i,
                                }
                            }
                        }
                    ]
                }
            })

        search_query.should.append({
            "dis_max": {
                "queries": queries
            }
        })

        return search_query
