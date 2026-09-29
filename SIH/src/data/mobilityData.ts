export interface RouteOption {
  id: string;
  name: string;
  durationMin: number;
  distanceKm: number;
  savingsMin: number;
  congestionLevel: 'low' | 'moderate' | 'high';
  fuelCostInr: number;
  co2Kg: number;
  roadQualityScore: number; // 0-100
  description: string;
  via: string;
  incidentsCount: number;
  coordinatesSummary: string;
  segments: {
    name: string;
    status: 'flowing' | 'moderate' | 'congested';
    speedKmph: number;
    distanceKm: number;
  }[];
}

export const ROUTE_OPTIONS: Record<string, RouteOption> = {
  fastest: {
    id: 'fastest',
    name: 'FASTEST ROUTE',
    durationMin: 24,
    distanceKm: 12.4,
    savingsMin: 8,
    congestionLevel: 'moderate',
    fuelCostInr: 118,
    co2Kg: 2.1,
    roadQualityScore: 92,
    description: 'Optimal velocity via elevated arterial corridor with real-time green wave synchronization.',
    via: 'Via Outer Ring Road & Tech Corridor Flyover',
    incidentsCount: 0,
    coordinatesSummary: 'Koramangala 80ft Rd → Domlur Flyover → Indiranagar 100ft Rd',
    segments: [
      { name: 'Koramangala 80ft Arterial', status: 'flowing', speedKmph: 48, distanceKm: 3.2 },
      { name: 'Domlur Elevated Expressway', status: 'flowing', speedKmph: 62, distanceKm: 5.6 },
      { name: 'Indiranagar Radial Loop', status: 'moderate', speedKmph: 34, distanceKm: 3.6 },
    ],
  },
  balanced: {
    id: 'balanced',
    name: 'BALANCED ROUTE',
    durationMin: 27,
    distanceKm: 11.8,
    savingsMin: 5,
    congestionLevel: 'low',
    fuelCostInr: 104,
    co2Kg: 1.8,
    roadQualityScore: 88,
    description: 'Minimizes stop-and-go friction, saving brake wear and fuel while avoiding narrow choke points.',
    via: 'Via Old Airport Road & Suranjan Das Arterial',
    incidentsCount: 1,
    coordinatesSummary: 'Koramangala Inner Ring Rd → Wind Tunnel Rd → Indiranagar',
    segments: [
      { name: 'Inner Ring Link', status: 'flowing', speedKmph: 42, distanceKm: 4.1 },
      { name: 'Wind Tunnel Bypass', status: 'flowing', speedKmph: 46, distanceKm: 4.5 },
      { name: 'Suranjan Das Junction', status: 'moderate', speedKmph: 28, distanceKm: 3.2 },
    ],
  },
  'low-traffic': {
    id: 'low-traffic',
    name: 'LOW TRAFFIC ROUTE',
    durationMin: 31,
    distanceKm: 13.1,
    savingsMin: 1,
    congestionLevel: 'low',
    fuelCostInr: 122,
    co2Kg: 2.2,
    roadQualityScore: 95,
    description: 'Widest lanes and zero red bottleneck warnings, guaranteed steady cruising speed.',
    via: 'Via HAL Perimeter Expressway & Ring Corridor',
    incidentsCount: 0,
    coordinatesSummary: 'Outer Ring Bypass → HAL Perimeter Rd → Defence Colony Extension',
    segments: [
      { name: 'Outer Ring Bypass', status: 'flowing', speedKmph: 58, distanceKm: 5.8 },
      { name: 'HAL Perimeter Expressway', status: 'flowing', speedKmph: 54, distanceKm: 4.9 },
      { name: 'Defence Radial Parkway', status: 'flowing', speedKmph: 45, distanceKm: 2.4 },
    ],
  },
};

export interface TrafficCorridor {
  id: string;
  name: string;
  city: string;
  avgSpeedKmph: number;
  flowPercentage: number;
  status: 'optimal' | 'moderate' | 'congested';
  incidentText?: string;
  trend: 'improving' | 'stable' | 'deteriorating';
  activeVehicles: number;
}

export const LIVE_CORRIDORS: TrafficCorridor[] = [
  {
    id: 'bengaluru-orr',
    name: 'Outer Ring Road (Silk Board to Marathahalli)',
    city: 'Bengaluru',
    avgSpeedKmph: 32,
    flowPercentage: 74,
    status: 'moderate',
    incidentText: 'Slow flow near Bellandur flyover junction (metro pier zone)',
    trend: 'improving',
    activeVehicles: 4820,
  },
  {
    id: 'bengaluru-hebbal',
    name: 'Hebbal Flyover to Airport Expressway',
    city: 'Bengaluru',
    avgSpeedKmph: 64,
    flowPercentage: 91,
    status: 'optimal',
    trend: 'stable',
    activeVehicles: 6150,
  },
  {
    id: 'bengaluru-ecity',
    name: 'Electronic City Phase 1 Elevated Corridor',
    city: 'Bengaluru',
    avgSpeedKmph: 71,
    flowPercentage: 94,
    status: 'optimal',
    trend: 'stable',
    activeVehicles: 3940,
  },
  {
    id: 'bengaluru-whitefield',
    name: 'Whitefield Main Rd / ITPL Main Arterial',
    city: 'Bengaluru',
    avgSpeedKmph: 22,
    flowPercentage: 58,
    status: 'congested',
    incidentText: 'Temporary lane restriction at Hoodi Circle',
    trend: 'deteriorating',
    activeVehicles: 5310,
  },
  {
    id: 'bengaluru-indiranagar',
    name: 'Indiranagar 100ft Rd / CMH Corridor',
    city: 'Bengaluru',
    avgSpeedKmph: 38,
    flowPercentage: 86,
    status: 'optimal',
    trend: 'improving',
    activeVehicles: 2790,
  },
];

export interface IncidentAlert {
  id: string;
  type: 'congestion' | 'construction' | 'accident' | 'weather';
  title: string;
  location: string;
  impactMinutes: number;
  alternativeRouteSuggested: boolean;
  timestamp: string;
}

export const ACTIVE_INCIDENTS: IncidentAlert[] = [
  {
    id: 'inc-101',
    type: 'congestion',
    title: 'High density bottleneck detected',
    location: 'Silk Board Junction Northbound',
    impactMinutes: 14,
    alternativeRouteSuggested: true,
    timestamp: '2 mins ago',
  },
  {
    id: 'inc-102',
    type: 'construction',
    title: 'Metro barricading lane shift',
    location: 'Outer Ring Road, Kadubeesanahalli',
    impactMinutes: 6,
    alternativeRouteSuggested: true,
    timestamp: '8 mins ago',
  },
  {
    id: 'inc-103',
    type: 'accident',
    title: 'Minor vehicle stoppage cleared',
    location: 'Richmond Circle Underpass',
    impactMinutes: 3,
    alternativeRouteSuggested: false,
    timestamp: '14 mins ago',
  },
];
