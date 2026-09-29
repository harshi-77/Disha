from fastapi import Header, HTTPException
from app.utils.errors import error_response
from app.utils.logging import get_logger
from app.config import get_settings
from typing import Optional
import httpx

logger = get_logger(__name__)


class CurrentUser:
    def __init__(self, uid: str, email: str, display_name: Optional[str] = None):
        self.uid = uid
        self.email = email
        self.display_name = display_name


async def get_current_user(authorization: Optional[str] = Header(None)) -> CurrentUser:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail=error_response('AUTH_ERROR', 'Missing or invalid authorization header'))

    token = authorization.split(' ', 1)[1]
    settings = get_settings()
    if token == 'demo_token' and settings.allow_demo_auth:
        return CurrentUser(uid='demo_pilot_01', email='pilot@disha-mobility.local', display_name='Disha Pilot')

    if not settings.supabase_url or not settings.supabase_publishable_key:
        raise HTTPException(status_code=503, detail=error_response('AUTH_ERROR', 'Supabase Auth is not configured'))

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                f'{settings.supabase_url.rstrip("/")}/auth/v1/user',
                headers={
                    'apikey': settings.supabase_publishable_key,
                    'Authorization': f'Bearer {token}',
                },
            )
        if response.status_code != 200:
            raise ValueError(f'Supabase Auth returned HTTP {response.status_code}')
        user = response.json()
        metadata = user.get('user_metadata') or {}
        return CurrentUser(
            uid=user['id'],
            email=user.get('email', ''),
            display_name=metadata.get('display_name') or metadata.get('name'),
        )
    except Exception as e:
        logger.warning(f'Supabase token verification failed: {e}')
        raise HTTPException(status_code=401, detail=error_response('AUTH_ERROR', 'Invalid or expired Supabase access token'))


async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[CurrentUser]:
    if not authorization:
        return None
    try:
        return await get_current_user(authorization)
    except HTTPException:
        return None
