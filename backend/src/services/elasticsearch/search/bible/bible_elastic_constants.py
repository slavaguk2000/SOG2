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

# 1 Кор or Пес пес
MAX_BOOK_PATTERNS_COUNT = 2
# book pattern 2 5 verse content
MAX_NOT_VERSE_CONTENT_POSITION = MAX_BOOK_PATTERNS_COUNT + 2
