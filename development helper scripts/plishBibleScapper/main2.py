import json

with open('PolishBibleScrapper/PolishBibleScrapper/spiders/bible.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

    for book in sorted(data, key=lambda x: x['order']):
        print(book)
