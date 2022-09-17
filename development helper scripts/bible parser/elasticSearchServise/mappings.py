from elasticSearchServise.Mapping import Mapping

bible_mapping = Mapping(
    'bible',
    {
        "properties": {
            "book": {
                "type": "keyword"
            },
            "chapter": {
                "type": "integer"
            },
            "verse_number": {
                "type": "integer"
            },
            "verse_content": {
                "type": "text"
            }
        }
        })