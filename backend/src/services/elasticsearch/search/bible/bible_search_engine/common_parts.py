def get_book_name_query_strings(current_books_pattern: str):
    return [
        {
            "query_string": {
                "default_field": "root_book_name.edge_ngram",
                "query": f"{current_books_pattern}",
                "boost": 10
            }
        },
        {
            "query_string": {
                "default_field": "book_name",
                "query": f"{current_books_pattern}*",
                "boost": 1.7
            }
        },
        {
            "query_string": {
                "default_field": "book_name",
                "query": f"{current_books_pattern}",
                "boost": 1.6
            }
        }
    ]


def get_verse_content_pattern_dis_max(current_verse_content_pattern: str):
    return {
        "dis_max": {
            "queries": [
                {
                    "query_string": {
                        "default_field": "verse_content",
                        "query": f"{current_verse_content_pattern}*",
                        "boost": 1
                    }
                },
                {
                    "query_string": {
                        "default_field": "verse_content",
                        "query": f"{current_verse_content_pattern}",
                        "boost": 0.3
                    }
                },
                {
                    "query_string": {
                        "default_field": "verse_content.standard",
                        "query": f"{current_verse_content_pattern}*",
                        "boost": 3
                    }
                }
            ]
        }
    }
