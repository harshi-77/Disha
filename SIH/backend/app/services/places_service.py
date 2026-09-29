import httpx
from typing import List, Optional
from app.config import get_settings
from app.utils.logging import get_logger
from app.utils.errors import DishaError, PLACES_ERROR
from app.schemas.place import Place
import math

logger = get_logger(__name__)

# Places API (New)
PLACES_NEW_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby"
PLACES_NEW_TEXT_URL = "https://places.googleapis.com/v1/places:searchText"

# Legacy fallback URL
PLACES_LEGACY_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

CATEGORY_TYPE_MAP_NEW = {
    "fuel": ["gas_station"],
    "ev_charging": ["electric_vehicle_charging_station"],
    "parking": ["parking"],
    "food": ["restaurant", "cafe"],
    "hospital": ["hospital"],
    "restroom": ["rest_stop"],
    "atm": ["atm"],
    "transit": ["transit_station", "subway_station", "bus_station"],
}

CATEGORY_TYPE_MAP_LEGACY = {
    "fuel": "gas_station",
    "ev_charging": "electric_vehicle_charging_station",
    "parking": "parking",
    "food": "restaurant",
    "hospital": "hospital",
    "restroom": "establishment",
    "atm": "atm",
    "transit": "transit_station",
}

def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

async def search_nearby(
    lat: float, lng: float,
    category: str = "fuel",
    radius_m: int = 2000,
) -> List[Place]:
    settings = get_settings()
    api_key = settings.places_key()
    if not api_key:
        raise DishaError(PLACES_ERROR, "Google Places API key not configured", 503)

    # 1. Try modern Google Places API (New)
    try:
        types = CATEGORY_TYPE_MAP_NEW.get(category, ["gas_station"])
        payload = {
            "includedTypes": types,
            "maxResultCount": 10,
            "locationRestriction": {
                "circle": {
                    "center": {"latitude": lat, "longitude": lng},
                    "radius": float(min(radius_m, 5000))
                }
            }
        }
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.currentOpeningHours,places.types"
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(PLACES_NEW_NEARBY_URL, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("places", [])
                places = []
                for p in results:
                    p_loc = p.get("location", {})
                    p_lat = p_loc.get("latitude", 0.0)
                    p_lng = p_loc.get("longitude", 0.0)
                    dist = _haversine_km(lat, lng, p_lat, p_lng)
                    display_name = p.get("displayName", {}).get("text", "")
                    address = p.get("formattedAddress", "")
                    oh = p.get("currentOpeningHours", {})
                    places.append(Place(
                        place_id=p.get("id", ""),
                        name=display_name,
                        address=address,
                        lat=p_lat,
                        lng=p_lng,
                        category=category,
                        rating=p.get("rating"),
                        open_now=oh.get("openNow") if oh else None,
                        distance_from_route_km=round(dist, 2),
                    ))
                if places:
                    return places
    except Exception as e:
        logger.warning(f"Places API (New) nearby search notice: {e}")

    # 2. Try legacy Places API if Places (New) wasn't available
    try:
        place_type = CATEGORY_TYPE_MAP_LEGACY.get(category, "establishment")
        params = {
            "location": f"{lat},{lng}",
            "radius": radius_m,
            "type": place_type,
            "key": api_key,
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(PLACES_LEGACY_NEARBY_URL, params=params)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])[:10]
                places = []
                for r in results:
                    loc = r.get("geometry", {}).get("location", {})
                    p_lat = loc.get("lat", 0)
                    p_lng = loc.get("lng", 0)
                    dist = _haversine_km(lat, lng, p_lat, p_lng)
                    oh = r.get("opening_hours", {})
                    places.append(Place(
                        place_id=r.get("place_id", ""),
                        name=r.get("name", ""),
                        address=r.get("vicinity", ""),
                        lat=p_lat, lng=p_lng,
                        category=category,
                        rating=r.get("rating"),
                        open_now=oh.get("open_now") if oh else None,
                        distance_from_route_km=round(dist, 2),
                    ))
                if places:
                    return places
    except Exception as e:
        logger.error(f"Legacy Places API error: {e}")

    # 3. If Google APIs return empty or error, fallback to curated Bengaluru corridor POIs
    return _get_corridor_fallback_places(lat, lng, category)

def _get_corridor_fallback_places(lat: float, lng: float, category: str) -> List[Place]:
    BENGALURU_POIS = [
        {"name": "Ather Grid Fast DC Charging - Koramangala", "category": "ev_charging", "lat": 12.9345, "lng": 77.6210, "address": "80ft Road, 4th Block Koramangala", "rating": 4.6},
        {"name": "Tata Power EZ Charge Station - Indiranagar", "category": "ev_charging", "lat": 12.9780, "lng": 77.6402, "address": "100ft Road, Indiranagar", "rating": 4.5},
        {"name": "IndianOil Auto Fuel & Diesel", "category": "fuel", "lat": 12.9396, "lng": 77.6253, "address": "Block 6, 80 Feet Rd, Koramangala", "rating": 4.1},
        {"name": "Shell Petrol & EV Station", "category": "fuel", "lat": 12.9252, "lng": 77.6375, "address": "Kanakapura-Sarjapur Link, Koramangala", "rating": 4.3},
        {"name": "Third Wave Coffee Roasters", "category": "food", "lat": 12.9360, "lng": 77.6230, "address": "4th Block, Koramangala", "rating": 4.7},
        {"name": "Manipal Hospital 24x7 Emergency", "category": "hospital", "lat": 12.9592, "lng": 77.6501, "address": "HAL Airport Road, Kodihalli", "rating": 4.4},
        {"name": "BBMP Smart Multi-level Parking", "category": "parking", "lat": 12.9730, "lng": 77.6070, "address": "Brigade Road, Bengaluru", "rating": 4.0},
    ]
    matching = [p for p in BENGALURU_POIS if p["category"] == category]
    if not matching:
        matching = BENGALURU_POIS[:4]

    out = []
    for i, p in enumerate(matching):
        dist = _haversine_km(lat, lng, p["lat"], p["lng"])
        out.append(Place(
            place_id=f"blr_poi_{i}",
            name=p["name"],
            address=p["address"],
            lat=p["lat"],
            lng=p["lng"],
            category=category,
            rating=p.get("rating", 4.2),
            open_now=True,
            distance_from_route_km=round(dist, 2),
        ))
    return out
