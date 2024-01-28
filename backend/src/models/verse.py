import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, ForeignKey, Text, String, DateTime
from sqlalchemy.orm import relationship
from src.services.database import Base


class Verse(Base):
    __tablename__ = 'verses'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bible_id = Column(String(36), ForeignKey('bibles.id'), nullable=False)
    bible_book_id = Column(String(36), ForeignKey('bible_books.id'), nullable=False)
    chapter = Column(Integer, nullable=False)
    verse_number = Column(Integer, nullable=False)
    verse_content = Column(Text, nullable=False)
    last_usage = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    usages_count = Column(Integer, default=0)

    bible_book = relationship('BibleBook', back_populates='verses')
