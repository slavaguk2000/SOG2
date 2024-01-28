from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.bible_book import BibleBook


def get_bible_books_by_bible_id(bible_id: str):
    with Session(engine) as session:
        books = session.query(BibleBook).filter(BibleBook.bible_id == bible_id).all()
        return [{'id': book.id, 'name': book.name, 'chapter_count': book.chapters_count} for book in books]
