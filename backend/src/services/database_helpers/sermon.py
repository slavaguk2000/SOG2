from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.sermon import Sermon
from src.models.paragraph import Paragraph
from src.models.slide_audio_mapping import SlideAudioMapping


def get_sermons(sermons_collection_id: str):
    with Session(engine) as session:
        sermons = session.query(Sermon).order_by(Sermon.date.asc()).all()
        return [
            {
                'id': sermon.id,
                'name': sermon.name,
                'translation': sermon.translation,
                'date': sermon.date,
                'audio_link': (sermon.audio_mappings[0].audio_link if len(sermon.audio_mappings) else None)
            } for sermon in sermons
        ]


def get_sermon_by_id(sermon_id: str):
    with Session(engine) as session:
        paragraphs = session.query(Paragraph).filter(
            Paragraph.sermon_id == sermon_id,
        ).order_by(Paragraph.paragraph_order.asc()).all()

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


def get_sermon_paragraph_by_id(id: str):
    with Session(engine) as session:
        paragraph = session.query(Paragraph).filter(
            Paragraph.id == id,
        ).first()

        if paragraph:
            return {
                "id": paragraph.id,
                "search_content": paragraph.content,
                "content": paragraph.content,
                "location": [
                    "0",
                    paragraph.sermon_id,
                    "",
                    paragraph.paragraph_order
                ]
            }

    return None


def add_slide_audio_mapping(sermon_audio_mapping_id: str, slide_id: str, time_point: int):
    with Session(engine) as session:
        session.add(
            SlideAudioMapping(
                slide_collection_audio_mapping_id=sermon_audio_mapping_id,
                slide_id=slide_id,
                time_point=time_point
            )
        )
        session.commit()
