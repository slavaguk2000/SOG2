from elasticSearchServise.ElasticSearch import Elastic
from elasticSearchServise.mappings import bible_mapping
from datetime import datetime

el = Elastic()

book_order = 0
last_book = ""

def get_elastic_single_data_from_sog_bible(verse_data: str, identifier: int):
    global book_order, last_book
    [book, chapter, verse_num, verse_content] = verse_data.split('\t', maxsplit=3)

    if last_book != book:
        if len(last_book):
            book_order += 1
        last_book = book

    verse_content = verse_content.strip()

    return {
        "_id": identifier,
        "book": book,
        "book_name": book,
        "book_order": book_order,
        "bible_id": "0",
        "last_usage": datetime.utcnow(),
        "usages_count": 0,
        "chapter": int(chapter),
        "verse_number": int(verse_num),
        "verse_content": verse_content,
        "search_content": f"{book} {chapter}:{verse_num} {verse_content}"
    }


def get_elastic_bulk_data_from_sog_bible(sog_data: [str]):
    return [
        get_elastic_single_data_from_sog_bible(sog_data[i], i)
        for i in range(len(sog_data))
    ]



with open('russian.sog', 'r', encoding='utf-8-sig') as bible_file:
    bare_bible_data = bible_file.readlines()
    elastic_bulk_data_from_sog_bible = get_elastic_bulk_data_from_sog_bible(bare_bible_data)
    el.clear_index(bible_mapping.index)
    el.bulk_create(elastic_bulk_data_from_sog_bible, bible_mapping.index)

print('finish')
