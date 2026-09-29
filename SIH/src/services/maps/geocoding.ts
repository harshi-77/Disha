import { LocationPoint } from '../../types';
import { POPULAR_LOCATIONS } from '../../config/constants';
import { SEARCH_SUGGESTIONS } from '../../mock/mockPlaces';
import { apiRequest, isLiveMode } from '../api/apiClient';

export async function searchLocations(query: string): Promise<LocationPoint[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return SEARCH_SUGGESTIONS.slice(0, 5);
  if (isLiveMode()) return apiRequest<LocationPoint[]>(`/api/geocode/search?q=${encodeURIComponent(query)}`);

  // 1. Instant local search match against known tech hubs and mobility corridors
  const localMatches = [...SEARCH_SUGGESTIONS, ...POPULAR_LOCATIONS].filter((loc) => {
    return (
      loc.name.toLowerCase().includes(clean) ||
      (loc.address && loc.address.toLowerCase().includes(clean))
    );
  });

  const uniqueMap = new Map<string, LocationPoint>();
  localMatches.forEach((item) => uniqueMap.set(item.name, item));
  const results = Array.from(uniqueMap.values());

  // 2. If query is longer than 3 characters, attempt OpenStreetMap Nominatim search for global addresses
  if (clean.length >= 3) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500); // 2.5s safe timeout

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=4`,
        {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      clearTimeout(timer);

      if (res.ok) {
        const osmData = await res.json();
        osmData.forEach((item: any) => {
          const name = item.name || item.display_name.split(',')[0];
          if (!uniqueMap.has(name)) {
            uniqueMap.set(name, {
              name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              address: item.display_name,
              category: 'landmark',
            });
          }
        });
      }
    } catch {
      // Fallback silently to local matches
    }
  }

  return Array.from(uniqueMap.values()).slice(0, 8);
}

export function getCurrentUserLocation(): Promise<LocationPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          name: 'Current Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          category: 'custom',
        });
      },
      (err) => {
        reject(new Error(err.message || 'Unable to retrieve location.'));
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  });
}
