from fastapi import HTTPException
from typing import Any, Optional

class DishaError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)

def success_response(data: Any) -> dict:
    return {"success": True, "data": data}

def error_response(code: str, message: str) -> dict:
    return {"success": False, "error": {"code": code, "message": message}}

ROUTE_PROVIDER_ERROR = "ROUTE_PROVIDER_ERROR"
AUTH_ERROR = "AUTH_ERROR"
NOT_FOUND = "NOT_FOUND"
VALIDATION_ERROR = "VALIDATION_ERROR"
GEMINI_ERROR = "GEMINI_ERROR"
FIRESTORE_ERROR = "FIRESTORE_ERROR"
PLACES_ERROR = "PLACES_ERROR"
GEOCODING_ERROR = "GEOCODING_ERROR"
