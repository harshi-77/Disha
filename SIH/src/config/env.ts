export interface EnvConfig {
  dishaMode: 'demo' | 'live';
  apiBaseUrl: string;
  mapProvider: 'carto' | 'osm' | 'mapbox' | 'google';
  mapboxToken: string;
  googleMapsKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const ENV: EnvConfig = {
  dishaMode: (import.meta.env.VITE_DISHA_MODE === 'live' ? 'live' : 'demo') as 'demo' | 'live',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  mapProvider: (import.meta.env.VITE_MAP_PROVIDER || 'osm') as 'carto' | 'osm' | 'mapbox' | 'google',
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
  googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};
