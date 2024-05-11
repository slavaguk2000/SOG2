def get_phrase_queries(search_request: str, field: str | None, max_slop: int = 10):
    phrase_queries = []

    if field:
        for i in range(max_slop):
            phrase_queries.append(
                {
                    "match_phrase": {
                        field: {
                            "query": search_request,
                            "slop": i,
                            "boost": 2 - i / max_slop
                        }
                    }
                }
            )

    return phrase_queries
