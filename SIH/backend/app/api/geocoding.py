from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.auth.firebase_auth import get_optional_user, CurrentUser
from app.services.geocoding_service import geocode_address, reverse_geocode
from app.utils.errors import success_response, error_response, DishaError
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/geocoding", tags=["Geocoding"])


@router.get("/search")
async def geocode(
    address: str = Query(..., description="Address to geocode"),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Convert an address to geographic coordinates."""
    try:
        result = await geocode_address(address)
        if not result:
            raise HTTPException(status_code=404, detail=error_response("NOT_FOUND", "Address not found"))
        return success_response(result)
    except HTTPException:
        raise
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"Geocoding error: {e}")
        raise HTTPException(status_code=500, detail=error_response("GEOCODING_ERROR", "Geocoding failed"))


@router.get("/reverse")
async def reverse(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Convert coordinates to a human-readable address."""
    try:
        address = await reverse_geocode(lat, lng)
        if not address:
            raise HTTPException(status_code=404, detail=error_response("NOT_FOUND", "Address not found for coordinates"))
        return success_response({"formatted_address": address, "lat": lat, "lng": lng})
    except HTTPException:
        raise
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"Reverse geocoding error: {e}")
        raise HTTPException(status_code=500, detail=error_response("GEOCODING_ERROR", "Reverse geocoding failed"))
