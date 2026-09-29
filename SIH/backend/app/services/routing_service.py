import httpx
import json
from typing import List, Optional, Dict, Any
from app.config import get_settings
from app.utils.logging import get_logger
from app.utils.errors import DishaError, ROUTE_PROVIDER_ERROR
from app.schemas.route import RouteAlternative, TransportMode

logger = get_logger(__name__)
ROUTES_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"

TRAVEL_MODE_MAP = {
    "car": "DRIVE",
    "bike": "TWO_WHEELER",
    "transit": "TRANSIT",
    "walking": "WALK",
    "cycling": "BICYCLE",
}

def _fuel_cost(distance_km: float, mode: str) -> Optional[float]:
    """Rough fuel cost estimate (INR) - only for motor modes."""
    if mode in ("car", "bike"):
        liters_per_km = 0.07 if mode == "car" else 0.04
        price_per_liter = 105.0
        return round(distance_km * liters_per_km * price_per_liter, 1)
    return None

def _co2(distance_km: float, mode: str) -> Optional[float]:
    """Rough CO2 estimate (kg) - only for motor modes."""
    factors = {"car": 0.171, "bike": 0.094}
    factor = factors.get(mode)
    return round(distance_km * factor, 2) if factor else None

def _parse_route(route: Dict[str, Any], index: int, mode: str, is_mock: bool = False) -> RouteAlternative:
    duration_sec = int(route.get("duration", "0s").rstrip("s"))
    static_duration_sec = int(route.get("staticDuration", route.get("duration", "0s")).rstrip("s"))
    distance_m = route.get("distanceMeters", 0)
    distance_km = round(distance_m / 1000, 2)
    duration_min = round(duration_sec / 60, 1)
    static_duration_min = round(static_duration_sec / 60, 1)
    has_tolls = bool(route.get("travelAdvisory", {}).get("tollInfo"))
    polyline = route.get("polyline", {}).get("encodedPolyline", "")
    legs = route.get("legs", [])
    description = route.get("description", f"Route {index + 1}")

    # Traffic congestion approximation
    traffic_ratio = duration_sec / max(static_duration_sec, 1)
    if traffic_ratio < 1.1:
        congestion = "low"
    elif traffic_ratio < 1.4:
        congestion = "moderate"
    else:
        congestion = "high"

    names = ["FASTEST ROUTE", "BALANCED ROUTE", "LOW TRAFFIC ROUTE"]
    route_ids = ["fastest", "balanced", "low-traffic"]

    return RouteAlternative(
        route_id=route_ids[index] if index < len(route_ids) else f"route_{index}",
        name=names[index] if index < len(names) else f"Route {index + 1}",
        duration_min=duration_min,
        duration_in_traffic_min=duration_min,
        distance_km=distance_km,
        has_tolls=has_tolls,
        estimated_fuel_cost_inr=_fuel_cost(distance_km, mode),
        estimated_co2_kg=_co2(distance_km, mode),
        polyline=polyline,
        legs=legs,
        summary=description or f"Via {description}",
        congestion_level=congestion,
    )

async def compute_routes(
    origin_lat: float, origin_lng: float,
    destination_lat: float, destination_lng: float,
    transport_mode: str = "car",
    avoid_tolls: bool = False,
    avoid_highways: bool = False,
    compute_alternatives: bool = True,
) -> List[RouteAlternative]:
    settings = get_settings()
    routes_api_key = settings.routes_key()
    if not routes_api_key:
        raise DishaError(ROUTE_PROVIDER_ERROR, "Google Routes API key not configured", 503)

    travel_mode = TRAVEL_MODE_MAP.get(transport_mode, "DRIVE")
    avoid = []
    if avoid_tolls:
        avoid.append("TOLLS")
    if avoid_highways:
        avoid.append("HIGHWAYS")

    payload = {
        "origin": {"location": {"latLng": {"latitude": origin_lat, "longitude": origin_lng}}},
        "destination": {"location": {"latLng": {"latitude": destination_lat, "longitude": destination_lng}}},
        "travelMode": travel_mode,
        "computeAlternativeRoutes": compute_alternatives,
        "routingPreference": "TRAFFIC_AWARE" if transport_mode in ("car", "bike") else "ROUTING_PREFERENCE_UNSPECIFIED",
        "polylineEncoding": "ENCODED_POLYLINE",
    }
    if avoid:
        payload["routeModifiers"] = {"avoidTolls": avoid_tolls, "avoidHighways": avoid_highways}

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": routes_api_key,
        "X-Goog-FieldMask": "routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline,routes.legs,routes.travelAdvisory,routes.description",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(ROUTES_API_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"Routes API HTTP error: {e.response.status_code} - {e.response.text}")
        raise DishaError(ROUTE_PROVIDER_ERROR, f"Routes API error: {e.response.status_code}", 502)
    except Exception as e:
        logger.error(f"Routes API error: {e}")
        raise DishaError(ROUTE_PROVIDER_ERROR, "Failed to reach routing service", 502)

    routes = data.get("routes", [])
    if not routes:
        raise DishaError(ROUTE_PROVIDER_ERROR, "No routes found for the given origin/destination", 404)

    return [_parse_route(r, i, transport_mode) for i, r in enumerate(routes[:3])]
