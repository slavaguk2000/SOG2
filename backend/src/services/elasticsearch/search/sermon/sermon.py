from src.services.common_utils.sermon import get_sermon_date_string_from_datetime
from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import sermon_mapping
from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.sermon.search_providers.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.sermon.search_providers.default_search_provider import DefaultSearchProvider
from src.services.elasticsearch.search.sermon.search_providers.sermon_chapter_content_search_provider import \
    SermonChapterContentSearchProvider
from src.services.elasticsearch.utils import insert_highlights_into_original_str
from datetime import datetime
from typing import List, Union

el = Elastic()


# TODO : filter
# default_slide_source = ["book", "book_order", "chapter", "verse_number", "verse_content", "search_content"]


def get_date_str_for_search(source: dict):
    sermon_date = source['sermon_date']
    date_object = datetime.strptime(sermon_date, '%Y-%m-%dT%H:%M:%S')
    return get_sermon_date_string_from_datetime(date_object)


def get_content_for_search(hit: dict):
    return insert_highlights_into_original_str(
        hit["_source"]['chapter_content'],
        hit,
        ['chapter_content.standard', 'chapter_content']
    )


def get_name_for_search(hit: dict):
    matched_context_sermon = 'matched_queries' in hit and 'context_sermon' in hit['matched_queries']
    sermon_name = hit["_source"]['sermon_name']

    if matched_context_sermon:
        return f"{highlight_pre_tag}{sermon_name}{highlight_post_tag}"

    return insert_highlights_into_original_str(
        sermon_name,
        hit,
        ['sermon_name']
    )


def get_chapter_for_search(hit: dict):
    chapter_number = str(hit["_source"]['chapter'])
    matched_chapter = 'matched_queries' in hit and 'chapter' in hit['matched_queries']
    return f"{highlight_pre_tag}{chapter_number}{highlight_post_tag}" if matched_chapter else chapter_number


def sermon_hit_to_slide(hit: dict):
    source = hit["_source"]

    date_str = get_date_str_for_search(source)

    content = get_content_for_search(hit)

    name = get_name_for_search(hit)

    chapter = get_chapter_for_search(hit)

    return {
        "id": hit["_id"],
        "search_content": (
            f"{date_str} {name} ({source['sermon_translation']}) {chapter} {content}"
        ),
        "content": source['chapter_content'],
        "location": ["0", source['sermon_id'], str(source["chapter"]) if source.get("chapter") else "",
                     source['paragraph_order']]
    }


def get_sermon_by_id(sermon_id: str):
    result = el.search(index=sermon_mapping.index, query={
        "term":
            {
                "sermon_id": str(sermon_id)
            }
    }, size=1000, sort=['paragraph_order'])

    # print(result)

    return [sermon_hit_to_slide(hit) for hit in result["hits"]["hits"][:1]]


def sermon_agg_to_sermon_data(agg_data: dict):
    return {
        "id": agg_data["key"],
        "name": agg_data["sermon_name"]["buckets"][0]["key"],
        "translation": agg_data["sermon_translation"]["buckets"][0]["key"],
        "date": agg_data["sermon_date"]["buckets"][0]["key_as_string"],
        "audio_link": agg_data["audio_link"]["buckets"][0]["key"] if len(agg_data["audio_link"]["buckets"]) else None
    }


def get_sermons(sermons_collection_id: str):
    result = el.search(index=sermon_mapping.index, body={
        "size": 0,
        "query": {
            "term": {
                "sermon_collection_id": {
                    "value": sermons_collection_id
                }
            }
        },
        "aggs": {
            "unique_sermon_ids": {
                "terms": {
                    "field": "sermon_id",
                    "size": 10000
                },
                "aggs": {
                    "sermon_name": {
                        "terms": {
                            "field": "sermon_name.keyword",
                            "size": 1
                        }
                    },
                    "sermon_translation": {
                        "terms": {
                            "field": "sermon_translation",
                            "size": 1
                        }
                    },
                    "sermon_date": {
                        "terms": {
                            "field": "sermon_date",
                            "size": 1
                        }
                    },
                    "audio_link": {
                        "terms": {
                            "field": "audio_link",
                            "size": 1
                        }
                    }
                }
            }
        }
    })

    return [sermon_agg_to_sermon_data(sermon_data) for sermon_data in
            result["aggregations"]["unique_sermon_ids"]["buckets"]]


def search(search_request: str, providers: List[SearchProvider], current_sermon_id: str | None) -> SearchQuery:
    for provider in providers:
        if provider.match(search_request):
            return provider.get_query(search_request, [current_sermon_id] if current_sermon_id else None)
    return SearchQuery()


def sermon_search(search_pattern: str, sermon_collection_id: str, current_sermon_id: str | None):
    search_query = search(search_pattern.strip(), [
        SermonChapterContentSearchProvider(),
        DefaultSearchProvider(),
    ], current_sermon_id)

    query = {
        "bool": {
            "must": search_query.must,
            "should": search_query.should
        }
    }

    highlight = {
        "pre_tags": [highlight_pre_tag],
        "post_tags": [highlight_post_tag],
        "fields": {
            "sermon_name": {},
            "chapter": {},
            "chapter_content": {},
            "chapter_content.standard": {}
        }
    }

    print(str(query).replace("'", '"'))

    result = el.search(
        index=sermon_mapping.index,
        query=query,
        # source=default_slide_source,
        # sort=sort_priority,
        highlight=highlight,
    )

    return [sermon_hit_to_slide(hit) for hit in result["hits"]["hits"]]
