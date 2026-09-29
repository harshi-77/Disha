# DISHA Backend — Intelligent Mobility API

FastAPI backend for DISHA. Provides real Google Maps Platform routing/places/geocoding,
Firebase Authentication + Firestore persistence, a transparent route-scoring
recommendation engine, and a Gemini-powered "Ask DISHA" assistant.

This backend is additive: it does not modify the existing React/Vite/TypeScript
frontend's design, and it does not replace Firebase Authentication — it verifies
the same Firebase ID tokens the frontend already issues.

## 1. Architecture

```
backend/
  app/
    main.py            FastAPI app, CORS, routers, global error handler
    config.py           Settings loaded from .env (pydantic-settings)
    api/                One router per resource (routes, ai, users, places, ...)
    services/           Business logic + external API calls (Google, Gemini, Firestore)
    schemas/            Pydantic request/response models
    scoring/            Transparent weighted route-scoring engine
    database/firebase.py  Firebase Admin SDK init (Firestore + Auth)
    auth/firebase_auth.py Verifies Firebase ID tokens -> CurrentUser
    utils/              Logging + standard success/error response helpers
  tests/                pytest unit tests
  requirements.txt
  .env.example
```

Request flow for the core feature (personalized route recommendation):

```
RoutePlannerModal (frontend)
  -> POST /api/routes/recommend  (Firebase ID token optional)
    -> get_current_user / get_optional_user   (verifies Firebase ID token)
    -> personalization_service.get_user_preferences(uid)   (Firestore)
    -> personalization_service.get_recent_trips(uid)       (Firestore)
    -> incident_service.get_nearby_incidents(...)          (Firestore)
    -> routing_service.compute_routes(...)                 (Google Routes API)
    -> scoring.route_scorer.score_routes(...)              (transparent weighted scoring)
  <- recommended_route + alternatives + human-readable reasons
```

## 2. Installation

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

## 3. Environment variables

```bash
cp .env.example .env
```

Then fill in `backend/.env`:

| Variable | Required for | Where to get it |
|---|---|---|
| `GOOGLE_ROUTES_API_KEY` | `/api/routes/*` | Google Cloud Console → Credentials. Restrict this key to **Routes API** only. |
| `GOOGLE_GEOCODING_API_KEY` | `/api/geocoding/*` | Restrict to **Geocoding API** only. |
| `GOOGLE_PLACES_API_KEY` | `/api/places/*` | Restrict to **Places API** only. |
| `GOOGLE_MAPS_API_KEY` (optional) | fallback | Only used for a service above if its dedicated key is blank. All server-side — never exposed in frontend. |
| `GEMINI_API_KEY` | Ask DISHA (intent + explanations) | Google AI Studio → Get API key |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Auth verification + Firestore | Firebase Console → Project Settings → Service Accounts → Generate new private key. Copy `project_id`, `client_email`, `private_key` from the downloaded JSON. |
| `FRONTEND_URL` | CORS | Your Vite dev server / deployed frontend origin |
| `USE_MOCK_DATA` | — | Must be `false` for real data. Never falls back to mock silently. |

**Never commit `.env`.** It's already in `.gitignore`.

## 4. Firebase & Firestore setup

The Firebase *project* and *client-side Authentication* already exist in the
frontend (`src/lib/firebase.ts`, `firebase-applet-config.json`). This backend
does not create a new identity system — it verifies the ID tokens issued by
that same Firebase project via the Admin SDK.

Firestore document layout used by this backend:

```
users/{uid}
users/{uid}/preferences/main
users/{uid}/trips/{tripId}
users/{uid}/frequentJourneys/{journeyId}
incidents/{incidentId}
```

Make sure Firestore is enabled (Native mode) in the same Firebase project, and
that `firestore.rules` (already in the repo root) is deployed.

## 5. Google Maps Platform setup

In Google Cloud Console, on the project tied to your `GOOGLE_MAPS_API_KEY`:

