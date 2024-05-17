def get_sermon_name_query_strings(current_sermon_name_pattern: str):
    return [
        {
            "constant_score": {
                "filter": {
                    "term": {
                        "sermon_name.edge_ngram": f"{current_sermon_name_pattern}"
                    }
                },
                "boost": 6.5
            }
        },
        {
            "query_string": {
                "default_field": "sermon_name",
                "query": f"{current_sermon_name_pattern}*",
                "boost": 1.7
            }
        },
        {
            "query_string": {
                "default_field": "sermon_name",
                "query": f"{current_sermon_name_pattern}",
                "boost": 1.6
            }
        }
    ]
