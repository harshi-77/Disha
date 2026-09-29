# DISHA Backend API Contract (FastAPI Integration Specification)

This specification defines the contract between the DISHA React Frontend and the upcoming DISHA FastAPI Backend.

The frontend supports two operating modes via the environment variable `VITE_DISHA_MODE`:
- `demo` (Default): Uses self-contained mock and simulation data without requiring backend connectivity.
- `live`: Routes all traffic, route optimization, spillback analysis, and prediction calls to `VITE_API_BASE_URL` (default: `http://localhost:8000`).

---

## 1. System Health Check

### `GET /health`
Returns backend health status, active optimizer engine status (QPSO), and simulation worker availability.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "disha_engine": "online",
  "qpso_workers_available": 8,
  "timestamp": "2026-09-28T14:30:00Z"
}
```

---

## 2. Real-Time & Live Traffic

### `GET /api/traffic/current`
Returns active road segment congestion levels, mean flow speeds, and incident advisories.

**Query Parameters (Optional):**
- `bbox`: Bounding box `minLat,minLng,maxLat,maxLng`
- `corridor_id`: Optional identifier for prioritized sub-network

**Response (200 OK):**
```json
{
  "cityWideCongestionAverage": 48.5,
  "lastUpdated": "14:32",
  "segments": [
    {
      "id": "seg-silk-board",
      "name": "Outer Ring Road (Silk Board Choke Corridor)",
      "coordinates": [[12.923, 77.62], [12.9176, 77.6238], [12.912, 77.627]],
      "level": "severe",
      "congestionPercent": 86,
      "currentSpeedKmh": 12,
      "freeFlowSpeedKmh": 50,
      "vehiclesPerHour": 1840,
      "lastUpdated": "Just now"
    }
  ],
  "incidents": [
    {
      "id": "inc-01",
      "title": "Spillback Queue Alert — Silk Board Junction",
      "type": "spillback_warning",
      "location": [12.9176, 77.6238],
      "roadName": "Outer Ring Road Interchange",
      "severity": "critical",
      "impactDelayMin": 15,
      "description": "Downstream signal saturation has propagated a 750m queue backward onto the main carriageway.",
      "timestamp": "12 min ago"
    }
  ]
}
```

---

## 3. Traffic Prediction Engine

### `POST /api/traffic/predict`
Calculates forward-looking congestion forecasting at 15, 30, 45, 60, and 90-minute horizons using recurrent spatial-temporal graph models.

**Request Body:**
```json
{
  "corridorId": "corridor-central-east",
  "horizonMinutes": 60,
  "inflowPerturbation": 0
}
```

**Response (200 OK):**
```json
{
  "timestamp": "14:30",
  "currentCongestionPercent": 42,
  "forecasts": [
    {
      "minutesFromNow": 15,
      "congestionPercent": 51,
      "trend": "increasing",
      "projectedSpeedKmh": 28,
      "riskIndex": 58
    },
    {
      "minutesFromNow": 30,
      "congestionPercent": 63,
      "trend": "increasing",
      "projectedSpeedKmh": 19,
      "riskIndex": 74
    },
    {
      "minutesFromNow": 60,
      "congestionPercent": 70,
      "trend": "increasing",
      "projectedSpeedKmh": 15,
      "riskIndex": 86
    }
  ],
  "hourlyForecast": [
    { "hour": "17:00", "congestionPercent": 79, "predictedVolumeVehicles": 2350 },
    { "hour": "18:00", "congestionPercent": 88, "predictedVolumeVehicles": 2620 }
  ],
  "peakHourWarning": "Upcoming evening peak anticipated between 17:30 and 19:30."
}
```

---

## 4. QPSO Multi-Objective Route Optimization

### `POST /api/routes/optimize`
Runs Quantum Particle Swarm Optimization across candidate trajectory space considering travel time, distance, predicted future congestion, and bottleneck spillback penalties.

**Request Body:**
```json
{
  "origin": {
    "name": "MG Road Central Metro Hub",
    "lat": 12.9756,
    "lng": 77.6097
  },
  "destination": {
    "name": "Electronic City Phase 1 Expressway",
    "lat": 12.8452,
    "lng": 77.6602
  },
  "preferences": {
    "avoidHighSpillback": true,
    "prioritizeGreen": true,
    "vehicleType": "EV"
  }
}
```

**Response (200 OK):**
```json
{
  "qpsoConvergenceScore": 96.5,
  "recommendedRouteId": "route-c",
  "routes": [
    {
      "id": "route-a",
      "name": "Route A — Central Arterial",
      "tag": "FASTEST",
      "distanceKm": 14.2,
      "durationMin": 24,
      "currentCongestionPercent": 42,
      "predictedCongestionPercent": 78,
      "spillbackRisk": "high",
      "co2EmissionsKg": 2.8,
      "isDishaRecommended": false,
      "qpsoScore": 68.4,
      "tradeOffSummary": "Shortest travel time now (24 min), but severe 78% downstream congestion and 850m queue spillback predicted in 20 min.",
      "coordinates": [[12.9756, 77.6097], [12.9176, 77.6238], [12.8452, 77.6602]]
    },
    {
      "id": "route-c",
      "name": "Route C — DISHA Smart QPSO Adaptive Corridor",
      "tag": "DISHA_OPTIMIZED",
      "distanceKm": 17.8,
      "durationMin": 27,
      "currentCongestionPercent": 30,
      "predictedCongestionPercent": 25,
      "spillbackRisk": "low",
      "co2EmissionsKg": 2.1,
      "isDishaRecommended": true,
      "qpsoScore": 96.5,
      "tradeOffSummary": "Adds only 3 min over Route A right now, but avoids 15-minute future delay when Route A collapses under predicted 78% spillback.",
      "coordinates": [[12.9756, 77.6097], [12.965, 77.665], [12.8452, 77.6602]]
    }
  ],
  "explanation": {
    "routeId": "route-c",
    "routeName": "Route C — DISHA Smart QPSO Adaptive Corridor",
    "rationale": "Route C was selected because the simulation predicted significantly lower future congestion (25% vs 78%) and negligible spillback risk.",
    "analyzedFactors": [
      { "factor": "Travel Time Stability", "status": "optimal", "metric": "27 min" },
      { "factor": "Predicted Congestion", "status": "optimal", "metric": "25% load" },
      { "factor": "Spillback Risk", "status": "avoided", "metric": "Low (0.12 choke probability)" }
    ],
    "summarySentence": "Route C was selected because the simulation predicted lower future congestion and lower spillback risk."
  }
}
```

---

## 5. Traffic Spillback Simulation

### `POST /api/spillback/simulate`
Simulates queue shockwave propagation backwards from intersection bottlenecks when additional volume is injected into corridors.

**Request Body:**
```json
{
  "routeId": "route-a",
  "additionalVehiclesPerHour": 500,
  "durationMinutes": 45
}
```

**Response (200 OK):**
```json
{
  "scenarioName": "Central Arterial Saturation & Wave Propagation",
  "timestamp": "14:30",
  "beforeRoute": {
    "name": "Route A",
    "durationMin": 24,
    "congestionPercent": 42,
    "spillbackProbability": 0.38
  },
  "simulationParameters": {
    "additionalVehiclesPerHour": 500,
    "durationMinutes": 45,
    "corridorCapacityVehicles": 1600,
    "chokePointName": "Silk Board & Koramangala Inflow Bottleneck"
  },
  "afterRoute": {
    "name": "Route A (Post-Spillback Shockwave)",
    "predictedDurationMin": 39,
    "predictedCongestionPercent": 78,
    "spillbackRisk": "high",
    "queueBacklogMeters": 850
  },
  "alternativeRoute": {
    "name": "Route C — DISHA Smart Adaptive Bypass",
    "predictedDurationMin": 27,
    "predictedCongestionPercent": 25,
    "spillbackRisk": "low",
    "rerouteAdvantageMin": 12
  },
  "bottlenecks": [
    {
      "id": "bn-01",
      "name": "Outer Ring Choke Point Junction",
      "location": [12.9176, 77.6238],
      "queueLengthMeters": 850,
      "criticalThresholdMeters": 500,
      "spillbackProb": 0.89
    }
  ]
}
```

---

## 6. Route Re-Optimization & Swarm Convergence Steps

### `GET /api/routes/qpso-steps`
Provides the step-by-step mathematical convergence trace of the QPSO swarm particles for the visualization UI.

**Response (200 OK):**
```json
[
  {
    "step": "candidate_eval",
    "title": "1. Candidate Evaluation",
    "description": "Generating candidate path graph across primary arterials and bypasses.",
    "status": "completed",
    "metrics": [{ "label": "Graph Paths Sampled", "value": 16 }]
  },
  {
    "step": "qpso_optimizing",
    "title": "2. Quantum PSO Particle Search",
    "description": "Simulating quantum Delta-potential well particles across multi-objective space.",
    "status": "completed",
    "metrics": [{ "label": "Particles", "value": 40 }, { "label": "Convergence Fitness", "value": "0.965" }]
  },
  {
    "step": "spillback_sim",
    "title": "4. Spillback Shockwave Simulation",
    "description": "Injecting downstream inflow surge (+500 veh/hr).",
    "status": "completed",
    "metrics": [{ "label": "Queue Backlog", "value": "850m" }, { "label": "Spillback Risk", "value": "HIGH" }]
  },
  {
    "step": "reoptimizing",
    "title": "6. QPSO Re-Optimization with Penalty",
    "description": "Penalizing saturated choke corridors in fitness function.",
    "status": "completed",
    "metrics": [{ "label": "Adaptive Penalty", "value": "2.8x" }]
  },
  {
    "step": "final_converged",
    "title": "7. Final Adaptive Route Selected",
    "description": "Route C selected: preserves velocity and saves 12 minutes.",
    "status": "completed",
    "metrics": [{ "label": "Final Route", "value": "Route C" }]
  }
]
```

---

## 7. Journey History & Saved Routes

### `GET /api/routes/history`
Returns logged journeys.

### `POST /api/routes/history`
Logs a completed journey.

### `GET /api/places/saved`
Returns user saved places (Home, Work, College, Favorites).
