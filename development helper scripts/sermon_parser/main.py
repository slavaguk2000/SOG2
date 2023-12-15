import httpx
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

base_url = 'https://branham.ru'
main_path = 'sermons'


def parse_current_sermon(url):
    with httpx.Client() as client:
        response = client.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        year = soup.select('span.my-1')[0].get_text().replace('-', '')
        title = soup.select('h4.mt-3')[0].get_text().strip().upper()
        translation = soup.select('span.my-1')[2].get_text()
        content = '\n'.join(
            f"{idx + 1}. {item.get_text()}"
            for idx, item in enumerate(soup.select('span.p-text'))
        )

        print(year)
        print(title)
        print(translation)

    else:
        print(f'Не удалось получить данные с сайта {url}')


def scrape_branham_sermons():
    url = f'{base_url}/{main_path}'

    with httpx.Client() as client:
        response = client.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        sermon_rows = soup.select('table > tr.my-2')

        with ThreadPoolExecutor() as executor:
            for row in sermon_rows:
                sermon_link = row.find('a', class_='font-weight-bold')
                if sermon_link and sermon_link.text:
                    title = sermon_link.text.strip()
                    link = sermon_link['href']
                    full_link = f'{base_url}{link}'
                    print(f'Название: {title}, Ссылка: "{full_link}"')
                    # Запускаем задачу в отдельном потоке
                    executor.submit(parse_current_sermon, full_link)
    else:
        print('Не удалось получить данные с сайта')


# Запускаем функцию скрапинга
scrape_branham_sermons()
