from src.services.elasticsearch.search.bible import bible_search


def get_place_by_short_write_template(search_line: str, expected_locations):
    result = bible_search(search_line, "0")
    print()
    print(result)
    for i, expected_location in enumerate(expected_locations):
        assert result[i]["location"] == ['0'] + expected_location


short_writes = [
    # 'Исход 1:11 И поставили над ним начальников работ, чтобы изнуряли его тяжкими работами.
    # И он построил фараону Пифом и Раамсес, города для запасов.'
    {'search_line': "Ис фа", 'expected_locations': [[1, 1, 11], [1, 1, 19]]},

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
]


def test_answer():
    for short_write in short_writes[-1:]:
        get_place_by_short_write_template(short_write["search_line"], short_write['expected_locations'])
