from itertools import permutations
from typing import List, Dict, TypeVar, Generic

T = TypeVar("T")


def generate_combinations(variants: List[T], keys: List[str]) -> List[Dict[str, T]]:
    if len(variants) < len(keys):
        return [{key: variant} for key, variant in zip(keys, variants * len(keys))]

    permutations_list = list(permutations(variants, len(keys)))

    return [{key: perm[i] for i, key in enumerate(keys)} for perm in permutations_list]
