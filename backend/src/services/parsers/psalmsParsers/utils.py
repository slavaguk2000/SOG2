import shutil

from src.services.database_helpers.psalm.psalm import get_psalms_dicts, get_psalms_book_by_id
import os

from src.utils.text_utils.regular_expressions_replacements import path_masking

IMAGE_DIRECTORY = "psalms_images/images_by_ids"
SONG_BOOKS_DIRECTORY = "psalms_images/songs_books"


for required_directory in [IMAGE_DIRECTORY, SONG_BOOKS_DIRECTORY]:
    if not os.path.isdir(required_directory):
        os.mkdir(required_directory)


def import_song_images(psalms_book_id: str):
    psalms_book = get_psalms_book_by_id(psalms_book_id)
    if not psalms_book:
        return False

    directory = os.path.join(SONG_BOOKS_DIRECTORY, path_masking(psalms_book.name))
    if not os.path.isdir(directory):
        return False

    files = os.listdir(directory)
    if not files:
        return False

    psalms = get_psalms_dicts(psalms_book_id)

    for psalm_item in psalms:
        psalm = psalm_item["psalm"]
        psalm_number = psalm['psalm_number']
        extension = "jpg"
        source_file_name = f"{psalm_number}.{extension}"
        destination_file_name = f"{psalm['id']}.{extension}"
        if source_file_name in files:
            shutil.copyfile(os.path.join(directory, source_file_name), os.path.join(IMAGE_DIRECTORY, destination_file_name))

    return True
