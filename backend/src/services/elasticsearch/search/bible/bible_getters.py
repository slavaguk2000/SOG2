from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.search.bible.bible_elastic_constants import default_slide_source

from src.services.elasticsearch.search.bible.bible_elastic_utils import bible_hit_to_slide

from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()


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
    }, source=default_slide_source, size=1000, sort=['verse_number'])

    return [bible_hit_to_slide(hit) for hit in result["hits"]["hits"]]


def get_bible_history(bible_id, start=0, size=10):
    result = el.search(index=bible_mapping.index, query={
        "term":
            {
                "bible_id": str(bible_id)
            }
    }, source=default_slide_source, from_=start, size=size, sort='last_usage:desc')

    return [bible_hit_to_slide(hit) for hit in result["hits"]["hits"]]


def get_bible_slide_by_id(slide_id: str):
    return bible_hit_to_slide(el.get_slide_by_id(bible_mapping.index, slide_id))


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

