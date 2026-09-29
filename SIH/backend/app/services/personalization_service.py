from typing import List, Dict, Any
from datetime import datetime, timezone
from app.database.firebase import get_db
from app.schemas.preference import UserPreferences
from app.utils.logging import get_logger

logger = get_logger(__name__)

PREFERENCES_DOC = "main"


async def get_user_preferences(uid: str) -> UserPreferences:
    """
    Load a user's journey preferences from Firestore.
    Returns library defaults if the user has never set preferences,
    or if Firestore is unavailable.
    """
    db = get_db()
    if not db:
        logger.warning("Firestore unavailable — returning default preferences")
        return UserPreferences()
    try:
        ref = (
            db.collection("users")
            .document(uid)
            .collection("preferences")
            .document(PREFERENCES_DOC)
        )
        snap = ref.get()
        if snap.exists:
            data = snap.to_dict() or {}
            return UserPreferences(**data)
        return UserPreferences()
    except Exception as e:
        logger.error(f"get_user_preferences error for {uid}: {e}")
        return UserPreferences()


async def save_user_preferences(uid: str, preferences: UserPreferences) -> bool:
    """Persist a user's journey preferences to Firestore."""
    db = get_db()
    if not db:
        logger.warning("Firestore unavailable — cannot save preferences")
        return False
    try:
        ref = (
            db.collection("users")
            .document(uid)
            .collection("preferences")
            .document(PREFERENCES_DOC)
        )
        payload = preferences.model_dump()
        payload["updated_at"] = datetime.now(timezone.utc).isoformat()
        ref.set(payload, merge=True)
        return True
    except Exception as e:
        logger.error(f"save_user_preferences error for {uid}: {e}")
        return False


async def get_recent_trips(uid: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Load a user's most recent completed/started trips, used as light-weight
    personalization context for the recommendation engine (e.g. frequently
    chosen route types, common destinations). Returns an empty list if
    Firestore is unavailable or the user has no trip history yet.
    """
    db = get_db()
    if not db:
        return []
    try:
        docs = (
            db.collection("users")
            .document(uid)
            .collection("trips")
            .order_by("timestamp", direction="DESCENDING")
            .limit(limit)
            .stream()
        )
        return [d.to_dict() for d in docs]
    except Exception as e:
        logger.error(f"get_recent_trips error for {uid}: {e}")
        return []
