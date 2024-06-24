from src.services.elasticsearch.constants import highlight_pre_tag, highlight_post_tag
from src.utils.text_utils.HighlightMerger import HighlightMerger


def insert_highlights_into_original_str(original_str: str, hit: dict, fields: [str]):
    highlights = []
    for field in fields:
        if 'highlight' in hit and field in hit['highlight']:
            for highlight in hit['highlight'][field]:
                highlights.append(highlight)

    hm = HighlightMerger(original_str, highlights, highlight_pre_tag, highlight_post_tag)

    return hm.get_result()
