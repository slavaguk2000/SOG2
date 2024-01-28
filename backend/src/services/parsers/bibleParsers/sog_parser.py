from datetime import datetime, timezone

from sqlalchemy.orm import Session
from src.services.database import engine, Base
from src.models.bible import Bible
from src.models.bible_book import BibleBook
from src.models.verse import Verse

from src.services.database import get_db


class SimpleBibleParser:
    @staticmethod
    def __parse_data_from_sog_bible_strings(sog_data: [str]):
        books = []
        for verse_data in sog_data:
            [book_name, chapter, verse_num, verse_content] = verse_data.split('\t', maxsplit=3)

            if (not len(books)) or books[-1]["name"] != book_name:
                books.append({
                    "name": book_name,
                    "chapters_count": 1,
                    "verses": [],
                    "book_order": len(books),
                })
            else:
                books[-1]["chapters_count"] = max(books[-1]["chapters_count"], int(chapter))

            books[-1]["verses"].append({
                "verse_number": int(verse_num),
                "verse_content": verse_content.strip(),
                "chapter": int(chapter),
            })
        return books

    @staticmethod
    def parse(bible_src: str, language: str, translation: str):
        with open(bible_src, 'r', encoding='utf-8-sig') as bible_file:
            bare_bible_data = bible_file.readlines()
            with Session(engine) as session:
                books = SimpleBibleParser.__parse_data_from_sog_bible_strings(bare_bible_data)
                new_bible = Bible(language=language, translation=translation)
                session.add(new_bible)
                session.commit()
                book_objects = [
                    BibleBook(
                        **{k: v for k, v in book_data.items() if k != 'verses'},
                        bible_id=new_bible.id,
                        verses=[Verse(bible_id=new_bible.id, **verse_data) for verse_data in book_data["verses"]]
                    ) for book_data in books]
                session.add_all(book_objects)
                session.commit()
                print(f"Added new Bible with ID: {new_bible.id}")

