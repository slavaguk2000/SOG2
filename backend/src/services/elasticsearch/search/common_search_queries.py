def get_phrase_queries(search_request: str, field: str | None, max_slop: int = 10, **kwargs):
    phrase_queries = []

    phrase_function = "match_phrase_prefix" if kwargs.get("prefix") else "match_phrase"

    if field:
        for i in range(max_slop):
            phrase_queries.append(
                {
                    phrase_function: {
                        field: {
                            "query": search_request,
                            "slop": i,
                            "boost": (2 - i / max_slop) * kwargs.get("external_boost", 1)
                        }
                    }
                }
            )

    return phrase_queries


def get_span_near_phrase_queries(search_request: str, field: str | None, max_slop: int = 10, **kwargs):
    phrase_queries = []

    search_request_words = search_request.split()

    phrase_queries.append({
        "bool": {
            "must": [
                {
                    "span_near": {
                        "clauses": [
                            {
                                "span_multi": {
                                    "match": {
                                        "prefix": {
                                            field: {
                                                "value": search_request_word
                                            }
                                        }
                                    }
                                }
                            } for search_request_word in search_request_words
                        ],
                        "slop": 0,
                        "in_order": True
                    }
                }
            ],
            "boost": kwargs.get("external_boost", 1) / 10
        }
    })

    return phrase_queries
