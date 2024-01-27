from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.services.database import Base


class Verse(Base):
    __tablename__ = 'verses'

    id = Column(Integer, primary_key=True)
    bible_id = Column(Integer, ForeignKey('bibles.id'), nullable=False)
    bible_book_id = Column(Integer, ForeignKey('bible_books.id'), nullable=False)
    chapter = Column(Integer, nullable=False)
    verse_number = Column(Integer, nullable=False)
    verse_content = Column(Text, nullable=False)

    bible_book = relationship('BibleBook', back_populates='verses')