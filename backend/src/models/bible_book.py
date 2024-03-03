from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
import uuid
from src.services.database import Base
from src.models.bible import Bible


class BibleBook(Base):
    __tablename__ = 'bible_books'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bible_id = Column(String(36), ForeignKey('bibles.id'), nullable=False)
    book_order = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    chapters_count = Column(Integer, nullable=False)

    verses = relationship('Verse', back_populates='bible_book')
    bible = relationship('Bible', back_populates='books')
