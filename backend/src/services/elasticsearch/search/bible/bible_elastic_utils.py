from src.services.elasticsearch.constants import highlight_post_tag, highlight_pre_tag
from src.services.elasticsearch.utils import insert_highlights_into_original_str


def bible_source_to_content_string(source: dict):
    return source['verse_content']


def get_highlighted_book(hit: dict):
    if 'book_name' not in hit['_source']:
        return ""

    return insert_highlights_into_original_str(hit['_source']["book_name"], hit, ['book_name'])


def get_highlighted_chapter(hit: dict):
    chapter_number = str(hit["_source"]['chapter'])
    matched_chapter = 'matched_queries' in hit and any(query.startswith('chapter') for query in hit['matched_queries'])
    return f"{highlight_pre_tag}{chapter_number}{highlight_post_tag}" if matched_chapter else chapter_number


def get_highlighted_verse_number(hit: dict):
    verse_number = str(hit["_source"]['verse_number'])
    matched_verse_number = 'matched_queries' in hit and \
                           any(query.startswith('verse') for query in hit['matched_queries'])
    return f"{highlight_pre_tag}{verse_number}{highlight_post_tag}" if matched_verse_number else verse_number


def get_highlighted_verse_content(hit: dict):
    return insert_highlights_into_original_str(
        hit["_source"]['verse_content'],
        hit,
        ['verse_content']
    )


def bible_source_to_search_content_string(hit: dict):
    book = get_highlighted_book(hit)
    chapter = get_highlighted_chapter(hit)
    verse_number = get_highlighted_verse_number(hit)
    verse_content = get_highlighted_verse_content(hit)
    return f"{book} {chapter}:{verse_number} {verse_content}"


def bible_source_to_location(source: dict):
    return [source['bible_id'], source['book_id'], source['chapter'], source['verse_number']]


def bible_hit_to_slide(hit: dict):
    source = hit["_source"]
    return {
        "id": hit["_id"],
        "search_content": bible_source_to_search_content_string(hit),
        "content": bible_source_to_content_string(source),
        "location": bible_source_to_location(source)
    }
