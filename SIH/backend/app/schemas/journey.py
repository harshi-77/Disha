from pydantic import BaseModel
from typing import Optional

class JourneyCreate(BaseModel):
    label: str  # e.g. Home, Work, Airport
    origin: str
    destination: str
    origin_lat: Optional[float] = None
    origin_lng: Optional[float] = None
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None
    transport_mode: str = "car"
    emoji: Optional[str] = "🏠"

class JourneyRecord(JourneyCreate):
    journey_id: str
    user_id: str
    created_at: str
