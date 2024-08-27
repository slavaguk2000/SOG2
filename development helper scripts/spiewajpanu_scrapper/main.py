import json
import re


def split_string(string, n):
    length = len(string)
    part_size = length // n
    remainder = length % n

    parts = []
    start = 0

    for i in range(n):
        end = start + part_size + (1 if i < remainder else 0)
        parts.append(string[start:end])
        start = end

    return parts


def get_empty_couplet(order: int = 0):
    return {'content': [], 'styling': 0, 'marker': '', 'initial_order': order}


def get_couplets(song_lines: [dict]):
    couplets = [get_empty_couplet()]
    line = 0
    for song_line in song_lines:
        if song_line['text']:
            chords_array = re.sub(
                r"\s+",
                ' ',
                re.sub(
                    r"za 2 razem",
                    '',
                    re.sub(
                        r"[^A-Za-z\d#\s]",
                        '',
                        re.sub(
                            r'\(.+?\)',
                            '',
                            song_line['chords']
                        )
                    )
                )
            ).strip().split() or ['']
            chords_array_len = len(chords_array)
            text_array = split_string(song_line['text'], chords_array_len) \
                if chords_array_len > 1 else [song_line['text']]
            for i, text_content in enumerate(text_array):
                couplets[-1]['content'].append({
                    'text_content': text_content,
                    'chord': chords_array[i],
                    'line': line,
                })
            line += 1
        else:
            line = 0
            if len(couplets[-1]['content']):
                couplets.append(get_empty_couplet(len(couplets)))
    while len(couplets) and not len(couplets[-1]['content']):
        couplets.pop()

    return couplets


with open('myproject/myproject/output.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

    output_data = [{
        'psalm_number': f"00{i + 1}"[-3:],
        'name': psalm['song_title'],
        'default_tonality': psalm['selected_key'] and psalm['selected_key'].upper(),
        'couplets': get_couplets(psalm['song_lines'])
    } for i, psalm in enumerate(data)]

    with open('spiewajpanu.json', 'w', encoding='utf-8') as output_file:
        json.dump(output_data, output_file, ensure_ascii=False, indent=4)

