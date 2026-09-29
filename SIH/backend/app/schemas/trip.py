from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TripCreate(BaseModel):
    origin: str
    destination: str
    origin_lat: Optional[float] = None
    origin_lng: Optional[float] = None
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None
    route_id: Optional[str] = None
    distance_km: Optional[float] = None
    duration_min: Optional[float] = None
    transport_mode: str = "car"
    preferences: List[str] = []
    recommended_route_id: Optional[str] = None
    selected_route_id: Optional[str] = None

class TripRecord(TripCreate):
    trip_id: str
    user_id: str
    timestamp: str
    completed: bool = False
    completed_at: Optional[str] = None
