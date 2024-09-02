import scrapy


class MySpider(scrapy.Spider):
    name = "main"
    start_urls = [
        'https://www.wordproject.org/bibles/pl/index.htm',
    ]

    def parse(self, response):
        li_elements_gl = response.css('div.ym-g50.ym-gl ul.nav.nav-tabs.nav-stacked li')
        li_elements_gr = response.css('div.ym-g50.ym-gr ul.nav.nav-tabs.nav-stacked li')
        all_li_elements = li_elements_gl + li_elements_gr

        for i, li in enumerate(all_li_elements[:2]):
            item = {
                'name': li.css('a::text').get(),
                'href': li.css('a::attr(href)').get(),
                'order': i,
                'chapters': []  # Для хранения глав
            }

            next_page_url = response.urljoin(item['href'])
            request = scrapy.Request(url=next_page_url, callback=self.parse_chapter)
            request.meta['item'] = item
            yield request

    def parse_chapter(self, response):
        item = response.meta['item']

        # Извлекаем ссылки на все главы
        chapter_links = response.css('a.chap::attr(href)').getall()

        # Создаем запросы на каждую главу
        for chapter_link in chapter_links[:2]:
            next_chapter_url = response.urljoin(chapter_link)
            request = scrapy.Request(url=next_chapter_url, callback=self.parse_chapter_title)
            request.meta['item'] = item
            yield request

    def parse_chapter_title(self, response):
        item = response.meta['item']

        # Извлекаем заголовок главы
        title = response.css('title::text').get()

        # Извлекаем номер главы из элемента span с классом chapread и преобразуем его в int
        chapter_num = int(response.css('span.chapread::text').get())

        # Добавляем заголовок и номер главы в список глав
        item['chapters'].append({
            'title': title,
            'chapter_num': chapter_num
        })

        # Проверяем, завершены ли все запросы на главы
        if len(item['chapters']) == len(response.css('a.chap::attr(href)').getall()[:2]):
            yield item
