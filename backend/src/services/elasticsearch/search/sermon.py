from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import sermon_mapping
from src.services.elasticsearch.utils import insert_highlights_into_original_str
from datetime import datetime

el = Elastic()

# TODO : filter
# default_slide_source = ["book", "book_order", "chapter", "verse_number", "verse_content", "search_content"]


def sermon_hit_to_slide(hit: dict):
    print(hit)
    source = hit["_source"]
    print(source['chapter_content'])
    if 'highlight' in hit and 'chapter_content' in hit['highlight']:
        for i in hit['highlight']['chapter_content']:
            print(i)

    sermon_date = source['sermon_date']

    date_object = datetime.strptime(sermon_date, '%Y-%m-%dT%H:%M:%S')

    return {
        "id": hit["_id"],
        "search_content": f"{date_object.strftime('%y')}-{date_object.month}{date_object.day} {source['sermon_name']} ({source['sermon_translation']}) {insert_highlights_into_original_str(source['chapter_content'], hit)}",
        "content": source['chapter_content'],
    }


def get_sermon_by_id(sermon_id: str):
    result = el.search(index=sermon_mapping.index, query={
        "term":
            {
                "sermon_id": str(sermon_id)
            }
    }, size=1000, sort=['paragraph_order'])

    print(result)

    return [sermon_hit_to_slide(hit) for hit in result["hits"]["hits"]]


def sermon_search(search_pattern: str, sermon_collection_id: str):
    should = []

    must = [
        {
            "term": {
                "sermon_collection_id": sermon_collection_id
            },
        }
    ]

    if len(search_pattern.strip()):
        for content_word in search_pattern.strip().split():
            must.append({
                "query_string": {
                    "default_field": "chapter_content",
                    "query": f"{content_word}*",
                    "boost": 1
                }
            })

    query = {
        "bool": {
            "must": must,
            "should": should
        }
    }

    highlight = {
        "pre_tags": [highlight_pre_tag],
        "post_tags": [highlight_post_tag],
        "fields": {
            "chapter_content": {},
        }
    }

    result = el.search(
        index=sermon_mapping.index,
        query=query,
        # source=default_slide_source,
        # sort=sort_priority,
        highlight=highlight,
    )

    return [sermon_hit_to_slide(hit) for hit in result["hits"]["hits"]]

