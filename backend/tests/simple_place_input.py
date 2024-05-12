from src.services.database_helpers.bible import get_bible_books_by_bible_id
from src.services.elasticsearch.search.bible.bible_search_engine.bible_search_engine import bible_search2

bible_id = "fcd38411-5f94-4bda-9a2a-cd5624b3dac2"


def get_place_by_short_write_template(search_line: str, expected_locations, bible_books: [dict]):
    result = bible_search2(search_line, bible_id)

    print('exp', expected_locations)
    print('res', [res["search_content"] for res in result])
    for i, expected_location in enumerate(expected_locations):
        current_expected = [bible_id] + [bible_books[expected_location[0]]['id']] + expected_location[1:]
        current_result = result[i]["location"]
        print('exp', current_expected)
        print('res', current_result)
        assert current_result == current_expected


short_writes = [
    # 'Исход 1:11 И поставили над ним начальников работ, чтобы изнуряли его тяжкими работами.
    # И он построил фараону Пифом и Раамсес, города для запасов.'
    {'search_line': "Ис фа", 'expected_locations': [[1, 1, 11], [1, 1, 19], [1, 1, 22]]},

    {'search_line': "Ис фарс", 'expected_locations': [[22, 2, 16]]},
    # 'Исаии 2:16 и на все корабли Фарсисские, и на все вожделенные украшения их.'

    {'search_line': "Ис знамениях", 'expected_locations': [[1, 10, 2]]},
    # Исход 10:2 и чтобы ты рассказывал сыну твоему и сыну сына твоего о том, что Я сделал в Египте,
    # и о знамениях Моих, которые Я показал в нем, и чтобы вы знали, что Я Господь.

    {'search_line': "Ис 1", 'expected_locations': [[1, 1, 1]]},
    # Исход 1:1 Вот имена сынов Израилевых, которые вошли в Египет с Иаковом, вошли каждый с домом своим:

    {'search_line': "Ис 4 8", 'expected_locations': [[1, 4, 8], [1, 8, 4]]},  # Исход 4:8 и Исход 8:4

    {'search_line': "Ие 20 хвали", 'expected_locations': [[23, 20, 13]]},
    # Иеремии 20:13 Пойте Господу, хвалите Господа, ибо Он спасает душу бедного от руки злодеев

    {'search_line': "а 12 скита", 'expected_locations': [[29, 8, 12]]},
    # 'Амоса 8:12 И будут ходить от моря до моря и скитаться от севера к востоку, ища слова Господня,
    # и не найдут его.', 'content': 'И будут ходить от моря до моря и скитаться от севера к востоку,
    # ища слова Господня, и не найдут его.'

    {'search_line': "1 и 4 при", 'expected_locations': [[47, 4, 2]]},
    # '1 Иоанна 4:2 Духа Божия (и духа заблуждения) узнавайте так: всякий дух, который исповедует Иисуса Христа,
    # пришедшего во плоти, есть от Бога;'

    {'search_line': "1 и 1", 'expected_locations': [[47, 1, 1], [47, 1, 2], [47, 1, 3], [47, 1, 4], [47, 1, 5]]},
    # verse order

    {'search_line': "без ве уг", 'expected_locations': [[64, 11, 6]]},
    # 'Евреям 11:6 А без веры угодить Богу невозможно; ибо надобно, чтобы приходящий к Богу веровал, что Он есть,
    # и ищущим Его воздает.'

    {'search_line': "отвечает серебро", 'expected_locations': [[20, 10, 19]]},
    # 'Екклесиаст 10:19 Пиры устраиваются для удовольствия, и вино веселит жизнь; а за все отвечает серебро.'

    {'search_line': "1 кор одоб", 'expected_locations': [[53, 3, 1]]},
    # '2 Коринфянам 3:1 Неужели нам снова знакомиться с вами? Неужели нужны для нас, как для некоторых,
    # одобрительные письма к вам или от вас?'

    {'search_line': "лук 13 7", 'expected_locations': [[41, 13, 7]]},
    # 'От Луки 13:7 и сказал виноградарю: вот, я третий год прихожу искать плода на этой смоковнице и не нахожу;
    # сруби ее: на что она и землю занимает?'

    {'search_line': "1 и 2 4", 'expected_locations': [[47, 2, 4], [47, 4, 2]]},
    # '1 Иоанна 2:4 Кто говорит: `я познал Его', но заповедей Его не соблюдает, тот лжец, и нет в нем истины;'
    # '1 Иоанна 4:2 Духа Божия (и духа заблуждения) узнавайте так: всякий дух, который исповедует Иисуса Христа, пришедшего во плоти, есть от Бога;'

    {'search_line': "1 пар 3 4", 'expected_locations': [[12, 3, 4], [12, 4, 3], [13, 3, 4]]},
    # '1 Паралипоменон 3:4 шесть родившихся у него в Хевроне; царствовал же он там семь лет и шесть месяцев; а тридцать три года царствовал в Иерусалиме.'
    # '1 Паралипоменон 4:3 И сии сыновья Етама: Изреель, Ишма и Идбаш, и сестра их, по имени Гацлелпони,'
    # '2 Паралипоменон 3:4 и притвор, который пред домом, длиною по ширине дома в двадцать локтей, а вышиною во сто двадцать. И обложил его внутри чистым золотом.'

    {'search_line': "рим 2 5", 'expected_locations': [[51, 2, 5], [51, 5, 2]]},
    # 'К Римлянам 2:5 Но, по упорству твоему и нераскаянному сердцу, ты сам себе собираешь гнев на день гнева и откровения праведного суда от Бога,'
    # 'К Римлянам 5:2 через Которого верою и получили мы доступ к той благодати, в которой стоим и хвалимся надеждою славы Божией.'

    {'search_line': "к рим 3 6", 'expected_locations': [[51, 3, 6], [51, 6, 3]]},
    # 'К Римлянам 3:6 Никак. Ибо [иначе] как Богу судить мир?'
    # 'К Римлянам 6:3 Неужели не знаете, что все мы, крестившиеся во Христа Иисуса, в смерть Его крестились?'

    {'search_line': "за грех смерт", 'expected_locations': [[51, 6, 23]]},
    # 'К Римлянам 6:23 Ибо возмездие за грех--смерть, а дар Божий--жизнь вечная во Христе Иисусе, Господе нашем.'
]


def test_answer():
    bible_books = get_bible_books_by_bible_id(bible_id)
    # [print(i, book["name"]) for i, book in enumerate(bible_books)]

    for short_write in short_writes:
        get_place_by_short_write_template(short_write["search_line"], short_write['expected_locations'], bible_books)


def test_highlight():
    answer = bible_search2("мат 24 14", bible_id)
    assert answer[0]['search_content'] == 'От <span class="highlighted">Матфея</span> <span class="highlighted">24</span>:<span class="highlighted">14</span> И проповедано будет сие Евангелие Царствия по всей вселенной, во свидетельство всем народам; и тогда придет конец.'
