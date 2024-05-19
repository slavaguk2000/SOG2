import uuid

from sqlalchemy import Column, ForeignKey, Text, String, Integer
from sqlalchemy.orm import relationship
from src.services.database import Base


class Couplet(Base):
    __tablename__ = 'couplets'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    psalm_id = Column(String(36), ForeignKey('psalms.id'), nullable=False)
    marker = Column(String, nullable=False)
    couplet_content = Column(Text, nullable=False)
    initial_order = Column(Integer, nullable=False, server_default='0')

    psalm = relationship('Psalm', back_populates='couplets')
