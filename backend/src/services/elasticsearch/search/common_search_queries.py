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
