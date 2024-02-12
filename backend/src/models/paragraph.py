import uuid

from sqlalchemy import Column, Integer, ForeignKey, Text, String
from sqlalchemy.orm import relationship
from src.services.database import Base


class Paragraph(Base):
    __tablename__ = 'paragraphs'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sermon_id = Column(String(36), ForeignKey('sermons.id'), nullable=False)
    paragraph_order = Column(Integer, nullable=False)
    chapter = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)

    sermon = relationship('Sermon', back_populates='paragraphs')
    slide_audio_mappings = relationship("SlideAudioMapping", back_populates="slide", cascade="all, delete-orphan")
