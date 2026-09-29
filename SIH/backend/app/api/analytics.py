from fastapi import APIRouter, Depends, HTTPException
from app.auth.firebase_auth import get_current_user, CurrentUser
from app.services.analytics_service import get_mobility_analytics
from app.utils.errors import success_response, error_response
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/analytics", tags=["Mobility Analytics"])


@router.get("/mobility")
async def mobility_analytics(user: CurrentUser = Depends(get_current_user)):
    """
    Get the user's personal mobility analytics computed from actual trip history.
    Returns an empty state message if no trips have been recorded yet.
    """
    try:
        analytics = await get_mobility_analytics(user.uid)
        return success_response(analytics.model_dump())
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        raise HTTPException(status_code=500, detail=error_response("FIRESTORE_ERROR", "Could not compute analytics"))
