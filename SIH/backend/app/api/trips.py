from fastapi import APIRouter, Depends, HTTPException, Path
from typing import Optional
from datetime import datetime, timezone
from app.auth.firebase_auth import get_current_user, CurrentUser
from app.schemas.trip import TripCreate, TripRecord
from app.database.firebase import get_db
from app.utils.errors import success_response, error_response, DishaError, FIRESTORE_ERROR
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/trips", tags=["Trip History"])


@router.post("")
async def create_trip(
    trip: TripCreate,
    user: CurrentUser = Depends(get_current_user),
):
    """Log a new trip. Called when a user starts navigation."""
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail=error_response(FIRESTORE_ERROR, "Database not available"))
    try:
        trip_id = f"trip_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        record = {
            **trip.model_dump(),
            "trip_id": trip_id,
            "user_id": user.uid,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "completed": False,
            "completed_at": None,
        }
        db.collection("users").document(user.uid).collection("trips").document(trip_id).set(record)
        return success_response(record)
    except Exception as e:
        logger.error(f"Create trip error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not save trip"))


@router.get("/history")
async def trip_history(user: CurrentUser = Depends(get_current_user)):
    """Get the user's trip history, newest first."""
    db = get_db()
    if not db:
        return success_response({"trips": [], "message": "Database not available"})
    try:
        docs = db.collection("users").document(user.uid).collection("trips")\
            .order_by("timestamp", direction="DESCENDING").limit(50).stream()
        trips = [d.to_dict() for d in docs]
        return success_response({"trips": trips, "count": len(trips)})
    except Exception as e:
        logger.error(f"Trip history error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not load trip history"))


@router.get("/frequent")
async def frequent_trips(user: CurrentUser = Depends(get_current_user)):
    """Get frequently used routes derived from trip history."""
    db = get_db()
    if not db:
        return success_response({"frequent": []})
    try:
        docs = db.collection("users").document(user.uid).collection("trips").limit(100).stream()
        trips = [d.to_dict() for d in docs]
        # Count destination frequency
        from collections import Counter
        destinations = [t.get("destination", "") for t in trips if t.get("destination")]
        top = Counter(destinations).most_common(5)
        frequent = [{"destination": d, "count": c} for d, c in top]
        return success_response({"frequent": frequent})
    except Exception as e:
        logger.error(f"Frequent trips error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not load frequent trips"))


@router.post("/{trip_id}/complete")
async def complete_trip(
    trip_id: str = Path(...),
    user: CurrentUser = Depends(get_current_user),
):
    """Mark a trip as completed."""
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail=error_response(FIRESTORE_ERROR, "Database not available"))
    try:
        ref = db.collection("users").document(user.uid).collection("trips").document(trip_id)
        ref.update({"completed": True, "completed_at": datetime.now(timezone.utc).isoformat()})
        return success_response({"trip_id": trip_id, "completed": True})
    except Exception as e:
        logger.error(f"Complete trip error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not update trip"))
