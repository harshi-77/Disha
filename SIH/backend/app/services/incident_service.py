import math
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.database.firebase import get_db
from app.utils.errors import DishaError, FIRESTORE_ERROR
from app.utils.logging import get_logger

logger = get_logger(__name__)

INCIDENTS_COLLECTION = "incidents"


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


async def report_incident(incident_data: Dict[str, Any], reported_by: str) -> Dict[str, Any]:
    """Store a user-reported road incident in Firestore."""
    db = get_db()
    if not db:
        raise DishaError(FIRESTORE_ERROR, "Database not available", 503)
    try:
        incident_id = f"incident_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        record = {
            **incident_data,
            "incident_id": incident_id,
            "reported_by": reported_by,
            "reported_at": datetime.now(timezone.utc).isoformat(),
            "verified": False,
        }
        db.collection(INCIDENTS_COLLECTION).document(incident_id).set(record)
        return record
    except Exception as e:
        logger.error(f"report_incident error: {e}")
        raise DishaError(FIRESTORE_ERROR, "Could not save incident report", 500)


async def get_nearby_incidents(lat: float, lng: float, radius_km: float = 5.0) -> List[Dict[str, Any]]:
    """
    Return user-reported incidents within radius_km of (lat, lng).
    Firestore doesn't support native geo-radius queries here, so this pulls
    recent incidents and filters by haversine distance in-process. Fine for
    a moderate incident volume; swap for a geohash index if volume grows.
    """
    db = get_db()
    if not db:
        return []
    try:
        docs = (
            db.collection(INCIDENTS_COLLECTION)
            .order_by("reported_at", direction="DESCENDING")
            .limit(200)
            .stream()
        )
        nearby = []
        for d in docs:
            data = d.to_dict() or {}
            i_lat = data.get("lat")
            i_lng = data.get("lng")
            if i_lat is None or i_lng is None:
                continue
            dist = _haversine_km(lat, lng, i_lat, i_lng)
            if dist <= radius_km:
                data["distance_km"] = round(dist, 2)
                nearby.append(data)
        nearby.sort(key=lambda x: x.get("distance_km", 999))
        return nearby
    except Exception as e:
        logger.error(f"get_nearby_incidents error: {e}")
        return []
