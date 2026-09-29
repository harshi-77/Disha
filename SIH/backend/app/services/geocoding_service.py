import httpx
from typing import Optional, Tuple
from app.config import get_settings
from app.utils.logging import get_logger
from app.utils.errors import DishaError, GEOCODING_ERROR

logger = get_logger(__name__)
GOOGLE_GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json"

# Known Bengaluru landmarks for ultra-fast, zero-failure fallback
BENGALURU_LANDMARKS = {
    "koramangala": {"lat": 12.9352, "lng": 77.6245, "formatted_address": "Koramangala, Bengaluru, Karnataka, India"},
    "indiranagar": {"lat": 12.9784, "lng": 77.6408, "formatted_address": "Indiranagar, Bengaluru, Karnataka, India"},
    "whitefield": {"lat": 12.9698, "lng": 77.7500, "formatted_address": "Whitefield, Bengaluru, Karnataka, India"},
    "hsr layout": {"lat": 12.9121, "lng": 77.6446, "formatted_address": "HSR Layout, Bengaluru, Karnataka, India"},
    "electronic city": {"lat": 12.8452, "lng": 77.6602, "formatted_address": "Electronic City, Bengaluru, Karnataka, India"},
    "mg road": {"lat": 12.9756, "lng": 77.6066, "formatted_address": "Mahatma Gandhi Rd, Bengaluru, Karnataka, India"},
    "bellandur": {"lat": 12.9260, "lng": 77.6762, "formatted_address": "Bellandur, Outer Ring Road, Bengaluru, Karnataka, India"},
    "hebbal": {"lat": 13.0358, "lng": 77.5970, "formatted_address": "Hebbal, Bengaluru, Karnataka, India"},
    "jayanagar": {"lat": 12.9308, "lng": 77.5838, "formatted_address": "Jayanagar, Bengaluru, Karnataka, India"},
    "airport": {"lat": 13.1986, "lng": 77.7066, "formatted_address": "Kempegowda International Airport Bengaluru (BLR)"},
    "kempegowda": {"lat": 13.1986, "lng": 77.7066, "formatted_address": "Kempegowda International Airport Bengaluru (BLR)"},
    "marathahalli": {"lat": 12.9591, "lng": 77.6974, "formatted_address": "Marathahalli, Bengaluru, Karnataka, India"},
    "btm layout": {"lat": 12.9166, "lng": 77.6101, "formatted_address": "BTM Layout, Bengaluru, Karnataka, India"},
    "sarjapur": {"lat": 12.8604, "lng": 77.7865, "formatted_address": "Sarjapur Road, Bengaluru, Karnataka, India"},
    "banashankari": {"lat": 12.9255, "lng": 77.5468, "formatted_address": "Banashankari, Bengaluru, Karnataka, India"},
    "malleswaram": {"lat": 13.0031, "lng": 77.5643, "formatted_address": "Malleswaram, Bengaluru, Karnataka, India"},
    "majestic": {"lat": 12.9767, "lng": 77.5713, "formatted_address": "Majestic Bus Station / KSR Railway Station, Bengaluru"},
    "cubbon park": {"lat": 12.9738, "lng": 77.5906, "formatted_address": "Cubbon Park, Bengaluru, Karnataka, India"},
}

async def geocode_address(address: str) -> Optional[dict]:
    if not address or not address.strip():
        return None
        
    query_clean = address.strip()
    settings = get_settings()

    # 1. Try standard Google Geocoding API
    api_key = settings.geocoding_key()
    if api_key:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(GOOGLE_GEOCODING_URL, params={"address": query_clean, "key": api_key})
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("status") == "OK" and data.get("results"):
                        result = data["results"][0]
                        loc = result["geometry"]["location"]
                        return {"lat": loc["lat"], "lng": loc["lng"], "formatted_address": result["formatted_address"]}
        except Exception as e:
            logger.warning(f"Google Geocoding API notice: {e}")

    # 2. Try Places API (New) Text Search with Places API key
    places_key = settings.places_key()
    if places_key:
        try:
            payload = {
                "textQuery": f"{query_clean}, Bengaluru",
                "maxResultCount": 1
            }
            headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": places_key,
                "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post("https://places.googleapis.com/v1/places:searchText", json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    places = data.get("places", [])
                    if places:
                        loc = places[0].get("location", {})
                        lat = loc.get("latitude")
                        lng = loc.get("longitude")
                        addr = places[0].get("formattedAddress") or places[0].get("displayName", {}).get("text", query_clean)
                        if lat is not None and lng is not None:
                            return {"lat": lat, "lng": lng, "formatted_address": addr}
        except Exception as e:
            logger.warning(f"Places New geocoding fallback notice: {e}")

    # 3. Check Bengaluru landmark directory
    lower_query = query_clean.lower()
    for landmark, info in BENGALURU_LANDMARKS.items():
        if landmark in lower_query or lower_query in landmark:
            return dict(info)

    # 4. Fallback default coordinates (Central Bengaluru)
    return {
        "lat": 12.9716,
        "lng": 77.5946,
        "formatted_address": f"{query_clean}, Bengaluru, Karnataka, India"
    }

async def reverse_geocode(lat: float, lng: float) -> Optional[str]:
    settings = get_settings()
    api_key = settings.geocoding_key()

    # 1. Try Google Geocoding API
    if api_key:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(GOOGLE_GEOCODING_URL, params={"latlng": f"{lat},{lng}", "key": api_key})
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("status") == "OK" and data.get("results"):
                        return data["results"][0].get("formatted_address")
        except Exception as e:
            logger.warning(f"Google Reverse Geocoding notice: {e}")

    # 2. Try Nominatim (OpenStreetMap) as free zero-key reverse geocoder
    try:
        async with httpx.AsyncClient(timeout=6.0, headers={"User-Agent": "DishaMobilityApp/1.0"}) as client:
            resp = await client.get("https://nominatim.openstreetmap.org/reverse", params={"lat": lat, "lon": lng, "format": "json"})
            if resp.status_code == 200:
                data = resp.json()
                display = data.get("display_name")
                if display:
                    return display
    except Exception as e:
        logger.warning(f"OSM Reverse Geocoding notice: {e}")

    # 3. Proximity match against known Bengaluru landmarks
    closest_name = None
    min_dist = float('inf')
    for name, info in BENGALURU_LANDMARKS.items():
        d = ((info["lat"] - lat) ** 2 + (info["lng"] - lng) ** 2) ** 0.5
        if d < min_dist:
            min_dist = d
            closest_name = info["formatted_address"]

    if closest_name and min_dist < 0.05:  # within ~5km
        return f"Near {closest_name}"

    return f"{lat:.4f}, {lng:.4f}, Bengaluru"
