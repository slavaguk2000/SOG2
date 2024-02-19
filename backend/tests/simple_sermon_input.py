from src.services.elasticsearch.search.sermon.sermon import sermon_search
from src.services.database_helpers.sermon import get_sermons


def sermon_search_test(search_line: str, expected_locations: [[int | str]]):
    result = sermon_search(search_line, "0")

    for i, expected_location in enumerate(expected_locations):
        current_result = result[i]["location"][1:]
        assert current_result == expected_location


short_writes = [
    # full words input
    {
        'search_line': "этот человек лжепророк",
        'expected_locations': [
            ["Распознай cвой день и его послание", "VGR", '189', 280],
            ["Распознай cвой день и его послание", "MS", '189', 280],
        ]
    },
]


def get_id_by_name_and_translation(sermons: [dict], name: str, translation: str):
    return list(
        filter(
            lambda d:
            d.get('name') == name and
            d.get('translation') == translation,
            sermons
        )
    )[0]


def test_answer():
    sermons = get_sermons('0')

    for short_write in short_writes:
        expected_locations = short_write["expected_locations"]
        for i, expected_location in enumerate(expected_locations):
            expected_locations[i] = [
                get_id_by_name_and_translation(sermons, expected_location[0], expected_location[1])["id"],
                expected_location[2],
                expected_location[3],
            ]
        sermon_search_test(short_write["search_line"], expected_locations)


if __name__ == '__main__':
    test_answer()
