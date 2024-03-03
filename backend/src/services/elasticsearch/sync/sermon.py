from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.paragraph import Paragraph
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import sermon_mapping

el = Elastic()


def sync_sermons() -> bool:
    if not el.ping():
        print('Elastic was not available')
        return False
    with Session(engine) as session:
        paragraphs = session.query(Paragraph).all()

        if el.index_exist(sermon_mapping.index):
            el.delete_by_query(sermon_mapping.index, {
                "match_all": {}
            })
        else:
            el.create_index(sermon_mapping.index, sermon_mapping.body)

        el.bulk_create(sermon_mapping.index, [
            {
                "_id": paragraph.id,
                "sermon_id": paragraph.sermon_id,
                "paragraph_order": paragraph.paragraph_order,
                "sermon_name": paragraph.sermon.name,
                "sermon_translation": paragraph.sermon.translation,
                "sermon_date": paragraph.sermon.date,
                "chapter": paragraph.chapter,
                "chapter_content": paragraph.content,
            } for paragraph in paragraphs
        ])
        return True


