/**
 * DISHA Intelligent Mobility API client.
 * Demo mode is enabled by default so the complete UI remains usable without
 * Supabase Auth, map providers, Gemini, or a running backend.
 */

import { supabase } from './firebase';
import { DEMO_MODE, demoAssistant, demoGeocode, demoIncidents, demoPlaces, demoRoutes, demoTraffic } from './demo';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) headers.Authorization = `Bearer ${data.session.access_token}`;
  } catch {
    // Demo and public endpoints continue without a token.
  }
  return headers;
}

export async function checkBackendHealth() {
  if (DEMO_MODE) return { status: 'demo', service: 'DISHA Demo Runtime', mock_mode: true };
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend health check error:', e);
  }
  return { status: 'offline' };
}

export async function planRoute(originLat: number, originLng: number, destLat: number, destLng: number, mode = 'car', avoidTolls = false) {
  if (DEMO_MODE) return demoRoutes();
  try {
    const res = await fetch(`${API_BASE}/api/routes/plan`, {
      method: 'POST', headers: await getAuthHeaders(),
      body: JSON.stringify({ origin_lat: originLat, origin_lng: originLng, destination_lat: destLat, destination_lng: destLng, transport_mode: mode, avoid_tolls: avoidTolls }),
    });
    if (res.ok) return (await res.json()).data?.routes || [];
  } catch (e) { console.warn('planRoute error:', e); }
  return demoRoutes();
}

export async function recommendRoute(originLat: number, originLng: number, destLat: number, destLng: number, mode = 'car', avoidTolls = false) {
  if (DEMO_MODE) return { routes: demoRoutes(), recommended_route: demoRoutes()[0], demo: true };
  try {
    const res = await fetch(`${API_BASE}/api/routes/recommend`, {
      method: 'POST', headers: await getAuthHeaders(),
      body: JSON.stringify({ origin_lat: originLat, origin_lng: originLng, destination_lat: destLat, destination_lng: destLng, transport_mode: mode, avoid_tolls: avoidTolls }),
    });
    if (res.ok) return (await res.json()).data || null;
  } catch (e) { console.warn('recommendRoute error:', e); }
  return { routes: demoRoutes(), recommended_route: demoRoutes()[0], demo: true };
}

export async function searchNearbyPlaces(lat: number, lng: number, category = 'fuel', radiusM = 2500) {
  if (DEMO_MODE) return demoPlaces(category);
  try {
    const res = await fetch(`${API_BASE}/api/places/nearby?lat=${lat}&lng=${lng}&category=${category}&radius_m=${radiusM}`, { headers: await getAuthHeaders() });
    if (res.ok) return (await res.json()).data?.places || [];
  } catch (e) { console.warn('searchNearbyPlaces error:', e); }
  return demoPlaces(category);
}

export async function geocodeAddress(address: string) {
  if (DEMO_MODE) return demoGeocode(address);
  try {
    const res = await fetch(`${API_BASE}/api/geocoding/search?address=${encodeURIComponent(address)}`, { headers: await getAuthHeaders() });
    if (res.ok) return (await res.json()).data || null;
  } catch (e) { console.warn('geocodeAddress error:', e); }
  return demoGeocode(address);
}

export async function fetchLiveTraffic() {
  if (DEMO_MODE) return demoTraffic();
  try {
    const res = await fetch(`${API_BASE}/api/traffic/live`, { headers: await getAuthHeaders() });
    if (res.ok) return (await res.json()).data || null;
  } catch (e) { console.warn('fetchLiveTraffic error:', e); }
  return demoTraffic();
}

export async function fetchNearbyIncidents(lat = 12.9352, lng = 77.6245, radiusKm = 10) {
  if (DEMO_MODE) return demoIncidents();
  try {
    const res = await fetch(`${API_BASE}/api/incidents/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`, { headers: await getAuthHeaders() });
    if (res.ok) return (await res.json()).data?.incidents || [];
  } catch (e) { console.warn('fetchNearbyIncidents error:', e); }
  return demoIncidents();
}

export async function reportIncident(data: { type: string; location?: string; lat: number; lng: number; severity?: string; description?: string }) {
  if (DEMO_MODE) return { id: `demo_incident_${Date.now()}`, ...data, status: 'broadcasted', demo: true };
  try {
    const res = await fetch(`${API_BASE}/api/incidents/report`, { method: 'POST', headers: await getAuthHeaders(), body: JSON.stringify({ location: data.location || 'Bengaluru Corridor', ...data }) });
    if (res.ok) return (await res.json()).data || null;
  } catch (e) { console.warn('reportIncident error:', e); }
  return { id: `demo_incident_${Date.now()}`, ...data, status: 'broadcasted', demo: true };
}

export async function askDishaAI(message: string, userContext?: Record<string, any>) {
  if (DEMO_MODE) return demoAssistant(message);
  try {
    const res = await fetch(`${API_BASE}/api/ai/assistant`, { method: 'POST', headers: await getAuthHeaders(), body: JSON.stringify({ message, user_context: userContext || { city: 'Bengaluru' } }) });
    if (res.ok) return (await res.json()).data || null;
    throw new Error(`Ask DISHA is unavailable (${res.status}). ${await res.text()}`);
  } catch (e) {
    console.warn('askDishaAI error:', e);
    return demoAssistant(message);
  }
}
