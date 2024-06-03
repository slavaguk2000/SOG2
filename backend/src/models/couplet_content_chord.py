import uuid

from sqlalchemy import Column, ForeignKey, Text, String, Integer, SmallInteger
from sqlalchemy.orm import relationship
from src.services.database import Base


class CoupletContentChord(Base):
    __tablename__ = 'couplet_content_chords'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chord_template = Column(String(32), nullable=False, server_default='$')
    root_note = Column(SmallInteger, nullable=False, server_default='0')
    bass_note = Column(SmallInteger, nullable=True)

    couplet_contents = relationship('CoupletContent', back_populates='chord')
