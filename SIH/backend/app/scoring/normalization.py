from typing import List

def normalize(value: float, values: List[float]) -> float:
    """Min-max normalize a value within a list. Higher is better when inverted."""
    if len(values) <= 1:
        return 1.0
    min_v = min(values)
    max_v = max(values)
    if max_v == min_v:
        return 1.0
    return (value - min_v) / (max_v - min_v)

def normalize_inverse(value: float, values: List[float]) -> float:
    """Lower value = higher normalized score (e.g., duration, cost)."""
    return 1.0 - normalize(value, values)
