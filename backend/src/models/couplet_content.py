import uuid

from sqlalchemy import Column, ForeignKey, Text, String, Integer, SmallInteger
from sqlalchemy.orm import relationship
from src.services.database import Base


class CoupletContent(Base):
    __tablename__ = 'couplet_contents'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    couplet_id = Column(String(36), ForeignKey('couplets.id'), nullable=False)
    chord_id = Column(String(36), ForeignKey('couplet_content_chords.id'), nullable=False)
    text_content = Column(Text, nullable=False)
    order = Column(Integer, nullable=False, server_default='0')
    line = Column(Integer, nullable=False, server_default='0')

    couplet = relationship('Couplet', back_populates='couplet_content')
    chord = relationship('CoupletContentChord', back_populates='couplet_contents')
