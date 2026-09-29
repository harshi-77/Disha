import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  Bookmark, 
  Check, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Car,
  Bike,
  Bus,
  Footprints,
  Compass,
  Zap
} from 'lucide-react';
import { ROUTE_OPTIONS, RouteOption } from '../data/mobilityData';
import { IMAGES } from '../constants/images';
import { saveRouteToFirestore, auth } from '../lib/firebase';
import { geocodeAddress, planRoute } from '../lib/api';
import { InteractiveMapCanvas } from './InteractiveMapCanvas';
import { DEMO_MODE } from '../lib/demo';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRouteId?: string;
  initialOrigin?: string;
  initialDestination?: string;
  initialMode?: string;
  initialPreferences?: string[];
}

const POPULAR_LOCATIONS = [
  'Koramangala 80ft Road, Bengaluru',
  'Indiranagar 100ft Road, Bengaluru',
  'Electronic City Phase 1, Bengaluru',
  'Whitefield ITPL Main Road, Bengaluru',
  'Hebbal Flyover Junction, Bengaluru',
  'Kempegowda International Airport (BLR)',
  'HSR Layout Sector 1, Bengaluru',
  'MG Road Metro Station, Bengaluru',
  'Marathahalli Bridge, Bengaluru',
  'Jayanagar 4th Block, Bengaluru',
  'Bannerghatta Road, Bengaluru',
];

