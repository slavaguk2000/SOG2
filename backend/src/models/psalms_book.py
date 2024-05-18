import uuid

from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.database import Base


class PsalmBook(Base):
    __tablename__ = 'psalm_books'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    psalms = relationship("Psalm", secondary=psalms_book_psalms,  back_populates="psalm_books")
    # ISO 639-3
    language = Column(String, nullable=False)
