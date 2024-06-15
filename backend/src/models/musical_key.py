import enum


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


dictionary = {
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


def get_musical_key_by_str(key_str: str):
    lower_key_str = key_str.lower()
    return dictionary[lower_key_str] if lower_key_str in dictionary else None
