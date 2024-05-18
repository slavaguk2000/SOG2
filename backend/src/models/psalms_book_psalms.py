from sqlalchemy import Column, Table, String, ForeignKey
from src.services.database import Base


psalms_book_psalms = Table(
    'psalms_book_psalms',
    Base.metadata,
    Column('psalms_book_id', String(36), ForeignKey('psalm_books.id')),
    Column('psalm_id', String(36), ForeignKey('psalms.id'))
)
