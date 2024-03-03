import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from src.services.database import Base

import src.models.paragraph
import src.models.sermon_audio_mapping


class Sermon(Base):
    __tablename__ = 'sermons'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    translation = Column(String, nullable=False)
    # ISO 639-3
    language = Column(String, nullable=False)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    audio_mappings = relationship("SermonAudioMapping", back_populates="sermon", cascade="all, delete-orphan")
    paragraphs = relationship("Paragraph", back_populates="sermon", cascade="all, delete-orphan")
