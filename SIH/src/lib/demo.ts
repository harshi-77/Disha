import { ACTIVE_INCIDENTS, LIVE_CORRIDORS, ROUTE_OPTIONS } from '../data/mobilityData';

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

const LOCATIONS: Record<string, { lat: number; lng: number; formatted_address: string }> = {
  koramangala: { lat: 12.9352, lng: 77.6245, formatted_address: 'Koramangala 80ft Road, Bengaluru' },
  indiranagar: { lat: 12.9784, lng: 77.6408, formatted_address: 'Indiranagar 100ft Road, Bengaluru' },
  electronic: { lat: 12.8452, lng: 77.6602, formatted_address: 'Electronic City Phase 1, Bengaluru' },
  whitefield: { lat: 12.9698, lng: 77.7499, formatted_address: 'Whitefield ITPL Main Road, Bengaluru' },
  hebbal: { lat: 13.0358, lng: 77.5970, formatted_address: 'Hebbal Flyover Junction, Bengaluru' },
  airport: { lat: 13.1986, lng: 77.7066, formatted_address: 'Kempegowda International Airport, Bengaluru' },
  hsr: { lat: 12.9116, lng: 77.6389, formatted_address: 'HSR Layout Sector 1, Bengaluru' },
  mg: { lat: 12.9756, lng: 77.6062, formatted_address: 'MG Road Metro Station, Bengaluru' },
  marathahalli: { lat: 12.9591, lng: 77.6974, formatted_address: 'Marathahalli Bridge, Bengaluru' },
  jayanagar: { lat: 12.9250, lng: 77.5938, formatted_address: 'Jayanagar 4th Block, Bengaluru' },
  bannerghatta: { lat: 12.8870, lng: 77.5960, formatted_address: 'Bannerghatta Road, Bengaluru' },
};

export function demoUser(name = 'Harshitha R.') {
  return { email: 'harshi63633@gmail.com', name, uid: 'demo_pilot_session' };
}

export function demoGeocode(address: string) {
  const normalized = address.toLowerCase();
  const key = Object.keys(LOCATIONS).find((candidate) => normalized.includes(candidate));
  return LOCATIONS[key || 'koramangala'];
}

export function demoRoutes() {
  return Object.values(ROUTE_OPTIONS).map((route) => ({
    ...route,
    duration_min: route.durationMin,
    duration_in_traffic_min: route.durationMin,
    distance_km: route.distanceKm,
    congestion_level: route.congestionLevel,
    estimated_fuel_cost_inr: route.fuelCostInr,
    estimated_co2_kg: route.co2Kg,
    name: route.name,
    summary: route.coordinatesSummary,
  }));
}

export function demoTraffic() {
  return {
    city: 'Bengaluru',
    status: 'simulation',
    corridors: LIVE_CORRIDORS,
    network_flow_percentage: 84,
    monitored_vehicles: 22460,
    updated_at: new Date().toISOString(),
  };
}

export function demoPlaces(category = 'fuel') {
  const placeSets: Record<string, Array<Record<string, unknown>>> = {
    fuel: [
      { name: 'Shell Koramangala', category, lat: 12.934, lng: 77.624, rating: 4.4, open_now: true },
      { name: 'HP Domlur Fuel Station', category, lat: 12.961, lng: 77.638, rating: 4.2, open_now: true },
    ],
    ev: [
      { name: 'Tata Power EV Hub Indiranagar', category, lat: 12.978, lng: 77.641, rating: 4.6, open_now: true },
      { name: 'Ather Grid Koramangala', category, lat: 12.936, lng: 77.625, rating: 4.7, open_now: true },
    ],
    hospital: [
      { name: 'Manipal Hospital Old Airport Road', category, lat: 12.960, lng: 77.648, rating: 4.5, open_now: true },
    ],
  };
  return placeSets[category] || placeSets.fuel;
}

export function demoAssistant(message: string) {
  const text = message.toLowerCase();
  let reply = 'For this demo, DISHA recommends the Balanced Route through Old Airport Road: 27 minutes, smooth flow, and lower emissions.';
  let routeId = 'balanced';
  if (text.includes('ev') || text.includes('charger')) {
    reply = 'The EV-friendly demo plan uses the Balanced Route with a charging stop near Indiranagar. Estimated arrival is 27 minutes.';
  } else if (text.includes('flood') || text.includes('water')) {
    reply = 'Demo telemetry flags slow flow near Bellandur and a temporary restriction at Hoodi Circle. Use the Balanced Route to avoid the worst congestion.';
    routeId = 'low-traffic';
  } else if (text.includes('airport') || text.includes('fast')) {
    reply = 'The Fastest Route via Domlur Flyover is estimated at 24 minutes with the strongest green-wave alignment.';
    routeId = 'fastest';
  } else if (text.includes('pothole') || text.includes('smooth')) {
    reply = 'The Low Traffic Route has the best demo road-quality score (95/100) and avoids the reported Silk Board bottleneck.';
    routeId = 'low-traffic';
  }
  return {
    reply,
    route_recommendation: { recommended_route: { route_id: routeId } },
    demo: true,
  };
}

export function demoIncidents() {
  return ACTIVE_INCIDENTS;
}
