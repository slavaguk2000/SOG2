import enum
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.database import engine
from src.models.psalms_book import PsalmBook
from src.models.psalm import Psalm
from src.models.couplete import Couplet
from src.services.database_helpers.common import get_direction_function_by_direction
from src.types.commonTypes import SortingDirection


class PsalmsSortingKeys(enum.Enum):
    NAME = 'name'
    NUMBER = 'psalm_number'


def get_psalms_books():
    with Session(engine) as session:
        psalms_books = session.query(PsalmBook).order_by(desc('is_favourite')).all()
        return [
            {
                'id': psalms_book.id,
                'name': psalms_book.name,
                'icon_src': psalms_book.icon_src,
                'is_favourite': psalms_book.is_favourite,
            } for psalms_book in psalms_books
        ]


def get_psalms(
    psalms_book_id: str,
    sort_key: PsalmsSortingKeys = PsalmsSortingKeys.NUMBER,
    sort_direction: SortingDirection = SortingDirection.ASC
):
    with Session(engine) as session:
        psalms_query = select(Psalm)\
            .join(psalms_book_psalms)\
            .join(PsalmBook)\
            .filter(PsalmBook.id == psalms_book_id)\
            .order_by(get_direction_function_by_direction(sort_direction, f'psalms.{sort_key.value}'))
        psalms = session.execute(psalms_query).scalars().all()
        return [
            {
                'id': psalm.id,
                'name': psalm.name,
                'psalm_number': psalm.psalm_number,
                'couplets_order': psalm.couplets_order,
                'default_tonality': psalm.default_tonality.name if psalm.default_tonality else None,
            } for psalm in psalms
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
