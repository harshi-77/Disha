from typing import List, Optional, Dict, Any
from app.services.routing_service import compute_routes
from app.scoring.route_scorer import score_routes
from app.schemas.route import RouteAlternative, RouteRecommendResponse, RouteRequest
from app.schemas.preference import UserPreferences
from app.utils.logging import get_logger
from app.utils.errors import DishaError

logger = get_logger(__name__)

DEFAULT_PREFERENCES = UserPreferences()

async def recommend_routes(
    request: RouteRequest,
    preferences: Optional[UserPreferences] = None,
    recent_trips: Optional[List[Dict[str, Any]]] = None,
    incidents: Optional[List[Dict[str, Any]]] = None,
) -> RouteRecommendResponse:
    prefs = preferences or DEFAULT_PREFERENCES

    # Merge request-level preferences into weights
    if request.avoid_tolls:
        prefs.avoid_tolls = True

    routes = await compute_routes(
        origin_lat=request.origin_lat,
        origin_lng=request.origin_lng,
        destination_lat=request.destination_lat,
        destination_lng=request.destination_lng,
        transport_mode=request.transport_mode.value,
        avoid_tolls=request.avoid_tolls,
        avoid_highways=request.avoid_highways,
        compute_alternatives=True,
    )

    scored = score_routes(routes, prefs, incidents)
    recommended = scored[0]
    alternatives = scored[1:]

    return RouteRecommendResponse(
        recommended_route=recommended,
        alternatives=alternatives,
        data_source="google_routes",
        is_mock=False,
    )
