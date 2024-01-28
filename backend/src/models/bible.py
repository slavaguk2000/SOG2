import uuid

from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from src.services.database import Base


class Bible(Base):
    __tablename__ = 'bibles'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    books = relationship("BibleBook", back_populates="bible")
    translation = Column(String, nullable=False)
    # ISO 639-3
    language = Column(String, nullable=False)
