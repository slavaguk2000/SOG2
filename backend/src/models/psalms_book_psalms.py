from sqlalchemy import Column, Table, String, ForeignKey, Integer
from src.services.database import Base


psalms_book_psalms = Table(
    'psalms_book_psalms',
    Base.metadata,
    Column('psalms_book_id', String(36), ForeignKey('psalm_books.id')),
    Column('psalm_id', String(36), ForeignKey('psalms.id')),
    Column('transposition_steps', Integer, nullable=False, server_default='0'),
    Column('order', Integer, nullable=False, server_default='0')
)
