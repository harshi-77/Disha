import React, { useState } from 'react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

export const CityNeverStops: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'conditions' | 'incidents'>('traffic');

  return (
    <section className="relative py-32 bg-transparent overflow-hidden border-t border-orange-950/60">
      
      {/* Background molten amber and fiery orange aura */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-950/20 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-950/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={60}>
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2.5 font-mono text-xs font-semibold tracking-widest uppercase mb-3.5">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400">
                <img src={IMAGES.iconTrafficRadar} alt="Radar Icon" className="w-full h-full object-cover" />
              </div>
              <span className="floating-text-orange">01 // URBAN COMPLEXITY</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02]">
              <span className="floating-text-primary">
                THE CITY NEVER STOPS.
              </span>
            </h2>
            <p className="mt-5 text-lg floating-text-sub font-normal leading-relaxed">
              Metropolitan corridors are living, chaotic organisms. Changing traffic surges, sudden lane blockages, unexpected monsoon deluges, and bottleneck cascades evolve in fractions of a second. Reactive navigation fails when urban momentum shifts.
            </p>
          </div>
        </ScrollReveal>

        {/* Visual Showcase Card with Aerial Network */}
        <ScrollReveal direction="up" delay={120}>
          <div className="relative rounded-3xl overflow-hidden border border-orange-500/30 bg-black/85 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)]">
            
            {/* Main Visual Image */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
              <img
                src={IMAGES.cityTrafficAerial}
                alt="Intelligent urban traffic network aerial perspective with flowing orange light trails"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
              />
              
              {/* Visual Overlays & Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/65" />

              {/* Simulated Live Route Stream Lines SVG in neon orange */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="orangeGradientLine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff7800" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                <path 
                  d="M 50,600 C 350,520 500,400 750,320 S 1100,180 1400,120" 
                  fill="none" 
                  stroke="url(#orangeGradientLine)" 
                  strokeWidth="4" 
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />

                <path 
                  d="M 350,520 C 500,600 800,500 1000,420 S 1250,260 1400,120" 
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="2.5" 
                  strokeDasharray="4 6"
                  opacity="0.75"
                />
              </svg>

              {/* Top Interactive Layer Selector */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveLayer('traffic')}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeLayer === 'traffic'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                      : 'glass-hud floating-text-sub hover:text-white'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                    <img src={IMAGES.iconTrafficRadar} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                  01 Velocity Vectors
                </button>
                <button
                  onClick={() => setActiveLayer('conditions')}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeLayer === 'conditions'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                      : 'glass-hud floating-text-sub hover:text-white'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                    <img src={IMAGES.iconNeuralRoute} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                  02 Road Surface Micro-Telemetry
                </button>
                <button
                  onClick={() => setActiveLayer('incidents')}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeLayer === 'incidents'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                      : 'glass-hud floating-text-sub hover:text-white'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-amber-400">
                    <img src={IMAGES.iconQuantumShield} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                  03 Predictive Choke-Points
                </button>
              </div>

              {/* Bottom Floating Telemetry Overlay inside image */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="glass-hud p-4 rounded-2xl max-w-md">
                  <div className="text-[10px] font-mono floating-text-orange uppercase tracking-widest mb-1 flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                      <img src={IMAGES.iconTrafficRadar} alt="Icon" className="w-full h-full object-cover" />
                    </div>
                    CORRIDOR SYNTHESIS [SIMULATION]
                  </div>
                  <div className="text-sm font-sans floating-text-sub">
                    {activeLayer === 'traffic' && 'Neural velocity models analyze 1,400+ vehicle micro-movements per minute to predict choke formation.'}
                    {activeLayer === 'conditions' && 'Asphalt friction, speed-breaker density, and road elevation profile factored into ETA calculations.'}
                    {activeLayer === 'incidents' && 'Sudden stalled vehicles or construction barriers trigger autonomous branch rerouting within 1.2 seconds.'}
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  <div className="glass-hud px-4 py-3 rounded-2xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-400 animate-ping" />
                    <div>
                      <div className="text-[10px] font-mono floating-text-muted uppercase">Bengaluru Metro Grid</div>
                      <div className="font-mono text-xs font-bold floating-text-primary">4.82M Km Simulated Daily</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Three Key Pillar Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-orange-950/80 bg-black/90 p-6 sm:p-8">
              
              <div className="pb-6 md:pb-0 md:pr-6">
                <div className="flex items-center gap-2.5 font-mono text-xs uppercase mb-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-orange-400/40">
                    <img src={IMAGES.iconTrafficRadar} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="floating-text-orange">Dynamic Flow Rate</span>
                </div>
                <div className="font-display text-2xl font-bold floating-text-primary">
                  35-Minute Foresight
                </div>
                <p className="mt-2 text-sm floating-text-sub leading-relaxed">
                  Rather than showing where traffic was 10 minutes ago, DISHA simulates where congestion will accumulate 35 minutes into your commute.
                </p>
              </div>

              <div className="py-6 md:py-0 md:px-6">
                <div className="flex items-center gap-2.5 font-mono text-xs uppercase mb-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-amber-400/40">
                    <img src={IMAGES.iconNeuralRoute} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="floating-text-orange">Road Quality Indices</span>
                </div>
                <div className="font-display text-2xl font-bold floating-text-primary">
                  Surface-Aware Routing
                </div>
                <p className="mt-2 text-sm floating-text-sub leading-relaxed">
                  Avoid pothole clusters, rough gravel stretches, and severe speed bumps that degrade vehicle suspension and slow real-world velocity.
                </p>
              </div>

              <div className="pt-6 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2.5 font-mono text-xs uppercase mb-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-orange-400/40">
                    <img src={IMAGES.iconQuantumShield} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-orange-300">Autonomous Rerouting</span>
                </div>
                <div className="font-display text-2xl font-bold floating-text-primary">
                  Zero Gridlock Trap
                </div>
                <p className="mt-2 text-sm floating-text-sub leading-relaxed">
                  Dynamic arterial split suggestions divert you before you reach irreversible highway ramps or blocked flyover approaches.
                </p>
              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