1. Enable **Routes API** (used by `/api/routes/plan` and `/api/routes/recommend`).
2. Enable **Places API** (used by `/api/places/*`).
3. Enable **Geocoding API** (used by `/api/geocoding/*`).
4. Enable **Maps JavaScript API** for the separate *browser-restricted* key
   used by the frontend map (`VITE_GOOGLE_MAPS_API_KEY` — see frontend section
   below). Restrict that key to your web origin(s) in Cloud Console.
5. Keep `GOOGLE_MAPS_API_KEY` (server-side) unrestricted or IP-restricted only
   — never ship it to the browser.

## 6. Gemini / google-genai

`GEMINI_API_KEY` is used only for:
- Extracting structured intent from Ask DISHA messages (`app/services/ai_service.py::_extract_intent`)
- Generating the natural-language reply, grounded only in real route/geocoding data already fetched (`_generate_reply`)

Gemini never supplies route geometry, distance, ETA, live traffic, or incident
data — those always come from Google Routes/Places/Geocoding APIs or Firestore.

## 7. Running the backend

```bash
uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/health`

## 8. Running the frontend

From the project root (not `backend/`):

```bash
npm install   # or bun install, matching the existing bun.lock
npm run dev
```

Add to the frontend's `.env` (project root, not `backend/.env`):

```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=<browser-restricted Maps JavaScript API key>
```

**Never** put `GEMINI_API_KEY`, `FIREBASE_PRIVATE_KEY`, or the server-side
`GOOGLE_MAPS_API_KEY` into any `VITE_`-prefixed variable — anything prefixed
`VITE_` is bundled into the public JS bundle.

## 9. API documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 10. Testing

```bash
cd backend
pytest -v
```

Current tests cover: preference validation, route request validation, the
route-scoring engine (ranking + toll-avoidance behavior + empty-input safety),
standard error/success response shapes, and Ask DISHA request/intent schemas.
Tests that hit real Google/Gemini/Firestore APIs are intentionally **not**
included here — they'd require live credentials and would be flaky/costly to
run in CI. Add integration tests once real keys are configured, ideally
against a Firebase emulator.

## 11. Troubleshooting

| Symptom | Likely cause |
|---|---|
| `503 ROUTE_PROVIDER_ERROR "Google Maps API key not configured"` | `GOOGLE_MAPS_API_KEY` missing/empty in `backend/.env` |
| `503 GEMINI_ERROR "Gemini API key not configured"` | `GEMINI_API_KEY` missing/empty |
| `401 AUTH_ERROR "Invalid or expired token"` | Frontend sent a stale/expired Firebase ID token, or backend Firebase project doesn't match frontend's project |
| Firestore calls silently return empty lists / `False` | `FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` missing — `initialize_firebase()` logs a warning and Firestore is left uninitialized rather than raising |
| CORS error in browser console | `FRONTEND_URL` doesn't match the origin Vite is actually running on |

## 12. Security

- `GOOGLE_MAPS_API_KEY`, `GEMINI_API_KEY`, and the Firebase Admin private key
  never appear in `src/`, `public/`, or any `VITE_` variable.
- CORS origins are explicit (no wildcard).
- All endpoints return the standard `{ "success": bool, "data" | "error": ... }`
  envelope; internal exception details are never leaked to the client.

## 13. Mock mode

`USE_MOCK_DATA` exists as a switch for future use but **no mock provider is
wired in yet** — every endpoint currently calls real APIs/Firestore. If a mock
provider is added later, it must clearly label responses as demo data (e.g.
`"is_mock": true` — see `RouteRecommendResponse.is_mock`) so the UI can show
"Demo data" rather than presenting it as live.

## 14. What's implemented vs. still open

**Implemented (this backend):** all endpoints listed in the API docs below,
Firebase ID token verification, Firestore-backed preferences/trips/journeys/
incidents, Google Routes/Places/Geocoding integration, the transparent
weighted route-scoring engine, and the Gemini-grounded Ask DISHA pipeline.

**Not yet done (separate phase):** wiring the existing React components to
these endpoints (they currently still use `src/data/mobilityData.ts` demo data
and `setTimeout` simulations), and replacing `InteractiveMapCanvas`'s SVG demo
map with the real Google Maps JavaScript API. See the top-level implementation
summary provided alongside this backend for the exact remaining component list.
