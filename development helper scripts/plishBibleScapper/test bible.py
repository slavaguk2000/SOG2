class Verse:
    def __init__(self, verse_string: str):
        [book_name, chapter, verse_num, verse_content] = verse_string.split('\t', maxsplit=3)
        self.book_name = book_name
        self.chapter = chapter
        self.verse_num = verse_num
        self.verse_content = verse_content


with open('Polish Bible.sog', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines[1:]):
        prev = Verse(lines[i])
        cur = Verse(line)
        if prev.book_name != cur.book_name and prev.chapter < cur.chapter:
            print(f"'{prev.book_name}', '{cur.book_name}'")


