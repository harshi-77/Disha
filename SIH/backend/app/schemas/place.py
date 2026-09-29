from pydantic import BaseModel
from typing import Optional, List

class Place(BaseModel):
    place_id: str
    name: str
    address: str
    lat: float
    lng: float
    category: str
    rating: Optional[float] = None
    open_now: Optional[bool] = None  # Only when API provides it
    distance_from_route_km: Optional[float] = None
    detour_min: Optional[float] = None
