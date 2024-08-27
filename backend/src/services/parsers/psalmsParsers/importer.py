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


class ChordPart:
    def __init__(self, raw_chord_part: str, jazz_style=False):
        chord_regex = r"^(.*?)(\w)([ei]s|#|b)?(.*)$"
        res = regex.match(chord_regex, raw_chord_part.lower())

        self.chord_prefix = res.group(1)
        raw_note = res.group(2)
        raw_chord_accidental = res.group(3)
        chord_accidental = (
            '#' if raw_chord_accidental[0] == 'i' else
            'b' if raw_chord_accidental[0] == 'e' else raw_chord_accidental[0]
        ) if raw_chord_accidental else ''
        self.chord_postfix = res.group(4)
        normal_note = f"{raw_note}{chord_accidental}"
        self.note = get_musical_key_by_str(normal_note, jazz_style=jazz_style)


class ChordData:
    def __init__(self, raw_chord: str, jazz_style=False):
        if raw_chord:
            root, bass = (re.sub(r"[()]", '', raw_chord).split('/', 1) + [''])[:2]
            lower_chord = root.lower()
            is_minor = lower_chord == root

            root_part = ChordPart(root, jazz_style)
            self.template = f"{root_part.chord_prefix}${'m' if is_minor else ''}{root_part.chord_postfix}"
            self.root_note = root_part.note
            self.bass_note = ChordPart(bass, jazz_style).note if bass else None

            if not self.root_note:
                raise ValueError("Unknown note")
        else:
            self.template = '$'
            self.root_note = 0
            self.bass_note = None

    def __str__(self):
        return f"ChordData(r:{self.root_note} t:{self.template}" \
               f"{f' b:{self.bass_note}' if self.bass_note is not None else ''})"

    def __repr__(self):
        return self.__str__()


class ContentData:
    def __init__(self, text_content: str, chord: ChordData, line: int):
        self.text_content = text_content
        self.chord = chord
        self.line = line

    def __str__(self):
        return f"ContentData(t:{self.text_content} l:{self.line} c:{self.chord})"

    def __repr__(self):
        return self.__str__()


class CoupletData:
    def __init__(self, content: [dict], styling: int, marker: str, initial_order: int, jazz_style=False):
        self.marker = marker
        self.styling = styling
        self.order = initial_order
        self.content = [
            ContentData(
                content_item["text_content"],
                ChordData(content_item["chord"], jazz_style),
                content_item["line"]
            ) for content_item in content
        ]

    def __str__(self):
        return f"CoupletData(m:{self.marker} c:{self.content} o:{self.order})"

    def __repr__(self):
        return self.__str__()


class PsalmData:
    def __init__(self, name: str, psalm_number: str, default_tonality: str, couplets: [CoupletData], jazz_style=False):
        self.identifier = psalm_number
        self.name = name
        self.couplets = couplets
        self.tonality = get_musical_key_by_str(default_tonality, jazz_style=jazz_style) \
            if default_tonality else self.__get_tonality_from_couplets()

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


class PsalmsJsonImporter:
    @staticmethod
    def __import_data_from_single_json_object(psalm: dict, jazz_style=False):
        name = psalm["name"]
        psalm_number = psalm["psalm_number"]
        default_tonality = psalm["default_tonality"]

        couplets = [
            CoupletData(couplet["content"], couplet["styling"], couplet["marker"], couplet["initial_order"], jazz_style)
            for couplet
            in psalm["couplets"]
        ]

        return PsalmData(name, psalm_number, default_tonality, couplets, jazz_style)

    @staticmethod
    def __is_jazz_style(psalms: [dict]):
        for single_psalm_data in psalms:
            for couplet in single_psalm_data['couplets']:
                for content in couplet['content']:
                    if 'h' in content['chord'].lower():
                        return True

        return False

    @staticmethod
    def import_psalms(file_src: str, language: str):
        with open(file_src, 'r', encoding='utf-8-sig') as psalms_file:
            song_book_name = file_src.split('/').pop().replace(".json", "")
            bare_psalms_data = json.load(psalms_file)

            if type(bare_psalms_data) != list or not len(bare_psalms_data):
                return False

            jazz_style = PsalmsJsonImporter.__is_jazz_style(bare_psalms_data)

            psalms = [
                PsalmsJsonImporter.__import_data_from_single_json_object(single_psalm_data, jazz_style)
                for single_psalm_data
                in bare_psalms_data
            ]
            with Session(engine) as session:
                new_psalms_book = PsalmBook(language=language, name=song_book_name)
                session.add(new_psalms_book)
                psalms_objects = [
                    Psalm(
                        psalm_number=psalm_data.identifier,
                        name=psalm_data.name,
                        default_tonality=psalm_data.tonality,
                        psalm_books=[new_psalms_book],
                        couplets=[Couplet(
                            styling=couplet_data.styling,
                            marker=couplet_data.marker,
                            initial_order=couplet_data.order,
                            couplet_content=[
                                CoupletContent(
                                    text_content=content_data.text_content,
                                    line=content_data.line,
                                    chord=CoupletContentChord(
                                        chord_template=content_data.chord.template if content_data.chord else '$',
                                        root_note=get_musical_key_altitude(
                                            psalm_data.tonality,
                                            content_data.chord.root_note,
                                        ) if content_data.chord and content_data.chord.root_note else 0,
                                        bass_note=get_musical_key_altitude(
                                            psalm_data.tonality,
                                            content_data.chord.bass_note,
                                        ) if content_data.chord and content_data.chord.bass_note else None,
                                    )
                                ) for content_data in couplet_data.content
                            ],
                        ) for couplet_data in psalm_data.couplets],
                    ) for psalm_data in psalms]
                session.add_all(psalms_objects)
                session.commit()

            return True
