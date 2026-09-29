import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Car, 
  Bike, 
  Bus, 
  Footprints, 
  Compass, 
  Crosshair,
  Volume2
} from 'lucide-react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

interface MainSearchHeroProps {
  onPlanJourney: (params?: { origin?: string; destination?: string; mode?: string; preferences?: string[] }) => void;
  onOpenAskDisha: () => void;
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

export const MainSearchHero: React.FC<MainSearchHeroProps> = ({
  onPlanJourney,
  onOpenAskDisha,
}) => {
  const [currentLoc, setCurrentLoc] = useState('Koramangala 80ft Road, Bengaluru');
  const [destLoc, setDestLoc] = useState('Indiranagar 100ft Road, Bengaluru');
  const [transportMode, setTransportMode] = useState('car');
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['fastest', 'better-roads']);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);

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

  const handleLaunchPlanning = () => {
    onPlanJourney({
      origin: currentLoc,
      destination: destLoc,
      mode: transportMode,
      preferences: selectedPrefs,
    });
  };

  return (
    <section id="overview" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Centered Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        
        {/* Floating Top Badge */}
        <ScrollReveal direction="down" delay={40}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#180f08]/90 border border-orange-500/40 font-mono text-xs font-semibold tracking-widest uppercase mb-6 shadow-[0_0_25px_rgba(249,115,22,0.35)]">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-orange-400">
              <img src={IMAGES.iconNavArrow} alt="DISHA" className="w-full h-full object-cover" />
            </div>
            <span className="floating-text-orange">DISHA URBAN MOBILITY MATRIX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </ScrollReveal>

        {/* Master Headline */}
        <ScrollReveal direction="up" delay={60}>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] mb-4">
            <span className="floating-text-primary block">INTELLIGENT PATHFINDING</span>
            <span className="floating-text-orange block mt-1">FOR THE CITY OF TOMORROW</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={80}>
          <p className="text-base sm:text-xl floating-text-sub max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Predictive neural networks that bypass urban bottlenecks before you reach them.
          </p>
        </ScrollReveal>

        {/* Main Search & Interactive Planning Widget */}
        <ScrollReveal direction="up" delay={110}>
          <div className="glass-hud rounded-3xl p-5 sm:p-7 border border-orange-500/40 shadow-2xl shadow-orange-950/80 max-w-4xl mx-auto text-left">
            
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
                    list="dest-list"
                    className="w-full bg-black/80 border border-orange-950 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-orange-400 shadow-inner"
                  />
                  <datalist id="dest-list">
                    {POPULAR_DESTINATIONS.map((d, i) => (
                      <option key={i} value={d} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Action Button: "Plan My Journey" / "Calculate Distance" */}
              <div className="md:col-span-2 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleLaunchPlanning}
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

              {/* Journey Preferences: Fastest, Safest, Cheapest, Eco, Avoid Tolls */}
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

            {/* Quick Natural-Language "Ask DISHA" prompt strip */}
            <div className="mt-3.5 pt-3 border-t border-orange-950/80 flex items-center justify-between gap-3 bg-stone-950/50 p-2.5 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono floating-text-sub truncate">
                <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 animate-pulse" />
                <span className="text-stone-300 truncate">
                  "Find an EV route to Indiranagar avoiding Bellandur waterlogging"
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenAskDisha}
                className="px-3 py-1 rounded-lg bg-orange-950/90 hover:bg-orange-900 border border-orange-500/40 text-orange-300 font-mono text-[11px] font-bold uppercase transition-colors whitespace-nowrap cursor-pointer"
              >
                Ask DISHA AI →
              </button>
            </div>

          </div>
        </ScrollReveal>

      </div>

    </section>
  );
};
