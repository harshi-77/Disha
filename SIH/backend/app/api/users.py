from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.auth.firebase_auth import get_current_user, CurrentUser
from app.schemas.preference import UserPreferences
from app.services.personalization_service import get_user_preferences, save_user_preferences
from app.utils.errors import success_response, error_response, DishaError
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/users", tags=["Users & Preferences"])


@router.get("/preferences")
async def get_preferences(user: CurrentUser = Depends(get_current_user)):
    """Get the authenticated user's journey preferences."""
    try:
        prefs = await get_user_preferences(user.uid)
        return success_response(prefs.model_dump())
    except Exception as e:
        logger.error(f"Get preferences error: {e}")
        raise HTTPException(status_code=500, detail=error_response("FIRESTORE_ERROR", "Could not load preferences"))


@router.put("/preferences")
async def update_preferences(
    prefs: UserPreferences,
    user: CurrentUser = Depends(get_current_user),
):
    """Update the authenticated user's journey preferences."""
    try:
        success = await save_user_preferences(user.uid, prefs)
        if not success:
            raise HTTPException(status_code=503, detail=error_response("FIRESTORE_ERROR", "Database unavailable"))
        return success_response(prefs.model_dump())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update preferences error: {e}")
        raise HTTPException(status_code=500, detail=error_response("FIRESTORE_ERROR", "Could not save preferences"))


@router.get("/me")
async def get_current_user_info(user: CurrentUser = Depends(get_current_user)):
    """Get basic info about the currently authenticated user."""
    return success_response({
        "uid": user.uid,
        "email": user.email,
        "display_name": user.display_name,
    })
