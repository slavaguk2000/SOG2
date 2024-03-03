from datetime import datetime

from elasticsearch import Elasticsearch, helpers
from singleton_decorator import singleton

from src.services.elasticsearch.mappings import bible_mapping

import os

elastic_host = os.getenv("ELASTIC_URL")

elastic_address = f'http://{elastic_host if elastic_host else "localhost"}:9200'
user = 'elastic'
password = 'q1Z3ArlE7ky=4eoxB*cn'


@singleton
class Elastic:
    def __init__(self):
        self.es = Elasticsearch(elastic_address, basic_auth=(user, password), verify_certs=False)

    def ping(self):
        return self.es.ping()

    def index_exist(self, index: str):
        return self.es.indices.exists(index=index)

    def bulk_create(self, index: str, data: [dict]):
        print(helpers.bulk(self.es, actions=data, index=index))

    def search(self, index: str, fields=None, **kwargs):
        if fields is None:
            fields = []
        return self.es.search(index=index, fields=fields, **kwargs)

    def get_slide_by_id(self, index: str, slide_id: str):
        return self.es.get(index=index, id=slide_id)

    def update_slide_usage(self, index: str, slide_id):
        update_script = {
            "script": {
                "source": "ctx._source.usages_count += 1; ctx._source.last_usage = params.current_time;",
                "lang": "painless",
                "params": {
                    "current_time": datetime.utcnow()
                }
            }
        }

        self.es.update(index=index, id=slide_id, body=update_script)

    def delete_index(self, index: str, id: str):
        return self.es.delete(index=index, id=id)

    def delete_by_query(self, index: str, query: dict):
        return self.es.delete_by_query(index=index, body={"query": query})

    def create_index(self, index: str, body: dict):
        return self.es.indices.create(index=index, mappings=body.get("mappings"), settings=body.get("settings"))
