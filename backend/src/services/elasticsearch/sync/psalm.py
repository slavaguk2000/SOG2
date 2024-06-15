from sqlalchemy.orm import Session

from src.models.couplet import Couplet
from src.models.psalm import Psalm
from src.models.psalms_book import PsalmBook
from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.database import engine
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import psalm_mapping

el = Elastic()


def sync_psalms() -> bool:
    if not el.ping():
        print('Elastic was not available')
        return False
    with Session(engine) as session:
        couplets = session.query(
            Couplet,
            Psalm,
            PsalmBook.id.label('psalm_book_id')
         ). \
            join(Psalm, Couplet.psalm_id == Psalm.id). \
            join(psalms_book_psalms, psalms_book_psalms.c.psalm_id == Psalm.id). \
            join(PsalmBook, PsalmBook.id == psalms_book_psalms.c.psalms_book_id). \
            filter(PsalmBook.is_favourite == False). \
            all()

        if el.index_exist(psalm_mapping.index):
            el.delete_by_query(psalm_mapping.index, {
                "match_all": {}
            })
        else:
            el.create_index(psalm_mapping.index, psalm_mapping.body)

        el.bulk_create(psalm_mapping.index, [
            {
                "_id": couplet.id,
                "psalm_id": psalm.id,
                "psalm_book_id": psalm_book_id,
                "psalm_name": psalm.name,
                "couplet_content": "".join([content.text_content for content in couplet.couplet_content])
            } for couplet, psalm, psalm_book_id in couplets
        ])
        return True


