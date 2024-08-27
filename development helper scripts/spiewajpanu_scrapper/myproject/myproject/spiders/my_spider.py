import scrapy


class MySpider(scrapy.Spider):
    name = "my_spider"
    start_urls = [
        'https://www.spiewajpanu.pl/ihop/songbook.nsf/0/3AC293D688D188D4C1257B2F004EA7B9?Open&View=WEBByTitlePL',
    ]
    page_limit = 1000
    page_count = 0

    def parse(self, response):
        self.page_count += 1

        song_title = response.css('td.SongTitle::text').get()
        selected_key = response.css('select.KeyChange option[selected]::attr(value)').get()
        lyrics = response.css('div.SongLyricPL span::text').getall()
        keys = response.css('div.SongKeys span::text').getall()

        next_page_url = response.xpath("//td[contains(text(), 'Następna pieśń')]/@onclick").re_first(
            r"MenuAction\('SSCL','(/[^']+)'")

        if next_page_url and self.page_count < self.page_limit:
            next_page_url = response.urljoin(next_page_url)
            print(f'\n\n\n\nHELlo\n{next_page_url}\n\n\n\n')
            yield scrapy.Request(next_page_url, callback=self.parse)

        yield {
            'song_title': song_title,
            'selected_key': selected_key,
            'song_lines': [
                {
                    'text': lyric.strip(),
                    'chords': (keys[i] if i < len(keys) else '').strip(),
                } for i, lyric in enumerate(lyrics)
            ],
            'page_number': self.page_count,
        }

