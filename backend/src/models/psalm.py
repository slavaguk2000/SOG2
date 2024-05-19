from sqlalchemy import Column, String, ForeignKey, Integer, Enum
from sqlalchemy.orm import relationship
import uuid

from src.models.musical_key import MusicalKey
from src.models.psalms_book_psalms import psalms_book_psalms
from src.services.database import Base


class Psalm(Base):
    __tablename__ = 'psalms'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    psalm_number = Column(String, nullable=False)
    name = Column(String, nullable=False)
    default_tonality = Column(Enum(MusicalKey), nullable=True)
    couplets_order = Column(String, nullable=True)

    couplets = relationship('Couplet', back_populates='psalm')
    psalm_books = relationship('PsalmBook', secondary=psalms_book_psalms, back_populates='psalms')
