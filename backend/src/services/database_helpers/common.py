from sqlalchemy import asc, desc, text

from src.types.commonTypes import SortingDirection


def get_direction_function_by_direction(direction: SortingDirection, key: str):
    text_key = text(key)
    if direction == SortingDirection.DESC:
        return desc(text_key)
    return asc(text_key)
