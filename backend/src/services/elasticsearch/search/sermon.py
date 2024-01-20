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
        "location": [source['sermon_collection_id'], source['sermon_id'], str(source["chapter"]) if source.get("chapter") else "", source['paragraph_order']]
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


def sermon_agg_to_sermon_data(agg_data: dict):
    return {
        "id": agg_data["key"],
        "name": agg_data["sermon_name"]["buckets"][0]["key"],
        "translation": agg_data["sermon_translation"]["buckets"][0]["key"],
        "date": agg_data["sermon_date"]["buckets"][0]["key_as_string"]
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
            }
          }
        }
      }
    })

    return [sermon_agg_to_sermon_data(sermon_data) for sermon_data in result["aggregations"]["unique_sermon_ids"]["buckets"]]


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

