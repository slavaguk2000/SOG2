from typing import List

from src.services.elasticsearch.search.SearchQuery import SearchQuery
from src.services.elasticsearch.search.bible.bible_elastic_utils import bible_hit_to_slide

from src.services.elasticsearch.search.bible.bible_elastic_constants import sort_priority, default_slide_source
from src.services.elasticsearch.search.bible.bible_search_engine.abstract_seacrh_provider import SearchProvider
from src.services.elasticsearch.search.bible.bible_search_engine.default_search_provider import DefaultSearchProvider
from src.services.elasticsearch.search.bible.bible_search_engine.numeric_search_provider import NumericSearchProvider
from src.utils.bible_utils import get_root_book_name_rus
from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()


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
                    "default_field": "root_book_name",
                    "query": f"{get_root_book_name_rus(maybe_book_res['book'])}*",
                    "boost": 4.5
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

    print(str(query).replace("'", '"'))

    result = el.search(
        index=bible_mapping.index,
        query=query,
        source=default_slide_source,
        sort=sort_priority,
        highlight=highlight,
    )

    return [bible_hit_to_slide(hit) for hit in result["hits"]["hits"]]


def search(search_patterns_array: List[str], providers: List[SearchProvider]) -> SearchQuery:
    for provider in providers:
        if provider.match(search_patterns_array):
            return provider.get_query(search_patterns_array, [])
    return SearchQuery()


def bible_search2(search_pattern: str, bible_id: str):
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
