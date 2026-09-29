from pydantic import BaseModel
from typing import Optional, Dict, Any

class AIRequest(BaseModel):
    message: str
    user_context: Optional[Dict[str, Any]] = None

class AIIntent(BaseModel):
    intent: str
    destination: Optional[str] = None
    origin: Optional[str] = None
    avoid_tolls: Optional[bool] = None
    transport_mode: Optional[str] = None
    preferences: Optional[list] = None

class AIResponse(BaseModel):
    reply: str
    intent: Optional[AIIntent] = None
    suggested_action: Optional[str] = None  # e.g. 'open_route_planner'
    route_recommendation: Optional[Dict[str, Any]] = None
