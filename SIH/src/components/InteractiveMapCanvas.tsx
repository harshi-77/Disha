import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEMO_MODE } from '../lib/demo';
import { 
  Zap, 
  AlertTriangle, 
  MapPin, 
  Layers, 
  Maximize2, 
  Navigation, 
  Compass, 
  Crosshair,
  Volume2,
  Coffee,
  Fuel,
  Hospital,
  Globe,
  Radio,
  Check
} from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initDishaGoogleMap?: () => void;
    gm_authFailure?: () => void;
  }
}

interface OpenStreetMapFallbackProps {
  origin: { lat: number; lng: number; label?: string };
  destination: { lat: number; lng: number; label?: string };
  routePolylines?: Record<string, string>;
  selectedRouteId: string;
}

const FALLBACK_ROUTE_COORDINATES: Record<string, [number, number][]> = {
  fastest: [[12.9352, 77.6245], [12.9396, 77.6253], [12.946, 77.631], [12.955, 77.636], [12.964, 77.639], [12.971, 77.6405], [12.9784, 77.6408]],
  balanced: [[12.9352, 77.6245], [12.932, 77.63], [12.943, 77.641], [12.953, 77.647], [12.968, 77.644], [12.9784, 77.6408]],
  'low-traffic': [[12.9352, 77.6245], [12.929, 77.628], [12.938, 77.649], [12.9592, 77.6501], [12.973, 77.646], [12.9784, 77.6408]],
};

const decodeGooglePolyline = (encoded: string): [number, number][] => {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let result = 0, shift = 0, byte: number;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 0; shift = 0;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
};

/** A real map fallback for an unavailable Google Maps browser key. */
const OpenStreetMapFallback: React.FC<OpenStreetMapFallbackProps> = ({ origin, destination, routePolylines, selectedRouteId }) => {
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fallbackRef.current) return;
    const map = L.map(fallbackRef.current, { zoomControl: false, attributionControl: true });
    const bounds = L.latLngBounds([origin.lat, origin.lng], [destination.lat, destination.lng]);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    const availableRoutes = Object.entries(routePolylines || {}).map(([id, encoded]) => [id, decodeGooglePolyline(encoded)] as const);
    const routesToDraw = availableRoutes.length ? availableRoutes : Object.entries(FALLBACK_ROUTE_COORDINATES);
    routesToDraw.forEach(([id, points]) => {
      L.polyline(points, {
        color: id === selectedRouteId ? '#f97316' : '#f59e0b',
        weight: id === selectedRouteId ? 6 : 3,
        opacity: id === selectedRouteId ? 1 : 0.55,
      }).addTo(map);
    });
    L.circleMarker([origin.lat, origin.lng], { radius: 9, color: '#fff', weight: 2, fillColor: '#f97316', fillOpacity: 1 })
      .bindPopup(origin.label || 'Origin').addTo(map);
    L.circleMarker([destination.lat, destination.lng], { radius: 9, color: '#fff', weight: 2, fillColor: '#f59e0b', fillOpacity: 1 })
      .bindPopup(destination.label || 'Destination').addTo(map);
    map.fitBounds(bounds, { padding: [45, 45] });
    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 150);
    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
    };
  }, [origin.lat, origin.lng, origin.label, destination.lat, destination.lng, destination.label, routePolylines, selectedRouteId]);

  return <div ref={fallbackRef} className="absolute inset-0 z-10 min-h-[380px]" />;
};

export interface MapStop {
  id: string;
  name: string;
  type: 'ev' | 'fuel' | 'hospital' | 'food';
  lat: number;
  lng: number;
  info: string;
}

export interface MapIncident {
  id: string;
  type: 'pothole' | 'accident' | 'waterlog' | 'construction';
  title: string;
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high';
}

interface InteractiveMapCanvasProps {
  selectedRouteId: string;
  onRouteChange?: (routeId: string) => void;
  transportMode?: string;
  showSmartStops?: boolean;
  showIncidents?: boolean;
  className?: string;
  originCoords?: { lat: number; lng: number; label?: string };
  destCoords?: { lat: number; lng: number; label?: string };
  routePolylines?: Record<string, string>;
}

// Cyberpunk obsidian styling for Google Maps
const CYBER_DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0c0d12" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0c0d12" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f97316" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#111827" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4ade80" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e212b" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#14161f" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#b45309" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#78350f" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fed7aa" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e1e24" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#050914" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#050914" }]
  }
];

