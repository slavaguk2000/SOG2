from src.services.elasticsearch.search.sermon.sermon import sermon_search
from src.services.database_helpers.sermon import get_sermons
import re


def sermon_search_test(search_line: str, expected_locations: [[int | str]]):
    result = sermon_search(search_line, "0", None)

    for i, expected_location in enumerate(expected_locations):
        current_result = result[i]["location"][1:]
        assert current_result == expected_location


def get_id_by_name_and_translation(sermons: [dict], name: str, translation: str):
    return list(
        filter(
            lambda d:
            d.get('name') == name and
            d.get('translation') == translation,
            sermons
        )
    )[0]


def template_test_answer(test_suites: [dict]):
    sermons = get_sermons('0')

    for test_suite in test_suites:
        expected_locations = test_suite["expected_locations"]
        for i, expected_location in enumerate(expected_locations):
            expected_locations[i] = [
                get_id_by_name_and_translation(sermons, expected_location[0], expected_location[1])["id"],
                expected_location[2],
                expected_location[3],
            ]
        sermon_search_test(test_suite["search_line"], expected_locations)


def test_full_words_inputs():
    full_words_inputs = [
        {
            'search_line': "этот человек лжепророк",
            'expected_locations': [
                ["Распознай cвой день и его послание", "VGR", '189', 280],
                ["Распознай cвой день и его послание", "MS", '189', 280],
            ]
        },
    ]
    template_test_answer(full_words_inputs)


def test_short_writes():
    short_writes = [
        {
            'search_line': "рас 189 лже",
            'expected_locations': [
                ["Распознай cвой день и его послание", "VGR", '189', 280],
                ["Распознай cвой день и его послание", "MS", '189', 280],
            ]
        },
    ]
    template_test_answer(short_writes)


def test_highlight():
    answer = sermon_search("рас 189 лже", "0", None)
    assert answer[0]['search_content'] == '64-0726 <span class="highlighted">Распознай</span> свой день и его послание (VGR) <span class="highlighted">189</span> Вот, тот же самый человек поставил кассету и сказал: "Взгляните сюда, Пятидесятники, — сказал, — и вы, Баптисты. Этот человек, <span class="highlighted">лжепророк</span> Уилльям Бранхам сказал, что Орал Роберте и Билли Грэйем были в Содоме." Смотрите, потом обрезал ленту; вот и все, понимаете.'


def test_context():
    # 61d8295e-8f63-49c7-8a84-cfed75e83e9b - ID of Распознай cвой день и его послание (VGR)
    test_sermon_id = "61d8295e-8f63-49c7-8a84-cfed75e83e9b"
    count_result_in_sermon = 3
    search_pattern = "лжеп"
    answers = sermon_search(search_pattern, "0", test_sermon_id)
    for start_answer in answers[0:count_result_in_sermon]:
        assert start_answer['location'][1] == test_sermon_id
    for every_answer in answers:
        highlighted_parts = re.findall(r'<span class="highlighted">([^<]+)</span>', every_answer['search_content'])
        assert any(highlighted.lower().startswith(search_pattern) for highlighted in highlighted_parts)


def test_find_by_sermon_name():
    answer = sermon_search("рас св ден", "0", None)
    assert answer[0]['search_content'] == "64-0726 <span class=\"highlighted\">Распознай</span> <span class=\"highlighted\">свой</span> <span class=\"highlighted\">день</span> и его послание (VGR) 1 Доброе утро, друзья. Не садитесь пока, пожалуйста."


def test_search_by_name_and_chapter():
    answer = sermon_search("бог ми 143", "0", None)
    assert answer[0]['search_content'] == '65-0119 <span class="highlighted">Бог</span>, <span class="highlighted">богатый</span> <span class="highlighted">милостью</span> (VGR) <span class="highlighted">143</span> Но прежде чем мы это сделаем, из–за того, что здесь могут находиться прибывшие впервые, избавимся от всех суеверий. Это не суеверие. Это проявление обетования Божьего. Все зависит от того, на что вы смотрите. Ни в одном человеке нет добродетели. Ни в одном человеке нет силы. Но мы как верующие имеем власть, не силу, но власть.'
    assert answer[1]['search_content'] == '65-0119 <span class="highlighted">Бог</span> <span class="highlighted">богатый</span> <span class="highlighted">милостью</span> (Вильнюс) <span class="highlighted">143</span> Но прежде чем мы это сделаем, если здесь находятся новоприбывшие, выбросьте все суеверия…Это не суеверие. Это проявление обетования Божьего. Все зависит от того, на что вы смотрите. Ни в одном человеке нет добродетели. Ни в одном человеке нет силы. Но мы как верующие имеем власть, не силу, но власть.'