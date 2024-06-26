from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import psalm_mapping
from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.psalm.psalms_elastic_constant import sort_priority
from src.services.elasticsearch.search.psalm.search_providers.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.psalm.search_providers.default_search_provider import DefaultSearchProvider
from typing import List

from src.services.elasticsearch.utils import insert_highlights_into_original_str

el = Elastic()


# TODO : filter
# default_slide_source = ["book", "book_order", "chapter", "verse_number", "verse_content", "search_content"]


def get_couplet_content_for_search(hit: dict):
    return insert_highlights_into_original_str(
            hit["_source"]['couplet_content'],
            hit,
            ['couplet_content', 'couplet_content.edge_ngram', 'couplet_content.lowercase_standard']
        )


def get_psalm_number_for_search(hit: dict):
    psalm_number_highlights = ["psalm_non_numeric_number.edge_ngram"]
    psalm_number_source = hit["_source"]['psalm_number']

    if 'highlight' in hit and any(psalm_number_highlight in hit['highlight'] for psalm_number_highlight in psalm_number_highlights):
        hit['highlight']['psalm_number'] = [f"{highlight_pre_tag}{psalm_number_source}{highlight_post_tag}"]

    return insert_highlights_into_original_str(
            psalm_number_source,
            hit,
            ['psalm_number']
        )


def get_psalm_name_for_search(hit: dict):
    return insert_highlights_into_original_str(
            hit["_source"]['psalm_name'],
            hit,
            ['psalm_name']
        )


def psalm_hit_to_slide(hit: dict):
    source = hit["_source"]

    couplet_id = hit["_id"]
    marker = source["marker"]
    psalm_id = source["psalm_id"]
    psalms_book_id = source["psalms_book_id"]
    psalms_book_name = source["psalms_book_name"]

    couplet_content = get_couplet_content_for_search(hit)
    psalms_number = get_psalm_number_for_search(hit)
    psalms_name = get_psalm_name_for_search(hit)

    return {
        "id": couplet_id,
        "search_content": (
            f"{psalms_book_name} {psalms_number} {psalms_name} {marker} {couplet_content}"
        ),
        "content": source['couplet_content'],
        "location": [psalms_book_id, psalm_id, couplet_id, marker]
    }


def search(search_request: str, providers: List[SearchProvider]) -> SearchQuery:
    for provider in providers:
        if provider.match(search_request):
            return provider.get_query(search_request, None)
    return SearchQuery()


def psalm_search(search_pattern: str, psalm_book_id: str | None):
    search_query = search(search_pattern.strip(), [DefaultSearchProvider()])

    query = {
        "bool": {
            "must": search_query.must,
            "should": search_query.should
        }
    }

    if psalm_book_id is not None:
        query = {
            "script_score": {
                "script": {
                    "source": "double final_score = _score; "
                              "if (doc['psalms_book_id.keyword'].value == params.psalms_book_id) {"
                              "  return final_score * 2"
                              "} "
                              "return final_score;",
                    "params": {
                        "psalms_book_id": psalm_book_id
                    }
                },
                "query": query
            }
        }

    highlight = {
        "pre_tags": [highlight_pre_tag],
        "post_tags": [highlight_post_tag],
        "fields": {
            "psalm_number.edge_ngram": {},
            "psalm_number": {},
            "psalm_non_numeric_number.edge_ngram": {},
            "psalm_name": {},
            "couplet_content": {},
            "couplet_content.edge_ngram": {}
        }
    }

    print(str(query).replace("'", '"').replace("True", "true"))

    result = el.search(
        index=psalm_mapping.index,
        query=query,
        # source=default_slide_source,
        sort=sort_priority,
        highlight=highlight,
    )

    return [psalm_hit_to_slide(hit) for hit in result["hits"]["hits"]]
