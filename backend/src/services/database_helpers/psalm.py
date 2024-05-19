from sqlalchemy.orm import Session
from sqlalchemy import create_engine, select

from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.common_utils.sermon import get_sermon_date_string_from_datetime
from src.services.database import engine
from src.models.psalms_book import PsalmBook
from src.models.psalm import Psalm
from src.models.couplete import Couplet
from src.models.slide_audio_mapping import SlideAudioMapping


def get_psalms_books():
    with Session(engine) as session:
        psalms_books = session.query(PsalmBook).all()
        return [
            {
                'id': psalms_book.id,
                'name': psalms_book.name,
            } for psalms_book in psalms_books
        ]


def get_psalms(psalms_book_id: str):
    with Session(engine) as session:
        psalms_query = select(Psalm).join(psalms_book_psalms).join(PsalmBook).filter(PsalmBook.id == psalms_book_id)
        psalms = session.execute(psalms_query).scalars().all()
        return [
            {
                'id': psalms_book.id,
                'name': psalms_book.name,
            } for psalms_book in psalms
        ]


def get_psalm_by_id(psalm_id: str):
    with Session(engine) as session:
        couplets = session.query(Couplet).filter(
            Couplet.psalm_id == psalm_id,
        ).order_by(Couplet.initial_order.asc()).all()

        return [{
            "id": couplet.id,
            "search_content": couplet.couplet_content,
            "content": couplet.couplet_content,
            "location": [
                couplet.psalm.psalm_books[0].id,
                couplet.psalm_id,
                couplet.id,
                couplet.marker
            ]
        } for idx, couplet in enumerate(couplets)]
