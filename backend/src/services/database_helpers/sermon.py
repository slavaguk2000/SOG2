from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.sermon import Sermon
from src.models.paragraph import Paragraph


def get_sermons(sermons_collection_id: str):
    with Session(engine) as session:
        sermons = session.query(Sermon).all()
        return [
            {
                'id': sermon.id,
                'name': sermon.name,
                'translation': sermon.translation,
                'date': sermon.date,
                'audioLink': sermon.audio_mappings[0].audio_link if len(sermon.audio_mappings) else None
            } for sermon in sermons
        ]


def get_sermon_by_id(sermon_id: str):
    with Session(engine) as session:
        paragraphs = session.query(Paragraph).filter(
            Paragraph.sermon_id == sermon_id,
        ).all()

        return [{
            "id": paragraph.id,
            "search_content": paragraph.content,
            "content": paragraph.content,
            "location": [
                "0",
                sermon_id,
                paragraph.chapter if paragraph.chapter != paragraphs[idx - 1].chapter else "",
                paragraph.paragraph_order
            ]
        } for idx, paragraph in enumerate(paragraphs)]
