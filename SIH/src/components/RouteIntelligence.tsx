import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { ROUTE_OPTIONS, RouteOption } from '../data/mobilityData';
import { ScrollReveal } from './ScrollReveal';

interface RouteIntelligenceProps {
  onOpenPlannerWithRoute?: (routeId: string) => void;
}

export const RouteIntelligence: React.FC<RouteIntelligenceProps> = ({ onOpenPlannerWithRoute }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<'fastest' | 'balanced' | 'low-traffic'>('fastest');
  const activeRoute: RouteOption = ROUTE_OPTIONS[selectedRouteId];

  return (
    <section className="relative py-32 bg-transparent overflow-hidden border-t border-orange-950/60">
      
      {/* Background glow effects with orange/amber gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-orange-950/20 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={60}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#180f08]/90 border border-orange-500/40 font-mono text-xs font-semibold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-orange-400">
                <img src={IMAGES.iconNeuralRoute} alt="Route Icon" className="w-full h-full object-cover" />
              </div>
              <span className="floating-text-orange">03 // AUTONOMOUS MULTI-OBJECTIVE ARBITRATION</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02]">
              <span className="floating-text-primary block">ONE DESTINATION.</span>
              <span className="floating-text-orange block">MULTIPLE POSSIBILITIES.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg floating-text-sub">
              No two drivers have the exact same priority. Choose your trade-off: pure velocity, fuel conservation, or calm arterial cruising with zero gridlock risk.
            </p>
            <div className="mt-2 text-xs font-mono floating-text-muted uppercase tracking-widest">
              [ SIMULATED METROPOLITAN CORRIDOR: BENGALURU SECTOR 4 → 12 ]
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Main Route Cards (FASTEST, BALANCED, LOW TRAFFIC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Option 1: FASTEST */}
          <ScrollReveal direction="up" delay={90}>
            <div
              onClick={() => setSelectedRouteId('fastest')}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative border ${
                selectedRouteId === 'fastest'
                  ? 'glass-hud border-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.4)] ring-1 ring-orange-400 -translate-y-1'
                  : 'bg-black/60 border-orange-950 hover:border-orange-800 hover:bg-black/80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-orange-400">
                    <img src={IMAGES.iconNavArrow} alt="Fastest Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest floating-text-orange uppercase">
                    FASTEST
                  </span>
                </div>
                <span className="text-[11px] font-mono text-orange-300 bg-orange-950/80 border border-orange-500/40 px-2 py-0.5 rounded">
                  -8 MIN SAVED
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl font-extrabold floating-text-primary">24</span>
                <span className="font-mono text-sm floating-text-muted">MIN</span>
                <span className="text-stone-600">/</span>
                <span className="font-mono text-lg font-bold text-orange-400">12.4</span>
                <span className="font-mono text-xs floating-text-muted">KM</span>
              </div>

              <p className="text-xs floating-text-sub leading-relaxed mb-4">
                Prioritizes elevated expressways and dynamic green-wave signals.
              </p>

              <div className="pt-3 border-t border-orange-950 flex items-center justify-between text-[11px] font-mono floating-text-muted">
                <span>Road Index: <strong className="text-orange-300">92/100</strong></span>
                <span className="text-orange-400 font-semibold">★ Recommended</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Option 2: BALANCED */}
          <ScrollReveal direction="up" delay={120}>
            <div
              onClick={() => setSelectedRouteId('balanced')}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative border ${
                selectedRouteId === 'balanced'
                  ? 'glass-hud border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.4)] ring-1 ring-amber-400 -translate-y-1'
                  : 'bg-black/60 border-orange-950 hover:border-orange-800 hover:bg-black/80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-amber-400">
                    <img src={IMAGES.iconNeuralRoute} alt="Balanced Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-amber-300 uppercase">
                    BALANCED
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                  LOW EMISSIONS
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl font-extrabold floating-text-primary">27</span>
                <span className="font-mono text-sm floating-text-muted">MIN</span>
                <span className="text-stone-600">/</span>
                <span className="font-mono text-lg font-bold floating-text-sub">11.8</span>
                <span className="font-mono text-xs floating-text-muted">KM</span>
              </div>

              <p className="text-xs floating-text-sub leading-relaxed mb-4">
                Smooth cruising cadence. Minimizes hard braking cycles and engine idle.
              </p>

              <div className="pt-3 border-t border-orange-950 flex items-center justify-between text-[11px] font-mono floating-text-muted">
                <span>Road Index: <strong className="floating-text-sub">88/100</strong></span>
                <span>Saves ₹14 in fuel</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Option 3: LOW TRAFFIC */}
          <ScrollReveal direction="up" delay={150}>
            <div
              onClick={() => setSelectedRouteId('low-traffic')}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative border ${
                selectedRouteId === 'low-traffic'
                  ? 'glass-hud border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4)] ring-1 ring-orange-500 -translate-y-1'
                  : 'bg-black/60 border-orange-950 hover:border-orange-800 hover:bg-black/80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-orange-400">
                    <img src={IMAGES.iconQuantumShield} alt="Low Traffic Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-orange-400 uppercase">
                    LOW TRAFFIC
                  </span>
                </div>
                <span className="text-[11px] font-mono floating-text-muted bg-black/80 border border-orange-950 px-2 py-0.5 rounded">
                  ZERO BOTTLENECKS
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl font-extrabold floating-text-primary">31</span>
                <span className="font-mono text-sm floating-text-muted">MIN</span>
                <span className="text-stone-600">/</span>
                <span className="font-mono text-lg font-bold floating-text-sub">13.1</span>
                <span className="font-mono text-xs floating-text-muted">KM</span>
              </div>

              <p className="text-xs floating-text-sub leading-relaxed mb-4">
                Wide perimeter parkways. Unbroken momentum and stress-free driving.
              </p>

              <div className="pt-3 border-t border-orange-950 flex items-center justify-between text-[11px] font-mono floating-text-muted">
                <span>Road Index: <strong className="text-orange-400">95/100</strong></span>
                <span className="text-orange-400">Smoothest Road</span>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Detailed Visual Map & Route Topology Box */}
        <ScrollReveal direction="up" delay={180}>
          <div className="glass-hud rounded-3xl overflow-hidden border border-orange-500/35">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Visual Route Canvas */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-black">
                <img
                  src={IMAGES.routeIntelligence}
                  alt="Route intelligence simulation multiple routes branching to destination"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black" />

                {/* Glowing Dynamic Route Overlay SVG in fiery orange */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 60,340 C 180,310 260,240 400,210 S 580,180 720,130"
                    fill="none"
                    stroke={selectedRouteId === 'fastest' ? '#ff6b00' : '#451a03'}
                    strokeWidth={selectedRouteId === 'fastest' ? '5' : '2'}
                    strokeDasharray={selectedRouteId === 'fastest' ? 'none' : '4 4'}
                    opacity={selectedRouteId === 'fastest' ? '1' : '0.5'}
                  />

                  <path
                    d="M 60,340 C 220,380 320,310 460,280 S 620,220 720,130"
                    fill="none"
                    stroke={selectedRouteId === 'balanced' ? '#f59e0b' : '#451a03'}
                    strokeWidth={selectedRouteId === 'balanced' ? '5' : '2'}
                    strokeDasharray={selectedRouteId === 'balanced' ? 'none' : '4 4'}
                    opacity={selectedRouteId === 'balanced' ? '1' : '0.5'}
                  />

                  <path
                    d="M 60,340 C 120,440 280,430 450,380 S 660,260 720,130"
                    fill="none"
                    stroke={selectedRouteId === 'low-traffic' ? '#ea580c' : '#451a03'}
                    strokeWidth={selectedRouteId === 'low-traffic' ? '5' : '2'}
                    strokeDasharray={selectedRouteId === 'low-traffic' ? 'none' : '4 4'}
                    opacity={selectedRouteId === 'low-traffic' ? '1' : '0.5'}
                  />

                  <circle cx="60" cy="340" r="7" fill="#ff6b00" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="720" cy="130" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
                </svg>

                {/* Visual Badges */}
                <div className="absolute top-4 left-4 glass-hud px-3.5 py-1.5 rounded-xl text-xs font-mono floating-text-orange flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-orange-400">
                    <img src={IMAGES.iconNavArrow} alt="Trace" className="w-full h-full object-cover" />
                  </div>
                  ACTIVE TRACE: <span className="font-bold floating-text-primary uppercase">{activeRoute.name}</span>
                </div>
                <div className="absolute bottom-4 left-4 glass-hud px-3 py-1.5 rounded-xl text-[10px] font-mono floating-text-muted">
                  ORIGIN: Koramangala 80ft Rd → DESTINATION: Indiranagar Hub
                </div>
              </div>

              {/* Route Telemetry & Segment Inspection */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-black/95">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-orange-950">
                    <div>
                      <h3 className="font-display text-xl font-bold floating-text-primary">
                        {activeRoute.name}
                      </h3>
                      <p className="text-xs font-mono floating-text-orange mt-0.5">
                        {activeRoute.via}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono floating-text-muted bg-stone-900 border border-orange-950 px-2 py-0.5 rounded">
                        SIMULATION
                      </span>
                    </div>
                  </div>

                  {/* Segments breakdown */}
                  <div className="mt-5">
                    <div className="text-xs font-mono floating-text-muted uppercase tracking-wider mb-3">
                      Segment Velocity Profile
                    </div>
                    <div className="space-y-3">
                      {activeRoute.segments.map((seg, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-stone-950/80 border border-orange-950 flex items-center justify-between text-xs font-mono">
                          <div>
                            <div className="floating-text-primary font-medium">{seg.name}</div>
                            <div className="text-[10px] floating-text-muted">{seg.distanceKm} km stretch</div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              seg.status === 'flowing'
                                ? 'bg-orange-950/80 text-orange-400 border border-orange-800/40'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                            }`}>
                              {seg.speedKmph} km/h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Efficiency breakdown */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-stone-950/60 border border-orange-950">
                      <div className="flex items-center gap-2 floating-text-muted text-[10px] font-mono uppercase">
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                          <img src={IMAGES.iconTrafficRadar} alt="Fuel" className="w-full h-full object-cover" />
                        </div>
                        Est. Fuel Cost
                      </div>
                      <div className="font-mono text-base font-bold floating-text-primary mt-1">
                        ₹{activeRoute.fuelCostInr}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-950/60 border border-orange-950">
                      <div className="flex items-center gap-2 floating-text-muted text-[10px] font-mono uppercase">
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-amber-400">
                          <img src={IMAGES.iconQuantumShield} alt="CO2" className="w-full h-full object-cover" />
                        </div>
                        CO2 Footprint
                      </div>
                      <div className="font-mono text-base font-bold text-amber-400 mt-1">
                        {activeRoute.co2Kg} kg
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
