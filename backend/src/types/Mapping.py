class Mapping:
    def __init__(self, index: str, mappings: dict):
        self.index = index
        self.body = {
            'mappings': mappings
        }
