from elasticSearchServise.ElasticSearch import Elastic
from elasticSearchServise.mappings import bible_mapping

el = Elastic()


def get_elastic_single_data_from_sog_bible(verse_data: str, identifier: int):
    [book, chapter, verse_num, verse_content] = verse_data.split('\t', maxsplit=3)
    return {
        "_id": identifier,
        "doc": {
            "book": book,
            "chapter": int(chapter),
            "verse_number": int(verse_num),
            "verse_content": verse_content.strip()
        }
    }


def get_elastic_bulk_data_from_sog_bible(sog_data: [str]):
    return [
        get_elastic_single_data_from_sog_bible(sog_data[i], i)
        for i in range(len(sog_data))
    ]


with open('russian.sog', 'r', encoding='utf-8-sig') as bible_file:
    bare_bible_data = bible_file.readlines()
    el.bulk_create(get_elastic_bulk_data_from_sog_bible(bare_bible_data), bible_mapping.index)

print('finish')
