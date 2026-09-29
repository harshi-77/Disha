import { isLiveMode, apiRequest } from './apiClient';
import { MOCK_ROUTES } from '../../mock/mockRoutes';
import { LocationPoint, RouteOption, DishaExplanation, QpsoOptimizationStep } from '../../types';

export interface RouteOptimizationRequest {
  origin: LocationPoint;
  destination: LocationPoint;
  preferences?: {
    avoidHighSpillback?: boolean;
    prioritizeGreen?: boolean;
    vehicleType?: string;
  };
}

export interface RouteOptimizationResponse {
  routes: RouteOption[];
  recommendedRouteId: string;
  qpsoConvergenceScore: number;
  explanation: DishaExplanation;
}

export const routeService = {
  async getOptimizedRoutes(req: RouteOptimizationRequest): Promise<RouteOptimizationResponse> {
    if (isLiveMode()) {
      return apiRequest<RouteOptimizationResponse>('/api/routes/optimize', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    }

    // DEMO MODE: Synthesize responsive routes anchored between origin and destination
    await new Promise((resolve) => setTimeout(resolve, 650)); // Realistic network latency simulation

    const originCoord: [number, number] = [req.origin.lat, req.origin.lng];
    const destCoord: [number, number] = [req.destination.lat, req.destination.lng];

    // Adapt mock coordinates slightly so route ends at chosen origin & destination
    const adaptedRoutes = MOCK_ROUTES.map((route, idx) => {
      const midLat = (originCoord[0] + destCoord[0]) / 2;
      const midLng = (originCoord[1] + destCoord[1]) / 2;

      // Create distinct path curves for alternatives
      const offsetFactor = (idx - 1) * 0.02;
      const dynamicCoords: [number, number][] = [
        originCoord,
        [originCoord[0] * 0.7 + midLat * 0.3 + offsetFactor, originCoord[1] * 0.7 + midLng * 0.3 - offsetFactor],
        [midLat + offsetFactor * 1.5, midLng + offsetFactor],
        [destCoord[0] * 0.7 + midLat * 0.3 - offsetFactor, destCoord[1] * 0.7 + midLng * 0.3 + offsetFactor],
        destCoord,
      ];

      return {
        ...route,
        coordinates: dynamicCoords,
      };
    });

    const recommended = adaptedRoutes.find((r) => r.isDishaRecommended) || adaptedRoutes[2];

    const explanation: DishaExplanation = {
      routeId: recommended.id,
      routeName: recommended.name,
      rationale: 'Route C was selected because the simulation predicted significantly lower future congestion (25% vs 78%) and negligible spillback risk, avoiding an estimated 15-minute shockwave delay at primary choke junctions.',
      analyzedFactors: [
        { factor: 'Travel Time Stability', status: 'optimal', metric: '27 min (projected variance ±2m)' },
        { factor: 'Predicted Congestion', status: 'optimal', metric: '25% downstream load' },
        { factor: 'Spillback Risk', status: 'avoided', metric: 'Low (0.12 choke probability)' },
        { factor: 'Corridor Capacity Headroom', status: 'optimal', metric: '60% residual clearance' },
        { factor: 'Carbon Footprint', status: 'moderate', metric: '2.1 kg CO2 eq' },
      ],
      summarySentence: 'DISHA analyzed travel time, distance, current congestion, predicted congestion, spillback risk, and route stability. Route C was selected because the simulation predicted lower future congestion and lower spillback risk.',
    };

    return {
      routes: adaptedRoutes,
      recommendedRouteId: recommended.id,
      qpsoConvergenceScore: 96.5,
      explanation,
    };
  },

  async runQpsoSimulationWorkflow(): Promise<QpsoOptimizationStep[]> {
    if (isLiveMode()) {
      return apiRequest<QpsoOptimizationStep[]>('/api/routes/qpso-steps', {
        method: 'GET',
      });
    }

    // Return detailed QPSO visualization step definitions matching Section 20
    return [
      {
        step: 'candidate_eval',
        title: '1. Candidate Routes',
        description: 'Generating candidate multi-corridor path graph across arterials and bypasses.',
        status: 'completed',
        metrics: [{ label: 'Candidate Corridors', value: 4 }, { label: 'Graph Intersections', value: 48 }],
      },
      {
        step: 'qpso_optimizing',
        title: '2. Multi-Objective Route Optimization',
        description: 'Intelligent multi-objective search across travel time, fuel efficiency, and corridor capacity.',
        status: 'completed',
        metrics: [{ label: 'Optimization Pass', value: 'Complete' }, { label: 'Convergence Fitness', value: '96.5%' }],
      },
      {
        step: 'proposed_found',
        title: '3. Candidate Evaluation',
        description: 'Evaluating candidate corridors against instantaneous speeds and current traffic bottlenecks.',
        status: 'completed',
        metrics: [{ label: 'Candidate Evaluated', value: 'Route A, B, C' }, { label: 'Fastest Now', value: 'Route A (24 min)' }],
      },
      {
        step: 'proposed_found',
        title: '4. Proposed Route',
        description: 'Initial proposal prioritizes Direct Arterial (Route A, 24 min) under current clear conditions.',
        status: 'completed',
        metrics: [{ label: 'Proposed Route', value: 'Route A' }, { label: 'Duration Now', value: '24 min' }],
      },
      {
        step: 'spillback_sim',
        title: '5. Spillback Simulation',
        description: 'Injecting downstream inflow surge (+500 veh/hr). Simulating backward queue shockwave at primary choke points.',
        status: 'completed',
        metrics: [{ label: 'Queue Backlog', value: '850m' }, { label: 'Spillback Risk', value: 'HIGH (78%)' }],
      },
      {
        step: 'reoptimizing',
        title: '6. Re-Optimization',
        description: 'Penalizing saturated choke corridors in optimization fitness function; redirecting toward high-clearance bypass.',
        status: 'completed',
        metrics: [{ label: 'Bottleneck Penalty', value: '2.8x' }, { label: 'Bypass Identified', value: 'Route C' }],
      },
      {
        step: 'final_converged',
        title: '7. Final Route',
        description: 'Route C selected: preserves high velocity, avoids 850m queue shockwaves, saves 12 minutes over degraded Route A.',
        status: 'completed',
        metrics: [{ label: 'Final Route', value: 'Route C' }, { label: 'Net Advantage', value: '+12 min saved' }],
      },
    ];
  },
};
