from abc import ABC, abstractmethod

from src.services.elasticsearch.search.sermon.SearchQuery import SearchQuery


class SearchProvider(ABC):

    @abstractmethod
    def match(self, search_request: str) -> bool:
        pass

    @abstractmethod
    def get_query(self, search_request: str) -> SearchQuery:
        pass
