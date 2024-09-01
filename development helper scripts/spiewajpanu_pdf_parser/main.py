import pymupdf
import re
from typing import List
import json

PAGE_NUMBER_HEIGHT_COEFFICIENT = 0.955


class RawCouplet:
    def __init__(self, text: str, marker: str = ''):
        self.__marker = f"{marker} " if marker else ''
        self.__text = text.strip()

    def append_text(self, text):
        self.__text = f"{self.__text} {text.strip()}"

    def get_dict(self, initial_order: int = 0, tonality: str = 'A'):
        return {
            "content": [{
                "text_content": self.__text,
                "line": 0,
                "chord": tonality
            }],
            "styling": 1 if self.__marker.startswith('Ref') else 0,
            "marker": self.__marker,
            "initial_order": initial_order,
        }

    def __str__(self):
        return f"RawCouplet(m:{self.__marker};t:{self.__text})"

    def __repr__(self):
        return self.__str__()


class RawPsalm:
    def __init__(self, title: str):
        self.__title = title
        self.__is_title_completed = False
        self.__normalize_title()
        self.__number = None
        self.__tonality = None
        self.__is_minor = False
        self.couplets: List[RawCouplet] = []

    def supplement_title(self, title_supplement: str):
        if not self.__is_title_completed:
            self.__title = f"{self.__title} {title_supplement}"
            self.__normalize_title()

    def is_title_completed(self):
        return self.__is_title_completed

    def complete_title(self):
        if not self.__is_title_completed:
            title_regex_result = re.match(r"^(\d+). (.+) (?:\((.)(?:-(dur|moll))?\))$", self.__title)
            number = title_regex_result.group(1)
            self.__number = number and f"00{number}"[-3:]
            self.__title = title_regex_result.group(2)
            tonality = title_regex_result.group(3).strip()
            self.__tonality = tonality.upper().replace('B', 'Bb').replace('H', 'B') or 'A'
            tonality_mode = title_regex_result.group(4)
            self.__is_minor = tonality_mode == 'moll' if tonality_mode else tonality.islower()
            self.__is_title_completed = True

    def add_couplet_text(self, text):
        couplet_text_regex_result = re.match(r"^(\d\.|Ref\.(?:\s+\d+)?:)(.*)$", text)
        if couplet_text_regex_result or not self.couplets:
            new_couplet = RawCouplet(couplet_text_regex_result.group(2).strip(), couplet_text_regex_result.group(1)) \
                if couplet_text_regex_result else RawCouplet(text)
            self.couplets.append(new_couplet)
        else:
            self.couplets[-1].append_text(text)

    def get_dict(self):
        self.complete_title()
        return {
            "name": self.__title,
            "psalm_number": self.__number,
            "default_tonality": self.__tonality,
            "couplets": [couplet.get_dict(i, self.__get_full_tonality()) for i, couplet in enumerate(self.couplets)]
        }

    def __normalize_title(self):
        self.__title = re.sub(r"\s+", ' ', self.__title)

    def __get_full_tonality(self):
        return f"{self.__tonality}{'m' if self.__is_minor else ''}"

    def __str__(self):
        return f"RawPsalm(n:{self.__number};tnlt:{self.__get_full_tonality()};ttl:{self.__title})"

    def __repr__(self):
        return self.__str__()
# RawPsalm(n:None;tnltNone;ttl:638. JEHOWA JIREH (B-dur))


def get_min_y(line_span: dict):
    return min(line_span['bbox'][1], line_span['bbox'][3])


def is_in_blacklist(text_piece: str):
    return bool(re.match(r"^(?:(?:SP|JP) I+|PNZŻ|St|Ch|PR|WCK|PCh) \d+$", text_piece))


def main():
    doc = pymupdf.open("SP.pdf")
    start_page = 2
    num_pages = 239

    psalms: List[RawPsalm] = []

    # for i in range(2, min(3, num_pages)):
    for i in range(max(2, start_page), min(30000, num_pages)):
        current_page_num = i + 1
        print(current_page_num)
        page = doc.load_page(i)
        page_height = page.rect.height

        text_blocks = page.get_text("dict")["blocks"]
        for block in text_blocks:
            if 'lines' in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        min_num_y = page_height * PAGE_NUMBER_HEIGHT_COEFFICIENT
                        if min_num_y < get_min_y(span):
                            continue

                        text = span['text'].strip()
                        if text and not is_in_blacklist(text):
                            if span['font'] == 'Cambria-Bold':
                                # title
                                if psalms and not psalms[-1].is_title_completed():
                                    psalms[-1].supplement_title(text)
                                else:
                                    psalms.append(RawPsalm(text))
                            elif psalms:
                                # text
                                current_psalm = psalms[-1]
                                current_psalm.complete_title()
                                current_psalm.add_couplet_text(text)

    for i, psalm in enumerate(psalms):
        print(i + 1, psalm)
        for couplet in psalm.couplets:
            print(couplet)
        print()

    json_data = [psalm.get_dict() for psalm in psalms]
    with open('Spiewaj Panu.json', 'w', encoding='utf-8') as file:
        json.dump(json_data, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()
