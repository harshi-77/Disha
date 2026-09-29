import pytest
from pydantic import ValidationError
from app.schemas.route import RouteRequest, RouteAlternative, TransportMode
from app.schemas.preference import UserPreferences
from app.scoring.route_scorer import score_routes
from app.scoring.normalization import normalize, normalize_inverse


def test_route_request_requires_coordinates():
    with pytest.raises(ValidationError):
        RouteRequest(origin_lat=12.9716, transport_mode="car")  # missing required fields


def test_route_request_defaults():
    req = RouteRequest(
        origin_lat=12.9716, origin_lng=77.5946,
        destination_lat=12.9352, destination_lng=77.6245,
    )
    assert req.transport_mode == TransportMode.car
    assert req.avoid_tolls is False


def _make_route(route_id, duration, distance, tolls, congestion, cost, co2):
    return RouteAlternative(
        route_id=route_id, name=route_id, duration_min=duration,
        duration_in_traffic_min=duration, distance_km=distance,
        has_tolls=tolls, estimated_fuel_cost_inr=cost, estimated_co2_kg=co2,
        summary=route_id, congestion_level=congestion,
    )


def test_normalization_bounds():
    values = [10, 20, 30]
    assert normalize(10, values) == 0.0
    assert normalize(30, values) == 1.0
    assert normalize_inverse(10, values) == 1.0
    assert normalize_inverse(30, values) == 0.0


def test_score_routes_ranks_fastest_first_by_default_weights():
    routes = [
        _make_route("fastest", 20, 10, False, "low", 100, 2.0),
        _make_route("balanced", 25, 9, False, "low", 90, 1.8),
        _make_route("slow", 40, 8, True, "high", 80, 1.5),
    ]
    prefs = UserPreferences()
    scored = score_routes(routes, prefs)

    assert scored[0].is_recommended is True
    # The route ranked first must have the highest score of the set.
    assert scored[0].score == max(r.score for r in scored)
    # Every route should carry at least one human-readable reason.
    assert all(len(r.recommendation_reasons) > 0 for r in scored)


def test_score_routes_penalizes_tolls_when_avoided():
    routes = [
        _make_route("toll_route", 18, 10, True, "low", 100, 2.0),
        _make_route("no_toll_route", 19, 10, False, "low", 100, 2.0),
    ]
    prefs = UserPreferences(avoid_tolls=True)
    scored = score_routes(routes, prefs)
    assert scored[0].route_id == "no_toll_route"


def test_score_routes_empty_list_is_safe():
    assert score_routes([], UserPreferences()) == []
