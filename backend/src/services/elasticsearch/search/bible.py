from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()

default_slide_source = ["book", "book_order", "chapter", "verse_number", "verse_content"]


def bible_source_to_content_string(source: dict):
    return source['verse_content']


def bible_source_to_location(source: dict):
    return ["0", source['book_order'], source['chapter'], source['verse_number'],]


def bible_hit_to_slide(hit: dict):
    source = hit["_source"]
    return {
        "content": bible_source_to_content_string(source),
        "location": bible_source_to_location(source)
    }


def bible_search(search_pattern: str):
    result = el.search(index=bible_mapping.index, query={
        "query_string": {
            "fields": ["book", "verse_content"],
            "query": f"*{search_pattern}*"
        }
    }, source=default_slide_source)

    return [bible_hit_to_slide(hit) for hit in result["hits"]["hits"]]


def get_bible_books_by_bible_id(bible_id: str):
    result = el.search(index='bible', body={
        "size": 0,
        "query": {
            "match": {
                "bible_id.keyword": bible_id
            }
        },
        "aggs": {
            "books": {
                "terms": {
                    "field": "book.keyword",
                    "size": 100,
                    "order": {
                        "order": "asc"
                    }
                },
                "aggs": {
                    "order": {
                        "min": {
                            "field": "book_order"
                        }
                    },
                    "chapter_count": {
                        "cardinality": {
                            "field": "chapter"
                        }
                    }
                }
            }
        }
    })

    books = result['aggregations']['books']['buckets']
    return [{'id': int(book['order']['value']), 'name': book['key'], 'chapter_count': book['chapter_count']['value']} for book in books]


def get_chapter_verses(bible_id: str, book_id: str, chapter: int):
    result = el.search(index=bible_mapping.index, query={
        "bool": {
            "must": [
                {
                    "term":
                        {
                            "bible_id": str(bible_id)
                        }
                },
                {
                    "term": {
                        "book_order": {
                            "value": book_id
                        }
                    }
                },
                {
                    "term": {
                        "chapter": {
                            "value": chapter
                        }
                    }
                }
            ]
        }
    }, source=default_slide_source, size=1000)

    return [bible_hit_to_slide(hit) for hit in result["hits"]["hits"]]
