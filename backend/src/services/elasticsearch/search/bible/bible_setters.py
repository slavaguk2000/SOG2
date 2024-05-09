from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()


def update_bible_slide_usage_in_elastic(slide_id: str):
    try:
        return el.update_slide_usage(bible_mapping.index, slide_id)
    except BaseException as e:
        print('Error while syncing in elastic', e)
