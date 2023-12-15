from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag


def insert_highlights_into_original_str(original_str: str, hit: dict):
    if 'highlight' in hit and 'chapter_content' in hit['highlight']:
        for highlight in hit['highlight']['chapter_content']:
            clean_highlight = highlight.replace(highlight_pre_tag, '').replace(highlight_post_tag, '')

            if clean_highlight in original_str:
                original_str = original_str.replace(clean_highlight, highlight)

    return original_str
