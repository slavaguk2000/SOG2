from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()


def bible_source_to_content_string(source: dict):
    return f"{source['book']} {source['chapter']} {source['verse_number']} {source['verse_content']}"


def bible_search(search_pattern: str):
    result = el.search(index=bible_mapping.index, query={
        "query_string": {
            "fields": ["book", "verse_content"],
            "query": f"*{search_pattern}*"
        }
    }, fields=["book", "verse_content"])

    return [bible_source_to_content_string(hit["_source"]) for hit in result["hits"]["hits"]]
