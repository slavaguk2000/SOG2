from src.services.elasticsearch.search.sermon.SearchQuery import SearchQuery
from src.services.elasticsearch.search.sermon.search_providers.abstract_seacrh_provider import SearchProvider


class SermonChapterContentSearchProvider(SearchProvider):

    def match(self, search_request: str) -> bool:
        return False

    def get_query(self, search_request: str) -> SearchQuery:
        return SearchQuery()
