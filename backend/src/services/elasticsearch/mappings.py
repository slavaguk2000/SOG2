from src.types.Mapping import Mapping

bible_mapping = Mapping(
    'bible',
    {
        "properties": {
            "book": {
                "type": "text"
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