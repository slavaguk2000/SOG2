from elasticsearch import Elasticsearch, helpers
from singleton_decorator import singleton

from src.services.elasticsearch.mappings import bible_mapping

elastic_address = 'http://localhost:9200'
user = 'elastic'
password = 'q1Z3ArlE7ky=4eoxB*cn'


@singleton
class Elastic:
    def __init__(self):
        self.es = Elasticsearch(elastic_address, basic_auth=(user, password), verify_certs=False)

    def index_exist(self, index: str):
        return self.es.indices.exists(index=index)

    def bulk_create(self, index: str, data: [dict]):
        print(helpers.bulk(self.es, actions=data, index=index))

    def search(self, index: str, query: dict, fields=None):
        if fields is None:
            fields = []
        return self.es.search(index=index, query=query, fields=fields)
