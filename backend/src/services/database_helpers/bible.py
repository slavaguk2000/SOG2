from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.bible_book import BibleBook
from src.models.verse import Verse
from datetime import datetime, timezone


def get_bible_books_by_bible_id(bible_id: str):
    with Session(engine) as session:
        books = session.query(BibleBook).filter(BibleBook.bible_id == bible_id).all()
        return [{'id': book.id, 'name': book.name, 'chapter_count': book.chapters_count} for book in books]


def get_slide_by_verse(verse: Verse):
    return {
        "id": verse.id,
        "search_content": verse.verse_content,
        "content": verse.verse_content,
        "location": [
            verse.bible_id,
            verse.bible_book.id,
            verse.chapter,
            verse.verse_number
        ],
        "title": f"{verse.bible_book.name} {verse.chapter}"
    }


def get_chapter_verses(bible_id: str, book_id: str, chapter: int):
    with Session(engine) as session:
        verses = session.query(Verse).filter(
            Verse.bible_id == bible_id,
            Verse.bible_book_id == book_id,
            Verse.chapter == chapter
        ).all()

        return [get_slide_by_verse(verse) for verse in verses]


def update_bible_slide_usage_in_db(verse_id: str):
    try:
        with Session(engine) as session:
            verse = session.query(Verse).filter(Verse.id == verse_id).first()
            if verse:
                verse.last_usage = datetime.now(timezone.utc)
                verse.usages_count += 1
                session.commit()
    except BaseException as e:
        print('Error while syncing in database', e)


def get_bible_slide_by_id(verse_id: str):
    with Session(engine) as session:
        verse = session.query(Verse).filter(Verse.id == verse_id).first()
        if verse:
            return get_slide_by_verse(verse)

    return None
