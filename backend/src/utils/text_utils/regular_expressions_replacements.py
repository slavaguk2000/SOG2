import re


def path_masking(input_path: str):
    return re.sub(r"[./\\]", "", input_path)
