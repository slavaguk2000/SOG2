from regex import regex
import re
import json

from sqlalchemy.orm import Session

from src.models.couplet import Couplet

from src.models.couplet_content import CoupletContent
from src.models.couplet_content_chord import CoupletContentChord
from src.models.musical_key import get_musical_key_by_str, MusicalKey, get_musical_key_altitude
from src.models.psalm import Psalm
from src.models.psalms_book import PsalmBook
from src.services.database import engine
from src.services.parsers.psalmsParsers.constants import tonality_pattern


class ChordData:
    def __init__(self, raw_chord: str):
        lower_chord = raw_chord.lower()
        is_minor = lower_chord == raw_chord
        res = regex.match(r"^(.*?)(\w)([ei]s)?(.*)$", lower_chord)

        chord_prefix = res.group(1)
        raw_base_note = res.group(2)
        raw_chord_accidental = res.group(3)
        chord_postfix = res.group(4)

        self.template = f"{chord_prefix}${'m' if is_minor else ''}{chord_postfix}"
        chord_accidental = ('#' if raw_chord_accidental[0] == 'i' else 'b') if raw_chord_accidental else ''
        normal_root_note = f"{raw_base_note}{chord_accidental}"
        self.root_note = get_musical_key_by_str(normal_root_note, jazz_style=True)
        if not self.root_note:
            raise ValueError("Unknown note")

    def __str__(self):
        return f"ChordData(b:{self.root_note} t:{self.template})"

    def __repr__(self):
        return self.__str__()


class ContentData:
    def __init__(self, content_raw_data: str):
        res = regex.match(r"^(<span>(.*?)<sup>(.+?)</sup>(.*?)</span>)?(.*)$", content_raw_data)
        raw_chord = res.group(3)
        text_under_chord = f"{res.group(2) or ''}{res.group(4) or ''}"
        self.text = f"{text_under_chord}{res.group(5)}"
        self.chord_offset = int(len(text_under_chord) / 2)
        self.chord = raw_chord and ChordData(raw_chord)

    def __str__(self):
        return f"ContentData(t:{self.text} co:{self.chord_offset} c:{self.chord})"

    def __repr__(self):
        return self.__str__()


class CoupletData:
    def __init__(self, couplet_data: str, order: int):
        parsed_couplet_data = regex.match(r"^((\d+\.|Ref\..*\:)\s+)?(.+)", couplet_data)
        self.marker = (parsed_couplet_data and parsed_couplet_data.group(1)) or ""
        self.styling = 1 if self.marker and re.search(r"Ref", self.marker) else 0
        raw_contents = parsed_couplet_data.group(3).strip() if parsed_couplet_data else ""
        self.order = order
        self.content = [ContentData(res[0]) for res in re.findall(r'((<span>)?.+?)(?=<span>|$)', raw_contents)]
        self.__normalize_content()

    def __normalize_content(self):
        for i, content in enumerate(self.content):
            if i > 0 and content.chord_offset > 0:
                self.content[i - 1].text = f"{self.content[i - 1].text}{content.text[:content.chord_offset]}"
                content.text = content.text[content.chord_offset:]
                content.chord_offset = 0

    def __str__(self):
        return f"CoupletData(m:{self.marker} c:{self.content} o:{self.order})"

    def __repr__(self):
        return self.__str__()


class PsalmData:
    def __init__(self, name: str, couplets: [CoupletData]):
        title_regex_result = regex.match(fr"^((\d+)\.)?\s*([^\(]+)\s*{tonality_pattern}", name)
        self.identifier = f"00{title_regex_result.group(2).strip()}"[-3:]
        self.name = title_regex_result.group(3).strip()
        tonality = title_regex_result.group(4).strip()
        self.couplets = couplets
        self.tonality = \
            get_musical_key_by_str(tonality, jazz_style=True) if tonality else self.__get_tonality_from_couplets()

    def __get_tonality_from_couplets(self):
        if self.couplets:
            for content in reversed(self.couplets[-1]):
                if content.chord:
                    return content.chord

        return MusicalKey.A

    def __str__(self):
        return f"PsalmData({self.identifier} {self.tonality} {self.name} couplets: {len(self.couplets)})"

    def __repr__(self):
        return self.__str__()


class NovaPiesnPsalmParser:
    @staticmethod
    def __parse_data_from_single_json_object(psalm: dict):
        title = psalm["title"]
        couplets = [
            CoupletData(couplet, i)
            for i, couplet
            in enumerate(
                re.findall(r"<p>(.+)</p>", psalm["chorus"])
                if psalm["chorus"]
                else psalm["text"].strip().split('\n\n')
            )
        ]
        return PsalmData(title, couplets)

    @staticmethod
    def parse(file_src: str, language: str):
        with open(file_src, 'r', encoding='utf-8-sig') as psalms_file:
            song_book_name = file_src.split('/').pop().replace(".json", "")
            bare_psalms_data = json.load(psalms_file)

            if type(bare_psalms_data) != list or not len(bare_psalms_data):
                return False

            with Session(engine) as session:
                psalms = [
                    NovaPiesnPsalmParser.__parse_data_from_single_json_object(single_psalm_data)
                    for single_psalm_data
                    in bare_psalms_data
                ]
                new_psalms_book = PsalmBook(language=language, name=song_book_name)
                session.add(new_psalms_book)
                psalms_objects = [
                    Psalm(
                        psalm_number=psalm_data.identifier,
                        name=psalm_data.name,
                        default_tonality=psalm_data.tonality,
                        couplets=[Couplet(
                            styling=couplet_data.styling,
                            marker=couplet_data.marker,
                            couplet_content=[
                                CoupletContent(
                                    text_content=content_data.text,
                                    chord=CoupletContentChord(
                                        chord_template=content_data.chord.template if content_data.chord else '$',
                                        root_note=get_musical_key_altitude(
                                            psalm_data.tonality,
                                            content_data.chord.root_note,
                                        ) if content_data.chord else 0
                                    )
                                ) for content_data in couplet_data.content
                            ],
                            initial_order=couplet_data.order,
                        ) for couplet_data in psalm_data.couplets],
                        psalm_books=[new_psalms_book],
                    ) for i, psalm_data in enumerate(psalms)]
                session.add_all(psalms_objects)
                session.commit()


            return True
