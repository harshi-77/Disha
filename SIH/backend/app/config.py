from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
from typing import Optional

class Settings(BaseSettings):
    # Supabase Auth and database project
    supabase_url: str = ""
    supabase_publishable_key: str = ""

    # Google APIs — each API key is restricted to a single Google API,
    # per Google's recommended practice. Falls back to a shared
    # google_maps_api_key if a service-specific key isn't set, so a single
    # combined key still works for anyone who prefers that setup.
    google_maps_api_key: str = ""  # legacy/shared fallback
    google_routes_api_key: str = ""
    google_geocoding_api_key: str = ""
    google_places_api_key: str = ""
    gemini_api_key: str = ""

    def routes_key(self) -> str:
        return self.google_routes_api_key or self.google_maps_api_key

    def geocoding_key(self) -> str:
        return self.google_geocoding_api_key or self.google_maps_api_key

    def places_key(self) -> str:
        return self.google_places_api_key or self.google_maps_api_key
    
    # Legacy Firebase fields retained only for backwards-compatible environment files.
    firebase_project_id: str = ""
    firebase_client_email: str = ""
    firebase_private_key: str = ""
    
    # App
    frontend_url: str = "http://localhost:3003"
    use_mock_data: bool = False
    # Development-only convenience for local demos. Never enable in production.
    allow_demo_auth: bool = False
    
    # Optional
    weather_api_url: Optional[str] = None
    
    class Config:
        env_file = Path(__file__).resolve().parents[1] / ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
