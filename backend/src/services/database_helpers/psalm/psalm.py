import enum
from typing import Type, List

from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func, exists, literal_column, update

from src.models.couplet import Couplet
from src.models.couplet_content import CoupletContent
from src.models.couplet_content_chord import CoupletContentChord
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


def get_psalm_dict_from_psalm(psalm: Type[Psalm] | Psalm):
    return {
        'id': psalm.id,
        'name': psalm.name,
        'psalm_number': psalm.psalm_number,
        'couplets_order': psalm.couplets_order,
        'default_tonality': psalm.default_tonality.name if psalm.default_tonality else None,
    }


def get_psalm_book_item_dict_from_psalm(psalm: Type[Psalm] | Psalm, psalms_book_id: str, transposition_steps: int):
    return {
        'id': f"{psalms_book_id}{psalm.id}",
        "psalm": get_psalm_dict_from_psalm(psalm),
        "transposition_steps": transposition_steps,
    }


def get_psalms(
        psalms_book_id: str,
        sort_key: PsalmsSortingKeys | None = None,
        sort_direction: SortingDirection = SortingDirection.ASC,
        current_session: Session | None = None
) -> List[dict]:
    current_sort_key = f'psalms.{sort_key.value}' if sort_key else '"order"'

    with (current_session if current_session else Session(engine)) as session:
        psalms_query = select(
            Psalm,
            psalms_book_psalms.c.transposition_steps
        ) \
            .join(psalms_book_psalms, Psalm.id == psalms_book_psalms.c.psalm_id) \
            .join(PsalmBook, PsalmBook.id == psalms_book_psalms.c.psalms_book_id) \
            .filter(PsalmBook.id == psalms_book_id) \
            .order_by(get_direction_function_by_direction(sort_direction, current_sort_key))

        return session.execute(psalms_query).all()


def get_psalm_with_transposition(psalm_id: str, psalms_book_id: str) -> dict:
    with Session(engine) as session:
        psalms_query = select(
            Psalm,
            psalms_book_psalms.c.transposition_steps,
        ) \
            .join(psalms_book_psalms, Psalm.id == psalms_book_psalms.c.psalm_id) \
            .join(PsalmBook, PsalmBook.id == psalms_book_psalms.c.psalms_book_id) \
            .filter(Psalm.id == psalm_id, PsalmBook.id == psalms_book_id)

        return session.execute(psalms_query).first()


def get_psalms_dicts(
        psalms_book_id: str,
        sort_key: PsalmsSortingKeys | None = None,
        sort_direction: SortingDirection = SortingDirection.ASC,
        current_session: Session | None = None
):
    psalms = get_psalms(psalms_book_id, sort_key, sort_direction, current_session)

    return [
        get_psalm_book_item_dict_from_psalm(psalm, psalms_book_id, transposition_steps)
        for psalm, transposition_steps in
        psalms
    ]


def get_favourite_psalms_dicts():
    with Session(engine) as session:
        favourite_psalms_book_id = get_favourite_psalm_book(session).id

        return get_psalms_dicts(favourite_psalms_book_id, current_session=session)


def get_linear_contents_from_couplet(couplet: CoupletContent):
    linear_content = ''.join(
        [content.text_content for content in sorted(couplet.couplet_content, key=lambda x: x.order)]
    )

    return {
        "content": linear_content,
    }


def get_slide_from_couplet(couplet: Couplet):
    return {
        "id": couplet.id,
        **get_linear_contents_from_couplet(couplet),
        "content_prefix": f"{couplet.marker} ",
        "location": [
            couplet.psalm.psalm_books[0].id,
            couplet.psalm_id,
            couplet.id,
            couplet.initial_order,
            couplet.marker
        ]
    }


