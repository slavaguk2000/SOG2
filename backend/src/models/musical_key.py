import enum


NOTES_COUNT = 12


class MusicalKey(enum.Enum):
    C = 0
    CSharp = 1
    Db = 13
    D = 2
    DSharp = 3
    Eb = 15
    E = 4
    F = 5
    FSharp = 6
    Gb = 18
    G = 7
    GSharp = 8
    Ab = 20
    A = 9
    ASharp = 10
    Bb = 22
    B = 11


normal_dictionary = {
    "c": MusicalKey.C,
    "c#": MusicalKey.CSharp,
    "db": MusicalKey.Db,
    "d": MusicalKey.D,
    "d#": MusicalKey.DSharp,
    "eb": MusicalKey.Eb,
    "e": MusicalKey.E,
    "f": MusicalKey.F,
    "f#": MusicalKey.FSharp,
    "gb": MusicalKey.Gb,
    "g": MusicalKey.G,
    "g#": MusicalKey.GSharp,
    "ab": MusicalKey.Ab,
    "a": MusicalKey.A,
    "a#": MusicalKey.ASharp,
    "bb": MusicalKey.Bb,
    "b": MusicalKey.B,
}


jazz_style_dictionary = {
    "c": MusicalKey.C,
    "c#": MusicalKey.CSharp,
    "db": MusicalKey.Db,
    "d": MusicalKey.D,
    "d#": MusicalKey.DSharp,
    "eb": MusicalKey.Eb,
    "e": MusicalKey.E,
    "f": MusicalKey.F,
    "f#": MusicalKey.FSharp,
    "gb": MusicalKey.Gb,
    "g": MusicalKey.G,
    "g#": MusicalKey.GSharp,
    "ab": MusicalKey.Ab,
    "a": MusicalKey.A,
    "a#": MusicalKey.ASharp,
    "bb": MusicalKey.Bb,
    "b": MusicalKey.Bb,
    "hb": MusicalKey.Bb,
    "h": MusicalKey.B,
}


def get_musical_key_abs_altitude(key: MusicalKey):
    return key.value % NOTES_COUNT


def get_musical_key_altitude(base: MusicalKey, cur: MusicalKey):
    abs_base = get_musical_key_abs_altitude(base)
    abs_cur = get_musical_key_abs_altitude(cur)
    return (abs_cur - abs_base) % NOTES_COUNT


def get_musical_key_by_str(key_str: str, jazz_style: bool = False):
    lower_key_str = key_str.lower()
    dictionary = jazz_style_dictionary if jazz_style else normal_dictionary
    return dictionary[lower_key_str] if lower_key_str in dictionary else None
