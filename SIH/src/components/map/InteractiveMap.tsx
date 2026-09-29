import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationPoint, RouteOption, TrafficIncident, TrafficSegment } from '../../types';
import { CONGESTION_COLORS, ROUTE_PALETTE, TILE_PROVIDERS } from '../../config/constants';

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char));

interface InteractiveMapProps {
  center: [number, number];
  zoom: number;
  origin: LocationPoint | null;
  destination: LocationPoint | null;
  routes: RouteOption[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  onMapClickLocation: (point: LocationPoint, action: 'origin' | 'destination') => void;
  trafficSegments: TrafficSegment[];
  incidents: TrafficIncident[];
  showTrafficOverlay: boolean;
  showSpillbackZones: boolean;
  tileLayerKey: keyof typeof TILE_PROVIDERS;
  boundsPadding?: {
    topLeft?: [number, number];
    bottomRight?: [number, number];
  };
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center,
  zoom,
  origin,
  destination,
  routes,
  selectedRouteId,
  onSelectRoute,
  onMapClickLocation,
  trafficSegments,
  incidents,
  showTrafficOverlay,
  showSpillbackZones,
  tileLayerKey,
  boundsPadding,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups for clean updates
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const routeCasingLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const routesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const trafficLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const incidentsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const spillbackLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    const activeProvider = TILE_PROVIDERS[tileLayerKey] || TILE_PROVIDERS.osm;
    const tileLayer = L.tileLayer(activeProvider.url, {
      attribution: activeProvider.attribution,
      maxZoom: activeProvider.maxZoom,
      subdomains: (activeProvider as any).subdomains || 'abc',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Add layer groups to map
    trafficLayerRef.current.addTo(map);
    spillbackLayerRef.current.addTo(map);
    routeCasingLayerRef.current.addTo(map);
    routesLayerRef.current.addTo(map);
    incidentsLayerRef.current.addTo(map);
    markersLayerRef.current.addTo(map);

    // Map Click popup / handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-xs text-gray-800 font-sans';
      popupContent.innerHTML = `
        <div class="font-medium text-gray-900 mb-1">Dropped Pin</div>
        <div class="text-[11px] text-gray-500 mb-3 font-mono">${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
        <div class="flex gap-2">
          <button id="set-origin-btn" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm text-xs">
            Directions from here
          </button>
          <button id="set-dest-btn" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-md font-medium transition-colors text-xs">
            Directions to here
          </button>
        </div>
      `;

      L.popup({ closeButton: true, offset: [0, -8] })
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);

      setTimeout(() => {
        const originBtn = document.getElementById('set-origin-btn');
        const destBtn = document.getElementById('set-dest-btn');
        if (originBtn) {
          originBtn.onclick = () => {
            onMapClickLocation(
              {
                name: `Dropped Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                lat,
                lng,
                address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                category: 'custom',
              },
              'origin'
            );
            map.closePopup();
          };
        }
        if (destBtn) {
          destBtn.onclick = () => {
            onMapClickLocation(
              {
                name: `Dropped Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                lat,
                lng,
                address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                category: 'custom',
              },
              'destination'
            );
            map.closePopup();
          };
        }
      }, 50);
    });

    mapInstanceRef.current = map;

