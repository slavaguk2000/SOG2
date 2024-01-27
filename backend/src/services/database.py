from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

DATABASE_URL = "sqlite:///database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db_session = scoped_session(SessionLocal)

Base = declarative_base()


def init_db():
    from src.models.bible import Bible
    from src.models.bible_book import BibleBook
    from src.models.verse import Verse
    Base.metadata.create_all(bind=engine)


def get_db():
    try:
        db = db_session()
        yield db
    finally:
        db.close()

