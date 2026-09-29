import pytest
from pydantic import ValidationError
from app.schemas.preference import UserPreferences


def test_default_preferences_are_valid():
    prefs = UserPreferences()
    assert prefs.preferred_mode == "car"
    assert 0.0 <= prefs.time_weight <= 1.0


def test_custom_preferences_accepted():
    prefs = UserPreferences(
        preferred_mode="bike",
        time_weight=0.5,
        safety_weight=0.3,
        cost_weight=0.1,
        traffic_weight=0.05,
        eco_weight=0.05,
        avoid_tolls=True,
    )
    assert prefs.avoid_tolls is True
    assert prefs.preferred_mode == "bike"


def test_weight_out_of_range_rejected():
    with pytest.raises(ValidationError):
        UserPreferences(time_weight=1.5)

    with pytest.raises(ValidationError):
        UserPreferences(safety_weight=-0.1)
