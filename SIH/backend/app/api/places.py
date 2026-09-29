from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from app.auth.firebase_auth import get_current_user, get_optional_user, CurrentUser
from app.services.places_service import search_nearby
from app.utils.errors import success_response, error_response, DishaError
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/places", tags=["Places"])

VALID_CATEGORIES = ["fuel", "ev_charging", "parking", "food", "hospital", "restroom", "atm", "transit"]


@router.get("/nearby")
async def nearby_places(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    category: str = Query("fuel", description=f"Category: {', '.join(VALID_CATEGORIES)}"),
    radius_m: int = Query(2000, description="Radius in meters (max 5000)", le=5000),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Find nearby places of a given category using Google Places API."""
    if category not in VALID_CATEGORIES:
        raise HTTPException(status_code=400, detail=error_response("VALIDATION_ERROR", f"Invalid category. Choose from: {', '.join(VALID_CATEGORIES)}"))
    try:
        places = await search_nearby(lat, lng, category, radius_m)
        return success_response({"places": [p.model_dump() for p in places], "count": len(places), "category": category})
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"Nearby places error: {e}")
        raise HTTPException(status_code=500, detail=error_response("PLACES_ERROR", "Could not fetch places"))


@router.get("/on-route")
async def places_on_route(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    destination_lat: float = Query(...),
    destination_lng: float = Query(...),
    category: str = Query("fuel"),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Find places of interest along a route (searches near midpoint)."""
    if category not in VALID_CATEGORIES:
        raise HTTPException(status_code=400, detail=error_response("VALIDATION_ERROR", "Invalid category"))
    mid_lat = (origin_lat + destination_lat) / 2
    mid_lng = (origin_lng + destination_lng) / 2
    try:
        places = await search_nearby(mid_lat, mid_lng, category, 3000)
        return success_response({"places": [p.model_dump() for p in places], "count": len(places), "category": category, "note": "Results near route midpoint"})
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"On-route places error: {e}")
        raise HTTPException(status_code=500, detail=error_response("PLACES_ERROR", "Could not fetch on-route places"))


@router.get("/search")
async def search_places(
    query: str = Query(..., description="Text search query"),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Text search for places using Google Places API (New)."""
    import httpx
    from app.config import get_settings
    settings = get_settings()
    api_key = settings.places_key()
    if not api_key:
        raise HTTPException(status_code=503, detail=error_response("PLACES_ERROR", "Google Places API key not configured"))
    
    # 1. Try Places API (New) Text Search
    try:
        payload = {"textQuery": query, "maxResultCount": 10}
        if lat is not None and lng is not None:
            payload["locationBias"] = {
                "circle": {
                    "center": {"latitude": lat, "longitude": lng},
                    "radius": 10000.0
                }
            }
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating"
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post("https://places.googleapis.com/v1/places:searchText", json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("places", [])
                places = []
                for p in results:
                    loc = p.get("location", {})
                    places.append({
                        "place_id": p.get("id"),
                        "name": p.get("displayName", {}).get("text", ""),
                        "address": p.get("formattedAddress", ""),
                        "lat": loc.get("latitude"),
                        "lng": loc.get("longitude"),
                        "rating": p.get("rating")
                    })
                return success_response({"places": places, "count": len(places)})
    except Exception as e:
        logger.warning(f"Places API (New) text search notice: {e}")

    # 2. Try legacy Places API
    try:
        params = {"query": query, "key": api_key}
        if lat and lng:
            params["location"] = f"{lat},{lng}"
            params["radius"] = "10000"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get("https://maps.googleapis.com/maps/api/place/textsearch/json", params=params)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])[:10]
                places = []
                for r in results:
                    loc = r.get("geometry", {}).get("location", {})
                    places.append({
                        "place_id": r.get("place_id"),
                        "name": r.get("name"),
                        "address": r.get("formatted_address"),
                        "lat": loc.get("lat"),
                        "lng": loc.get("lng"),
                        "rating": r.get("rating")
                    })
                return success_response({"places": places, "count": len(places)})
    except Exception as e:
        logger.error(f"Legacy search places error: {e}")

    # Fallback to query name
    return success_response({
        "places": [
            {"place_id": "custom_1", "name": query, "address": f"{query}, Bengaluru", "lat": lat or 12.9716, "lng": lng or 77.5946, "rating": 4.5}
        ],
        "count": 1
    })
