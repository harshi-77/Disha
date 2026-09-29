from pydantic import BaseModel
from typing import Optional
from enum import Enum

class IncidentType(str, Enum):
    accident = "accident"
    pothole = "pothole"
    waterlogging = "waterlogging"
    construction = "construction"
    road_closure = "road_closure"
    signal_issue = "signal_issue"
    other = "other"

class IncidentSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class IncidentReport(BaseModel):
    type: IncidentType
    location: str = "Bengaluru Corridor"
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    severity: IncidentSeverity = IncidentSeverity.medium
    has_photo: bool = False
    image_url: Optional[str] = None

class IncidentRecord(IncidentReport):
    incident_id: str
    reported_by: str
    reported_at: str
    verified: bool = False
