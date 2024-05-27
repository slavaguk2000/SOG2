import enum
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func, exists, literal_column

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
        psalms_books_query = session.query(
            PsalmBook,
            func.count(Psalm.id).label('psalm_count')
        ).outerjoin(psalms_book_psalms, PsalmBook.id == psalms_book_psalms.c.psalms_book_id) \
            .outerjoin(Psalm, Psalm.id == psalms_book_psalms.c.psalm_id) \
            .group_by(PsalmBook.id) \
            .order_by(desc('is_favourite'))

        psalms_books = psalms_books_query.all()

        return [
            {
                'id': psalms_book.PsalmBook.id,
                'name': psalms_book.PsalmBook.name,
                'icon_src': psalms_book.PsalmBook.icon_src,
                'is_favourite': psalms_book.PsalmBook.is_favourite,
                'psalms_count': psalms_book.psalm_count
            } for psalms_book in psalms_books
        ]


def get_psalms(
        psalms_book_id: str,
        sort_key: PsalmsSortingKeys = PsalmsSortingKeys.NUMBER,
        sort_direction: SortingDirection = SortingDirection.ASC
):
    with Session(engine) as session:
        psalms_subquery = (
            select(
                Psalm.id,
                Psalm.psalm_number,
                Psalm.name,
                Psalm.default_tonality,
                Psalm.couplets_order
            )
            .join(psalms_book_psalms, Psalm.id == psalms_book_psalms.c.psalm_id)
            .join(PsalmBook, PsalmBook.id == psalms_book_psalms.c.psalms_book_id)
            .where(PsalmBook.id == psalms_book_id)
            .order_by(get_direction_function_by_direction(sort_direction, f'psalms.{sort_key.value}'))
        ).subquery()

        psalms_query = (
            select(
                psalms_subquery.c.id,
                psalms_subquery.c.psalm_number,
                psalms_subquery.c.name,
                psalms_subquery.c.default_tonality,
                psalms_subquery.c.couplets_order,
                exists(
                    select(literal_column('1'))
                    .select_from(psalms_book_psalms)
                    .join(PsalmBook, PsalmBook.id == psalms_book_psalms.c.psalms_book_id)
                    .where(psalms_book_psalms.c.psalm_id == psalms_subquery.c.id)
                    .where(PsalmBook.is_favourite == True)
                ).label('in_favourite')
            ).correlate(Psalm)
        )

        results = session.execute(psalms_query).all()

        return [
            {
                'id': psalm_id,
                'name': name,
                'psalm_number': psalm_number,
                'couplets_order': couplets_order,
                'default_tonality': default_tonality.name if default_tonality else None,
                'in_favourite': in_favourite
            } for psalm_id, psalm_number, name, default_tonality, couplets_order, in_favourite in results
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


def get_favourite_psalm_book(session: Session) -> PsalmBook:
    return session.query(PsalmBook).filter(PsalmBook.is_favourite == True).first()


def add_psalm_to_favourites(psalm_id: str) -> bool:
    with Session(engine) as session:
        favourite_psalm_book = get_favourite_psalm_book(session)
        if not favourite_psalm_book:
            raise ValueError("No favourite psalm book found")

        # Check if the psalm is already in favourites
        already_favourite = session.query(
            exists().where(
                psalms_book_psalms.c.psalm_id == psalm_id,
                psalms_book_psalms.c.psalms_book_id == favourite_psalm_book.id
            )
        ).scalar()

        if already_favourite:
            return False

        # Add psalm to favourite psalm book
        session.execute(
            psalms_book_psalms.insert().values(psalm_id=psalm_id, psalms_book_id=favourite_psalm_book.id)
        )
        session.commit()
        return True


def remove_psalm_from_favourites(psalm_id: str) -> bool:
    with Session(engine) as session:
        favourite_psalm_book = get_favourite_psalm_book(session)
        if not favourite_psalm_book:
            raise ValueError("No favourite psalm book found")

        # Check if the psalm is in favourites
        in_favourites = session.query(
            exists().where(
                psalms_book_psalms.c.psalm_id == psalm_id,
                psalms_book_psalms.c.psalms_book_id == favourite_psalm_book.id
            )
        ).scalar()

        if not in_favourites:
            return False

        # Remove psalm from favourite psalm book
        session.execute(
            psalms_book_psalms.delete().where(
                psalms_book_psalms.c.psalm_id == psalm_id,
                psalms_book_psalms.c.psalms_book_id == favourite_psalm_book.id
            )
        )
        session.commit()
        return True
