from src.services.database_helpers.bible import update_bible_slide_usage_in_db
from src.services.elasticsearch.search.bible.bible_setters import update_bible_slide_usage_in_elastic


def update_bible_slide_usage(slide_id: str):
    update_bible_slide_usage_in_db(slide_id)
    update_bible_slide_usage_in_elastic(slide_id)
