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