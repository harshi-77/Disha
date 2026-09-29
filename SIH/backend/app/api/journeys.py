from fastapi import APIRouter, Depends, HTTPException, Path
from datetime import datetime, timezone
from app.auth.firebase_auth import get_current_user, CurrentUser
from app.schemas.journey import JourneyCreate, JourneyRecord
from app.database.firebase import get_db
from app.utils.errors import success_response, error_response, FIRESTORE_ERROR
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/journeys", tags=["Saved Journeys"])


@router.get("")
async def list_journeys(user: CurrentUser = Depends(get_current_user)):
    """List all saved frequent journeys for the user (Home, Work, etc.)."""
    db = get_db()
    if not db:
        return success_response({"journeys": []})
    try:
        docs = db.collection("users").document(user.uid).collection("frequentJourneys").stream()
        journeys = [d.to_dict() for d in docs]
        return success_response({"journeys": journeys, "count": len(journeys)})
    except Exception as e:
        logger.error(f"List journeys error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not load journeys"))


@router.post("")
async def create_journey(
    journey: JourneyCreate,
    user: CurrentUser = Depends(get_current_user),
):
    """Save a new frequent journey."""
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail=error_response(FIRESTORE_ERROR, "Database not available"))
    try:
        journey_id = f"journey_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        record = {
            **journey.model_dump(),
            "journey_id": journey_id,
            "user_id": user.uid,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        db.collection("users").document(user.uid).collection("frequentJourneys").document(journey_id).set(record)
        return success_response(record)
    except Exception as e:
        logger.error(f"Create journey error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not save journey"))


@router.put("/{journey_id}")
async def update_journey(
    journey: JourneyCreate,
    journey_id: str = Path(...),
    user: CurrentUser = Depends(get_current_user),
):
    """Update an existing saved journey."""
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail=error_response(FIRESTORE_ERROR, "Database not available"))
    try:
        db.collection("users").document(user.uid).collection("frequentJourneys").document(journey_id).update(journey.model_dump())
        return success_response({"journey_id": journey_id, **journey.model_dump()})
    except Exception as e:
        logger.error(f"Update journey error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not update journey"))


@router.delete("/{journey_id}")
async def delete_journey(
    journey_id: str = Path(...),
    user: CurrentUser = Depends(get_current_user),
):
    """Delete a saved journey."""
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail=error_response(FIRESTORE_ERROR, "Database not available"))
    try:
        db.collection("users").document(user.uid).collection("frequentJourneys").document(journey_id).delete()
        return success_response({"journey_id": journey_id, "deleted": True})
    except Exception as e:
        logger.error(f"Delete journey error: {e}")
        raise HTTPException(status_code=500, detail=error_response(FIRESTORE_ERROR, "Could not delete journey"))
