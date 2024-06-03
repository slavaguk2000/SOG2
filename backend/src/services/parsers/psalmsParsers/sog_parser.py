from regex import regex
from sqlalchemy.orm import Session

from src.models.couplet import Couplet

from src.models.couplet_content import CoupletContent
from src.models.couplet_content_chord import CoupletContentChord
from src.models.musical_key import get_musical_key_by_str
from src.models.psalm import Psalm
from src.models.psalms_book import PsalmBook
from src.services.database import engine


class CoupletData:
    def __init__(self, couplet_data: str, order: int):
        parsed_couplet_data = regex.match(r"^([\d\.\s\*]*)(.+)", couplet_data)
        self.marker = parsed_couplet_data.group(1).strip() if parsed_couplet_data else ""
        self.content = parsed_couplet_data.group(2).strip() if parsed_couplet_data else ""
        self.order = order

    def __str__(self):
        return f"CoupletData(m:{self.marker} c:{self.content} o:{self.order})"

    def __repr__(self):
        return self.__str__()


class PsalmData:
    def __init__(self, identifier: str, name: str, couplets: [CoupletData]):
        tonality_pattern = "(?:\(([А-Яа-яA-Za-z#]+).*\))?"
        name_regex_result = regex.match(fr"^{tonality_pattern}\s*([^\(]+)\s*{tonality_pattern}", name)
        identifier_regex_result = regex.match(fr"^([^\(]+)\s*{tonality_pattern}$", identifier)
        self.identifier = identifier_regex_result.group(1).strip()
        self.name = name_regex_result.group(2).strip()
        self.couplets = couplets
        tonality = name_regex_result.group(1) if name_regex_result.group(1) \
            else name_regex_result.group(3) if name_regex_result.group(3) \
            else identifier_regex_result.group(2)
        self.tonality = get_musical_key_by_str(tonality.strip()) if tonality else None

    def __str__(self):
        return f"PsalmData({self.identifier} {self.tonality} {self.name} couplets: {len(self.couplets)})"

    def __repr__(self):
        return self.__str__()


class SimplePsalmParser:
    @staticmethod
    def __parse_data_from_sog_psalms_strings(sog_data: [str]):
        psalm_items_data = [[]]
        for psalms_string in sog_data:
            stripped_psalms_string = psalms_string.strip()
            if len(stripped_psalms_string):
                psalm_items_data[-1].append(stripped_psalms_string)
            elif len(psalm_items_data[-1]):
                psalm_items_data.append([])

        filtered_psalm_items_data = list(filter(lambda x: len(x) > 2, psalm_items_data))

        return [
            PsalmData(
                psalm_item_data[0].strip(),
                psalm_item_data[1].strip(),
                [CoupletData(couplet_data, i) for i, couplet_data in enumerate(psalm_item_data[2:])]
            ) for psalm_item_data in filtered_psalm_items_data
        ]

    @staticmethod
    def parse(psalms_src: str, language: str):
        with open(psalms_src, 'r', encoding='utf-8-sig') as psalms_file:
            song_book_name = psalms_src.replace(".sog", "")
            bare_psalms_data = psalms_file.readlines()
            if len(bare_psalms_data) < 3:
                return False
            with Session(engine) as session:
                psalms = SimplePsalmParser.__parse_data_from_sog_psalms_strings(bare_psalms_data)
                new_psalms_book = PsalmBook(language=language, name=song_book_name)
                session.add(new_psalms_book)
                session.commit()
                psalms_objects = [
                    Psalm(
                        psalm_number=psalm_data.identifier,
                        name=psalm_data.name,
                        default_tonality=psalm_data.tonality,
                        couplets=[Couplet(
                            marker=couplet_data.marker,
                            couplet_content=[CoupletContent(
                                text_content=couplet_data.content,
                                chord=CoupletContentChord()
                            )],
                            initial_order=couplet_data.order,
                        ) for couplet_data in psalm_data.couplets],
                        psalm_books=[new_psalms_book],
                    ) for psalm_data in psalms]
                session.add_all(psalms_objects)
                session.commit()
                print(f"Added new psalms book with ID: {new_psalms_book.id}")

            return True
