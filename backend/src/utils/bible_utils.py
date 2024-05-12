import re


def get_root_book_name_rus(book_name: str):
    pattern = r"^(?:от|к|\d+)\s+"
    return re.sub(pattern, "", book_name, flags=re.IGNORECASE)

# TODO: Make test
# examples = [
#     "От Луки",
#     "К Коринфянам",
#     "3 Иоанна",
#     "От Иоанна",
#     "5 Моисея",
#     "К Ефесянам",
#     "1 Коринфянам"
# ]
#
# results = [remove_prefix(text) for text in examples]
# for original, result in zip(examples, results):
#     print(f"{original} -> {result}")
