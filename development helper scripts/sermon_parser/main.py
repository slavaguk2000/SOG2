import httpx
import uuid
import re
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

from elasticsearch.helpers import BulkIndexError

from elasticSearchServise.ElasticSearch import Elastic
from elasticSearchServise.mappings import sermon_mapping

base_url = 'https://branham.ru'
main_path = 'sermons'


def flatten_deeply_nested_list(nested_list):
    for item in nested_list:
        if isinstance(item, list):
            yield from flatten_deeply_nested_list(item)
        else:
            yield item


def get_text_content_for_sog(sermon_data):
    sep = '\n'
    return '\n'.join(
                [
                    f"{chapter['chapter']}. {sep.join([paragraph.strip() for paragraph in chapter['paragraphs']])}"
                    for chapter in sermon_data["content"]
                ]
            )


def get_text_file_for_sog(sermons_data_array):
    return '\n'.join([
        f"{sermon_data['year']}\n({sermon_data['translation']}) {sermon_data['title'].upper()}\n" +
        f"{get_text_content_for_sog(sermon_data)}\n" for sermon_data in sermons_data_array
    ])


def parse_current_sermon(url):
    with httpx.Client() as client:
        response = client.get(url)

    if response.status_code == 200:
        try:
            soup = BeautifulSoup(response.text, 'html.parser')

            year = re.sub('\\s', '', soup.select('span.my-1')[0].get_text().replace('-', '').strip())
            title = soup.select('h4.mt-3')[0].get_text().strip()
            translation = soup.select('span.my-1')[2].get_text().strip()

            content = [
                {"chapter": idx + 1, "paragraphs": [
                    paragraph.strip() for paragraph in item.get_text().strip().split('\n')
                ]}
                for idx, item in enumerate(soup.select('span.p-text'))
            ]

            audio_modal = soup.find(id='downMp3')
            result_audio_link = None

            if audio_modal:
                audio_links = [item['href'] for item in audio_modal.select('a')]
                hq_audio_link = next((item for item in audio_links if item.startswith('/files/mp3/hq/')), None)
                result_audio_link = hq_audio_link \
                    if (hq_audio_link is not None) or (not len(audio_links)) else \
                    audio_links[0]

            return {"year": year, "title": title, "translation": translation, "content": content,
                    "audio_link": result_audio_link.strip() if result_audio_link else result_audio_link}
        except BaseException as e:
            print(e)

    else:
        print(f'Не удалось получить данные с сайта {url}')


def scrape_branham_sermons():
    url = f'{base_url}/{main_path}'

    with httpx.Client() as client:
        response = client.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        sermon_rows = soup.select('table > tr.my-2')

        future_to_sermon = {}

        with ThreadPoolExecutor() as executor:
            for row in sermon_rows[:10]:
                sermon_link = row.find('a', class_='font-weight-bold')
                if sermon_link and sermon_link.text:
                    link = sermon_link['href']
                    full_link = f'{base_url}{link}'

                    future = executor.submit(parse_current_sermon, full_link)
                    future_to_sermon[future] = full_link

        all_results = []
        for future in as_completed(future_to_sermon):
            result = future.result()
            all_results.append(result)

        return all_results
    else:
        print('Не удалось получить данные с сайта')


def convert_sermon_year_to_datetime(date_str):
    time_mapping = {'M': '10:00', 'A': '14:00', 'E': '18:00', '': '16:00'}
    match = re.match(r'(\d{2})(\d{2})(\d{2})([MAE]?)', date_str)
    if not match:
        raise ValueError(f"Incorect date format: {date_str}")

    year, month, day, time_suffix = match.groups()
    year = f"19{year}"

    time = time_mapping[time_suffix]

    return f"{year}-{'{:02}'.format(max(min(int(month), 12), 1))}-{'{:02}'.format(max(min(int(day), 31), 1))}T{time}:00"


def get_elastic_data_from_single_sermon_data(sermon_data):
    sermon_date = convert_sermon_year_to_datetime(sermon_data["year"])
    sermon_id = str(uuid.uuid4())

    result = []
    order = 0

    for chapter in sermon_data["content"]:
        for idx, paragraph in enumerate(chapter['paragraphs']):
            result.append({
                "_id": str(uuid.uuid4()),
                "sermon_collection_id": "0",
                "sermon_id": sermon_id,
                "paragraph_order": order,
                "sermon_name": sermon_data["title"],
                "sermon_translation": sermon_data["translation"],
                "sermon_date": sermon_date,
                "audio_link": sermon_data["audio_link"],
                **({} if idx else {"chapter": chapter["chapter"]}),
                "chapter_content": paragraph,
            })
            order += 1

    return result


def add_sermon_data_to_elastic(sermons_data):
    elastic_bulk_data_from_branham_ru = [
        get_elastic_data_from_single_sermon_data(sermon_data) for sermon_data in sermons_data
    ]

    el = Elastic()
    el.clear_index(sermon_mapping.index)
    el.create_index(sermon_mapping)

    for one_sermon_data in elastic_bulk_data_from_branham_ru:
        try:
            el.bulk_create(one_sermon_data, sermon_mapping.index)
        except BulkIndexError as e:
            print(e.errors[0])


branham_sermons_data = scrape_branham_sermons()
add_sermon_data_to_elastic(branham_sermons_data)



