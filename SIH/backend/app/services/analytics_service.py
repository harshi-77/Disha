from collections import Counter
from typing import List, Dict, Any
from app.database.firebase import get_db
from app.schemas.analytics import MobilityAnalytics
from app.utils.logging import get_logger

logger = get_logger(__name__)

# Same rough factors used in routing_service, kept here for cost/emissions
# roll-ups so analytics stay consistent with per-route estimates.
FUEL_COST_PER_KM = {"car": 0.07 * 105.0, "bike": 0.04 * 105.0}
CO2_PER_KM = {"car": 0.171, "bike": 0.094}


async def get_mobility_analytics(uid: str) -> MobilityAnalytics:
    """
    Compute mobility analytics purely from the user's actual stored trip
    history. Returns an honest empty state if there is no data yet —
    never fabricated statistics.
    """
    db = get_db()
    if not db:
        return MobilityAnalytics(
            data_available=False,
            message="Database not available.",
        )

    try:
        docs = list(
            db.collection("users").document(uid).collection("trips").stream()
        )
    except Exception as e:
        logger.error(f"get_mobility_analytics error for {uid}: {e}")
        return MobilityAnalytics(
            data_available=False,
            message="Could not load trip history.",
        )

    trips: List[Dict[str, Any]] = [d.to_dict() for d in docs]

    if not trips:
        return MobilityAnalytics(
            data_available=False,
            message="No trips recorded yet. Analytics will appear after your first journey.",
        )

    total_trips = len(trips)
    distances = [t.get("distance_km") for t in trips if t.get("distance_km") is not None]
    durations = [t.get("duration_min") for t in trips if t.get("duration_min") is not None]
    modes = [t.get("transport_mode", "car") for t in trips]
    destinations = [t.get("destination") for t in trips if t.get("destination")]

    total_distance_km = round(sum(distances), 2) if distances else 0.0
    average_duration_min = round(sum(durations) / len(durations), 1) if durations else 0.0
    most_common_mode = Counter(modes).most_common(1)[0][0] if modes else None
    most_frequent_destination = (
        Counter(destinations).most_common(1)[0][0] if destinations else None
    )

    return MobilityAnalytics(
        total_trips=total_trips,
        total_distance_km=total_distance_km,
        average_duration_min=average_duration_min,
        most_common_mode=most_common_mode,
        most_frequent_destination=most_frequent_destination,
        data_available=True,
        message=None,
    )
