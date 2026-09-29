from app.utils.errors import success_response, error_response, DishaError
from app.schemas.ai import AIRequest, AIIntent


def test_success_response_shape():
    resp = success_response({"foo": "bar"})
    assert resp == {"success": True, "data": {"foo": "bar"}}


def test_error_response_shape():
    resp = error_response("ROUTE_PROVIDER_ERROR", "Unable to calculate route")
    assert resp["success"] is False
    assert resp["error"]["code"] == "ROUTE_PROVIDER_ERROR"


def test_disha_error_carries_status_code():
    err = DishaError("AUTH_ERROR", "Invalid token", 401)
    assert err.status_code == 401
    assert err.code == "AUTH_ERROR"
    assert str(err) == "Invalid token"


def test_ai_request_parses_message_only():
    req = AIRequest(message="Find me a route to the airport without tolls.")
    assert req.user_context is None


def test_ai_intent_defaults():
    intent = AIIntent(intent="route_planning", destination="airport", avoid_tolls=True)
    assert intent.destination == "airport"
    assert intent.avoid_tolls is True
    assert intent.origin is None
