from src.services.elasticsearch.search.bible import bible_search


def get_place_by_short_write_template(search_line: str, expected_locations):
    result = bible_search(search_line, "0")
    print()
    print(result)
    for i, expected_location in enumerate(expected_locations):
        assert result[i]["location"] == ['0'] + expected_location


def get_place_by_short_write1():
    # 'Исход 1:11 И поставили над ним начальников работ, чтобы изнуряли его тяжкими работами.
    # И он построил фараону Пифом и Раамсес, города для запасов.'
    get_place_by_short_write_template("Ис фа", [[1, 1, 11], [1, 1, 19]])


def get_place_by_short_write2():
    get_place_by_short_write_template("Ис фарс", [[22, 23, 6]]) # "Исаии 23:6 Переселяйтесь в Фарсис, рыдайте, обитатели острова!"


def get_place_by_short_write3():
    get_place_by_short_write_template("Ис знамениях", [[1, 10, 2]]) # Исход 10:2 и чтобы ты рассказывал сыну твоему и сыну сына твоего о том, что Я сделал в Египте, и о знамениях Моих, которые Я показал в нем, и чтобы вы знали, что Я Господь.


def get_place_by_short_write4():
    get_place_by_short_write_template("Ис 1", [[1, 1, 1]]) # Исход 1:1 Вот имена сынов Израилевых, которые вошли в Египет с Иаковом, вошли каждый с домом своим:


def get_place_by_short_write5():
    get_place_by_short_write_template("Ис 4 8", [[1, 4, 8], [1, 8, 4]]) # Исход 4:8 и Исход 8:4


def get_place_by_short_write6():
    get_place_by_short_write_template("Ие 20 хвали", [[23, 20, 13]]) # Иеремии 20:13 Пойте Господу, хвалите Господа, ибо Он спасает душу бедного от руки злодеев


def get_place_by_short_write7():
    get_place_by_short_write_template("а 12 скита", [[29, 8, 12]]) # 'Амоса 8:12 И будут ходить от моря до моря и скитаться от севера к востоку, ища слова Господня, и не найдут его.', 'content': 'И будут ходить от моря до моря и скитаться от севера к востоку, ища слова Господня, и не найдут его.'


def get_place_by_short_write8():
    get_place_by_short_write_template("1 и 4 при", [[47, 4, 2]]) # '1 Иоанна 4:2 Духа Божия (и духа заблуждения) узнавайте так: всякий дух, который исповедует Иисуса Христа, пришедшего во плоти, есть от Бога;'


def test_answer():
    get_place_by_short_write1()
    get_place_by_short_write2()
    get_place_by_short_write3()
    get_place_by_short_write4()
    get_place_by_short_write5()
    get_place_by_short_write6()
    get_place_by_short_write7()
    get_place_by_short_write8()
