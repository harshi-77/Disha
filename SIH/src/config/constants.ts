import { LocationPoint } from '../types';

export const APP_INFO = {
  name: 'DISHA Maps',
  fullName: 'Dynamic Intelligent System for Holistic Access',
  tagline: 'Predict. Optimize. Adapt. — Towards Smarter, Greener Mobility.',
  version: '1.0.0-PROD-FE',
};

// Default center: Bangalore Mobility Corridor (known for high-density multi-arterial spillback corridors)
export const DEFAULT_MAP_CENTER: [number, number] = [12.9716, 77.5946];
export const DEFAULT_ZOOM = 13;

export const POPULAR_LOCATIONS: LocationPoint[] = [
  {
    name: 'MG Road Central Metro Hub',
    lat: 12.9756,
    lng: 77.6097,
    address: 'Central Business District, Bengaluru',
    category: 'transit',
  },
  {
    name: 'Indiranagar 100 Feet Road',
    lat: 12.9784,
    lng: 77.6408,
    address: 'East Corridor Arterial, Bengaluru',
    category: 'landmark',
  },
  {
    name: 'Bellandur Silk Board Chokepoint',
    lat: 12.9176,
    lng: 77.6238,
    address: 'Outer Ring Road Critical Choke Junction',
    category: 'transit',
  },
  {
    name: 'Electronic City Phase 1 Expressway',
    lat: 12.8452,
    lng: 77.6602,
    address: 'Tech Hub South Terminal',
    category: 'tech_park',
  },
  {
    name: 'IISc / Malleshwaram Tech Campus',
    lat: 13.0219,
    lng: 77.5671,
    address: 'North Tech & Academic Zone',
    category: 'university',
  },
  {
    name: 'Whitefield ITPL Gateway',
    lat: 12.9863,
    lng: 77.7308,
    address: 'East Tech Cluster & Metro Terminal',
    category: 'tech_park',
  },
  {
    name: 'Koramangala Sony World Junction',
    lat: 12.9352,
    lng: 77.6245,
    address: 'Inner Ring Road Commercial Cross',
    category: 'landmark',
  },
  {
    name: 'Hebbal Flyover Junction',
    lat: 13.0358,
    lng: 77.5970,
    address: 'Airport Expressway Divergence Choke',
    category: 'transit',
  },
];

export const TILE_PROVIDERS = {
  cartoVoyager: {
    name: 'City streets',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
  cartoDark: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
  osm: {
    name: 'Road map',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
};

// Google Maps traffic colors
export const CONGESTION_COLORS = {
  low: '#188038',       // Google Maps green
  moderate: '#ea8600',  // Google Maps amber / orange
  high: '#d93025',      // Google Maps red
  severe: '#a50e0e',    // Google Maps dark crimson
};

// Google Maps route colors
export const ROUTE_PALETTE = {
  dishaRecommended: '#1a73e8', // Google Maps Primary Blue
  fastest: '#8ab4f8',          // Light Google Blue
  balanced: '#5f6368',         // Muted route gray
  alternative: '#70757a',      // Google gray alternative
  spillbackRisk: '#d93025',    // Hazard Red
};
