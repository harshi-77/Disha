import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Mic, 
  Crosshair, 
  Car, 
  Bike, 
  Bus, 
  Footprints, 
  Compass, 
  Check, 
  Bookmark, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  RotateCcw,
  Zap,
  ArrowRight,
  TrendingUp,
  Leaf,
  DollarSign
} from 'lucide-react';
import { IMAGES } from '../constants/images';
import { InteractiveMapCanvas } from '../components/InteractiveMapCanvas';
import { UsualJourneysSection } from '../components/UsualJourneysSection';
import { PredictiveTrafficSection } from '../components/PredictiveTrafficSection';
import { RoadIntelligenceHub } from '../components/RoadIntelligenceHub';
import { SmartStopsExplorer } from '../components/SmartStopsExplorer';
import { PersonalMobilityInsights } from '../components/PersonalMobilityInsights';
import { AppFooter } from '../components/AppFooter';
import { ROUTE_OPTIONS, RouteOption } from '../data/mobilityData';
import { saveRouteToFirestore, auth } from '../lib/firebase';
import { ScrollReveal } from '../components/ScrollReveal';

interface DishaPortalPageProps {
  currentUser: { email: string; name: string; uid?: string } | null;
  onOpenLiveTraffic: () => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  onOpenAskDisha: () => void;
  onOpenReportModal: () => void;
  onOpenSafetyAccessibility: () => void;
  onOpenDashboard: () => void;
  onOpenRoutePlannerModal: (params?: any) => void;
  onSwitchToLanding: () => void;
}

const POPULAR_DESTINATIONS = [
  'Indiranagar 100ft Road, Bengaluru',
  'Electronic City Phase 1, Bengaluru',
  'Whitefield ITPL Main Road, Bengaluru',
  'Kempegowda International Airport (BLR)',
  'Hebbal Flyover Junction, Bengaluru',
  'HSR Layout Sector 1, Bengaluru',
  'MG Road Metro Station, Bengaluru',
];

