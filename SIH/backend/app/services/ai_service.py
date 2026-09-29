import asyncio
import json
from typing import Optional, Dict, Any
from google import genai
from google.genai import types

from app.config import get_settings
from app.utils.logging import get_logger
from app.utils.errors import DishaError, GEMINI_ERROR
from app.schemas.ai import AIIntent
from app.schemas.route import RouteRequest, RouteRecommendResponse, TransportMode
from app.services.geocoding_service import geocode_address
from app.services.recommendation_service import recommend_routes
from app.services.personalization_service import get_user_preferences

logger = get_logger(__name__)

# Keep the primary model on a currently available, low-latency model. The older
# `gemini-flash-latest` alias can stall for a long time for some API projects,
# which made the whole assistant appear broken even when the key was valid.
GEMINI_CANDIDATE_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
]
GEMINI_REQUEST_TIMEOUT_SECONDS = 15

INTENT_SYSTEM_PROMPT = """You are the natural-language understanding layer for DISHA, an urban \
mobility app for Bengaluru, India. Read the user's message and extract structured intent as JSON \
ONLY — no markdown, no commentary, no code fences.

Return exactly this JSON shape:
{
  "intent": "route_planning" | "traffic_query" | "place_search" | "general_query" | "greeting",
  "destination": string or null,
  "origin": string or null,
  "avoid_tolls": true | false | null,
  "transport_mode": "car" | "bike" | "transit" | "walking" | "cycling" | null,
  "preferences": [string, ...]
}

Rules:
- "route_planning" is for anything about getting from A to B, finding a route, or navigating somewhere.
- Only set fields you can actually infer from the message. Use null when unknown.
- Never invent a destination or origin that wasn't mentioned or clearly implied.
- "preferences" can include things like "avoid_tolls", "fastest", "eco", "safest" if implied.
"""

EXPLANATION_SYSTEM_PROMPT = """You are Ask DISHA, the conversational assistant inside DISHA, an \
urban mobility app. Reply naturally and conversationally, in 1-4 short sentences.

CRITICAL RULES — you must follow these exactly:
- You are given a FACTUAL_CONTEXT block below with the only real data available (route info, \
distances, durations, whether data was found). Use ONLY that data for any factual claim.
- NEVER invent or guess: live traffic conditions, accident data, waterlogging, road closures, \
sensor readings, vehicle counts, exact distances, or ETAs that are not present in FACTUAL_CONTEXT.
- If FACTUAL_CONTEXT says information is unavailable, say so plainly instead of guessing.
- If FACTUAL_CONTEXT contains a recommended route, briefly explain why it was recommended, \
using only the reasons provided.
- Do not use markdown formatting. Plain conversational text only.
"""


def _get_client() -> genai.Client:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise DishaError(GEMINI_ERROR, "Gemini API key not configured", 503)
    return genai.Client(api_key=settings.gemini_api_key)


async def _extract_intent(message: str) -> AIIntent:
    client = _get_client()
    for model_name in GEMINI_CANDIDATE_MODELS:
        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=model_name,
                    contents=message,
                    config=types.GenerateContentConfig(
                        system_instruction=INTENT_SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        temperature=0.1,
                    ),
                ),
                timeout=GEMINI_REQUEST_TIMEOUT_SECONDS,
            )
            raw = (response.text or "").strip()
            data = json.loads(raw)
            return AIIntent(
                intent=data.get("intent", "general_query"),
                destination=data.get("destination"),
                origin=data.get("origin"),
                avoid_tolls=data.get("avoid_tolls"),
                transport_mode=data.get("transport_mode"),
                preferences=data.get("preferences") or [],
            )
        except json.JSONDecodeError as e:
            logger.error(f"Gemini intent JSON parse error on {model_name}: {e}")
            return AIIntent(intent="general_query")
        except Exception as e:
            logger.warning(f"Gemini model {model_name} intent extraction notice: {e}")
            continue

    # Resilient rule-based fallback if all models are unavailable/rate-limited
    lower = message.lower()
    intent = "general_query"
    dest = None
    orig = None
    if " to " in lower or "route" in lower or "direction" in lower or "navigate" in lower:
        intent = "route_planning"
        if " to " in lower:
            parts = lower.split(" to ")
            if len(parts) >= 2:
                dest = parts[1].split()[0].capitalize()
                if " from " in parts[0]:
                    orig = parts[0].split(" from ")[-1].strip().capitalize()
    elif "traffic" in lower or "jam" in lower or "congestion" in lower:
        intent = "traffic_query"
    elif "ev" in lower or "charger" in lower or "petrol" in lower or "food" in lower:
        intent = "place_search"
    elif any(g in lower for g in ["hi", "hello", "hey", "namaskara"]):
        intent = "greeting"

    return AIIntent(
        intent=intent,
        destination=dest,
        origin=orig,
        avoid_tolls="toll" in lower and "avoid" in lower,
        transport_mode="bike" if "bike" in lower else "car",
        preferences=[],
    )