    // Handle container resizing to avoid blank/zero-height Leaflet tiles
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    const initialInvalidateTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      clearTimeout(initialInvalidateTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Replace the tile layer live when the user changes map style. Leaflet does
  // not recreate this layer automatically because the map itself is persistent.
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const provider = TILE_PROVIDERS[tileLayerKey] || TILE_PROVIDERS.osm;
    tileLayerRef.current?.remove();
    tileLayerRef.current = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      subdomains: (provider as any).subdomains || 'abc',
    }).addTo(mapInstanceRef.current);
  }, [tileLayerKey]);

  // Update center and zoom when changed externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  // 2. Update Tile Layer on switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const activeProvider = TILE_PROVIDERS[tileLayerKey] || TILE_PROVIDERS.osm;
    tileLayerRef.current.setUrl(activeProvider.url);
  }, [tileLayerKey]);

  // 3. Update Origin and Destination Markers (Authentic Google Maps Pin SVG)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    if (origin) {
      // Google Maps Origin blue dot
      const originIcon = L.divIcon({
        className: 'custom-origin-icon',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inline-flex h-7 w-7 rounded-full bg-blue-400 opacity-40 animate-ping"></span>
            <div class="relative w-5 h-5 rounded-full bg-blue-600 border-[3px] border-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([origin.lat, origin.lng], { icon: originIcon });
      marker.bindPopup(`
        <div class="p-1">
          <div class="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Starting Point</div>
          <div class="text-sm font-medium text-gray-900">${escapeHtml(origin.name)}</div>
          ${origin.address ? `<div class="text-xs text-gray-500">${escapeHtml(origin.address)}</div>` : ''}
        </div>
      `);
      markersLayerRef.current.addLayer(marker);
    }

    if (destination) {
      // Google Maps Red Teardrop Pin SVG
      const destIcon = L.divIcon({
        className: 'custom-dest-icon',
        html: `
          <div class="relative flex items-center justify-center -translate-y-4">
            <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]">
              <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 46 17 46C17 46 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#EA4335"/>
              <path d="M17 24C20.866 24 24 20.866 24 17C24 13.134 20.866 10 17 10C13.134 10 10 13.134 10 17C10 20.866 13.134 24 17 24Z" fill="#FFFFFF"/>
              <circle cx="17" cy="17" r="4.5" fill="#B31412" />
            </svg>
          </div>
        `,
        iconSize: [34, 46],
        iconAnchor: [17, 46],
      });

      const marker = L.marker([destination.lat, destination.lng], { icon: destIcon });
      marker.bindPopup(`
        <div class="p-1">
          <div class="text-[10px] font-bold text-red-600 uppercase tracking-wider">Destination</div>
          <div class="text-sm font-medium text-gray-900">${escapeHtml(destination.name)}</div>
          ${destination.address ? `<div class="text-xs text-gray-500">${escapeHtml(destination.address)}</div>` : ''}
        </div>
      `);
      markersLayerRef.current.addLayer(marker);
    }
  }, [origin, destination]);

  // 4. Update Route Polylines (Google Maps navigation styling with outer casing)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    routeCasingLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();

    if (!routes || routes.length === 0) return;

    const bounds = L.latLngBounds([]);

    // Sort so unselected routes draw underneath, selected draws on top
    const sortedRoutes = [...routes].sort((a, b) => {
      if (a.id === selectedRouteId) return 1;
      if (b.id === selectedRouteId) return -1;
      return 0;
    });

    sortedRoutes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      const isDisha = route.isDishaRecommended;

      // Google Maps Colors
      const coreColor = isSelected ? '#1a73e8' : '#70757a';
      const casingColor = isSelected ? '#0d47a1' : '#5f6368';

      // 1. Dark outer casing for Google Maps elevation look
      const casing = L.polyline(route.coordinates, {
        color: casingColor,
        weight: isSelected ? 8 : 6,
        opacity: isSelected ? 0.9 : 0.4,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeCasingLayerRef.current.addLayer(casing);

      // 2. Vibrant inner line
      const polyline = L.polyline(route.coordinates, {
        color: coreColor,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 1 : 0.7,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.on('click', () => {
        onSelectRoute(route.id);
      });

      polyline.bindTooltip(
        `<div class="text-xs font-sans">
          <strong>${escapeHtml(route.name)}</strong><br/>
          <span class="text-blue-600 font-semibold">${route.durationMin} min</span> (${route.distanceKm} km)<br/>
          ${isDisha ? '<span class="text-xs text-green-700 font-medium">DISHA Smart Recommended</span>' : ''}
        </div>`,
        { sticky: true }
      );

      routesLayerRef.current.addLayer(polyline);

      // Extend bounds
      route.coordinates.forEach((coord) => bounds.extend(coord));
    });

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: boundsPadding?.topLeft || [80, 420], // offset for left floating Google Maps card
        paddingBottomRight: boundsPadding?.bottomRight || [60, 60],
        maxZoom: 14,
        animate: true,
      });
    }
  }, [routes, selectedRouteId, boundsPadding]);

  // 5. Update Traffic Layer (Google Maps live road traffic styling)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    trafficLayerRef.current.clearLayers();

    if (!showTrafficOverlay) return;

    trafficSegments.forEach((segment) => {
      const color = CONGESTION_COLORS[segment.level];
      const polyline = L.polyline(segment.coordinates, {
        color,
        weight: 4.5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.bindTooltip(`
        <div class="text-xs font-sans">
          <div class="font-semibold text-gray-900">${escapeHtml(segment.name)}</div>
          <div>Traffic: <strong style="color: ${color}">${segment.level.toUpperCase()}</strong> (${segment.congestionPercent}%)</div>
          <div class="text-[11px] text-gray-600">Speed: ${segment.currentSpeedKmh} km/h (Limit: ${segment.freeFlowSpeedKmh} km/h)</div>
          <div class="text-[10px] text-gray-400 mt-1">DISHA Traffic Data</div>
        </div>
      `);

      trafficLayerRef.current.addLayer(polyline);
    });
  }, [trafficSegments, showTrafficOverlay]);

  // 6. Update Incidents & Spillback Chokepoints
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    incidentsLayerRef.current.clearLayers();
    spillbackLayerRef.current.clearLayers();

    incidents.forEach((inc) => {
      const icon = L.divIcon({
        className: 'incident-icon',
        html: `
          <div class="relative flex items-center justify-center w-6 h-6">
            <div class="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">
              !
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(inc.location, { icon });
      marker.bindPopup(`
        <div class="p-1 font-sans">
          <div class="text-xs font-bold text-red-600 uppercase">${escapeHtml(inc.title)}</div>
          <div class="text-xs text-gray-700 mt-1">${escapeHtml(inc.description)}</div>
          <div class="text-[11px] text-gray-500 mt-2 font-mono">+${inc.impactDelayMin} min delay · ${inc.timestamp}</div>
        </div>
      `);
      incidentsLayerRef.current.addLayer(marker);
    });

    if (showSpillbackZones) {
      // Add simulated spillback danger circles around Silk Board and central choke zones
      const chokePoints: [number, number, number][] = [
        [12.9176, 77.6238, 700], // Silk Board
        [12.9352, 77.6245, 450], // Sony World
        [12.9550, 77.6200, 400], // Hosur road convergence
      ];

      chokePoints.forEach(([lat, lng, radius]) => {
        const circle = L.circle([lat, lng], {
          radius,
          color: '#d93025',
          fillColor: '#d93025',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5',
        });
        circle.bindTooltip(`
          <div class="text-xs font-sans">
            <strong class="text-red-600">Spillback Critical Choke Zone</strong><br/>
            Queue Backlog Risk: HIGH<br/>
            Shockwave propagation active under high vehicle inflow.
          </div>
        `);
        spillbackLayerRef.current.addLayer(circle);
      });
    }
  }, [incidents, showSpillbackZones]);

  return <div ref={mapContainerRef} className="w-full h-full relative z-0" />;
};