def get_psalm_by_id(psalm_id: str):
    with Session(engine) as session:
        psalm = session.get(Psalm, psalm_id)

        if not psalm:
            raise "Psalm with such id was not found"

        return {
            "id": psalm_id,
            "psalm": get_psalm_dict_from_psalm(psalm),
            "couplets": [{
                "id": couplet.id,
                "couplet": {
                    "id": couplet.id,
                    "marker": couplet.marker,
                    "initial_order": couplet.initial_order,
                    "styling": couplet.styling,
                    "couplet_content": [{
                        "id": content.id,
                        "text": content.text_content,
                        "line": content.line,
                        "chord": {
                            "id": content.chord.id,
                            "root_note": content.chord.root_note,
                            "bass_note": content.chord.bass_note,
                            "chord_template": content.chord.chord_template,
                        }
                    } for content in sorted(couplet.couplet_content, key=lambda x: x.order)],
                },
                "slide": get_slide_from_couplet(couplet)
            } for couplet in sorted(psalm.couplets, key=lambda x: x.initial_order)]
        }


def get_favourite_psalm_book(session: Session) -> PsalmBook:
    return session.query(PsalmBook).filter(PsalmBook.is_favourite == True).first()


def is_psalm_in_psalm_book(psalm_id: str, psalm_book_id: str) -> bool:
    with Session(engine) as session:
        return bool(
            session.query(
                exists().where(
                    psalms_book_psalms.c.psalm_id == psalm_id,
                    psalms_book_psalms.c.psalms_book_id == psalm_book_id
                )
            ).scalar()
        )


def is_psalm_in_favourite(psalm_id: str) -> bool:
    with Session(engine) as session:
        favourite_psalm_book = get_favourite_psalm_book(session)
        if not favourite_psalm_book:
            raise ValueError("No favourite psalm book found")

        return is_psalm_in_psalm_book(psalm_id, favourite_psalm_book.id)


def add_psalm_to_favourites(psalm_id: str, transposition: int) -> bool:
    with Session(engine) as session:
        favourite_psalm_book = get_favourite_psalm_book(session)
        if not favourite_psalm_book:
            raise ValueError("No favourite psalm book found")

        if is_psalm_in_favourite(psalm_id):
            return False

        max_order = session.query(
            func.max(psalms_book_psalms.c.order)
        ).filter_by(psalms_book_id=favourite_psalm_book.id).scalar()

        if max_order is None:
            max_order = 0

        # Add psalm to favourite psalm book
        session.execute(
            psalms_book_psalms.insert().values(
                psalm_id=psalm_id,
                psalms_book_id=favourite_psalm_book.id,
                transposition_steps=transposition,
                order=max_order + 1,
            )
        )
        session.commit()
        return True


def remove_psalm_from_favourites(psalm_id: str) -> bool:
    with Session(engine) as session:
        favourite_psalm_book = get_favourite_psalm_book(session)
        if not favourite_psalm_book:
            raise ValueError("No favourite psalm book found")

        # Check if the psalm is in favourites
        # TODO : replace with is_psalm_in_psalm_book
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


def delete_psalm_book(psalm_book_id: str):
    with Session(engine) as session:
        psalm_book = session.query(PsalmBook).filter(PsalmBook.id == psalm_book_id).first()
        if not psalm_book:
            raise "Psalm Book with such id not found"

        if psalm_book.is_favourite:
            raise "You can't delete \"favourite\" psalm book"

        psalms = psalm_book.psalms

        for psalm in psalms:
            couplets = session.query(Couplet).filter(Couplet.psalm_id == psalm.id).all()
            for couplet in couplets:
                couplet_contents = session.query(CoupletContent).filter(CoupletContent.couplet_id == couplet.id).all()
                for content in couplet_contents:
                    session.delete(content)
                session.delete(couplet)

            session.delete(psalm)

        session.delete(psalm_book)
        session.commit()

        chords_to_delete = session.query(CoupletContentChord).filter(
            ~CoupletContentChord.couplet_contents.any()
        ).all()
        for chord in chords_to_delete:
            session.delete(chord)

        session.commit()
        return True


