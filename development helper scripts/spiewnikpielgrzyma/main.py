import asyncio
import re
from typing import List

import aiohttp


async def fetch(session, url):
    try:
        async with session.get(url) as response:
            return await response.text()
    except Exception as e:
        print(f"Ошибка при загрузке {url}: {e}")
        return None


async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for url in urls:
            task = asyncio.create_task(fetch(session, url))
            tasks.append(task)
        return await asyncio.gather(*tasks)


def get_documents(urls):
    return asyncio.run(fetch_all(urls))


class RawPsalm:
    def __init__(self, psalm_data: str):
        [raw_title_str, raw_couplets_str] = psalm_data.split('\n', maxsplit=1)
        title_regex_result = re.match(r"^(.+)\. (.+)$", raw_title_str)
        number = title_regex_result.group(1).strip()
        self.__number = f"00{number}"[-3:] if number.isdigit() else number
        self.__title = title_regex_result.group(2).strip()
        self.__couplets: List[str] = raw_couplets_str.strip().split('\n\n')

    def get_sog(self):
        couplets = '\n'.join([re.sub(r"^Refren:", "*", c) for c in self.__couplets])
        return f"{self.__number}\n{self.__title}\n{couplets}"

    def __str__(self):
        return f"RawPsalm(n:{self.__number};ttl:{self.__title})"

    def __repr__(self):
        return self.__str__()


if __name__ == "__main__":
    normal_numbers = [f'00{i + 1}'[-3:] for i in range(860)]
    external_numbers = [f"A{f'0{i + 1}'[-2:]}" for i in range(15)]

    all_numbers = [*normal_numbers, *external_numbers]

    urls = [
        f"https://kajetansuchanski.pl/spiewnikpielgrzyma/res/hymns/texts/{number}"
        for number
        in all_numbers[:5000]
    ]

    psalms = get_documents(urls)

    sog_psalms = [RawPsalm(psalm).get_sog() for psalm in psalms]

    with open('Spiewnik Pielgrzyma.sog', 'w', encoding='utf-8') as file:
        file.write("\n\n".join(sog_psalms))