export const InteractiveMapCanvas: React.FC<InteractiveMapCanvasProps> = ({
  selectedRouteId = 'fastest',
  onRouteChange,
  transportMode = 'car',
  showSmartStops = true,
  showIncidents = true,
  className = '',
  originCoords = { lat: 12.9352, lng: 77.6245, label: 'START: Koramangala 80ft' },
  destCoords = { lat: 12.9784, lng: 77.6408, label: 'DEST: Indiranagar Hub' },
  routePolylines,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const polylinesRef = useRef<{ [key: string]: any }>({});
  const markersRef = useRef<any[]>([]);

  const [activeLayer, setActiveLayer] = useState<'all' | 'traffic' | 'stops' | 'incidents'>('all');
  const [mapTheme, setMapTheme] = useState<'cyber' | 'hybrid' | 'roadmap'>('cyber');
  const [selectedPointInfo, setSelectedPointInfo] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);

  // Real Bengaluru Corridor stops
  const SMART_STOPS: MapStop[] = [
    { id: 'ev-1', name: 'Ather Grid Fast DC', type: 'ev', lat: 12.9460, lng: 77.6310, info: '60kW DC Fast • 2/3 Available' },
    { id: 'ev-2', name: 'Tata Power EZ Charge', type: 'ev', lat: 12.9690, lng: 77.6380, info: '50kW CCS-2 • 1/2 Available' },
    { id: 'fuel-1', name: 'IndianOil Super', type: 'fuel', lat: 12.9396, lng: 77.6253, info: 'Petrol / Diesel / Air • Open 24/7' },
    { id: 'food-1', name: 'Third Wave Coffee', type: 'food', lat: 12.9550, lng: 77.6340, info: 'Drive-thru • Restroom Available' },
    { id: 'hosp-1', name: 'Manipal Hospital Point', type: 'hospital', lat: 12.9592, lng: 77.6501, info: 'Emergency 24x7 Facility' },
  ];

  // Real Incident telemetry
  const INCIDENTS: MapIncident[] = [
    { id: 'inc-1', type: 'pothole', title: 'Pothole Cluster (Lane 2)', lat: 12.9420, lng: 77.6280, severity: 'medium' },
    { id: 'inc-2', type: 'waterlog', title: 'Monsoon Water Puddle (15cm)', lat: 12.9510, lng: 77.6360, severity: 'high' },
    { id: 'inc-3', type: 'construction', title: 'Flyover Pillar Work', lat: 12.9650, lng: 77.6410, severity: 'low' },
  ];

  // Route paths between Koramangala and Indiranagar
  const ROUTE_COORDINATES: Record<string, { lat: number; lng: number }[]> = {
    fastest: [
      { lat: 12.9352, lng: 77.6245 },
      { lat: 12.9396, lng: 77.6253 },
      { lat: 12.9460, lng: 77.6310 },
      { lat: 12.9550, lng: 77.6360 },
      { lat: 12.9640, lng: 77.6390 },
      { lat: 12.9710, lng: 77.6405 },
      { lat: 12.9784, lng: 77.6408 },
    ],
    balanced: [
      { lat: 12.9352, lng: 77.6245 },
      { lat: 12.9320, lng: 77.6300 },
      { lat: 12.9430, lng: 77.6410 },
      { lat: 12.9530, lng: 77.6470 },
      { lat: 12.9680, lng: 77.6440 },
      { lat: 12.9784, lng: 77.6408 },
    ],
    'low-traffic': [
      { lat: 12.9352, lng: 77.6245 },
      { lat: 12.9290, lng: 77.6280 },
      { lat: 12.9380, lng: 77.6490 },
      { lat: 12.9592, lng: 77.6501 },
      { lat: 12.9730, lng: 77.6460 },
      { lat: 12.9784, lng: 77.6408 },
    ],
  };

  // 1. Load Google Maps JS API script dynamically
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    let fallbackTimer: number | undefined;
    let interval: number | undefined;

    if (DEMO_MODE) {
      setApiError(true);
      return;
    }

    window.gm_authFailure = () => {
      console.warn('Google Maps rejected the configured browser key. Showing OpenStreetMap fallback.');
      setApiError(true);
    };

    if (!apiKey) {
      console.warn('Google Maps is not configured. Set VITE_GOOGLE_MAPS_API_KEY in .env.');
      setApiError(true);
      return;
    }

    // Never leave the canvas stuck on the loading overlay when a browser key,
    // billing setting, or Google Maps request is unavailable.
    fallbackTimer = window.setTimeout(() => {
      if (!window.google?.maps) {
        console.warn('Google Maps did not initialize in time. Showing OpenStreetMap fallback.');
        setApiError(true);
      }
    }, 8000);

    if (window.google?.maps) {
      window.clearTimeout(fallbackTimer);
      initMap();
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.clearTimeout(fallbackTimer);
        initMap();
      };
      script.onerror = () => {
        window.clearTimeout(fallbackTimer);
        console.warn('Google Maps script failed to load. Using fallback.');
        setApiError(true);
      };
      document.head.appendChild(script);
    } else {
      interval = window.setInterval(() => {
        if (window.google?.maps) {
          window.clearInterval(interval);
          window.clearTimeout(fallbackTimer);
          initMap();
        }
      }, 100);
    }
    return () => {
      window.clearTimeout(fallbackTimer);
      if (interval) window.clearInterval(interval);
      window.gm_authFailure = undefined;
    };
  }, []);

  // 2. Initialize Google Map instance
  const initMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return;

    try {
      const center = {
        lat: (originCoords.lat + destCoords.lat) / 2,
        lng: (originCoords.lng + destCoords.lng) / 2,
      };

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 13,
        styles: mapTheme === 'cyber' ? CYBER_DARK_MAP_STYLE : undefined,
        mapTypeId: mapTheme === 'hybrid' ? 'hybrid' : 'roadmap',
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        backgroundColor: '#050508',
      });

      mapInstanceRef.current = map;
      trafficLayerRef.current = new window.google.maps.TrafficLayer();

      // Fit map to origin & destination
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(originCoords);
      bounds.extend(destCoords);
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });

      setMapLoaded(true);
      renderMapElements(map);
    } catch (e) {
      console.error('Google Map initialization error:', e);
      setApiError(true);
    }
  };

  // 3. Render Polylines, Markers, and Traffic Layer on Google Map
  const renderMapElements = (map: any) => {
    if (!map || !window.google?.maps) return;

    // Clear existing polylines & markers
    Object.values(polylinesRef.current).forEach((p) => p.setMap(null));
    polylinesRef.current = {};
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // --- Traffic Layer ---
    if (activeLayer === 'all' || activeLayer === 'traffic') {
      trafficLayerRef.current?.setMap(map);
    } else {
      trafficLayerRef.current?.setMap(null);
    }

    // --- Polylines for Routes ---
    const routeConfigs = [
      { id: 'fastest', color: '#f97316', weight: selectedRouteId === 'fastest' ? 6 : 3, opacity: selectedRouteId === 'fastest' ? 1.0 : 0.4 },
      { id: 'balanced', color: '#f59e0b', weight: selectedRouteId === 'balanced' ? 6 : 3, opacity: selectedRouteId === 'balanced' ? 1.0 : 0.4 },
      { id: 'low-traffic', color: '#ea580c', weight: selectedRouteId === 'low-traffic' ? 6 : 3, opacity: selectedRouteId === 'low-traffic' ? 1.0 : 0.4 },
    ];

    routeConfigs.forEach((cfg) => {
      const encodedPolyline = routePolylines?.[cfg.id];
      const coords = encodedPolyline && window.google.maps.geometry?.encoding
        ? window.google.maps.geometry.encoding.decodePath(encodedPolyline)
        : ROUTE_COORDINATES[cfg.id];
      if (coords) {
        const polyline = new window.google.maps.Polyline({
          path: coords,
          geodesic: true,
          strokeColor: cfg.color,
          strokeOpacity: cfg.opacity,
          strokeWeight: cfg.weight,
          zIndex: selectedRouteId === cfg.id ? 10 : 2,
        });

        polyline.addListener('click', () => {
          if (onRouteChange) onRouteChange(cfg.id);
        });

        polyline.setMap(map);
        polylinesRef.current[cfg.id] = polyline;
      }
    });

    // --- Origin Marker (Koramangala 80ft) ---
    const originMarker = new window.google.maps.Marker({
      position: originCoords,
      map,
      title: originCoords.label || 'Origin',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#f97316',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 25,
    });
    originMarker.addListener('click', () => setSelectedPointInfo(originCoords.label || 'Koramangala 80ft'));
    markersRef.current.push(originMarker);

    // --- Destination Marker (Indiranagar Hub) ---
    const destMarker = new window.google.maps.Marker({
      position: destCoords,
      map,
      title: destCoords.label || 'Destination',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#f59e0b',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3.5,
      },
      zIndex: 25,
    });
    destMarker.addListener('click', () => setSelectedPointInfo(destCoords.label || 'Indiranagar Hub'));
    markersRef.current.push(destMarker);

    // --- Smart Stops Markers ---
    if ((activeLayer === 'all' || activeLayer === 'stops') && showSmartStops) {
      SMART_STOPS.forEach((stop) => {
        const stopMarker = new window.google.maps.Marker({
          position: { lat: stop.lat, lng: stop.lng },
          map,
          title: stop.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: stop.type === 'ev' ? '#34d399' : stop.type === 'hospital' ? '#fb7185' : '#f59e0b',
            fillOpacity: 0.9,
            strokeColor: '#000000',
            strokeWeight: 2,
          },
          zIndex: 20,
        });
        stopMarker.addListener('click', () => {
          setSelectedPointInfo(`${stop.name}: ${stop.info}`);
        });
        markersRef.current.push(stopMarker);
      });
    }

    // --- Incidents Markers ---
    if ((activeLayer === 'all' || activeLayer === 'incidents') && showIncidents) {
      INCIDENTS.forEach((inc) => {
        const incMarker = new window.google.maps.Marker({
          position: { lat: inc.lat, lng: inc.lng },
          map,
          title: inc.title,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
          },
          zIndex: 22,
        });
        incMarker.addListener('click', () => {
          setSelectedPointInfo(`ALERT: ${inc.title} (${inc.severity} priority)`);
        });
        markersRef.current.push(incMarker);
      });
    }
  };

  // Re-render when activeLayer, selectedRouteId, or mapTheme changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Update theme
      if (mapTheme === 'cyber') {
        mapInstanceRef.current.setOptions({
          styles: CYBER_DARK_MAP_STYLE,
          mapTypeId: 'roadmap',
        });
      } else if (mapTheme === 'hybrid') {
        mapInstanceRef.current.setOptions({
          styles: undefined,
          mapTypeId: 'hybrid',
        });
      } else {
        mapInstanceRef.current.setOptions({
          styles: undefined,
          mapTypeId: 'roadmap',
        });
      }
      renderMapElements(mapInstanceRef.current);
    }
  }, [activeLayer, selectedRouteId, mapTheme, routePolylines, originCoords, destCoords]);

  // Zoom handlers for HUD buttons
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(originCoords);
      bounds.extend(destCoords);
      mapInstanceRef.current.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-black border border-orange-500/35 select-none ${className}`}>
      
      {/* 1. Provider map surface; demo mode uses the local OpenStreetMap route canvas. */}
      <div 
        ref={mapContainerRef} 
        className={`absolute inset-0 w-full h-full z-0 ${DEMO_MODE ? 'hidden' : ''}`} 
        style={{ minHeight: '380px' }}
      />

      {/* Fallback styling if script is loading or offline */}
      {!mapLoaded && !apiError && !DEMO_MODE && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-orange-400 font-mono text-xs gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <span>INITIALIZING REAL GOOGLE MAPS ENGINE...</span>
        </div>
      )}

      {apiError && (
        <>
          <OpenStreetMapFallback origin={originCoords} destination={destCoords} routePolylines={routePolylines} selectedRouteId={selectedRouteId} />
          <div className="absolute left-3 bottom-12 z-30 max-w-sm rounded-xl border border-amber-500/50 bg-black/85 px-3 py-2 text-[10px] font-mono text-amber-200 shadow-xl">
            {DEMO_MODE
              ? 'DISHA DEMO MAP • Simulated Bengaluru corridor • No external map credentials required'
              : 'Using the OpenStreetMap fallback because the live Google map is unavailable.'}
          </div>
        </>
      )}

      {/* Top Map Layer Selector Controls */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
            activeLayer === 'all'
              ? 'bg-orange-500 text-black font-bold shadow-md'
              : 'glass-hud floating-text-sub hover:text-white'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setActiveLayer('traffic')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
            activeLayer === 'traffic'
              ? 'bg-orange-500 text-black font-bold shadow-md'
              : 'glass-hud floating-text-sub hover:text-white'
          }`}
        >
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          Traffic Only
        </button>
        <button
          onClick={() => setActiveLayer('stops')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
            activeLayer === 'stops'
              ? 'bg-emerald-500 text-black font-bold shadow-md'
              : 'glass-hud floating-text-sub hover:text-white'
          }`}
        >
          Smart Stops (EV/Fuel)
        </button>
        <button
          onClick={() => setActiveLayer('incidents')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
            activeLayer === 'incidents'
              ? 'bg-rose-500 text-white font-bold shadow-md'
              : 'glass-hud floating-text-sub hover:text-white'
          }`}
        >
          Road Issues
        </button>

        {/* Map View Mode Toggle */}
        <button
          onClick={() => setMapTheme(prev => prev === 'cyber' ? 'hybrid' : prev === 'hybrid' ? 'roadmap' : 'cyber')}
          className="glass-hud px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300 hover:text-white border border-cyan-500/40 flex items-center gap-1 cursor-pointer"
          title="Toggle Map Style"
        >
          <Globe className="w-3 h-3" />
          <span className="uppercase">{mapTheme}</span>
        </button>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-7 h-7 rounded-lg glass-hud hover:border-orange-400 text-stone-200 text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-7 h-7 rounded-lg glass-hud hover:border-orange-400 text-stone-200 text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer"
        >
          −
        </button>
        <button
          onClick={handleRecenter}
          title="Recenter Route Corridor"
          className="w-7 h-7 rounded-lg glass-hud hover:border-orange-400 text-orange-300 text-xs font-mono flex items-center justify-center transition-all cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Origin & Destination Labels */}
      <div className="absolute top-[72%] left-[6%] z-20 pointer-events-none">
        <div className="glass-hud px-2.5 py-1 rounded-lg text-[10px] font-mono floating-text-orange border border-orange-500/50 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
          <strong>START:</strong> Koramangala 80ft
        </div>
      </div>

      <div className="absolute top-[20%] right-[6%] z-20 pointer-events-none">
        <div className="glass-hud px-2.5 py-1 rounded-lg text-[10px] font-mono text-amber-300 border border-amber-500/50 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <strong>DEST:</strong> Indiranagar Hub
        </div>
      </div>

      {/* Real-time Telemetry Overlay */}
      <div className="absolute top-12 left-3 z-20 pointer-events-none">
        <div className="glass-hud px-2 py-0.5 rounded text-[9px] font-mono text-orange-400/90 border border-orange-500/20">
          DISHA DEMO TELEMETRY • SIMULATED CORRIDOR
        </div>
      </div>

      {/* Selected Point Callout Bar */}
      {selectedPointInfo && (
        <div className="absolute bottom-3 left-3 right-3 z-30 glass-hud p-2.5 rounded-xl border border-orange-400 text-xs font-mono flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 shadow-2xl">
          <div className="flex items-center gap-2 text-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>{selectedPointInfo}</span>
          </div>
          <button
            onClick={() => setSelectedPointInfo(null)}
            className="text-stone-400 hover:text-white text-[11px] underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bottom Route Legend Bar */}
      <div className="absolute bottom-3 right-3 z-20 hidden sm:flex items-center gap-3 glass-hud px-3 py-1.5 rounded-xl text-[10px] font-mono floating-text-sub">
        <button 
          onClick={() => onRouteChange && onRouteChange('fastest')}
          className={`flex items-center gap-1.5 cursor-pointer hover:text-white ${selectedRouteId === 'fastest' ? 'text-orange-400 font-bold' : ''}`}
        >
          <span className="w-2.5 h-1 bg-orange-500 rounded-full" /> Fastest
        </button>
        <button 
          onClick={() => onRouteChange && onRouteChange('balanced')}
          className={`flex items-center gap-1.5 cursor-pointer hover:text-white ${selectedRouteId === 'balanced' ? 'text-amber-400 font-bold' : ''}`}
        >
          <span className="w-2.5 h-1 bg-amber-500 rounded-full" /> Balanced
        </button>
        <button 
          onClick={() => onRouteChange && onRouteChange('low-traffic')}
          className={`flex items-center gap-1.5 cursor-pointer hover:text-white ${selectedRouteId === 'low-traffic' ? 'text-orange-600 font-bold' : ''}`}
        >
          <span className="w-2.5 h-1 bg-orange-700 rounded-full" /> Low-Traffic
        </button>
      </div>

    </div>
  );
};
