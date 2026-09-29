from pydantic import BaseModel, field_validator
from typing import List, Optional, Dict, Any
from enum import Enum

class TransportMode(str, Enum):
    car = "car"
    bike = "bike"
    transit = "transit"
    walking = "walking"
    cycling = "cycling"

class JourneyPreference(str, Enum):
    fastest = "fastest"
    safest = "safest"
    cheapest = "cheapest"
    eco = "eco"
    less_traffic = "less-traffic"
    better_roads = "better-roads"

class RouteRequest(BaseModel):
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    transport_mode: TransportMode = TransportMode.car
    avoid_tolls: bool = False
    avoid_highways: bool = False
    preferences: List[str] = []

class RouteSegment(BaseModel):
    name: str
    status: str
    speed_kmph: Optional[float] = None
    distance_km: float

class RouteAlternative(BaseModel):
    route_id: str
    name: str
    duration_min: float
    duration_in_traffic_min: Optional[float] = None
    distance_km: float
    has_tolls: bool
    estimated_fuel_cost_inr: Optional[float] = None
    estimated_co2_kg: Optional[float] = None
    polyline: Optional[str] = None  # encoded polyline
    legs: List[Dict[str, Any]] = []
    summary: str
    congestion_level: str = "unknown"
    score: Optional[float] = None
    is_recommended: bool = False
    recommendation_reasons: List[str] = []

class RouteRecommendResponse(BaseModel):
    recommended_route: RouteAlternative
    alternatives: List[RouteAlternative]
    data_source: str = "google_routes"
    is_mock: bool = False
