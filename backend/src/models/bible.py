from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.services.database import Base


class Bible(Base):
    __tablename__ = 'bibles'

    id = Column(Integer, primary_key=True)
    books = relationship("BibleBook", back_populates="bible")
    translation = Column(String, nullable=False)
