from elasticsearch import Elasticsearch, helpers
from elasticSearchServise.mappings import bible_mapping
from uuid import uuid4

elastic_address = 'http://localhost:9200'
user = 'elastic'
password = 'q1Z3ArlE7ky=4eoxB*cn'

mapping = {
    "settings": {
        "number_of_shards": 2,
        "number_of_replicas": 1
    },
    "mappings": {
        "properties": {
            "some_string": {
                "type": "text" # formerly "string"
            },
            "some_bool": {
                "type": "boolean"
            },
            "some_int": {
                "type": "integer"
            },
            "some_more_text": {
                "type": "text"
            }
        }
    }
}

actions = [
    {
        "_id" : uuid4(), # random UUID for _id
        "doc": { # the body of the document
            "name": "George Peterson",
            "sex": "male",
            "age": 34+doc,
            "years": 10+doc
        }
    }
    for doc in range(100)
]


class Elastic:
    def __init__(self):
        self.es = Elasticsearch(elastic_address, basic_auth=(user, password), verify_certs=False)
        if not self.index_exist(bible_mapping.index):
            self.es.indices.create(index=bible_mapping.index, body=bible_mapping.body)
        if not self.index_exist('test'):
            self.es.indices.create(index='test')

    def index_exist(self, index: str):
        return self.es.indices.exists(index=index)

    def bulk_create(self, data: [dict], index: str):
        print(helpers.bulk(self.es, actions=data, index=index))
        # print(self.es.bulk(operations=actions, refresh=True))