export const RoutePlannerModal: React.FC<RoutePlannerModalProps> = ({
  isOpen,
  onClose,
  initialRouteId = 'fastest',
  initialOrigin,
  initialDestination,
  initialMode = 'car',
  initialPreferences = ['fastest'],
}) => {
  const [origin, setOrigin] = useState<string>(initialOrigin || POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState<string>(initialDestination || POPULAR_LOCATIONS[1]);
  const [transportMode, setTransportMode] = useState<string>(initialMode);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRouteId);
  const [avoidTolls, setAvoidTolls] = useState<boolean>(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(initialPreferences);
  
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navStep, setNavStep] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [calculatedRoutes, setCalculatedRoutes] = useState<Record<string, RouteOption> | null>(null);
  const [routePolylines, setRoutePolylines] = useState<Record<string, string>>({});
  const [originCoords, setOriginCoords] = useState({ lat: 12.9352, lng: 77.6245, label: 'START' });
  const [destCoords, setDestCoords] = useState({ lat: 12.9784, lng: 77.6408, label: 'DESTINATION' });

  if (!isOpen) return null;

  const routeOptions = calculatedRoutes || ROUTE_OPTIONS;
  const activeRoute: RouteOption = routeOptions[selectedRouteId] || routeOptions.fastest || Object.values(routeOptions)[0];

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setIsNavigating(false);
    setSavedSuccess(false);
    setCalculationError(null);
    try {
      const [originResult, destinationResult] = await Promise.all([
        geocodeAddress(origin),
        geocodeAddress(destination),
      ]);
      if (!originResult || !destinationResult) {
        throw new Error('The selected locations could not be found.');
      }

      const routes = await planRoute(
        originResult.lat,
        originResult.lng,
        destinationResult.lat,
        destinationResult.lng,
        transportMode,
        avoidTolls,
      );
      if (!routes.length) {
        throw new Error('No route options were returned. Please try another demo location pair.');
      }

      const routeIds = ['fastest', 'balanced', 'low-traffic'] as const;
      const longestDuration = Math.max(...routes.map((route: any) => route.duration_min || 0));
      const nextRoutes = Object.fromEntries(routes.map((route: any, index: number) => {
        const id = routeIds[index] || `route-${index}`;
        return [id, {
          id,
          name: route.name || `ROUTE ${index + 1}`,
          durationMin: Math.round(route.duration_in_traffic_min || route.duration_min),
          distanceKm: route.distance_km,
          savingsMin: Math.max(0, Math.round(longestDuration - (route.duration_in_traffic_min || route.duration_min))),
          congestionLevel: route.congestion_level || 'moderate',
          fuelCostInr: route.estimated_fuel_cost_inr ?? 0,
          co2Kg: route.estimated_co2_kg ?? 0,
          roadQualityScore: 0,
          description: route.summary || 'Live route calculation',
          via: route.summary || (DEMO_MODE ? 'DISHA Demo Network' : 'Live route provider'),
          incidentsCount: 0,
          coordinatesSummary: route.summary || '',
          segments: [{ name: route.summary || 'Route in progress', status: route.congestion_level || 'moderate', speedKmph: 0, distanceKm: route.distance_km }],
        } satisfies RouteOption];
      }));

      setCalculatedRoutes(nextRoutes);
      setRoutePolylines(Object.fromEntries(routes
        .map((route: any, index: number): [string, string | undefined] => [routeIds[index] || `route-${index}`, route.polyline])
        .filter((entry: [string, string | undefined]): entry is [string, string] => Boolean(entry[1]))));
      setSelectedRouteId(routeIds[0]);
      setOriginCoords({ lat: originResult.lat, lng: originResult.lng, label: originResult.formatted_address || origin });
      setDestCoords({ lat: destinationResult.lat, lng: destinationResult.lng, label: destinationResult.formatted_address || destination });
      setShowResults(true);
    } catch (error) {
      console.error('Route calculation failed:', error);
      setCalculationError(error instanceof Error ? error.message : 'Route calculation failed.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setNavStep(0);
  };

  const handleSaveToCloud = async () => {
    if (!auth.currentUser && !DEMO_MODE) {
      alert('Please sign in to save routes to your cloud profile.');
      return;
    }
    setIsSaving(true);
    try {
      await saveRouteToFirestore({
        origin,
        destination,
        routeId: selectedRouteId,
        durationMin: activeRoute.durationMin,
        distanceKm: activeRoute.distanceKm,
        savingsMin: activeRoute.savingsMin,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save route to cloud', e);
      alert('Could not save route. Please ensure you are signed in.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-stone-950/95 border-b border-orange-950 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-orange-500/50 shadow-md">
              <img src={IMAGES.iconNavArrow} alt="Navigation" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold floating-text-primary flex items-center gap-2">
                DISHA Intelligent Route Canvas
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 border border-orange-800 px-2 py-0.5 rounded">
                  LIVE SENSORS & SATELLITE
                </span>
              </h2>
              <p className="text-xs floating-text-sub font-mono">
                Multi-objective route arbitration • Pothole avoidance • Real-time traffic shockwave prediction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
          
          {/* Left Column: Form & Preferences (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Origin & Destination Card */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-orange-950 space-y-3">
              <div>
                <label className="block text-[11px] font-mono floating-text-orange uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Origin Location
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-black border border-orange-950 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
                >
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="px-2.5 py-0.5 rounded-md bg-stone-900 border border-orange-950 text-[10px] font-mono text-stone-400 hover:text-orange-300 transition-colors cursor-pointer"
                >
                  ⇅ Swap Origin & Destination
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono floating-text-orange uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Destination Point
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-black border border-orange-950 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
                >
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transport Modes */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-orange-950">
              <label className="block text-[11px] font-mono floating-text-muted uppercase tracking-wider mb-2">
                Transport Mode
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'car', icon: Car, label: 'Car' },
                  { id: 'bike', icon: Bike, label: 'Bike' },
                  { id: 'transit', icon: Bus, label: 'Transit' },
                  { id: 'walking', icon: Footprints, label: 'Walk' },
                  { id: 'cycling', icon: Compass, label: 'Cycle' },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = transportMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTransportMode(mode.id)}
                      className={`p-2 rounded-xl border text-[11px] font-mono transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-orange-500 text-black font-bold border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                          : 'bg-black border-orange-950 text-stone-400 hover:text-stone-200 hover:border-orange-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Journey Preferences Pills */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-orange-950">
              <label className="block text-[11px] font-mono floating-text-muted uppercase tracking-wider mb-2">
                Journey Preferences
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'fastest', label: '⚡ Fastest' },
                  { id: 'safest', label: '🛡️ Safest' },
                  { id: 'cheapest', label: '💰 Cheapest' },
                  { id: 'eco', label: '🌱 Eco-friendly' },
                  { id: 'less-traffic', label: '🚦 Less traffic' },
                  { id: 'better-roads', label: '🛣️ Better roads' },
                ].map((pref) => {
                  const isChecked = selectedPreferences.includes(pref.id);
                  return (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => togglePreference(pref.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-orange-950/90 border-orange-400 text-orange-200 font-bold'
                          : 'bg-black border-orange-950 text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      {pref.label}
                    </button>
                  );
                })}
              </div>

              {/* Avoid Tolls Checkbox */}
              <div className="mt-3 pt-2.5 border-t border-orange-950/80 flex items-center justify-between">
                <label className="text-xs font-mono floating-text-sub cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={avoidTolls}
                    onChange={(e) => setAvoidTolls(e.target.checked)}
                    className="accent-orange-500 rounded cursor-pointer"
                  />
                  <span>Avoid Toll Roads (₹0 Cost Priority)</span>
                </label>
              </div>
            </div>

            {/* Recalculate Button */}
            <button
              type="button"
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-black font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{isCalculating ? 'Calculating live route...' : 'Calculate Live Route'}</span>
            </button>
            {calculationError && <p className="text-xs font-mono text-rose-300">{calculationError}</p>}

            {/* Alternative Routes Selector */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-orange-950">
              <div className="text-[11px] font-mono floating-text-muted uppercase tracking-wider mb-2">
                Alternative Routes Comparison
              </div>
              <div className="space-y-2">
                {Object.values(routeOptions).map((alt) => {
                  const isSelected = selectedRouteId === alt.id;
                  return (
                    <div
                      key={alt.id}
                      onClick={() => setSelectedRouteId(alt.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-mono ${
                        isSelected
                          ? 'bg-orange-500/20 border-orange-400 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                          : 'bg-black/60 border-orange-950 text-stone-400 hover:border-orange-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">{alt.name}</div>
                        <div className="text-[10px] text-stone-400">{alt.distanceKm} km • {alt.congestionLevel} traffic</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        isSelected ? 'bg-orange-500 text-black' : 'bg-stone-900 text-stone-300'
                      }`}>
                        {alt.durationMin}m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Map & Deep Route Intelligence (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* 1. Interactive Satellite Map with Waypoints & Incidents */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl border border-orange-500/35">
              <InteractiveMapCanvas
                selectedRouteId={selectedRouteId}
                onRouteChange={(routeId) => setSelectedRouteId(routeId)}
                transportMode={transportMode}
                originCoords={originCoords}
                destCoords={destCoords}
                routePolylines={routePolylines}
                className="w-full h-full"
              />
            </div>

            {/* 2. Route Metrics Dashboard */}
            <div className="p-4 rounded-2xl bg-black/90 border border-orange-950">
              <div className="flex items-start justify-between pb-3 border-b border-orange-950/80">
                <div>
                  <span className="font-mono text-[11px] font-bold floating-text-orange uppercase">
                    ACTIVE TRAJECTORY: {activeRoute.name}
                  </span>
                  <h3 className="font-display text-2xl font-bold floating-text-primary mt-0.5">
                    {activeRoute.durationMin} MIN • {activeRoute.distanceKm} KM
                  </h3>
                  <p className="text-xs font-mono floating-text-sub mt-0.5">
                    {activeRoute.via}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2.5 py-1 rounded bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-mono font-bold">
                    -{activeRoute.savingsMin} min saved vs Legacy GPS
                  </span>
                  <button
                    onClick={handleSaveToCloud}
                    disabled={isSaving}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border cursor-pointer ${
                      savedSuccess
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-black border-orange-500/40 text-orange-300 hover:border-orange-400'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved to Cloud!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save to Cloud'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Multi-Objective Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Traffic Level</div>
                  <div className="font-mono text-sm font-bold text-orange-400 mt-0.5">
                    {activeRoute.congestionLevel}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Toll Cost</div>
                  <div className="font-mono text-sm font-bold floating-text-primary mt-0.5">
                    {avoidTolls ? '₹0' : '₹45 (BETL Flyover)'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Estimated Fuel</div>
                  <div className="font-mono text-sm font-bold floating-text-primary mt-0.5">
                    ₹{activeRoute.fuelCostInr}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Road Score</div>
                  <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">
                    {activeRoute.roadQualityScore ? `${activeRoute.roadQualityScore}/100` : 'Not available'}
                  </div>
                </div>
              </div>

              {/* "Why DISHA Recommends This Route" Card */}
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-orange-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold floating-text-orange mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>WHY DISHA RECOMMENDS THIS ROUTE:</span>
                </div>
                <ul className="text-[11px] font-mono floating-text-sub space-y-1.5 list-disc pl-4">
                  <li><strong>Route source:</strong> {DEMO_MODE ? 'DISHA Demo Network with simulated Bengaluru traffic.' : calculatedRoutes ? 'Live route provider returned this current route option.' : 'Sample route shown until you calculate a live route.'}</li>
                  <li><strong>Traffic conditions:</strong> Current route congestion is {activeRoute.congestionLevel}.</li>
                  <li><strong>Route summary:</strong> {activeRoute.description}</li>
                  <li><strong>Environmental estimate:</strong> {activeRoute.co2Kg ? `${activeRoute.co2Kg} kg CO₂ estimated for this trip.` : 'Not available for this travel mode.'}</li>
                </ul>
              </div>

              {/* Turn-by-Turn Preview / Navigation start */}
              <div className="mt-3 pt-3 border-t border-orange-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-mono floating-text-muted">
                  {isNavigating ? (
                    <span className="text-orange-300 font-bold">
                      Segment {navStep + 1} of {activeRoute.segments.length}: {activeRoute.segments[navStep].name}
                    </span>
                  ) : (
                    <span>Ready for real-time turn-by-turn guidance</span>
                  )}
                </div>

                {isNavigating ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNavStep((prev) => (prev + 1) % activeRoute.segments.length)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 text-black font-mono text-xs font-bold uppercase cursor-pointer"
                    >
                      Next Step →
                    </button>
                    <button
                      onClick={() => setIsNavigating(false)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-stone-300 font-mono text-xs cursor-pointer"
                    >
                      End
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startNavigation}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Navigation Simulation</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
