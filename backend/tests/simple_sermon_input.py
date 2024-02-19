from src.services.elasticsearch.search.sermon.sermon import sermon_search
from src.services.database_helpers.sermon import get_sermons


def sermon_search_test(search_line: str, expected_locations: [[int | str]]):
    result = sermon_search(search_line, "0")

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
