from src.types.Mapping import Mapping

bible_mapping = Mapping(
    'bible',
    {
        "properties": {
            "bible_id": {
                "type": "keyword"
            },
            "book": {
                "type": "keyword"
            },
            "book_order": {
                "type": "integer"
            },
            "chapter": {
                "type": "integer"
            },
            "verse_number": {
                "type": "integer"
            },
            "verse_content": {
                "type": "text",
                "analyzer": "russian"
            },
            "search_content": {
                "type": "text",
                "analyzer": "russian"
            }
        }
    })