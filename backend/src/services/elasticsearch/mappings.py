from src.types.Mapping import Mapping

bible_mapping = Mapping(
    'bible',
    {
        "properties": {
            "bible_id": {
                "type": "keyword",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    }
                }
            },
            "book_id": {
                "type": "keyword"
            },
            "book_name": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    },
                    "edge_ngram": {
                        "type": "text",
                        "analyzer": "edge_ngram_analyzer",
                        "search_analyzer": "standard"
                    }
                }
            },
            "root_book_name": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    },
                    "edge_ngram": {
                        "type": "text",
                        "analyzer": "edge_ngram_analyzer",
                        "search_analyzer": "standard"
                    }
                }
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
                "analyzer": "russian",
                "fields": {
                    "standard": {
                        "type": "text",
                        "analyzer": "standard"
                    }
                }
            },
            "search_content": {
                "type": "text",
                "analyzer": "russian"
            }
        }
    },
    settings={
        "analysis": {
            "tokenizer": {
                "whitespace_tokenizer": {
                    "type": "whitespace"
                }
            },
            "filter": {
                "edge_ngram_filter": {
                    "type": "edge_ngram",
                    "min_gram": 1,
                    "max_gram": 5
                }
            },
            "analyzer": {
                "lowercase_analyzer": {
                    "type": "custom",
                    "tokenizer": "keyword",
                    "filter": ["lowercase"]
                },
                "edge_ngram_analyzer": {
                    "type": "custom",
                    "tokenizer": "whitespace_tokenizer",
                    "filter": ["lowercase", "edge_ngram_filter"]
                }
            }
        }
    }
)

sermon_mapping = Mapping(
    'sermon',
    {
        "properties": {
            "id": {
                "type": "keyword"
            },
            "sermon_collection_id": {
                "type": "keyword"
            },
            "sermon_id": {
                "type": "keyword"
            },
            "sermon_name": {
                "type": "text",
                "analyzer": "standard",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    },
                    "lowercase": {
                        "type": "text",
                        "analyzer": "lowercase_analyzer"
                    },
                    "edge_ngram": {
                        "type": "text",
                        "analyzer": "edge_ngram_analyzer",
                        "search_analyzer": "standard"
                    }
                }
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
            "paragraph_order": {
                "type": "integer"
            },
            "chapter_content": {
                "type": "text",
                "analyzer": "russian",
                "fields": {
                    "standard": {
                        "type": "text",
                        "analyzer": "standard"
                    }
                }
            },
            "audio_link": {
                "type": "keyword"
            }
        }
    },
    settings={
        "analysis": {
            "tokenizer": {
                "whitespace_tokenizer": {
                    "type": "whitespace"
                }
            },
            "filter": {
                "edge_ngram_filter": {
                    "type": "edge_ngram",
                    "min_gram": 1,
                    "max_gram": 5
                }
            },
            "analyzer": {
                "lowercase_analyzer": {
                    "type": "custom",
                    "tokenizer": "keyword",
                    "filter": ["lowercase"]
                },
                "edge_ngram_analyzer": {
                    "type": "custom",
                    "tokenizer": "whitespace_tokenizer",
                    "filter": ["lowercase", "edge_ngram_filter"]
                }
            }
        }
    }
)