async def _generate_reply(message: str, intent: AIIntent, factual_context: str) -> str:
    client = _get_client()
    prompt = (
        f"USER_MESSAGE: {message}\n\n"
        f"DETECTED_INTENT: {intent.intent}\n\n"
        f"FACTUAL_CONTEXT:\n{factual_context or 'No additional factual data was retrieved for this message.'}"
    )
    for model_name in GEMINI_CANDIDATE_MODELS:
        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=EXPLANATION_SYSTEM_PROMPT,
                        temperature=0.4,
                    ),
                ),
                timeout=GEMINI_REQUEST_TIMEOUT_SECONDS,
            )
            text = (response.text or "").strip()
            if text:
                return text
        except Exception as e:
            logger.warning(f"Gemini model {model_name} reply error: {e}")
            continue

    # Fallback response grounded in factual context
    if factual_context:
        return f"Here is the latest routing intelligence for Bengaluru: {factual_context}"
    return "DISHA neural co-pilot is online and active. Ask for real-time route optimization, traffic predictions, or smart charging stops across Bengaluru."


def _summarize_route_for_gemini(result: RouteRecommendResponse) -> str:
    r = result.recommended_route
    lines = [
        f"Recommended route: {r.name}",
        f"Duration: {r.duration_min} min (traffic-aware: {r.duration_in_traffic_min} min)",
        f"Distance: {r.distance_km} km",
        f"Has tolls: {r.has_tolls}",
        f"Congestion level: {r.congestion_level}",
    ]
    if r.estimated_fuel_cost_inr is not None:
        lines.append(f"Estimated fuel cost: INR {r.estimated_fuel_cost_inr}")
    if r.recommendation_reasons:
        lines.append("Reasons this route was recommended: " + "; ".join(r.recommendation_reasons))
    if result.alternatives:
        lines.append(f"{len(result.alternatives)} alternative route(s) are also available.")
    return "\n".join(lines)


async def ask_disha(
    message: str,
    user_context: Optional[Dict[str, Any]] = None,
    uid: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Ask DISHA pipeline:
    Gemini (intent extraction) -> real geocoding/routing/recommendation data
    -> Gemini (natural-language explanation grounded in that real data).

    Gemini never supplies route geometry, distance, ETA, traffic, or incident
    data itself — only real backend/API data is used for those facts.
    """
    user_context = user_context or {}
    intent = await _extract_intent(message)

    route_recommendation: Optional[Dict[str, Any]] = None
    suggested_action: Optional[str] = None
    factual_context = ""

    if intent.intent == "route_planning" and intent.destination:
        dest_geo = await geocode_address(intent.destination)
        if not dest_geo:
            factual_context = f"Could not resolve the destination '{intent.destination}' to a real location. No route data is available."
        else:
            origin_geo = await geocode_address(intent.origin) if intent.origin else None
            origin_lat = origin_geo["lat"] if origin_geo else user_context.get("origin_lat")
            origin_lng = origin_geo["lng"] if origin_geo else user_context.get("origin_lng")

            if origin_lat is None or origin_lng is None:
                suggested_action = "request_origin_location"
                factual_context = (
                    f"Destination resolved: {dest_geo['formatted_address']}. "
                    "The user's current location/origin is not known yet, so no route could be computed. "
                    "Ask the user for their starting point, or prompt them to share their location."
                )
            else:
                try:
                    prefs = await get_user_preferences(uid) if uid else None
                    request = RouteRequest(
                        origin_lat=origin_lat,
                        origin_lng=origin_lng,
                        destination_lat=dest_geo["lat"],
                        destination_lng=dest_geo["lng"],
                        transport_mode=TransportMode(intent.transport_mode) if intent.transport_mode else TransportMode.car,
                        avoid_tolls=bool(intent.avoid_tolls),
                    )
                    result = await recommend_routes(request=request, preferences=prefs)
                    route_recommendation = result.model_dump()
                    suggested_action = "show_route_on_map"
                    factual_context = _summarize_route_for_gemini(result)
                except DishaError as e:
                    factual_context = f"Route computation failed: {e.message}. No route data is available to share."

    elif intent.intent == "traffic_query":
        factual_context = (
            "No live traffic sensor feed is configured for this deployment. "
            "Only traffic-aware route ETAs from Google Routes API are available, via route planning."
        )

    reply = await _generate_reply(message, intent, factual_context)

    return {
        "reply": reply,
        "intent": intent.model_dump(),
        "suggested_action": suggested_action,
        "route_recommendation": route_recommendation,
    }
