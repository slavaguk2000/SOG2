import os
from typing import List
from bs4 import BeautifulSoup


def get_verses_from_file(file_path: str, chapter) -> List[str]:
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        soup = BeautifulSoup(content, 'html.parser')
        book = soup.find('h1').text.strip()
        return [
            f"{book}\t{chapter}\t{verse.get_text(strip=True)}\t{verse.next_sibling.strip()}\n"
            for verse in soup.find_all('span', class_='verse')
        ]


def get_all_verses(root_dir):
    verses = []
    for root, dirs, files in os.walk(root_dir):
        for cur_dir in sorted(dirs):
            for root1, dirs1, files1 in os.walk(os.path.join(root, cur_dir)):
                for file in sorted(files1, key=lambda x: int(x.split('.', 2)[0])):
                    if file.endswith(".htm"):
                        file_path = os.path.join(root, cur_dir, file)
                        verses.extend(get_verses_from_file(file_path, file.split('.', 2)[0]))
    return verses


if __name__ == '__main__':
    root_directory = "pl_new"
    all_verses = get_all_verses(root_directory)
    with open('Polish Bible unchecked.sog', 'w', encoding='utf-8') as file:
        file.writelines(all_verses)
