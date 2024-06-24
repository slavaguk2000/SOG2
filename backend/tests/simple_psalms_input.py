from src.services.elasticsearch.search.psalm.psalm import psalm_search


def test_search_by_text_with_stop_words():
    answers = psalm_search("не может солнца", None)
    answer_contents = [answer_item['search_content'] for answer_item in answers[0:2]]

    expected_1 = 'Благословлю, Господь, Тебя 062 Я ПРИНОШУ ТЕБЕ ХВАЛУ 1. <span class="highlighted">Не</span> <span class="highlighted">может</span> <span class="highlighted">солнца</span> лик описать Твою любовь, В Твоем Присутствии <span class="highlighted">нет</span> тени. Перед Тобой предстать никто из смертных бы <span class="highlighted">не</span> смог - Лишь Ты Святой, Единый, Вечный. Только через кровь, только через милость я прихожу.'
    expected_2 = 'Верь, только верь 496 Я ПРИНОШУ ТЕБЕ ХВАЛУ 1. <span class="highlighted">Не</span> <span class="highlighted">может</span> <span class="highlighted">солнца</span> лик описать Твою любовь, В Твоём Присутствии <span class="highlighted">нет</span> тени. Перед Тобой предстать никто из смертных бы <span class="highlighted">не</span> смог – Лишь Ты святой, единый, вечный. Только через Кровь, Только через милость я прихожу.'

    assert expected_1 in answer_contents
    assert expected_2 in answer_contents


def test_search_by_text_with_partial_words():
    answers = psalm_search("н мож со ли оп", None)
    answer_contents = [answer_item['search_content'] for answer_item in answers[0:2]]

    expected_1 = 'Благословлю, Господь, Тебя 062 Я ПРИНОШУ ТЕБЕ ХВАЛУ 1. <span class="highlighted">Не</span> <span class="highlighted">может</span> <span class="highlighted">солнца</span> <span class="highlighted">лик</span> <span class="highlighted">описать</span> Твою любовь, В Твоем Присутствии <span class="highlighted">нет</span> тени. Перед Тобой предстать <span class="highlighted">никто</span> из смертных бы <span class="highlighted">не</span> смог - <span class="highlighted">Лишь</span> Ты Святой, Единый, Вечный. Только через кровь, только через милость я прихожу.'
    expected_2 = 'Верь, только верь 496 Я ПРИНОШУ ТЕБЕ ХВАЛУ 1. <span class="highlighted">Не</span> <span class="highlighted">может</span> <span class="highlighted">солнца</span> <span class="highlighted">лик</span> <span class="highlighted">описать</span> Твою любовь, В Твоём Присутствии <span class="highlighted">нет</span> тени. Перед Тобой предстать <span class="highlighted">никто</span> из смертных бы <span class="highlighted">не</span> смог – <span class="highlighted">Лишь</span> Ты святой, единый, вечный. Только через Кровь, Только через милость я прихожу.'

    assert expected_1 in answer_contents
    assert expected_2 in answer_contents

