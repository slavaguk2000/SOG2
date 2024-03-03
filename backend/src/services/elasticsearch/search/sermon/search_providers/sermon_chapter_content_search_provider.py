from typing import List, Optional
from src.services.elasticsearch.search.sermon.SearchQuery import SearchQuery
from src.services.elasticsearch.search.sermon.search_providers.abstract_seacrh_provider import SearchProvider
import regex

from src.services.elasticsearch.search.sermon.search_providers.default_search_provider import DefaultSearchProvider

pattern = r'^(\p{L}+\s)?(\d+)(\s\p{L}+)?$'


class SermonChapterContentSearchProvider(SearchProvider):

    def match(self, search_request: str) -> bool:
        return bool(regex.search(pattern, search_request))

    def get_query(self, search_request: str, context: Optional[List[str]]) -> SearchQuery:
        search_query = SearchQuery()

        match = regex.search(pattern, search_request)

        if not match:
            return search_query

        sermon_name = match.group(1).strip() if match.group(1) else None
        chapter = match.group(2).strip() if match.group(2) else None
        content = match.group(3).strip() if match.group(3) else None

        content_search_provider = DefaultSearchProvider()
        sermon_name_search_provider = DefaultSearchProvider(
            max_slop=2,
            standard_field='sermon_name',
            russian_field=None
        )

        if sermon_name:
            q = sermon_name_search_provider.get_query(sermon_name, None)
            search_query.should.append({
                "bool": {
                    "should": q.should,
                    "boost": 30,
                }
            })

        if chapter:
            search_query.should.append({
                "term": {
                    "chapter": {
                        "value": chapter,
                        "boost": 30,
                        "_name": "chapter"
                    }
                }
            })

        if content:
            q = content_search_provider.get_query(content, None)
            search_query.should += q.should

        return search_query
