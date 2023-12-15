import httpx
import re
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

base_url = 'https://branham.ru'
main_path = 'sermons'


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
        f"{sermon_data['year']}\n({sermon_data['translation']}) {sermon_data['title']}\n" +
        f"{get_text_content_for_sog(sermon_data)}\n" for sermon_data in sermons_data_array
    ])


def parse_current_sermon(url):
    with httpx.Client() as client:
        response = client.get(url)

    if response.status_code == 200:
        try:
            soup = BeautifulSoup(response.text, 'html.parser')

            year = re.sub('\\W', '', soup.select('span.my-1')[0].get_text().replace('-', '').strip())
            title = soup.select('h4.mt-3')[0].get_text().strip().upper()
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

            print(year.strip())
            print(title.strip())
            print(translation.strip())
            print(result_audio_link.strip() if result_audio_link else result_audio_link)
            # print(content)
            return { "year": year, "title": title, "translation": translation, "content": content, "audio_link": result_audio_link.strip() if result_audio_link else result_audio_link }
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
            for row in sermon_rows:
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


branham_sermons_data = scrape_branham_sermons()
print()
# print(branham_sermons_data)
print('---------------')
print(get_text_file_for_sog(branham_sermons_data))
print('-------------')
