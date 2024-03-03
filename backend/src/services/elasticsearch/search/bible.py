from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping
import re

from src.services.elasticsearch.utils import insert_highlights_into_original_str

el = Elastic()


default_slide_source = [
    "bible_id",
    "book_id",
    "book_name",
    "book_order",
    "chapter",
    "verse_number",
    "verse_content",
    "search_content"
]

sort_priority = [
    {
        "_score": {
            "order": "desc"
        }
    },
    {
        "book_order": {
            "order": "asc"
        }
    },
    {
        "chapter": {
            "order": "asc"
        }
    },
    {
        "verse_number": {
            "order": "asc"
        }
    }
]


def bible_source_to_content_string(source: dict):
    return source['verse_content']


def get_highlighted_book(hit: dict):
    if 'book_name' not in hit['_source']:
        return ""

    return insert_highlights_into_original_str(hit['_source']["book_name"], hit, ['book_name'])


def get_highlighted_chapter(hit: dict):
    chapter_number = str(hit["_source"]['chapter'])
    matched_chapter = 'matched_queries' in hit and (
            'primary_chapter' in hit['matched_queries'] or 'secondary_chapter' in hit['matched_queries']
    )
    return f"{highlight_pre_tag}{chapter_number}{highlight_post_tag}" if matched_chapter else chapter_number


def get_highlighted_verse_number(hit: dict):
    verse_number = str(hit["_source"]['verse_number'])
    matched_verse_number = 'matched_queries' in hit and (
            'primary_verse' in hit['matched_queries'] or 'secondary_verse' in hit['matched_queries']
    )
    return f"{highlight_pre_tag}{verse_number}{highlight_post_tag}" if matched_verse_number else verse_number


def get_highlighted_verse_content(hit: dict):
    return insert_highlights_into_original_str(
        hit["_source"]['verse_content'],
        hit,
        ['verse_content']
    )


def bible_source_to_search_content_string(hit: dict):
    book = get_highlighted_book(hit)
    chapter = get_highlighted_chapter(hit)
    verse_number = get_highlighted_verse_number(hit)
    verse_content = get_highlighted_verse_content(hit)
    return f"{book} {chapter}:{verse_number} {verse_content}"


def bible_source_to_location(source: dict):
    return [source['bible_id'], source['book_id'], source['chapter'], source['verse_number']]


def bible_hit_to_slide(hit: dict):
    source = hit["_source"]
    return {
        "id": hit["_id"],
        "search_content": bible_source_to_search_content_string(hit),
        "content": bible_source_to_content_string(source),
        "location": bible_source_to_location(source)
    }


def get_maybe_book_from_search_pattern(search_pattern: str):
    if ' ' not in search_pattern:
        return {"book": None, "chapter": None, "verse_num": None, "content": search_pattern}

    [first_word, else_verse] = search_pattern.split(' ', 1)

    if first_word.isdigit():
        else_verse_split = else_verse.split(' ', 1)
        book = f"{first_word} {else_verse_split[0]}"
        if len(else_verse_split) > 1:
            else_verse = else_verse_split[1]
        else:
            else_verse = ''
    else:
        book = first_word

    maybe_chapter = None
    maybe_verse = None

    while len(else_verse):
        else_verse_split = else_verse.split(' ', 1)
        if else_verse_split[0].isdigit():
            if not maybe_chapter:
                maybe_chapter = int(else_verse_split[0])
            elif not maybe_verse:
                maybe_verse = int(else_verse_split[0])
        else:
            break
        else_verse = else_verse_split[1] if len(else_verse_split) > 1 else ''

    return {"book": book, "chapter": maybe_chapter, "verse_num": maybe_verse, "content": else_verse}


def bible_search(search_pattern: str, bible_id: str):
    search_pattern = search_pattern.strip()
    maybe_book_res = get_maybe_book_from_search_pattern(search_pattern)

    should = []

    if maybe_book_res["book"]:
        should += [
          {
            "dis_max": {
              "queries": [
                {
                  "query_string": {
                    "default_field": "book_name",
                    "query": f"{maybe_book_res['book']}*",
                    "boost": 5
                  }
                },
                {
                  "query_string": {
                    "default_field": "verse_content",
                    "query": f"{maybe_book_res['book']}*"
                  }
                }
              ]
            }
          }
        ]

    if maybe_book_res["chapter"]:
        must_chapter = [
            {
                "term": {
                    "chapter": {
                        "value": maybe_book_res["chapter"],
                        "boost": 2,
                        "_name": "primary_chapter"
                    }
                }
            }
        ]

        must_verse = [
            {
                "term": {
                    "verse_number": {
                        "value": maybe_book_res["chapter"],
                        "boost": 1.2,
                        "_name": "secondary_verse"
                    }
                }
            }
        ]

        if maybe_book_res["verse_num"]:
            must_chapter += [
                {
                    "term": {
                        "verse_number": {
                            "value": maybe_book_res["verse_num"],
                            "boost": 2,
                            "_name": "primary_verse"
                        }
                    }
                }
            ]
            must_verse += [
                {
                    "term": {
                        "chapter": {
                            "value": maybe_book_res["verse_num"],
                            "boost": 1.2,
                            "_name": "secondary_chapter"
                        }
                    }
                }
            ]

        should += [
            {
                "bool": {
                    "should": [
                        {
                            "bool": {
                                "must": must_chapter
                            }
                        },
                        {
                            "bool": {
                                "must": must_verse
                            }
                        },
                    ]
                }
            }
        ]

    must = [
        {
            "term": {
                "bible_id.keyword": bible_id
            },
        }
    ]

    if len(maybe_book_res['content']):
        for content_word in maybe_book_res['content'].strip().split():
            must.append({
                "query_string": {
                    "default_field": "verse_content",
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
            "verse_content": {},
            "book_name": {}
        }
    }

    # print(str(query).replace("'", '"'))

    result = el.search(
        index=bible_mapping.index,
        query=query,
        source=default_slide_source,
        sort=sort_priority,
        highlight=highlight,
    )

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


def update_bible_slide_usage_in_elastic(slide_id: str):
    try:
        return el.update_slide_usage(bible_mapping.index, slide_id)
    except BaseException as e:
        print('Error while syncing in elastic', e)
