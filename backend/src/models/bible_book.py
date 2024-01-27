from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.services.database import Base


class BibleBook(Base):
    __tablename__ = 'bible_books'

    id = Column(Integer, primary_key=True)
    bible_id = Column(Integer, ForeignKey('bibles.id'), nullable=False)
    name = Column(String, nullable=False)
    chapters_count = Column(Integer, nullable=False)

    verses = relationship('Verse', back_populates='bible_book')

    bible = relationship('Bible', back_populates='books')
