from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.auth.firebase_auth import get_optional_user, CurrentUser
from app.schemas.ai import AIRequest
from app.services.ai_service import ask_disha
from app.utils.errors import success_response, error_response, DishaError
from app.utils.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/assistant")
async def ai_assistant(
    request: AIRequest,
    user: Optional[CurrentUser] = Depends(get_optional_user),
):
    """
    Ask DISHA AI assistant powered by Gemini.
    Gemini handles NLU and explanation only — never invents route data.
    Route data, if needed, is fetched from real APIs.
    """
    try:
        user_context = {
            "user_name": (user.display_name or user.email) if user else "Guest",
            "city": "Bengaluru",
        }
        result = await ask_disha(
            message=request.message,
            user_context={**user_context, **(request.user_context or {})},
            uid=user.uid if user else None,
        )
        return success_response(result)
    except DishaError as e:
        raise HTTPException(status_code=e.status_code, detail=error_response(e.code, e.message))
    except Exception as e:
        logger.error(f"AI assistant error: {e}")
        raise HTTPException(status_code=500, detail=error_response("GEMINI_ERROR", "AI service unavailable"))
