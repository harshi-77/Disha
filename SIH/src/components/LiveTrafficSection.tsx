import React, { useState } from 'react';
import { RefreshCw, Maximize2, Clock } from 'lucide-react';
import { LIVE_CORRIDORS, ACTIVE_INCIDENTS, TrafficCorridor } from '../data/mobilityData';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

interface LiveTrafficSectionProps {
  onOpenLiveTrafficModal: () => void;
}

export const LiveTrafficSection: React.FC<LiveTrafficSectionProps> = ({ onOpenLiveTrafficModal }) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('bengaluru-orr');
  const [corridors, setCorridors] = useState<TrafficCorridor[]>(LIVE_CORRIDORS);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const activeCorridor = corridors.find(c => c.id === selectedCorridorId) || corridors[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCorridors(prev => prev.map(c => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newFlow = Math.min(99, Math.max(40, c.flowPercentage + delta));
        return { ...c, flowPercentage: newFlow };
      }));
      setLastRefreshed('Seconds ago');
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <section id="live-traffic" className="relative py-32 bg-transparent overflow-hidden border-t border-orange-950/60">
      
      {/* Background radial glow in deep warm amber */}
      <div className="absolute top-1/4 left-1/3 w-[650px] h-[650px] bg-orange-950/20 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={60}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="font-mono text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400">
                  <img src={IMAGES.iconTrafficRadar} alt="Radar Icon" className="w-full h-full object-cover" />
                </div>
                <span className="floating-text-orange">05 // REAL-TIME NETWORK TELEMETRY</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02]">
                <span className="floating-text-primary block">THE ROAD CHANGES.</span>
                <span className="floating-text-orange block">DISHA RESPONDS.</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs floating-text-muted uppercase bg-black/60 border border-orange-950 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                SYNCHRONIZED: {lastRefreshed}
              </span>
              <button
                onClick={handleRefresh}
                className="p-2.5 rounded-xl glass-hud hover:border-orange-400 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Refresh simulated telemetry"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
              </button>
              <button
                onClick={onOpenLiveTrafficModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/50 hover:border-orange-300 floating-text-orange font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Full Radar Explorer
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Traffic Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Corridor List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <ScrollReveal direction="right" delay={80}>
              <div className="flex items-center justify-between text-xs font-mono floating-text-muted uppercase tracking-wider px-2 mb-1">
                <span>Bengaluru Key Corridors</span>
                <span className="text-[10px] text-orange-400 bg-orange-950/80 border border-orange-800/40 px-2 py-0.5 rounded">
                  SIMULATION DATA
                </span>
              </div>
            </ScrollReveal>

            {corridors.map((corridor, idx) => {
              const isSelected = corridor.id === selectedCorridorId;
              const isCongested = corridor.status === 'congested';
              const isOptimal = corridor.status === 'optimal';

              return (
                <ScrollReveal key={corridor.id} direction="right" delay={80 * (idx + 1)}>
                  <div
                    onClick={() => setSelectedCorridorId(corridor.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? 'glass-hud border-orange-400 bg-black/90 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
                        : 'bg-black/60 border-orange-950 hover:border-orange-800 hover:bg-black/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-sm floating-text-primary flex items-center gap-2">
                          {corridor.name}
                        </div>
                        <div className="text-[11px] font-mono floating-text-muted mt-1 flex items-center gap-2">
                          <span>Speed: <strong className="floating-text-primary">{corridor.avgSpeedKmph} km/h</strong></span>
                          <span>•</span>
                          <span>{corridor.activeVehicles.toLocaleString()} vehicles</span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isOptimal
                            ? 'bg-orange-950/90 text-orange-300 border border-orange-700/50'
                            : isCongested
                            ? 'bg-rose-950/90 text-rose-300 border border-rose-800/50'
                            : 'bg-amber-950/90 text-amber-300 border border-amber-800/50'
                        }`}>
                          {corridor.flowPercentage}% Flow
                        </span>
                      </div>
                    </div>

                    {corridor.incidentText && (
                      <div className="mt-2.5 pt-2 border-t border-orange-950 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-amber-400">
                          <img src={IMAGES.iconQuantumShield} alt="Alert" className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate">{corridor.incidentText}</span>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right Column: Tactical Radar & Active Incident Stream */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Tactical Radar Display Box */}
            <ScrollReveal direction="left" delay={120}>
              <div className="glass-hud rounded-3xl p-6 sm:p-8 border border-orange-500/35 relative overflow-hidden">
                
                {/* Radar Grid Circles Background */}
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-orange-500/25 pointer-events-none opacity-40">
                  <div className="absolute inset-8 rounded-full border border-orange-500/20" />
                  <div className="absolute inset-16 rounded-full border border-orange-500/15" />
                  <div className="absolute inset-24 rounded-full border border-orange-500/25 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-t border-orange-400/70 animate-radar origin-center" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-mono text-xs floating-text-orange tracking-wider uppercase flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400">
                        <img src={IMAGES.iconTrafficRadar} alt="Radar" className="w-full h-full object-cover" />
                      </div>
                      CORRIDOR TELEMETRY FOCUS
                    </div>
                    <span className="text-[10px] font-mono floating-text-muted bg-stone-900 px-2 py-0.5 rounded border border-orange-950">
                      BENGALURU URBAN GRID
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold floating-text-primary mb-2">
                    {activeCorridor.name}
                  </h3>
                  <p className="text-xs sm:text-sm floating-text-sub mb-6">
                    Real-time neural velocity synthesis across arterial lanes. Updated every 3 seconds via simulated edge sensors.
                  </p>

                  {/* Corridor Status Bar */}
                  <div className="p-4 rounded-2xl bg-black/80 border border-orange-950 grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-[10px] font-mono floating-text-muted uppercase">Network Flow</div>
                      <div className="font-display text-2xl font-black text-orange-400 mt-0.5">
                        {activeCorridor.flowPercentage}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono floating-text-muted uppercase">Mean Velocity</div>
                      <div className="font-display text-2xl font-black floating-text-primary mt-0.5">
                        {activeCorridor.avgSpeedKmph} <span className="text-xs font-mono floating-text-muted font-normal">km/h</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono floating-text-muted uppercase">Dynamic Status</div>
                      <div className="font-mono text-sm font-bold uppercase mt-1.5 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          activeCorridor.status === 'optimal' ? 'bg-orange-400' : activeCorridor.status === 'congested' ? 'bg-rose-500' : 'bg-amber-400'
                        }`} />
                        <span className={activeCorridor.status === 'optimal' ? 'text-orange-400' : activeCorridor.status === 'congested' ? 'text-rose-400' : 'text-amber-300'}>
                          {activeCorridor.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time incident banner */}
                  {activeCorridor.incidentText ? (
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs font-mono text-amber-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-amber-400">
                          <img src={IMAGES.iconQuantumShield} alt="Alert" className="w-full h-full object-cover" />
                        </div>
                        <span>{activeCorridor.incidentText}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded">
                        REROUTE SUGGESTED
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-between text-xs font-mono text-orange-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-orange-400">
                          <img src={IMAGES.iconNeuralRoute} alt="Optimal" className="w-full h-full object-cover" />
                        </div>
                        <span>Corridor running at nominal throughput. Zero critical obstacles reported.</span>
                      </div>
                      <span className="text-[10px] text-orange-400 font-bold">OPTIMAL</span>
                    </div>
                  )}
                </div>

              </div>
            </ScrollReveal>

            {/* Active Incident Feed Ticker */}
            <ScrollReveal direction="up" delay={150}>
              <div className="bg-black/80 rounded-2xl p-5 border border-orange-950">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono floating-text-muted uppercase tracking-wider flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-400">
                      <img src={IMAGES.iconQuantumShield} alt="Alerts" className="w-full h-full object-cover" />
                    </div>
                    Active Incident Telemetry [Simulation]
                  </span>
                  <span className="text-[10px] font-mono floating-text-orange">
                    {ACTIVE_INCIDENTS.length} Tracked
                  </span>
                </div>

                <div className="space-y-2.5">
                  {ACTIVE_INCIDENTS.map((inc) => (
                    <div key={inc.id} className="p-3 rounded-xl bg-stone-950/80 border border-orange-950 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <div>
                          <div className="floating-text-primary font-medium">{inc.title}</div>
                          <div className="text-[10px] floating-text-muted">{inc.location} • {inc.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-rose-400 font-semibold">+{inc.impactMinutes}m delay</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
