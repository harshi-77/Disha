from pydantic import BaseModel, field_validator
from typing import List, Optional

class UserPreferences(BaseModel):
    preferred_mode: str = "car"
    time_weight: float = 0.40
    safety_weight: float = 0.25
    cost_weight: float = 0.15
    traffic_weight: float = 0.10
    eco_weight: float = 0.10
    road_quality_weight: float = 0.00
    avoid_tolls: bool = False
    avoid_highways: bool = False
    max_extra_time: int = 10
    accessibility_requirements: List[str] = []

    @field_validator('time_weight', 'safety_weight', 'cost_weight', 'traffic_weight', 'eco_weight', 'road_quality_weight')
    @classmethod
    def weight_range(cls, v):
        if not 0.0 <= v <= 1.0:
            raise ValueError('Weight must be between 0.0 and 1.0')
        return v
