from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings
from app.api import routes, ai, users, places, geocoding, traffic, incidents, trips, journeys, analytics
from app.utils.logging import get_logger

logger = get_logger(__name__)

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────
app = FastAPI(
    title="DISHA Intelligent Mobility API",
    description=(
        "Backend API for DISHA — an AI-powered urban mobility and route planning platform for Bengaluru. "
        "Provides personalized route recommendations, real-time incident reporting, places search, "
        "trip history, mobility analytics, and the Ask DISHA AI assistant powered by Gemini."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─────────────────────────────────────────────
# CORS
# ─────────────────────────────────────────────
settings = get_settings()
ALLOWED_ORIGINS = [
    settings.frontend_url,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3003",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Startup
# ─────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("DISHA Backend starting up...")
    logger.info(f"Supabase Auth configured: {bool(settings.supabase_url and settings.supabase_publishable_key)}")
    logger.info(f"Mock data mode: {settings.use_mock_data}")
    logger.info(f"Google Routes API configured: {bool(settings.routes_key())}")
    logger.info(f"Google Geocoding API configured: {bool(settings.geocoding_key())}")
    logger.info(f"Google Places API configured: {bool(settings.places_key())}")
    logger.info(f"Gemini API configured: {bool(settings.gemini_api_key)}")
    logger.info("DISHA Backend ready.")


# ─────────────────────────────────────────────
# Global Exception Handler
# ─────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}},
    )


# ─────────────────────────────────────────────
# API Routers
# ─────────────────────────────────────────────
API_PREFIX = "/api"

app.include_router(routes.router, prefix=API_PREFIX)
app.include_router(ai.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(places.router, prefix=API_PREFIX)
app.include_router(geocoding.router, prefix=API_PREFIX)
app.include_router(traffic.router, prefix=API_PREFIX)
app.include_router(incidents.router, prefix=API_PREFIX)
app.include_router(trips.router, prefix=API_PREFIX)
app.include_router(journeys.router, prefix=API_PREFIX)
app.include_router(analytics.router, prefix=API_PREFIX)


# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "service": "DISHA Intelligent Mobility API",
        "version": "1.0.0",
        "google_routes_configured": bool(settings.routes_key()),
        "google_geocoding_configured": bool(settings.geocoding_key()),
        "google_places_configured": bool(settings.places_key()),
        "gemini_configured": bool(settings.gemini_api_key),
        "supabase_configured": bool(settings.supabase_url and settings.supabase_publishable_key),
        "mock_mode": settings.use_mock_data,
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "DISHA Intelligent Mobility API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }
