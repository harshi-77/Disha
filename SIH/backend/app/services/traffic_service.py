from datetime import datetime
from typing import Dict, Any
from app.config import get_settings
from app.utils.logging import get_logger

logger = get_logger(__name__)

# Weekday rush-hour windows (24h local time), based on generally known
# Bengaluru commute patterns. This is a rule-based baseline only — it is
# NOT a trained ML model and NOT live sensor telemetry.
MORNING_PEAK = (8, 11)
EVENING_PEAK = (17, 21)


async def get_live_traffic() -> Dict[str, Any]:
    """
    Live corridor-level traffic (vehicle counts, sensor feeds, etc.) requires
    a dedicated live-traffic data subscription that is not configured for
    this deployment. Rather than fabricate numbers, this honestly reports
    unavailability so the UI can show that state instead of fake data.

    Per-route traffic-aware duration IS available and comes from Google
    Routes API — see POST /api/routes/recommend and /api/routes/plan.
    """
    settings = get_settings()
    return {
        "available": False,
        "message": "Live corridor traffic data unavailable. No live traffic sensor feed is configured.",
        "traffic_aware_routing_available": bool(settings.google_maps_api_key),
        "note": "Traffic-aware route duration is available via /api/routes/recommend and /api/routes/plan, which use Google Routes API's live traffic-aware ETA.",
    }


def get_traffic_prediction(lat: float, lng: float) -> Dict[str, Any]:
    """
    Rule-based baseline traffic-level estimate from time-of-day and
    day-of-week only. Explicitly labeled as a baseline, not an ML model,
    since no trained prediction model exists yet.
    """
    now = datetime.now()
    hour = now.hour
    is_weekend = now.weekday() >= 5

    if is_weekend:
        level = "low" if hour < 10 or hour > 22 else "moderate"
    elif MORNING_PEAK[0] <= hour < MORNING_PEAK[1] or EVENING_PEAK[0] <= hour < EVENING_PEAK[1]:
        level = "high"
    elif 11 <= hour < 17:
        level = "moderate"
    else:
        level = "low"

    return {
        "lat": lat,
        "lng": lng,
        "predicted_congestion_level": level,
        "basis": "time_of_day_and_day_of_week_baseline",
        "is_ml_model": False,
        "note": "This is a rule-based baseline estimate, not a trained ML traffic prediction model. It does not use live sensor data.",
        "generated_at": now.isoformat(),
    }
