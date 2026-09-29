from pydantic import BaseModel
from typing import Optional

class MobilityAnalytics(BaseModel):
    total_trips: int = 0
    total_distance_km: float = 0.0
    average_duration_min: float = 0.0
    most_common_mode: Optional[str] = None
    most_frequent_destination: Optional[str] = None
    data_available: bool = False
    message: Optional[str] = None
