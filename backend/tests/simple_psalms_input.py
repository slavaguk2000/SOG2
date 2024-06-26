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


def test_search_by_number():
    answers = psalm_search("2", None)
    answer_content = answers[0]['search_content']

    expected = 'Благословлю, Господь, Тебя <span class="highlighted">2</span> БЛИЖЕ БЫТЬ К ТЕБЕ 1. Я так слаб, но силен Ты, Удержать меня вдали От всего, что мне вредит, О, позволь лишь с Тобою идти.'

    assert expected == answer_content


def test_search_by_non_numeric_number():
    answers = psalm_search("д11", None)
    answer_contents = [answer_item['search_content'] for answer_item in answers[0:5]]

    expected = [
        'Верь, только верь <span class="highlighted">д011</span> НАС ЗОВУТ ХРИСТИАНЕ 1. Манит сердце мечтою Высь небес голубая Нашей общей судьбою Стала Вера живая.',
        'Верь, только верь <span class="highlighted">д110</span> АНГЕЛЫ В НЕБЕ ГОСПОДА СЛАВЯТ 1. Ангелы в небе Господа славят, Славу достойную Богу поют, Богу поют:',
        'Верь, только верь <span class="highlighted">д111</span> ОТ ПОГИБЕЛИ СПАСЛА МЕНЯ МИЛОСТЬ БОЖИЯ 1. От погибели спасла меня Милость Божия, В день отчаянья нашла меня Милость Божия. То, что я ещё живу, то, что Господу служу, Это милость Божия, это милость Божия.',
        'Верь, только верь <span class="highlighted">д112</span> ТЫ ЗНАЕШЬ, БОЖЕ, МОИ ЖЕЛАНЬЯ 1. Ты знаешь, Боже, мои желанья, Мои молитвы слышишь Ты; Тебе известны мои страданья, Мои стремленья и мечты.',
        'Верь, только верь <span class="highlighted">д113</span> О ГОСПОДЬ, В МОЛИТВЕ 1. О Господь, в молитве пред Тобой склоняюсь, Благодарность сердца приношу Тебе За любовь, за путь Твой. Боже, умоляю - Освяти, очисти жизнь мою в Себе!',
    ]

    for i, expected_item in enumerate(expected):
        assert expected_item == answer_contents[i]

