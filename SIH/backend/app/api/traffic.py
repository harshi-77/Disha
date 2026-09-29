from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.auth.firebase_auth import get_optional_user, CurrentUser
from app.services.traffic_service import get_traffic_prediction, get_live_traffic
from app.utils.errors import success_response, error_response
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/traffic", tags=["Traffic"])


@router.get("/live")
async def live_traffic(user: Optional[CurrentUser] = Depends(get_optional_user)):
    """
    Get live traffic data.
    Note: Returns availability status — real-time corridor feed requires a live traffic API subscription.
    """
    data = await get_live_traffic()
    return success_response(data)


@router.get("/prediction")
async def traffic_prediction(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """
    Get a baseline traffic prediction based on time-of-day and day-of-week patterns.
    Note: This is a rule-based baseline estimator, not an ML prediction model.
    """
    data = get_traffic_prediction(lat, lng)
    return success_response(data)


@router.get("/route")
async def route_traffic(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    destination_lat: float = Query(...),
    destination_lng: float = Query(...),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """
    Get traffic conditions for a specific route.
    Traffic-aware duration is included in /api/routes/plan and /api/routes/recommend.
    This endpoint returns the prediction baseline for the origin area.
    """
    data = get_traffic_prediction(origin_lat, origin_lng)
    return success_response({
        **data,
        "note": "For accurate traffic-aware route duration, use POST /api/routes/recommend which uses Google Routes API traffic data."
    })
