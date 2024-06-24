from typing import List


class HighlightItem:
    def __init__(self, text: str, start: int, stop: int):
        self.text = text
        self.start = start
        self.stop = stop

    def __lt__(self, other):
        return self.start < other.start

    def __repr__(self):
        return f"{self.start} {self.stop} '{self.text[self.start:self.stop]}'"


class HighlightString:
    def __init__(self, text: str, pre_tag: str, post_tag: str):
        self.__highlighted_text = text
        self.__original_text = text.replace(pre_tag, "").replace(post_tag, "")
        self.__not_analyzed = text
        self.__offset = 0
        self.__pre_tag = pre_tag
        self.__post_tag = post_tag
        self.__highlights = self.__get_next_highlights()

    def __move_analyzed_data(self, offset: int, skip: int):
        self.__offset += offset
        self.__not_analyzed = self.__not_analyzed[offset + skip:]

    def __get_next_highlights(self):
        highlights = []
        while True:
            pre_tag_position = self.__not_analyzed.find(self.__pre_tag)
            post_tag_position = self.__not_analyzed.find(self.__post_tag)

            if pre_tag_position < 0 or pre_tag_position > post_tag_position:
                return highlights

            new_highlight_start = pre_tag_position + self.__offset

            self.__move_analyzed_data(pre_tag_position, len(self.__pre_tag))

            internal_highlights = self.__get_next_highlights()

            post_tag_position = self.__not_analyzed.find(self.__post_tag)

            if post_tag_position < 0:
                raise "Invalid highlight string"

            new_highlight_stop = post_tag_position + self.__offset

            self.__move_analyzed_data(post_tag_position, len(self.__post_tag))

            highlights.extend(
                [
                    HighlightItem(self.__original_text, new_highlight_start, new_highlight_stop),
                    *internal_highlights
                ]
            )

    def get_original_text(self):
        return self.__original_text

    def get_highlights(self):
        return self.__highlights


class HighlightMerger:
    def __init__(self, text: str, highlights: List[str], pre_tag: str, post_tag: str):
        self.__source = text
        self.__pre_tag = pre_tag
        self.__post_tag = post_tag
        highlight_items_with_overlapping = []
        for highlight in highlights:
            hs = HighlightString(highlight, pre_tag, post_tag)
            original_position = text.find(hs.get_original_text())
            if original_position < 0:
                raise "Incompatible text with highlights"
            for highlight_item in hs.get_highlights():
                highlight_items_with_overlapping.append(
                    HighlightItem(
                        text,
                        highlight_item.start + original_position,
                        highlight_item.stop + original_position
                    )
                )

        self.__highlights = HighlightMerger.__delete_overlapping(highlight_items_with_overlapping)
        self.__result = self.__create_result()

    @staticmethod
    def __delete_overlapping(highlights_with_overlapping: List[HighlightItem]):
        highlights_items = []
        for highlight in sorted(highlights_with_overlapping):
            if len(highlights_items) and highlights_items[-1].stop >= highlight.start:
                highlights_items[-1].stop = max(highlights_items[-1].stop, highlight.stop)
            else:
                highlights_items.append(highlight)
        return highlights_items

    def __create_result(self):
        result = self.__source
        for highlight in reversed(self.__highlights):
            result = f"{result[:highlight.start]}{self.__pre_tag}{result[highlight.start:highlight.stop]}" \
                     f"{self.__post_tag}{result[highlight.stop:]}"
        return result

    def get_result(self):
        return self.__result
