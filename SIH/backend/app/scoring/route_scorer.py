from typing import List, Dict, Any, Optional
from app.schemas.route import RouteAlternative
from app.schemas.preference import UserPreferences
from app.scoring.normalization import normalize_inverse, normalize
from app.utils.logging import get_logger

logger = get_logger(__name__)

CONGESTION_SCORES = {"low": 1.0, "moderate": 0.5, "high": 0.0, "unknown": 0.5}

def score_routes(
    routes: List[RouteAlternative],
    preferences: UserPreferences,
    incidents_nearby: Optional[List[Dict[str, Any]]] = None,
) -> List[RouteAlternative]:
    """Score and rank routes using a transparent weighted scoring engine."""
    if not routes:
        return routes

    durations = [r.duration_in_traffic_min or r.duration_min for r in routes]
    distances = [r.distance_km for r in routes]
    costs = [r.estimated_fuel_cost_inr or 0.0 for r in routes]
    co2s = [r.estimated_co2_kg or 0.0 for r in routes]

    scored = []
    for i, route in enumerate(routes):
        dur = route.duration_in_traffic_min or route.duration_min
        time_score = normalize_inverse(dur, durations)
        traffic_score = CONGESTION_SCORES.get(route.congestion_level, 0.5)
        cost_score = normalize_inverse(route.estimated_fuel_cost_inr or 0.0, costs)
        eco_score = normalize_inverse(route.estimated_co2_kg or 0.0, co2s)
        safety_score = 1.0 if not route.has_tolls else 0.8

        if preferences.avoid_tolls and route.has_tolls:
            safety_score *= 0.1

        total = (
            time_score * preferences.time_weight
            + safety_score * preferences.safety_weight
            + cost_score * preferences.cost_weight
            + traffic_score * preferences.traffic_weight
            + eco_score * preferences.eco_weight
        )
        if preferences.avoid_tolls and route.has_tolls:
            total = max(0.0, total - 0.35)

        route.score = round(total, 4)
        reasons = _generate_reasons(route, routes, preferences, i)
        route.recommendation_reasons = reasons
        scored.append(route)

    scored.sort(key=lambda r: r.score or 0, reverse=True)
    if scored:
        scored[0].is_recommended = True
    return scored

def _generate_reasons(
    route: RouteAlternative,
    all_routes: List[RouteAlternative],
    prefs: UserPreferences,
    index: int,
) -> List[str]:
    reasons = []
    fastest_dur = min(r.duration_in_traffic_min or r.duration_min for r in all_routes)
    dur = route.duration_in_traffic_min or route.duration_min
    diff = round(dur - fastest_dur, 1)

    if prefs.avoid_tolls and not route.has_tolls:
        reasons.append("Matches your preference for avoiding toll roads.")
    elif route.has_tolls:
        reasons.append("This route includes toll roads.")

    if diff == 0:
        reasons.append("This is the fastest available route.")
    elif diff > 0:
        reasons.append(f"About {diff} minute(s) longer than the fastest alternative.")

    if route.congestion_level == "low":
        reasons.append("Low traffic congestion expected on this route.")
    elif route.congestion_level == "moderate":
        reasons.append("Moderate traffic expected — some slowdowns possible.")
    elif route.congestion_level == "high":
        reasons.append("High traffic congestion on this route.")

    if route.estimated_fuel_cost_inr is not None:
        min_cost = min(r.estimated_fuel_cost_inr or float('inf') for r in all_routes)
        if route.estimated_fuel_cost_inr == min_cost:
            reasons.append(f"Lowest estimated fuel cost (₹{route.estimated_fuel_cost_inr}).")
        else:
            reasons.append(f"Estimated fuel cost: ₹{route.estimated_fuel_cost_inr}.")

    if route.estimated_co2_kg is not None:
        min_co2 = min(r.estimated_co2_kg or float('inf') for r in all_routes)
        if route.estimated_co2_kg == min_co2:
            reasons.append(f"Lowest estimated CO₂ emissions ({route.estimated_co2_kg} kg).")

    return reasons
