# DISHA final repair report

## 1. Original problems

- The supplied archive was a frontend-only AI Studio export with no backend, no lockfile, an incompatible Vite 6 / React-plugin 6 pairing, and a Unix-only clean script.
- “Live” API paths had no corresponding FastAPI service. Route, traffic, prediction, spillback, authentication, and saved locations were primarily simulated or in memory.
- The README referenced unrelated Gemini setup; environment variables mixed public/browser values with server concepts.
- Location search called Nominatim directly from the browser without an identifying User-Agent or server-side throttle. Map popups interpolated external/user text into HTML.
- Settings appeared to change live services but were not persisted or consumed by the shared client. Mapbox/Google credentials were offered although the map implementation is Leaflet tiles.

## 2. Fixed problems

- Corrected the dependency line, added a normal `package-lock.json`, added cross-platform `rimraf`, and verified standard `npm install` works without legacy-peer-deps.
- Added FastAPI with strict request models, limited CORS, `/health`, backend Nominatim search throttling, OSRM route calculation, and explicit live-traffic refusal instead of fake data.
- Added a centralized runtime-aware API client with timeouts, errors, bearer header forwarding, and persisted runtime settings.
- Added Supabase Auth integration for real live-mode email/password signup/signin, session restoration, Google OAuth redirect, password reset, and logout. Demo credentials remain explicitly demo-only.
- Added saved-place persistence: browser local storage for demo, authenticated Supabase REST through the backend for live. Added the RLS schema.
- Added route error feedback, persisted settings, removed fabricated random location coordinates, escaped map popup content, and updated complete installation/deployment documentation.

## 3. Modified / added files

- `package.json`, `package-lock.json`, `.env.example`: compatible dependencies and public environment contract.
- `src/config/env.ts`, `src/services/api/apiClient.ts`: configuration and shared HTTP behavior.
- `src/services/api/authService.ts`, `savedRoutesService.ts`, `src/services/maps/geocoding.ts`: real integration paths.
- `src/App.tsx`, `src/components/auth/LoginPage.tsx`, `src/components/map/InteractiveMap.tsx`: persistence, error handling, password reset, XSS escaping.
- `backend/main.py`, `backend/requirements.txt`, `backend/.env.example`, `backend/supabase_schema.sql`: production API and optional database setup.
- `README.md`: actual project documentation.

## 4. API integrations

| Integration | Purpose | Status | Required configuration |
|---|---|---|---|
| OSRM public API | live driving geometry/distance/duration | implemented and verified | none for evaluation; use managed routing for production scale |
| Nominatim | live place search | implemented, server throttled | `NOMINATIM_USER_AGENT` contact |
| Supabase Auth | identity/session/OAuth/reset | implemented, externally unconfigured | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Supabase REST | saved routes | implemented, externally unconfigured | server `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, SQL schema |
| Live traffic | traffic/incidents | intentionally not fabricated | licensed provider integration still required |

## 5. Authentication, maps, backend, database, security

Live auth uses Supabase’s client session; the browser sends its bearer token to protected saved-route endpoints. The backend uses the caller JWT and Supabase RLS for user-scoped access. Leaflet remains the map provider with Carto/OSM tiles. Backend endpoints: `GET /health`, `GET /api/geocode/search`, `POST /api/routes/optimize`, `GET/POST/DELETE /api/saved-routes`, and `GET /api/traffic/current` (honest 503 until configured). Security improvements include restricted CORS, bounded Pydantic fields, server-only service key, no fabricated secrets, timeouts, provider rate-limit handling, and HTML escaping in map popups.

## 6. Actual test results

- `npm install`: **PASS** (111 packages, 0 vulnerabilities; npm reports an optional pending esbuild postinstall approval notice in this environment).
- `npm run lint`: **PASS**.
- `npm run build`: **PASS**. Non-blocking 570 kB minified bundle warning remains; map UI can be code-split later.
- `python -m compileall backend`: **PASS**.
- FastAPI start and `GET /health`: **PASS**; response showed `status: ok`.
- Real OSRM `POST /api/routes/optimize` Bengaluru → Koramangala: **PASS**; returned live 7.5 km / 12 min geometry.
- Browser/map, Supabase, saved-route database, Google OAuth, live traffic: **not verified** because the supplied project had no credentials or configured external account. Demo UI was not misrepresented as live verification.

## 7. Remaining external configuration

1. Create a Supabase project; add frontend variables, backend variables, permitted redirect URLs, and run `backend/supabase_schema.sql`.
2. Configure a licensed traffic provider if live traffic/incidents are required. The current backend deliberately returns a clear 503 rather than simulated live traffic.
3. Set exact HTTPS deployment origins in Vercel and backend CORS. Set a valid Nominatim User-Agent contact for public deployment.

## 8. Exact clean-machine setup

Follow the `README.md` “Install and run” steps. Use Demo Mode with no keys for evaluation; use Live Mode only after completing the three external configuration items above. Never place service-role keys in `.env.local` or Vercel’s `VITE_` variables.

## 9. Follow-up UI repair

- Replaced the key-restricted CARTO tile endpoint with three no-key map styles (standard OpenStreetMap, humanitarian city map, and terrain), verified the standard tile response, and set OpenStreetMap as the default.
- Removed the useless home button and direct guest entry. Login fields now start empty and user-provided Supabase profile data is retained by the authenticated flow.
- Directions inputs already provide debounced selectable origin/destination results and a current-location action. Starting navigation now opens a real Google Maps driving navigation URL with the chosen coordinates.
- Reworded map, forecast, traffic, route, and settings panels in user-facing language and removed configuration/key fields from the in-app settings view. Environment files remain the sole place to configure services.
- Replaced incomplete public tile sources with stable Esri road, city-street, and satellite layers. In-app navigation now keeps guidance inside DISHA, and dropped pins recenter the map and update the route endpoint.
