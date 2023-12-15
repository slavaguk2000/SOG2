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
            "usages_count": {
                "type": "integer"
            },
            "last_usage": {
                "type": "date"
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


sermon_mapping = Mapping(
    'sermon',
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
            "id": {
                "type": "keyword"
            },
            "sermon_collection_id": {
                "type": "keyword"
            },
            "sermon_name": {
                "type": "text",
                "analyzer": "lowercase_analyzer"
            },
            "sermon_translation": {
                "type": "keyword"
            },
            "sermon_date": {
                "type": "date"
            },
            "chapter": {
                "type": "integer"
            },
            "chapter_content": {
                "type": "text",
                "analyzer": "russian"
            },
        }
    }
)