export const DishaPortalPage: React.FC<DishaPortalPageProps> = ({
  currentUser,
  onOpenLiveTraffic,
  onOpenAbout,
  onOpenHelp,
  onOpenAskDisha,
  onOpenReportModal,
  onOpenSafetyAccessibility,
  onOpenDashboard,
  onOpenRoutePlannerModal,
  onSwitchToLanding,
}) => {
  // Main Search State
  const [currentLoc, setCurrentLoc] = useState('Koramangala 80ft Road, Bengaluru');
  const [destLoc, setDestLoc] = useState('Indiranagar 100ft Road, Bengaluru');
  const [transportMode, setTransportMode] = useState('car');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['fastest', 'better-roads']);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('fastest');

  // Action states
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const activeRoute: RouteOption = ROUTE_OPTIONS[selectedRouteId] || ROUTE_OPTIONS.fastest;

  const togglePref = (id: string) => {
    if (selectedPrefs.includes(id)) {
      setSelectedPrefs(selectedPrefs.filter(p => p !== id));
    } else {
      setSelectedPrefs([...selectedPrefs, id]);
    }
  };

  const handleUseGps = () => {
    setGpsDetecting(true);
    setTimeout(() => {
      setCurrentLoc('Current GPS: Koramangala 4th Block, Bengaluru');
      setGpsDetecting(false);
    }, 500);
  };

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setDestLoc('Kempegowda International Airport (BLR)');
      setIsListeningVoice(false);
    }, 1800);
  };

  const handleRecalculate = () => {
    setIsCalculating(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setIsCalculating(false);
    }, 450);
  };

  const handleSaveToCloud = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await saveRouteToFirestore({
        origin: currentLoc,
        destination: destLoc,
        routeId: selectedRouteId,
        durationMin: activeRoute.durationMin,
        distanceKm: activeRoute.distanceKm,
        savingsMin: activeRoute.savingsMin,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save route', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectUsualJourney = (origin: string, destination: string) => {
    setCurrentLoc(origin);
    setDestLoc(destination);
    setSelectedRouteId('fastest');
    handleRecalculate();
  };

  return (
    <div className="w-full bg-transparent min-h-screen text-slate-100 overflow-x-hidden relative pt-24">
      
      {/* 1. PORTAL HERO / MAIN SEARCH SECTION */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Welcome Banner with Pilot Credentials */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-orange-950/60 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/40 text-orange-300 font-mono text-[11px] mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PILOT AUTHENTICATED • SUPABASE SYNC ACTIVE</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl floating-text-primary">
              Welcome back, {currentUser?.name || 'Urban Pilot'}
            </h1>
            <p className="text-xs font-mono floating-text-sub mt-0.5">
              Bengaluru Urban Node • Live Sensor Network & Predictive Trajectories
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSafetyAccessibility}
              className="px-3.5 py-2 rounded-xl glass-hud hover:border-orange-400 text-stone-200 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>Safety & Accessibility</span>
            </button>
            <button
              onClick={onSwitchToLanding}
              className="px-3.5 py-2 rounded-xl bg-stone-900 border border-orange-950 hover:border-orange-500 text-stone-300 font-mono text-xs transition-colors cursor-pointer"
            >
              View Landing Page
            </button>
          </div>
        </div>

        {/* Main Search & Interactive Planning Widget */}
        <div className="glass-hud rounded-3xl p-5 sm:p-7 border border-orange-500/40 shadow-2xl shadow-orange-950/80 mb-8 text-left">
          
          {/* Origin & Destination Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            
            {/* Origin */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] font-mono floating-text-orange uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Current Location / Origin
                </span>
                <button
                  type="button"
                  onClick={handleUseGps}
                  className="text-[10px] font-mono text-orange-400 hover:text-orange-200 flex items-center gap-1 cursor-pointer"
                >
                  <Crosshair className={`w-3 h-3 ${gpsDetecting ? 'animate-spin' : ''}`} />
                  <span>{gpsDetecting ? 'Detecting...' : 'Use GPS'}</span>
                </button>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  value={currentLoc}
                  onChange={(e) => setCurrentLoc(e.target.value)}
                  className="w-full bg-black/80 border border-orange-950 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-orange-400 shadow-inner"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] font-mono floating-text-orange uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Destination Search
                </span>
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                    isListeningVoice ? 'text-rose-400 animate-pulse' : 'text-stone-400 hover:text-orange-300'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{isListeningVoice ? 'Listening...' : 'Voice Search'}</span>
                </button>
              </label>
              <div className="relative">
                <Navigation className="absolute left-3.5 top-3 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  value={destLoc}
                  onChange={(e) => setDestLoc(e.target.value)}
                  list="dest-portal-list"
                  className="w-full bg-black/80 border border-orange-950 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-orange-400 shadow-inner"
                />
                <datalist id="dest-portal-list">
                  {POPULAR_DESTINATIONS.map((d, i) => (
                    <option key={i} value={d} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Action Button: "Plan My Journey" */}
            <div className="md:col-span-2 flex flex-col justify-end">
              <button
                type="button"
                onClick={handleRecalculate}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 cursor-pointer h-[38px]"
              >
                <span>Plan Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Transport Modes & Journey Preferences Row */}
          <div className="pt-3 border-t border-orange-950/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Transport Mode: Car, Bike, Transit, Walk, Cycle */}
            <div className="md:col-span-6 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono floating-text-muted uppercase mr-1">Mode:</span>
              {[
                { id: 'car', icon: Car, label: 'Car' },
                { id: 'bike', icon: Bike, label: 'Bike' },
                { id: 'transit', icon: Bus, label: 'Transit' },
                { id: 'walking', icon: Footprints, label: 'Walk' },
                { id: 'cycling', icon: Compass, label: 'Cycle' },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = transportMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-black font-bold border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                        : 'bg-black/60 border-orange-950 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Journey Preferences */}
            <div className="md:col-span-6 flex items-center gap-1.5 flex-wrap md:justify-end">
              <span className="text-[10px] font-mono floating-text-muted uppercase mr-1">Prefs:</span>
              {[
                { id: 'fastest', label: '⚡ Fastest' },
                { id: 'safest', label: '🛡️ Safest' },
                { id: 'cheapest', label: '💰 Cheapest' },
                { id: 'eco', label: '🌱 Eco' },
                { id: 'better-roads', label: '🛣️ Roads' },
              ].map((p) => {
                const active = selectedPrefs.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePref(p.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border cursor-pointer ${
                      active
                        ? 'bg-orange-950 border-orange-400 text-orange-200 font-bold'
                        : 'bg-black/60 border-orange-950 text-stone-400 hover:text-stone-300'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}

              <label className="text-[10px] font-mono floating-text-sub cursor-pointer flex items-center gap-1 ml-1">
                <input
                  type="checkbox"
                  checked={avoidTolls}
                  onChange={(e) => setAvoidTolls(e.target.checked)}
                  className="accent-orange-500 rounded cursor-pointer"
                />
                <span>No Tolls</span>
              </label>
            </div>

          </div>

          {/* DISHA AI Intelligence Prompt Strip */}
          <div className="mt-3.5 pt-3 border-t border-orange-950/80 flex items-center justify-between gap-3 bg-stone-950/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono floating-text-sub truncate">
              <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 animate-pulse" />
              <span className="text-stone-300 truncate">
                "Recommend a low-stress EV route to Indiranagar avoiding waterlogged underpasses"
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenAskDisha}
              className="px-3.5 py-1 rounded-lg bg-orange-950/90 hover:bg-orange-900 border border-orange-500/50 text-orange-300 font-mono text-[11px] font-bold uppercase transition-colors whitespace-nowrap cursor-pointer shadow-md"
            >
              Ask DISHA AI →
            </button>
          </div>

        </div>

        {/* 2. INTERACTIVE MAP & ROUTE INTELLIGENCE CANVAS (EMBEDDED DIRECTLY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Interactive Satellite Map (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg floating-text-primary flex items-center gap-2">
                <span>Interactive Route Canvas</span>
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800">
                  LIVE CORRIDOR
                </span>
              </h3>
              <button
                onClick={() => onOpenRoutePlannerModal({
                  origin: currentLoc,
                  destination: destLoc,
                  mode: transportMode,
                  preferences: selectedPrefs,
                })}
                className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Fullscreen Canvas View ↗</span>
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl border border-orange-500/35">
              <InteractiveMapCanvas
                selectedRouteId={selectedRouteId}
                onRouteChange={(routeId) => setSelectedRouteId(routeId)}
                transportMode={transportMode}
                className="w-full h-full"
              />
            </div>

            {/* Alternative Routes Comparison Pills */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { id: 'fastest', name: '⚡ Fastest (24m)', desc: '12.4 km via ORR' },
                { id: 'balanced', name: '💰 Cheapest (27m)', desc: '11.8 km • ₹0 Tolls' },
                { id: 'low-traffic', name: '🛡️ Safest (31m)', desc: '98% Smooth Asphalt' },
              ].map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => setSelectedRouteId(alt.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                    selectedRouteId === alt.id
                      ? 'bg-orange-500/20 border-orange-400 text-orange-200 shadow-md'
                      : 'bg-stone-950/70 border-orange-950 text-stone-400 hover:border-orange-800'
                  }`}
                >
                  <div className="font-bold text-white text-[11px]">{alt.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{alt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Route Metrics & Multi-Objective Explanation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 glass-hud rounded-2xl p-5 border border-orange-500/30">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-orange-950">
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
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Trip'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 my-3">
                <div className="p-2.5 rounded-xl bg-black/60 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Traffic Level</div>
                  <div className="font-mono text-sm font-bold text-orange-400 mt-0.5">
                    Moderate (41 km/h)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Toll Cost</div>
                  <div className="font-mono text-sm font-bold floating-text-primary mt-0.5">
                    {avoidTolls ? '₹0' : '₹45 (BETL Flyover)'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Estimated Fuel</div>
                  <div className="font-mono text-sm font-bold floating-text-primary mt-0.5">
                    ₹{activeRoute.fuelCostInr}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-orange-950 text-center">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Road Quality Score</div>
                  <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">
                    {activeRoute.roadQualityScore}/100
                  </div>
                </div>
              </div>

              {/* "Why DISHA Recommends This Route" Card */}
              <div className="p-3 rounded-xl bg-stone-950/90 border border-orange-500/30 text-left">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold floating-text-orange mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>WHY DISHA RECOMMENDS THIS ROUTE:</span>
                </div>
                <ul className="text-[11px] font-mono floating-text-sub space-y-1 list-disc pl-4">
                  <li><strong>Faster / Efficient:</strong> Bypasses the 80ft Koramangala bottleneck, saving 8 mins.</li>
                  <li><strong>Traffic Conditions:</strong> Avoids forming shockwave near Sony World junction.</li>
                  <li><strong>Road Quality:</strong> 92/100 score; zero deep pothole trenches.</li>
                  <li><strong>Safety & Eco Impact:</strong> Recovers ~14% EV battery power while reducing carbon output by 2.1 kg.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onOpenRoutePlannerModal({
                origin: currentLoc,
                destination: destLoc,
                mode: transportMode,
                preferences: selectedPrefs,
              })}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Turn-by-Turn Navigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* 3. YOUR USUAL JOURNEYS (Home, Work, College, Gym, Airport, Saved) */}
      <UsualJourneysSection onSelectJourney={handleSelectUsualJourney} />

      {/* 4. PREDICTIVE TRAFFIC SHOCKWAVE MODELING */}
      <PredictiveTrafficSection />

      {/* 5. LIVE ROAD HAZARD INTELLIGENCE & REPORTING */}
      <RoadIntelligenceHub onOpenReportModal={onOpenReportModal} />

      {/* 6. SMART STOPS (EV, Fuel, Parking, Food, Hospital, Restrooms) */}
      <SmartStopsExplorer />

      {/* 7. PERSONAL MOBILITY INSIGHTS & RECENT TRIPS */}
      <PersonalMobilityInsights onRepeatTrip={handleSelectUsualJourney} />

      {/* 8. DEDICATED APP FOOTER */}
      <AppFooter
        onOpenPlanner={() => onOpenRoutePlannerModal()}
        onOpenLiveTraffic={onOpenLiveTraffic}
        onOpenAbout={onOpenAbout}
        onOpenHelp={onOpenHelp}
        onOpenAskDisha={onOpenAskDisha}
        onOpenSafetyAccessibility={onOpenSafetyAccessibility}
      />

    </div>
  );
};
