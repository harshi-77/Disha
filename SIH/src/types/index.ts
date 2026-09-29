export type CongestionLevel = 'low' | 'moderate' | 'high' | 'severe';
export type SpillbackRisk = 'low' | 'medium' | 'high' | 'severe';

export interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  category?: 'city' | 'transit' | 'landmark' | 'university' | 'tech_park' | 'custom';
}

export interface RouteSegment {
  coordinates: [number, number][];
  congestion: CongestionLevel;
  speedKmh: number;
  roadName: string;
}

export interface RouteOption {
  id: string;
  name: string; // e.g., "Via Ring Expressway", "Via Urban Arterial", "Via Central Corridor"
  tag: 'FASTEST' | 'BALANCED' | 'ECO_FRIENDLY' | 'DISHA_OPTIMIZED' | 'ALTERNATIVE';
  distanceKm: number;
  durationMin: number;
  currentCongestionPercent: number;
  predictedCongestionPercent: number;
  spillbackRisk: SpillbackRisk;
  co2EmissionsKg: number;
  energyConsumptionKwh?: number;
  isDishaRecommended: boolean;
  qpsoScore: number; // 0-100 fitness
  tradeOffSummary: string;
  coordinates: [number, number][];
  segments: RouteSegment[];
  spillbackRiskReason?: string;
}

export interface TrafficSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  level: CongestionLevel;
  congestionPercent: number;
  currentSpeedKmh: number;
  freeFlowSpeedKmh: number;
  vehiclesPerHour: number;
  lastUpdated: string;
}

export interface TrafficIncident {
  id: string;
  title: string;
  type: 'congestion' | 'roadwork' | 'lane_closure' | 'spillback_warning' | 'weather';
  location: [number, number];
  roadName: string;
  severity: 'minor' | 'moderate' | 'critical';
  impactDelayMin: number;
  description: string;
  timestamp: string;
}

export interface TrafficPrediction {
  timestamp: string;
  currentCongestionPercent: number;
  forecasts: {
    minutesFromNow: number; // 15, 30, 45, 60, 90
    congestionPercent: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    projectedSpeedKmh: number;
    riskIndex: number;
  }[];
  hourlyForecast: {
    hour: string;
    congestionPercent: number;
    predictedVolumeVehicles: number;
  }[];
  peakHourWarning?: string;
}

export interface SpillbackSimulationData {
  scenarioName: string;
  timestamp: string;
  beforeRoute: {
    name: string;
    durationMin: number;
    congestionPercent: number;
    spillbackProbability: number;
  };
  simulationParameters: {
    additionalVehiclesPerHour: number;
    durationMinutes: number;
    corridorCapacityVehicles: number;
    chokePointName: string;
  };
  afterRoute: {
    name: string;
    predictedDurationMin: number;
    predictedCongestionPercent: number;
    spillbackRisk: SpillbackRisk;
    queueBacklogMeters: number;
  };
  alternativeRoute: {
    name: string;
    predictedDurationMin: number;
    predictedCongestionPercent: number;
    spillbackRisk: SpillbackRisk;
    rerouteAdvantageMin: number;
  };
  bottlenecks: {
    id: string;
    name: string;
    location: [number, number];
    queueLengthMeters: number;
    criticalThresholdMeters: number;
    spillbackProb: number;
  }[];
}

export interface QpsoOptimizationStep {
  step: 'candidate_eval' | 'qpso_optimizing' | 'proposed_found' | 'spillback_sim' | 'future_congestion' | 'reoptimizing' | 'final_converged';
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  metrics?: {
    label: string;
    value: string | number;
  }[];
}

export interface DishaExplanation {
  routeId: string;
  routeName: string;
  rationale: string;
  analyzedFactors: {
    factor: string;
    status: 'optimal' | 'moderate' | 'avoided';
    metric: string;
  }[];
  summarySentence: string;
}

export interface SavedPlace {
  id: string;
  label: 'Home' | 'Work' | 'College' | 'Custom';
  customTitle?: string;
  location: LocationPoint;
  savedAt: string;
}

export interface JourneyHistoryItem {
  id: string;
  origin: LocationPoint;
  destination: LocationPoint;
  distanceKm: number;
  durationMin: number;
  completedAt: string;
  routeType: string;
  co2SavedKg: number;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  vehicleType: 'EV' | 'Hybrid' | 'ICE';
  preferences: {
    prioritizeGreen: boolean;
    avoidHighSpillback: boolean;
    voicePrompts: boolean;
  };
}

export interface AppSettings {
  mode: 'demo' | 'live';
  apiBaseUrl: string;
  mapProvider: 'carto' | 'osm' | 'mapbox' | 'google';
  mapboxToken: string;
  googleMapsKey: string;
  enableSimulatedSpillback: boolean;
  simulationVehicleStress: number; // 200 - 1500 veh/hr
}
