from elasticSearchServise.Mapping import Mapping

bible_mapping = Mapping(
    'bible',
    {
        "settings": {
            "analysis": {
                "analyzer": {
                    "lowercase_analyzer": {
                        "type": "custom",
                        "tokenizer": "keyword",
                        "filter": ["lowercase"]
                    }
                }
            }
        },
        "properties": {
            "bible_id": {
                "type": "keyword"
            },
            "book": {
                "type": "keyword"
            },
            "book_name": {
                "type": "text",
                "analyzer": "lowercase_analyzer"
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