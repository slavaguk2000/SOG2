from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()

default_slide_source = ["book", "book_order", "chapter", "verse_number", "verse_content", "search_content"]
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


def bible_source_to_search_content_string(source: dict):
    return source['search_content']


def bible_source_to_location(source: dict):
    return ["0", source['book_order'], source['chapter'], source['verse_number'],]


def bible_hit_to_slide(hit: dict):
    source = hit["_source"]
    return {
        "search_content": bible_source_to_search_content_string(source),
        "content": bible_source_to_content_string(source),
        "location": bible_source_to_location(source)
    }


def get_maybe_book_from_search_pattern(search_pattern: str):
    if ' ' not in search_pattern:
        return {"book": None, "chapter": None, "verse_num": None, "content": search_pattern}

    [first_word, else_verse] = search_pattern.split(' ', 1)

    book = None

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
        should += [{
                "query_string": {
                    "default_field": "book_name",
                    "query": f"{maybe_book_res['book']}*",
                    "boost": 5
                }
            },
            {
                "query_string": {
                    "fields": ["search_content"],
                    "query": f"*{search_pattern}*"
                }
            }]

    if maybe_book_res["chapter"]:
        must_chapter = [
            {
                "term": {
                    "chapter": {
                        "value": maybe_book_res["chapter"],
                        "boost": 2
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
                            "boost": 2
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
                        }
                    ]
                }
            }
        ]

    query = {
        "function_score": {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "bible_id": bible_id
                            },
                        },
                        {
                            "query_string": {
                                "default_field": "verse_content",
                                "query": f"{maybe_book_res['content']}*",
                                "boost": 1
                            }
                        }
                    ],
                    "should": should
                }
            },
            "functions": [
                {
                    "linear": {
                        "book_order": {
                            "origin": 1,  # Примерный порядок книги, который вы считаете наиболее релевантным
                            "scale": 10,  # Зависит от разброса вашего параметра book_order
                            "offset": 5,  # Можно использовать, чтобы добавить небольшую "погрешность"
                            "decay": 0.5  # Скорость уменьшения значения после прохождения через "origin"
                        }
                    },
                    "weight": 2  # Увеличение веса для совпадений
                }
            ],
            "boost_mode": "sum"  # Метод комбинирования оценки функции и базовой оценки
        }
    }

    print(str(query).replace("'", '"'))

    result = el.search(index=bible_mapping.index, query=query, source=default_slide_source, sort=sort_priority)

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
