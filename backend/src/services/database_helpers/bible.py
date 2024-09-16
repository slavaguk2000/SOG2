from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, and_
from src.services.database import engine
from src.models.bible import Bible
from src.models.bible_book import BibleBook
from src.models.bible_book_mapping import BibleBooksMapping
from src.models.verse import Verse
from datetime import datetime, timezone


def get_bibles():
    with Session(engine) as session:
        bibles = session.query(Bible).all()
        return [{'id': bible.id} for bible in bibles]


def get_bible_books_by_bible_id(bible_id: str | None):
    with Session(engine) as session:
        books_req = session.query(BibleBook)
        if bible_id:
            books_req = books_req.filter(BibleBook.bible_id == bible_id)
        books = books_req.all()
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
        "content_prefix": f"{verse.verse_number}. ",
        "title": f"{verse.bible_book.name} {verse.chapter}"
    }


def get_chapter_verses(bible_id: str, book_id: str | None, chapter: int):
    with Session(engine) as session:
        verses_req = session.query(Verse).filter(
            Verse.bible_book_id == book_id,
            Verse.chapter == chapter
        )

        if bible_id:
            verses_req = verses_req.filter(Verse.bible_id == bible_id)

        verses = verses_req.all()

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


def get_bible_slide_mappings(
        verse_id: str,
        # TODO : make filtration by language and selected bibles
        mappings_languages: [str]
):
    if not len(mappings_languages):
        return []

    with Session(engine) as session:
        BBM1 = aliased(BibleBooksMapping)
        BBM2 = aliased(BibleBooksMapping)

        mappings_cte = (
            select(
                Verse.chapter,
                Verse.verse_number,
                BBM2.bible_book_id.label("bible_book_id")
            )
            .select_from(Verse)
            .outerjoin(BBM1, Verse.bible_book_id == BBM1.bible_book_id)
            .outerjoin(BBM2, and_(
                BBM1.global_bible_book_id == BBM2.global_bible_book_id,
                BBM2.bible_book_id != Verse.bible_book_id
            ))
            .where(Verse.id == verse_id)
            .cte("mappings")
        )

        query = (
            select(Verse)
            .join(mappings_cte, and_(
                Verse.bible_book_id == mappings_cte.c.bible_book_id,
                Verse.chapter == mappings_cte.c.chapter,
                Verse.verse_number == mappings_cte.c.verse_number
            ))
        )

        verses = session.execute(query).scalars().all()
        return [get_slide_by_verse(verse) for verse in verses]