def update_psalm_transposition(psalm_book_id: str, psalm_id: str, transposition: int):
    with Session(engine) as session:
        session.execute(
            update(psalms_book_psalms)
            .where(
                psalms_book_psalms.c.psalms_book_id == psalm_book_id,
                psalms_book_psalms.c.psalm_id == psalm_id
            )
            .values(transposition_steps=transposition)
        )
        session.commit()

        result = session.execute(
            select(
                psalms_book_psalms.c.psalms_book_id,
                psalms_book_psalms.c.psalm_id,
                psalms_book_psalms.c.transposition_steps,
                Psalm.id,
                Psalm.name,
                Psalm.psalm_number,
                Psalm.couplets_order,
                Psalm.default_tonality
            )
            .join(Psalm, Psalm.id == psalms_book_psalms.c.psalm_id)
            .where(
                psalms_book_psalms.c.psalms_book_id == psalm_book_id,
                psalms_book_psalms.c.psalm_id == psalm_id
            )
        ).first()

        if not result:
            raise "Invalid ids"

        return get_psalm_book_item_dict_from_psalm(Psalm(
            id=result.id,
            name=result.name,
            psalm_number=result.psalm_number,
            couplets_order=result.couplets_order,
            default_tonality=result.default_tonality
        ), result.psalms_book_id, result.transposition_steps)


def get_psalm_slide_by_id(couplet_id: str):
    with Session(engine) as session:
        couplet = session.query(Couplet).filter(Couplet.id == couplet_id).first()
        if couplet:
            return {
                **get_slide_from_couplet(couplet),
                "content_prefix": f"{couplet.marker} " if couplet.marker else None,
                "title": f"{couplet.psalm.psalm_number} {couplet.psalm.name}"
            }

    return None


def get_psalms_book_by_id(psalm_book_id: str) -> PsalmBook | None:
    with Session(engine) as session:
        psalm_book = session.query(PsalmBook).filter(PsalmBook.id == psalm_book_id).first()
        if psalm_book:
            return psalm_book

    return None


def reorder_psalms_in_psalms_book(psalms_book_id: str, psalms_ids: List[str]):
    if not psalms_book_id or not psalms_ids:
        return False

    with Session(engine) as session:
        for index, psalm_id in enumerate(psalms_ids):
            session.execute(
                update(psalms_book_psalms)
                .where(psalms_book_psalms.c.psalms_book_id == psalms_book_id)
                .where(psalms_book_psalms.c.psalm_id == psalm_id)
                .values(order=index + 1)
            )

        session.commit()

    return True


def create_psalm(psalms_book_id: str, psalm_number: str, psalm_name: str, tonality):
    if not (psalms_book_id and psalm_number and psalm_name and tonality):
        return None

    with Session(engine) as session:
        psalms_book = session.query(PsalmBook).filter(PsalmBook.id == psalms_book_id).first()
        new_psalm = Psalm(
            psalm_number=psalm_number,
            name=psalm_name,
            default_tonality=tonality,
            couplets=[Couplet(
                styling=0,
                marker='',
                couplet_content=[
                    CoupletContent(
                        text_content="First couplet",
                        chord=CoupletContentChord(
                            chord_template='$',
                            root_note=0
                        )
                    )
                ],
                initial_order=0,
            )],
            psalm_books=[psalms_book],
        )
        session.add(new_psalm)
        session.commit()
        return new_psalm.id


def get_real_transposition(
    psalm_id: str,
    transposition: int | None = None,
    psalms_book_id: str | None = None
) -> int:
    if transposition is None and psalms_book_id is not None:
        with Session(engine) as session:
            result = session.execute(
                select(psalms_book_psalms.c.transposition_steps)
                .where(
                    psalms_book_psalms.c.psalms_book_id == psalms_book_id,
                    psalms_book_psalms.c.psalm_id == psalm_id
                )
            ).first()

            if result:
                return result.transposition_steps
    return transposition or 0
