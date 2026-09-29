from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.auth.firebase_auth import get_current_user, get_optional_user, CurrentUser
from app.schemas.route import RouteRequest, RouteRecommendResponse
from app.services.recommendation_service import recommend_routes
from app.services.personalization_service import get_user_preferences, get_recent_trips
from app.services.incident_service import get_nearby_incidents
from app.utils.errors import success_response, error_response, DishaError
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/routes", tags=["Routes"])


@router.post("/plan")
async def plan_route(
    request: RouteRequest,
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Plan a route using Google Routes API. Returns route options without personalized scoring."""
    try:
        from app.services.routing_service import compute_routes
        routes = await compute_routes(
            origin_lat=request.origin_lat,
            origin_lng=request.origin_lng,
            destination_lat=request.destination_lat,
            destination_lng=request.destination_lng,
            transport_mode=request.transport_mode.value,
            avoid_tolls=request.avoid_tolls,
            avoid_highways=request.avoid_highways,
        )
        return success_response({"routes": [r.model_dump() for r in routes]})
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"Plan route error: {e}")
        raise HTTPException(status_code=500, detail=error_response("ROUTE_PROVIDER_ERROR", "Unexpected error planning route"))


@router.post("/recommend")
async def recommend_route(
    request: RouteRequest,
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """
    AI-personalized route recommendation using DISHA scoring engine.
    Loads user preferences and trip history if authenticated.
    """
    try:
        preferences = None
        recent_trips = []
        incidents = []

        if user:
            preferences = await get_user_preferences(user.uid)
            recent_trips = await get_recent_trips(user.uid)
            incidents = await get_nearby_incidents(request.origin_lat, request.origin_lng)

        result = await recommend_routes(
            request=request,
            preferences=preferences,
            recent_trips=recent_trips,
            incidents=incidents,
        )
        return success_response(result.model_dump())
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"Recommend route error: {e}")
        raise HTTPException(status_code=500, detail=error_response("ROUTE_PROVIDER_ERROR", "Unexpected error recommending route"))
