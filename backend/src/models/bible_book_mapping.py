from sqlalchemy import Column, String, ForeignKey
import uuid
from src.services.database import Base


class BibleBooksMapping(Base):
    __tablename__ = 'bible_books_mappings'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bible_book_id = Column(String(36), ForeignKey('bible_books.id'), nullable=False)
    global_bible_book_id = Column(String(36), ForeignKey('bible_books.id'), nullable=False)
