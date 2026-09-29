from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.auth.firebase_auth import get_current_user, get_optional_user, CurrentUser
from app.schemas.incident import IncidentReport
from app.services.incident_service import report_incident, get_nearby_incidents
from app.utils.errors import success_response, error_response, DishaError
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/incidents", tags=["Road Incidents"])


@router.get("/nearby")
async def nearby_incidents(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(5.0, description="Search radius in km"),
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """Get user-reported road incidents near a location."""
    try:
        incidents = await get_nearby_incidents(lat, lng, radius_km)
        return success_response({"incidents": incidents, "count": len(incidents)})
    except Exception as e:
        logger.error(f"Nearby incidents error: {e}")
        raise HTTPException(status_code=500, detail=error_response("FIRESTORE_ERROR", "Could not fetch incidents"))


@router.post("/report")
async def report_road_incident(
    incident: IncidentReport,
    user: CurrentUser = Depends(get_current_user),
):
    """Report a new road hazard or incident."""
    try:
        record = await report_incident(incident.model_dump(), reported_by=user.email or user.uid)
        return success_response(record)
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"Report incident error: {e}")
        raise HTTPException(status_code=500, detail=error_response("FIRESTORE_ERROR", "Could not save incident report"))
