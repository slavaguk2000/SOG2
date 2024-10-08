from sqlalchemy.orm import Session

from src.utils.bible_utils import get_root_book_name_rus
from src.services.database import engine
from src.models.verse import Verse
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import bible_mapping

el = Elastic()


def sync_bible(bible_id: str) -> bool:
    if not el.ping():
        print('Elastic was not available')
        return False
    with Session(engine) as session:
        verses = session.query(Verse).filter(Verse.bible_id == bible_id).all()

        if el.index_exist(bible_mapping.index):
            el.delete_index(bible_mapping.index)
        else:
            el.create_index(bible_mapping.index, bible_mapping.body)

        el.bulk_create(bible_mapping.index, [
            {
                "_id": verse.id,
                "book_id": verse.bible_book.id,
                "book_name": verse.bible_book.name,
                "root_book_name": get_root_book_name_rus(verse.bible_book.name),
                "book_name_length": len(verse.bible_book.name.split()),
                "book_order": verse.bible_book.book_order,
                "bible_id": verse.bible_id,
                "last_usage": verse.last_usage,
                "usages_count": verse.usages_count,
                "chapter": verse.chapter,
                "verse_number": verse.verse_number,
                "verse_content": verse.verse_content,
                "search_content": f"{verse.bible_book.name} {verse.chapter}:{verse.verse_number} {verse.verse_content}"
            } for verse in verses
        ])
        return True
