from sqlalchemy.orm import Session

from src.models.couplet import Couplet
from src.models.psalm import Psalm
from src.models.psalms_book import PsalmBook
from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.database import engine
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import psalm_mapping
from src.services.elasticsearch.utils import get_numeric_number, get_non_numeric_number

el = Elastic()


def sync_psalms() -> bool:
    if not el.ping():
        print('Elastic was not available')
        return False
    with Session(engine) as session:
        couplets = session.query(
            Couplet,
            Psalm,
            PsalmBook.id.label('psalms_book_id'),
            PsalmBook.name.label('psalms_book_name')
         ). \
            join(Psalm, Couplet.psalm_id == Psalm.id). \
            join(psalms_book_psalms, psalms_book_psalms.c.psalm_id == Psalm.id). \
            join(PsalmBook, PsalmBook.id == psalms_book_psalms.c.psalms_book_id). \
            filter(PsalmBook.is_favourite == False). \
            all()

        if el.index_exist(psalm_mapping.index):
            el.delete_index(psalm_mapping.index)
        else:
            el.create_index(psalm_mapping.index, psalm_mapping.body)

        el.bulk_create(psalm_mapping.index, [
            {
                "_id": couplet.id,
                "psalm_id": psalm.id,
                "psalms_book_id": psalms_book_id,
                "psalms_book_name": psalms_book_name,
                "psalm_name": psalm.name,
                "psalm_name_length": len(psalm.name.split()),
                "psalm_number": psalm.psalm_number,
                "psalm_decimal_number": int(get_numeric_number(psalm.psalm_number)) if len(get_numeric_number(psalm.psalm_number)) else None,
                "psalm_decimal_number_str": str(int(get_numeric_number(psalm.psalm_number))) if len(get_numeric_number(psalm.psalm_number)) else None,
                "psalm_non_numeric_number": get_non_numeric_number(psalm.psalm_number),
                "marker": couplet.marker,
                "couplet_content": "".join([content.text_content for content in couplet.couplet_content]),
                "couplet_order": couplet.initial_order
            } for couplet, psalm, psalms_book_id, psalms_book_name in couplets
        ])
        return True


