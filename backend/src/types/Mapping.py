class Mapping:
    def __init__(self, index: str, mappings: dict, **kwargs):
        self.index = index
        self.body = {
            "mappings": mappings,
            "settings": kwargs.get("settings")
        }
