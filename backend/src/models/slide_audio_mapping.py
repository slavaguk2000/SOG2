import uuid

from sqlalchemy import Column, String, ForeignKey, Integer, Float
from sqlalchemy.orm import relationship
from src.services.database import Base


class SlideAudioMapping(Base):
    __tablename__ = 'slide_audio_mappings'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    slide_collection_audio_mapping_id = Column(String(36), ForeignKey('sermon_audio_mappings.id'), nullable=False)
    time_point = Column(Integer, nullable=False)
    chars_offset = Column(Integer, nullable=False, server_default='0')
    space_offset = Column(Float, nullable=False, server_default='0')
    slide_id = Column(String(36), ForeignKey('paragraphs.id'), nullable=False)

    sermon_audio_mapping = relationship("SermonAudioMapping", back_populates="slide_audio_mappings")
    slide = relationship("Paragraph", back_populates="slide_audio_mappings")
