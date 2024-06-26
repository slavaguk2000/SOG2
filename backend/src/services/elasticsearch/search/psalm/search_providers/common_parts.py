from src.services.elasticsearch.utils import get_numeric_number, get_non_numeric_number


def get_psalm_number_query_strings(current_psalm_number_pattern: str):
    numeric_number = get_numeric_number(current_psalm_number_pattern)

    psalm_numbers_queries = [
        {
            "constant_score": {
                "filter": {
                    "term": {
                        "psalm_number.edge_ngram": f"{current_psalm_number_pattern}"
                    }
                },
                "boost": 6.5
            }
        },
        {
            "constant_score": {
                "filter": {
                    "term": {
                        "psalm_decimal_number_str.edge_ngram":
                            f"{str(int(numeric_number if len(numeric_number) else '0'))}"
                    }
                },
                "boost": 10
            }
        },
        {
            "query_string": {
                "default_field": "psalm_number",
                "query": f"*{current_psalm_number_pattern}",
                "boost": 1.7
            }
        },
        {
            "query_string": {
                "default_field": "psalm_number",
                "query": f"{current_psalm_number_pattern}",
                "boost": 2
            }
        },
        {
            "term": {
                "psalm_number.keyword": {
                    "value": f"{current_psalm_number_pattern}",
                    "boost": 10
                }
            }
        },
    ]

    return [
        {
            "bool": {
                "must": [
                    {
                        "constant_score": {
                            "filter": {
                                "term": {
                                    "psalm_non_numeric_number.edge_ngram":
                                        f"{get_non_numeric_number(current_psalm_number_pattern)}"
                                }
                            },
                            "boost": 10
                        }
                    },
                    {
                        "dis_max": {
                            "queries": psalm_numbers_queries
                        }
                    }
                ]
            }
        },
        *psalm_numbers_queries,
    ]


def get_psalm_name_query_strings(current_psalm_name_pattern: str):
    return [
        {
            "constant_score": {
                "filter": {
                    "term": {
                        "psalm_name.edge_ngram": f"{current_psalm_name_pattern}"
                    }
                },
                "boost": 6.5
            }
        },
        {
            "query_string": {
                "default_field": "psalm_name",
                "query": f"{current_psalm_name_pattern}*",
                "boost": 1.7
            }
        },
        {
            "query_string": {
                "default_field": "psalm_name",
                "query": f"{current_psalm_name_pattern}",
                "boost": 1.6
            }
        }
    ]


def get_couplet_content_query_strings(current_couplet_content_pattern: str):
    return [
        {
            "constant_score": {
                "filter": {
                    "term": {
                        "couplet_content.edge_ngram": f"{current_couplet_content_pattern}"
                    }
                },
                "boost": 6.5
            }
        },
        {
            "query_string": {
                "default_field": "couplet_content",
                "query": f"{current_couplet_content_pattern}*",
                "boost": 1.7
            }
        },
        {
            "query_string": {
                "default_field": "couplet_content",
                "query": f"{current_couplet_content_pattern}",
                "boost": 2
            }
        }
    ]
