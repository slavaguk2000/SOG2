import enum
from typing import Type

from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func, exists, literal_column

from src.models.couplet_content import CoupletContent
from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.database import engine
from src.models.psalms_book import PsalmBook
from src.models.psalm import Psalm
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


def get_psalm_dict_from_psalm(psalm: Type[Psalm]):
    return {
        'id': psalm.id,
        'name': psalm.name,
        'psalm_number': psalm.psalm_number,
        'couplets_order': psalm.couplets_order,
        'default_tonality': psalm.default_tonality.name if psalm.default_tonality else None,
    }


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
            get_psalm_dict_from_psalm(psalm) for psalm in psalms
        ]


def get_linear_contents_from_couplet(couplet: CoupletContent):
    print(couplet.couplet_content)
    linear_content = ''.join(
        [content.text_content for content in sorted(couplet.couplet_content, key=lambda x: x.order)]
    )

    return {
        "search_content": linear_content,
        "content": linear_content,
    }


def get_psalm_by_id(psalm_id: str):
    with Session(engine) as session:
        psalm = session.get(Psalm, psalm_id)

        if not psalm:
            raise "Psalm with such id was not found"

        return {
            "psalm": get_psalm_dict_from_psalm(psalm),
            "couplets": [{
                "id": couplet.id,
                "marker": couplet.marker,
                "initial_order": couplet.initial_order,
                "couplet_content": [{
                    "id": content.id,
                    "text": content.text_content,
                    "line":  content.line,
                    "chord": {
                        "id": content.chord.id,
                        "root_note": content.chord.root_note,
                        "bass_note": content.chord.bass_note,
                        "chord_template": content.chord.chord_template,
                    }
                } for content in sorted(couplet.couplet_content, key=lambda x:x.order)],
                "slide": {
                    "id": couplet.id,
                    **get_linear_contents_from_couplet(couplet),
                    "location": [
                        couplet.psalm.psalm_books[0].id,
                        couplet.psalm_id,
                        couplet.id,
                        couplet.marker
                    ]
                }
            } for idx, couplet in enumerate(sorted(psalm.couplets, key=lambda x:x.initial_order))
        ]
    }


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
