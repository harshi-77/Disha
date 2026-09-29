import { JourneyHistoryItem, LocationPoint, SavedPlace } from '../types';

export const SEARCH_SUGGESTIONS: LocationPoint[] = [
  {
    name: 'Bangalore City Railway Station',
    lat: 12.9781,
    lng: 77.5695,
    address: 'Krantivira Sangolli Rayanna Railway Station, Majestic',
    category: 'transit',
  },
  {
    name: 'Electronic City',
    lat: 12.8452,
    lng: 77.6602,
    address: 'Electronics City Phase 1, South Tech Corridor',
    category: 'tech_park',
  },
  {
    name: 'Silk Board',
    lat: 12.9176,
    lng: 77.6238,
    address: 'Central Silk Board Junction, Outer Ring Road',
    category: 'transit',
  },
  {
    name: 'Majestic',
    lat: 12.9767,
    lng: 77.5713,
    address: 'Kempegowda Bus Station & Metro Interchange',
    category: 'transit',
  },
  {
    name: 'Kempegowda International Airport',
    lat: 13.1986,
    lng: 77.7066,
    address: 'Devanahalli, Bengaluru (BLR)',
    category: 'transit',
  },
  {
    name: 'MG Road Central Metro Hub',
    lat: 12.9756,
    lng: 77.6097,
    address: 'Central Business District, Bengaluru',
    category: 'transit',
  },
  {
    name: 'Whitefield ITPL Gateway',
    lat: 12.9863,
    lng: 77.7308,
    address: 'East Tech Cluster & Metro Terminal',
    category: 'tech_park',
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
    address: 'Outer Ring Road Critical Junction',
    category: 'transit',
  },
  {
    name: 'IISc / Malleshwaram Tech Campus',
    lat: 13.0219,
    lng: 77.5671,
    address: 'North Tech & Academic Zone',
    category: 'university',
  },
  {
    name: 'Koramangala 4th Block Club',
    lat: 12.9340,
    lng: 77.6290,
    address: 'Commercial Hub, Bengaluru',
    category: 'landmark',
  },
  {
    name: 'Kempegowda International Airport (BLR)',
    lat: 13.1986,
    lng: 77.7066,
    address: 'North Transit Hub',
    category: 'transit',
  },
];

export const INITIAL_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'place-home',
    label: 'Home',
    customTitle: 'Indiranagar Residence',
    location: {
      name: 'Indiranagar 100 Feet Road',
      lat: 12.9784,
      lng: 77.6408,
      address: 'East Corridor Arterial, Bengaluru',
      category: 'landmark',
    },
    savedAt: '2 days ago',
  },
  {
    id: 'place-work',
    label: 'Work',
    customTitle: 'Electronic City Tech Campus',
    location: {
      name: 'Electronic City Phase 1 Expressway',
      lat: 12.8452,
      lng: 77.6602,
      address: 'Tech Hub South Terminal',
      category: 'tech_park',
    },
    savedAt: '1 week ago',
  },
  {
    id: 'place-college',
    label: 'College',
    customTitle: 'IISc Central Campus',
    location: {
      name: 'IISc / Malleshwaram Tech Campus',
      lat: 13.0219,
      lng: 77.5671,
      address: 'North Academic Zone',
      category: 'university',
    },
    savedAt: '2 weeks ago',
  },
];

export const INITIAL_JOURNEY_HISTORY: JourneyHistoryItem[] = [
  {
    id: 'hist-01',
    origin: {
      name: 'MG Road Central Metro Hub',
      lat: 12.9756,
      lng: 77.6097,
    },
    destination: {
      name: 'Electronic City Phase 1 Expressway',
      lat: 12.8452,
      lng: 77.6602,
    },
    distanceKm: 17.8,
    durationMin: 27,
    completedAt: 'Yesterday at 18:42',
    routeType: 'DISHA Smart Route (Adaptive Bypass)',
    co2SavedKg: 0.7,
  },
  {
    id: 'hist-02',
    origin: {
      name: 'Indiranagar 100 Feet Road',
      lat: 12.9784,
      lng: 77.6408,
    },
    destination: {
      name: 'Whitefield ITPL Gateway',
      lat: 12.9863,
      lng: 77.7308,
    },
    distanceKm: 11.4,
    durationMin: 21,
    completedAt: '3 days ago',
    routeType: 'Balanced Corridor',
    co2SavedKg: 0.4,
  },
  {
    id: 'hist-03',
    origin: {
      name: 'IISc / Malleshwaram Tech Campus',
      lat: 13.0219,
      lng: 77.5671,
    },
    destination: {
      name: 'MG Road Central Metro Hub',
      lat: 12.9756,
      lng: 77.6097,
    },
    distanceKm: 7.6,
    durationMin: 18,
    completedAt: '5 days ago',
    routeType: 'Green Wave Arterial',
    co2SavedKg: 0.3,
  },
];
