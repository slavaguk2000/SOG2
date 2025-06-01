from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from typing import List
from bs4 import BeautifulSoup

from src.services.database import engine
from src.models.bible import Bible
from src.models.bible_book import BibleBook
from src.models.verse import Verse

class SqliteBibleParser:
    @staticmethod
    def get_dict_books(session: Session) -> dict:
        result = session.execute(text("SELECT * FROM books"))
        source_books = result.fetchall()
        columns = result.keys()
        books_dicts = [dict(zip(columns, row)) for row in source_books]
        dict_books = dict()
        for book in books_dicts:
            book["verses"] = []
            dict_books[book["book_number"]] = book
        return dict_books

    @staticmethod
    def get_list_verses(session: Session) -> List[dict]:
        result = session.execute(text("SELECT * FROM verses"))
        source_verses = result.fetchall()
        columns = result.keys()
        return [dict(zip(columns, row)) for row in source_verses]

    @staticmethod
    def get_chapter_count(verses: List[dict]) -> int:
        chapter_numbers_set = set()
        for verse in verses:
            chapter_numbers_set.add(verse["chapter"])
        return len(chapter_numbers_set)

    @staticmethod
    def get_clean_verse_content(text: str) -> str:
        soup = BeautifulSoup(text, "html.parser")
        return soup.get_text()

    @staticmethod
    def parse(bible_src: str, language: str, translation: str):
        with Session(create_engine(f"sqlite:///{bible_src}", connect_args={"check_same_thread": False}, echo=True)) as bible_source_session:
            with Session(engine) as session:
                dict_books = SqliteBibleParser.get_dict_books(bible_source_session)
                verses = SqliteBibleParser.get_list_verses(bible_source_session)

                for verse in verses:
                    book_number = verse["book_number"]
                    book = dict_books[book_number]
                    if book:
                        book["verses"].append(verse)

                new_bible = Bible(language=language, translation=translation)
                session.add(new_bible)
                session.commit()
                book_objects = [
                    BibleBook(
                        name=book_data["long_name"],
                        book_order=book_data["sorting_order"],
                        chapters_count=SqliteBibleParser.get_chapter_count(book_data["verses"]),
                        bible_id=new_bible.id,
                        verses=[Verse(
                            bible_id=new_bible.id,
                            chapter=verse_data["chapter"],
                            verse_number=verse_data["verse"],
                            verse_content=SqliteBibleParser.get_clean_verse_content(verse_data["text"])
                        ) for verse_data in book_data["verses"]]
                    ) for book_data in dict_books.values()]

                session.add_all(book_objects)
                session.commit()
                print(f"Added new Bible with ID: {new_bible.id}")

