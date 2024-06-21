from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.paragraph import Paragraph
from src.services.elasticsearch.elastic import Elastic
from src.services.elasticsearch.mappings import sermon_mapping

el = Elastic()


def replace_english_letters_to_russian_equivalent(input_string: str):
    for en, ru in [
        ("C", "С"), ("c", "с"),
        ("O", "О"), ("o", "о"),
        ("X", "Х"), ("x", "х"),
        ("A", "А"), ("a", "а"),
        ("B", "В"),
        ("E", "Е"), ("e", "е"),
        ("K", "К"), ("k", "к"),
        ("M", "М"), ("m", "м"),
        ("H", "Н"), ("h", "Н"),
        ("P", "Р"), ("p", "р"),
        ("T", "Т"), ("t", "т"),
        ("n", "п"),
        ("u", "и"),
        ("y", "у")
    ]:
        input_string = input_string.replace(en, ru)
    return input_string


def sync_sermons() -> bool:
    if not el.ping():
        print('Elastic was not available')
        return False
    with Session(engine) as session:
        paragraphs = session.query(Paragraph).all()

        if el.index_exist(sermon_mapping.index):
            el.delete_by_query(sermon_mapping.index, {
                "match_all": {}
            })
        else:
            el.create_index(sermon_mapping.index, sermon_mapping.body)

        chunk_size = 1000
        for i in range(0, len(paragraphs), chunk_size):
            print(i)
            el.bulk_create(sermon_mapping.index, [
                {
                    "_id": paragraph.id,
                    "sermon_id": paragraph.sermon_id,
                    "paragraph_order": paragraph.paragraph_order,
                    "sermon_name": replace_english_letters_to_russian_equivalent(paragraph.sermon.name),
                    "sermon_name_length": len(paragraph.sermon.name.split()),
                    "sermon_translation": paragraph.sermon.translation,
                    "sermon_date": paragraph.sermon.date,
                    "chapter": paragraph.chapter,
                    "chapter_content": replace_english_letters_to_russian_equivalent(paragraph.content),
                } for paragraph in paragraphs[i:i + chunk_size]
            ])
        return True


