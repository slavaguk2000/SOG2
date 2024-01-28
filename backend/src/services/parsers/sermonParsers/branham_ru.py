import datetime

from sqlalchemy.orm import Session
from src.services.database import engine
from src.models.sermon_audio_mapping import SermonAudioMapping
from src.models.paragraph import Paragraph
from src.models.sermon import Sermon
import httpx
import uuid
import re
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

base_url = 'https://branham.ru'
main_path = 'sermons'


class BranhamRuSermonParser:
    @staticmethod
    def flatten_deeply_nested_list(nested_list):
        for item in nested_list:
            if isinstance(item, list):
                yield from BranhamRuSermonParser.flatten_deeply_nested_list(item)
            else:
                yield item

    @staticmethod
    def parse_current_sermon(url):
        with httpx.Client() as client:
            response = client.get(url)

        if response.status_code == 200:
            try:
                soup = BeautifulSoup(response.text, 'html.parser')

                date = re.sub('\\s', '', soup.select('span.my-1')[0].get_text().replace('-', '').strip())
                name = soup.select('h4.mt-3')[0].get_text().strip()
                translation = soup.select('span.my-1')[2].get_text().strip()

                content = [
                    [
                        {
                            "content": paragraph.strip(),
                            "chapter": idx + 1
                        } for paragraph in item.get_text().strip().split('\n')
                    ]
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

                return {
                    "date": BranhamRuSermonParser.convert_sermon_year_to_datetime(date),
                    "name": name,
                    "translation": translation,
                    "content": content,
                    **({"audio_link":
                         f"https://branham.ru{result_audio_link.strip()}"} if result_audio_link else {})
                }
            except BaseException as e:
                print(e)

        else:
            print(f'Не удалось получить данные с сайта {url}')

    @staticmethod
    def scrape_branham_sermons():
        url = f'{base_url}/{main_path}'

        with httpx.Client() as client:
            response = client.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            sermon_rows = soup.select('table > tr.my-2')

            future_to_sermon = {}

            with ThreadPoolExecutor() as executor:
                for row in sermon_rows:
                    sermon_link = row.find('a', class_='font-weight-bold')
                    if sermon_link and sermon_link.text:
                        link = sermon_link['href']
                        full_link = f'{base_url}{link}'

                        future = executor.submit(BranhamRuSermonParser.parse_current_sermon, full_link)
                        future_to_sermon[future] = full_link

            all_results = []
            for future in as_completed(future_to_sermon):
                result = future.result()
                all_results.append(result)

            return all_results
        else:
            print('Не удалось получить данные с сайта')

    @staticmethod
    def convert_sermon_year_to_datetime(date_str):
        time_mapping = {'M': '10:00', 'A': '14:00', 'E': '18:00', '': '16:00'}
        match = re.match(r'(\d{2})(\d{2})(\d{2})([MAE]?)', date_str)
        if not match:
            raise ValueError(f"Incorect date format: {date_str}")

        year, month, day, time_suffix = match.groups()
        year = f"19{year}"

        time = time_mapping[time_suffix]

        return f"{year}-{'{:02}'.format(max(min(int(month), 12), 1))}-{'{:02}'.format(max(min(int(day), 31), 1))}T{time}:00"

    @staticmethod
    def get_paragraphs_from_content(sermon_data_content: [[dict]]):
        result = []
        order = 0

        for chapter in sermon_data_content:
            for paragraph in chapter:
                result.append({
                    **paragraph,
                    "paragraph_order": order,
                })
                order += 1

        return result

    @staticmethod
    def parse(delete_previous=False):
        branham_sermons_data = BranhamRuSermonParser.scrape_branham_sermons()
        with Session(engine) as session:
            if delete_previous:
                all_records = session.query(Sermon).all()
                for record in all_records:
                    session.delete(record)
                session.commit()
            for sermon in branham_sermons_data:
                sermon_obj = Sermon(
                    translation=sermon["translation"],
                    language='rus',
                    name=sermon["name"],
                    date=datetime.datetime.fromisoformat(sermon["date"]),
                    paragraphs=[
                        Paragraph(**paragraph) for paragraph
                        in BranhamRuSermonParser.get_paragraphs_from_content(sermon["content"])
                    ],
                    audio_mappings=([SermonAudioMapping(audio_link=sermon["audio_link"])]
                                    if sermon.get("audio_link") else [])
                )
                session.add(sermon_obj)
                session.commit()





