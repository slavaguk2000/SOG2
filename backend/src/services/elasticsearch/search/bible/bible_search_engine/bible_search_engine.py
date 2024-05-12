from typing import List

from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.bible.bible_elastic_utils import bible_hit_to_slide

from src.services.elasticsearch.search.bible.bible_elastic_constants import sort_priority, default_slide_source
from src.services.elasticsearch.search.bible.bible_search_engine.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.bible.bible_search_engine.default_search_provider import DefaultSearchProvider
from src.services.elasticsearch.search.bible.bible_search_engine.numeric_search_provider import NumericSearchProvider
from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()


def search(search_patterns_array: List[str], providers: List[SearchProvider]) -> SearchQuery:
    for provider in providers:
        if provider.match(search_patterns_array):
            return provider.get_query(search_patterns_array, [])
    return SearchQuery()


def bible_search(search_pattern: str, bible_id: str):
    search_patterns_array = search_pattern.lower().split()

    if not len(search_patterns_array):
        return []

    search_query = search(search_patterns_array, [
        NumericSearchProvider(),
        DefaultSearchProvider()
    ])

    must = [
        {
            "term": {
                "bible_id.keyword": bible_id
            },
        },
    ]

    query = {
        "bool": {
            "must": must + search_query.must,
            "should": search_query.should
        }
    }

    highlight = {
        "pre_tags": [highlight_pre_tag],
        "post_tags": [highlight_post_tag],
        "fields": {
            "verse_content": {},
            "verse_content.standard": {},
            "book_name": {}
        }
    }

    print(str(query).replace("'", '"'))
    print()

    result = el.search(
        index=bible_mapping.index,
        query=query,
        source=default_slide_source,
        sort=sort_priority,
        highlight=highlight,
    )

    return [bible_hit_to_slide(hit) for hit in result["hits"]["hits"]]
