import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Car,
  Bike,
  Sparkles,
  ArrowUpDown,
  X,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Send,
  Leaf,
  Navigation,
  Info,
  Bookmark,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { LocationPoint, RouteOption, SavedPlace } from '../../types';
import { searchLocations, getCurrentUserLocation } from '../../services/maps/geocoding';

interface DirectionsPanelProps {
  origin: LocationPoint | null;
  destination: LocationPoint | null;
  onSetOrigin: (point: LocationPoint | null) => void;
  onSetDestination: (point: LocationPoint | null) => void;
  onSwapPoints: () => void;
  onPlanRoute: () => void;
  routes: RouteOption[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  isLoadingRoutes: boolean;
  savedPlaces: SavedPlace[];
  onOpenWhyDisha: () => void;
  onOpenQpso: () => void;
  onOpenSpillback: () => void;
  onCloseDirections: () => void;
}

interface NavigationStep {
  instruction: string;
  distanceKm: number;
  roadName: string;
}

const distanceBetween = (a: [number, number], b: [number, number]) => {
  const lat = ((b[0] - a[0]) * 111);
  const lng = ((b[1] - a[1]) * 111 * Math.cos((a[0] * Math.PI) / 180));
  return Math.max(0.1, Math.sqrt(lat * lat + lng * lng));
};

const bearingBetween = (a: [number, number], b: [number, number]) => {
  const y = Math.sin((b[1] - a[1]) * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180);
  const x = Math.cos(a[0] * Math.PI / 180) * Math.sin(b[0] * Math.PI / 180) -
    Math.sin(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.cos((b[1] - a[1]) * Math.PI / 180);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
};

const turnPhrase = (previous: number, next: number) => {
  const delta = ((next - previous + 540) % 360) - 180;
  if (Math.abs(delta) < 25) return 'Continue';
  if (Math.abs(delta) > 145) return 'Make a U-turn';
  return delta > 0 ? 'Turn right' : 'Turn left';
};

const buildNavigationSteps = (route: RouteOption, destination: LocationPoint | null): NavigationStep[] => {
  const points = route.coordinates.length > 1 ? route.coordinates : [];
  if (!points.length) return [];
  const roadNames = route.segments.length
    ? route.segments.map((segment) => segment.roadName)
    : [route.name.split('—')[1]?.trim() || 'the main road'];
  const steps: NavigationStep[] = [{
    instruction: `Head toward ${roadNames[0]}`,
    distanceKm: distanceBetween(points[0], points[1]),
    roadName: roadNames[0],
  }];
  for (let index = 1; index < points.length - 1; index += 1) {
    const previousBearing = bearingBetween(points[index - 1], points[index]);
    const nextBearing = bearingBetween(points[index], points[index + 1]);
    const roadName = roadNames[Math.min(index, roadNames.length - 1)];
    steps.push({
      instruction: `${turnPhrase(previousBearing, nextBearing)} onto ${roadName}`,
      distanceKm: distanceBetween(points[index], points[index + 1]),
      roadName,
    });
  }
  steps.push({
    instruction: `Arrive at ${destination?.name || 'your destination'}`,
    distanceKm: 0,
    roadName: destination?.name || 'Destination',
  });
  return steps;
};

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  origin,
  destination,
  onSetOrigin,
  onSetDestination,
  onSwapPoints,
  onPlanRoute,
  routes,
  selectedRouteId,
  onSelectRoute,
  isLoadingRoutes,
  savedPlaces,
  onOpenWhyDisha,
  onOpenQpso,
  onOpenSpillback,
  onCloseDirections,
}) => {
  const [activeInput, setActiveInput] = useState<'origin' | 'dest' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationPoint[]>([]);
  const [transportMode, setTransportMode] = useState<'drive' | 'qpso' | 'transit' | 'walk' | 'bike'>('qpso');
  const [isLocating, setIsLocating] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!activeInput) {
      setSuggestions([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSuggestions(results);
    }, 120);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, activeInput]);

  const handleSelectSuggestion = (point: LocationPoint) => {
    if (activeInput === 'origin') {
      onSetOrigin(point);
    } else {
      onSetDestination(point);
    }
    setActiveInput(null);
    setSearchQuery('');
  };

  const handleUseCurrentLocation = async (field: 'origin' | 'dest') => {
    try {
      setIsLocating(true);
      const loc = await getCurrentUserLocation();
      if (field === 'origin') onSetOrigin(loc);
      else onSetDestination(loc);
      setActiveInput(null);
    } catch (err: any) {
      alert(err.message || 'Unable to retrieve location.');
    } finally {
      setIsLocating(false);
    }
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const navigationSteps = useMemo(
    () => selectedRoute ? buildNavigationSteps(selectedRoute, destination) : [],
    [selectedRoute, destination],
  );

  const speakCurrentInstruction = (stepIndex: number) => {
    if (!voiceEnabled || !('speechSynthesis' in window) || !navigationSteps[stepIndex]) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(navigationSteps[stepIndex].instruction);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!navigationStarted || !selectedRoute || navigationSteps.length === 0) return;
    setCurrentStepIndex(0);
    speakCurrentInstruction(0);

    let watchId: number | undefined;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const nearestPointIndex = selectedRoute.coordinates.reduce((closest, point, index) => {
          const distance = Math.hypot(position.coords.latitude - point[0], position.coords.longitude - point[1]);
          const closestDistance = Math.hypot(position.coords.latitude - selectedRoute.coordinates[closest][0], position.coords.longitude - selectedRoute.coordinates[closest][1]);
          return distance < closestDistance ? index : closest;
        }, 0);
        setCurrentStepIndex(Math.min(Math.max(nearestPointIndex, 0), navigationSteps.length - 1));
      }, () => undefined, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 });
    }

    // If location permission is unavailable, keep the voice/list experience usable with a gentle progress fallback.
    const fallbackTimer = window.setInterval(() => {
      setCurrentStepIndex((current) => Math.min(current + 1, navigationSteps.length - 1));
    }, 12000);

    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
      window.clearInterval(fallbackTimer);
      window.speechSynthesis?.cancel();
    };
  }, [navigationStarted, selectedRoute?.id]);

  useEffect(() => {
    if (navigationStarted && currentStepIndex > 0) speakCurrentInstruction(currentStepIndex);
  }, [currentStepIndex, voiceEnabled]);

  const openNavigation = () => {
    if (!origin || !destination) return;
    setCurrentStepIndex(0);
    setNavigationStarted(true);
    setShowSteps(true);
  };

  return (
    <div className="w-[410px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-24px)] bg-white rounded-xl shadow-[0_3px_14px_rgba(0,0,0,0.28)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200 z-30 font-sans">
      {/* Top Header: Transport Mode Bar + Close */}
      <div className="bg-white border-b border-gray-200 px-3.5 pt-2.5 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTransportMode('qpso')}
              title="DISHA Smart Routing"
              className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
                transportMode === 'qpso'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-100" />
              <span className="text-xs font-medium">Smart</span>
            </button>

            <button
              onClick={() => setTransportMode('drive')}
              title="Driving"
              className={`p-2 rounded-full transition-colors ${
                transportMode === 'drive'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Car className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTransportMode('bike')}
              title="Cycling"
              className={`p-2 rounded-full transition-colors ${
                transportMode === 'bike'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bike className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onCloseDirections}
            title="Close directions"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Origin and Destination Input Slots (Google Maps aesthetic) */}
        <div className="relative mt-2.5 flex items-center">
          {/* Vertical icons connector */}
          <div className="flex flex-col items-center justify-between w-6 h-14 py-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />
            <div className="w-0.5 h-6 bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-red-600" />
          </div>

          {/* Inputs container */}
          <div className="flex-1 flex flex-col gap-1.5 ml-2 mr-1">
            {/* Origin Input (FROM) */}
            <div className="relative flex items-center">
              <span className="absolute left-2 text-[10px] font-bold text-blue-600 uppercase pointer-events-none tracking-wider">
                FROM
              </span>
              <input
                type="text"
                value={activeInput === 'origin' ? searchQuery : origin?.name || ''}
                placeholder="Current location or starting point..."
                onFocus={() => {
                  setActiveInput('origin');
                  setSearchQuery(origin?.name || '');
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f1f3f4] hover:bg-[#e8eaed] focus:bg-white text-gray-900 border border-transparent focus:border-blue-500 rounded-md pl-12 pr-6 py-2 text-xs focus:outline-none transition-colors"
              />
              {origin && activeInput !== 'origin' && (
                <button
                  onClick={() => onSetOrigin(null)}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                  title="Clear starting point"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Destination Input (TO) */}
            <div className="relative flex items-center">
              <span className="absolute left-2 text-[10px] font-bold text-red-600 uppercase pointer-events-none tracking-wider">
                TO
              </span>
              <input
                type="text"
                value={activeInput === 'dest' ? searchQuery : destination?.name || ''}
                placeholder="Search destination..."
                onFocus={() => {
                  setActiveInput('dest');
                  setSearchQuery(destination?.name || '');
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f1f3f4] hover:bg-[#e8eaed] focus:bg-white text-gray-900 border border-transparent focus:border-blue-500 rounded-md pl-8 pr-6 py-2 text-xs focus:outline-none transition-colors"
              />
              {destination && activeInput !== 'dest' && (
                <button
                  onClick={() => onSetDestination(null)}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                  title="Clear destination"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Reverse swap button */}
          <button
            onClick={onSwapPoints}
            title="Reverse starting point and destination"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all active:rotate-180"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Location Shortcuts */}
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100 overflow-x-auto scrollbar-none text-[11px]">
          <button
            onClick={() => handleUseCurrentLocation('origin')}
            disabled={isLocating}
            className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium flex items-center gap-1 shrink-0"
          >
            <Navigation className="w-2.5 h-2.5" />
            <span>{isLocating ? 'Locating...' : 'Your location'}</span>
          </button>

          {savedPlaces.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                if (!origin) onSetOrigin(p.location);
                else onSetDestination(p.location);
              }}
              className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Plan Journey Action Bar */}
        <div className="pt-2 px-1">
          <button
            onClick={onPlanRoute}
            className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1769d1] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 rotate-45 fill-current" />
            <span>Plan Journey & Compare Routes</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Suggestions drop when focused on an input */}
      {activeInput && suggestions.length > 0 && (
        <div className="p-2 bg-gray-50 border-b border-gray-200 max-h-56 overflow-y-auto divide-y divide-gray-100">
          <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium px-2 py-1">
            <span>Choose {activeInput === 'origin' ? 'Origin' : 'Destination'}</span>
            <button onClick={() => setActiveInput(null)} className="hover:text-gray-800">
              Done
            </button>
          </div>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(item)}
              className="p-2 hover:bg-white rounded cursor-pointer text-xs group"
            >
              <div className="font-medium text-gray-800 group-hover:text-blue-600 truncate">
                {item.name}
              </div>
              {item.address && (
                <div className="text-[11px] text-gray-500 truncate">{item.address}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast feedback */}
      {savedToast && (
        <div className="mx-2 mt-2 p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center justify-between animate-in fade-in duration-200">
          <span className="font-medium">{savedToast}</span>
          <button onClick={() => setSavedToast(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Route Cards Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2.5 space-y-2">
        <div className="flex items-center justify-between px-1 text-[10px] text-gray-500 font-medium">
          <span className="font-semibold uppercase tracking-wider text-gray-600">Suggested routes</span>
          <span className="text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">Updated now</span>
        </div>

        {isLoadingRoutes && (
          <div className="py-8 text-center text-gray-500 space-y-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs font-medium text-gray-700">Calculating Optimal Routes...</div>
            <div className="text-[11px] text-gray-400">Analyzing real-time & predictive traffic models</div>
          </div>
        )}

        {!isLoadingRoutes && routes.length === 0 && (
          <div className="py-8 text-center text-gray-500 space-y-1 px-4">
            <Car className="w-7 h-7 mx-auto text-gray-400" />
            <div className="text-xs font-medium text-gray-700">No route selected</div>
            <div className="text-[11px] text-gray-400">
              Enter origin and destination to compare live routes with predictive traffic bypasses.
            </div>
          </div>
        )}

        {/* Route Cards (Section 13) */}
        {!isLoadingRoutes &&
          routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isDisha = route.isDishaRecommended;

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? isDisha
                      ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/20'
                      : 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-500/20'
                    : 'border-gray-200 bg-white/70 hover:bg-white opacity-85 hover:opacity-100 hover:border-gray-300'
                }`}
              >
                {/* Duration & Distance Row */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xl font-bold font-sans tracking-tight ${
                        isDisha
                          ? 'text-[#188038]' // Google green
                          : route.predictedCongestionPercent > 65
                          ? 'text-[#d93025]' // Google red
                          : 'text-gray-800'
                      }`}
                    >
                      {route.durationMin} min
                    </span>
                    <span className="text-xs text-gray-500 font-medium">({route.distanceKm} km)</span>
                  </div>

                  {isDisha && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      DISHA SMART ROUTE
                    </span>
                  )}
                  {!isDisha && (
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      {route.tag}
                    </span>
                  )}
                </div>

                {/* Road Name */}
                <div className="text-xs text-gray-700 font-medium mt-0.5 truncate">{route.name}</div>

                {/* Explicit Congestion & Spillback Metrics (Section 13) */}
                <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-3 gap-1 text-[11px] text-center">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-[10px] text-gray-400 uppercase">Current</div>
                    <div className="font-semibold text-gray-800">{route.currentCongestionPercent}%</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-[10px] text-gray-400 uppercase">Predicted</div>
                    <div className={`font-semibold ${route.predictedCongestionPercent > 60 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {route.predictedCongestionPercent}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-[10px] text-gray-400 uppercase">Spillback</div>
                    <div className={`font-bold ${route.spillbackRisk === 'high' ? 'text-red-600' : route.spillbackRisk === 'medium' ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {route.spillbackRisk.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Section 15: Dedicated Route Summary & Action Buttons */}
                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-gray-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-gray-500 font-medium">
                        {isDisha ? '⚡ Lowest future bottleneck risk' : 'Selected corridor'}
                      </span>
                      <span className="text-[10px] text-gray-400">Route details</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openNavigation();
                        }}
                        className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer ${
                          navigationStarted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Navigation className="w-3.5 h-3.5 fill-current rotate-45" />
                        <span>{navigationStarted ? 'Navigation active' : 'Start Navigation'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Save route to localStorage
                          const savedList = JSON.parse(localStorage.getItem('disha_saved_routes') || '[]');
                          savedList.push({
                            id: 'saved-' + Date.now(),
                            name: route.name,
                            durationMin: route.durationMin,
                            distanceKm: route.distanceKm,
                            savedAt: new Date().toLocaleTimeString(),
                          });
                          localStorage.setItem('disha_saved_routes', JSON.stringify(savedList));
                          setSavedToast(`Route saved: ${route.name.split('—')[0]}`);
                          setTimeout(() => setSavedToast(null), 3000);
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs text-gray-700 font-medium flex items-center justify-center gap-1 cursor-pointer"
                        title="Save Route"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                        <span>Save</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenWhyDisha();
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs text-gray-700 font-medium flex items-center justify-center gap-1 cursor-pointer"
                        title="View Analysis"
                      >
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Analysis</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSteps((p) => !p);
                      }}
                      className="text-[11px] text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1 pt-1"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSteps ? 'rotate-90' : ''}`} />
                      <span>{showSteps ? 'Hide Step Directions' : 'View Turn-by-Turn Steps'}</span>
                    </button>
                  </div>
                )}

                {/* Step-by-step turn details preview */}
                {isSelected && showSteps && (
                  <div className="mt-3 pt-2 border-t border-gray-200 space-y-2 text-xs">
                    <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Turn-by-turn guidance</span>
                      <span className="text-[10px] text-blue-600 font-mono">DISHA Adaptive</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {navigationSteps.map((step, index) => (
                        <div key={`${step.roadName}-${index}`} className={`flex items-start gap-2 text-gray-700 rounded-md px-1.5 py-1 ${index === currentStepIndex ? 'bg-blue-50' : ''}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${index === navigationSteps.length - 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-600'}`}>
                            {index === navigationSteps.length - 1 ? '✓' : index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{step.instruction}</p>
                            <p className="text-[11px] text-gray-500">{step.distanceKm > 0 ? `Continue for ${step.distanceKm.toFixed(1)} km` : 'You have arrived'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Google Maps Active Navigation Top Overlay HUD when navigation started */}
      {navigationStarted && selectedRoute && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#188038] text-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-4 min-w-[340px] max-w-[92vw] border border-emerald-500/50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Navigation className="w-6 h-6 fill-current -rotate-45" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-emerald-100 font-medium">{navigationSteps[currentStepIndex]?.distanceKm ? `In ${Math.round(navigationSteps[currentStepIndex].distanceKm * 1000)} m` : 'Arriving now'}</div>
            <div className="text-base font-bold truncate">{navigationSteps[currentStepIndex]?.instruction || 'Continue to your destination'}</div>
            <div className="text-[11px] text-emerald-200 flex items-center gap-2 mt-0.5">
              <span>{selectedRoute.durationMin} min</span>
              <span>·</span>
              <span>{selectedRoute.distanceKm} km</span>
            </div>
          </div>
          <button
            onClick={() => setVoiceEnabled((enabled) => !enabled)}
            className="p-2 text-white/90 hover:text-white hover:bg-white/20 rounded-full"
            title={voiceEnabled ? 'Mute voice guidance' : 'Enable voice guidance'}
            aria-label={voiceEnabled ? 'Mute voice guidance' : 'Enable voice guidance'}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setNavigationStarted(false)}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            title="Exit Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Bottom Shortcuts Bar */}
      <div className="p-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
        <button
          onClick={onOpenQpso}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Route Analysis</span>
        </button>

        <span className="text-gray-300">|</span>

        <button
          onClick={onOpenSpillback}
          className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Congestion Simulator</span>
        </button>
      </div>
    </div>
  );
};
