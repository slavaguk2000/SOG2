import uuid

from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from src.services.database import Base


class SermonAudioMapping(Base):
    __tablename__ = 'sermon_audio_mappings'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sermon_id = Column(String(36), ForeignKey('sermons.id'), nullable=False)
    audio_link = Column(String, nullable=False)

    sermon = relationship("Sermon", back_populates="audio_mappings")
