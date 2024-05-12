from abc import ABC, abstractmethod
from typing import List, Optional

from src.services.elasticsearch.search.SearchQuery import SearchQuery


class SearchProvider(ABC):
    @abstractmethod
    def match(self, search_patterns: List[str]) -> bool:
        pass

    @abstractmethod
    def get_query(self, search_patterns: List[str], context: Optional[List[str]]) -> SearchQuery:
        pass
