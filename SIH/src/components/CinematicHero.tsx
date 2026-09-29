import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

interface CinematicHeroProps {
  onExploreDisha: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onExploreDisha,
}) => {
  const [activeHudCard, setActiveHudCard] = useState<string | null>(null);

  return (
    <section id="overview" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 lg:py-0">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-140px)]">
          
          {/* Left Column: Floating Editorial Headline */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Eyebrow with Orange Navigation Icon Image */}
            <ScrollReveal direction="down" delay={40}>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#180f08]/90 border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:border-orange-400 hover:shadow-[0_0_28px_rgba(249,115,22,0.7)] transition-all cursor-pointer">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400/80 group-hover:scale-110 transition-transform">
                    <img 
                      src={IMAGES.iconNavArrow} 
                      alt="Nav Icon" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-mono text-xs font-semibold tracking-wider floating-text-orange">
                    INTELLIGENT MOBILITY PLATFORM
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest floating-text-muted uppercase bg-black/60 px-2.5 py-1 rounded-md border border-orange-950">
                  [ SIMULATION ENGINE V4.2 ]
                </span>
              </div>
            </ScrollReveal>

            {/* Floating Translucent Headline */}
            <ScrollReveal direction="up" delay={60}>
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight leading-[0.95] mb-6">
                <span className="floating-text-primary block">
                  MOVE SMARTER.
                </span>
                <span className="floating-text-orange block mt-1">
                  ARRIVE BETTER.
                </span>
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={90}>
              <p className="text-lg sm:text-xl floating-text-sub max-w-2xl font-normal leading-relaxed mb-8 tracking-wide">
                AI-powered route intelligence for the cities of tomorrow. Predictive neural networks that eliminate urban gridlock before you ever encounter it.
              </p>
            </ScrollReveal>

            {/* Explore Disha Trigger */}
            <ScrollReveal direction="up" delay={120}>
              <div className="flex items-center gap-4 mb-10">
                <button
                  onClick={onExploreDisha}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-hud hover:border-orange-400/80 floating-text-sub hover:text-white font-mono text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400/50 group-hover:border-orange-300 group-hover:scale-110 transition-all">
                    <img src={IMAGES.navHowItWorks} alt="Explore" className="w-full h-full object-cover" />
                  </div>
                  <span>EXPLORE DISHA</span>
                  <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1 text-orange-400" />
                </button>
              </div>
            </ScrollReveal>

            {/* Live City Telemetry Micro Bar */}
            <ScrollReveal direction="up" delay={150}>
              <div className="pt-6 border-t border-orange-950/80 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-mono text-xs floating-text-muted uppercase">Urban Nodes</div>
                  <div className="font-mono text-lg font-bold floating-text-primary flex items-center gap-1.5 mt-0.5">
                    12,480
                    <span className="text-[10px] text-orange-400 font-normal">Active</span>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs floating-text-muted uppercase">Latency</div>
                  <div className="font-mono text-lg font-bold floating-text-orange flex items-center gap-1.5 mt-0.5">
                    42 ms
                    <span className="text-[10px] floating-text-muted font-normal">Real-Time</span>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs floating-text-muted uppercase">Accuracy</div>
                  <div className="font-mono text-lg font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    98.6%
                    <span className="text-[10px] floating-text-muted font-normal">ETA Model</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Floating Glassmorphism HUD Overlays */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:pl-6">
            
            <ScrollReveal direction="left" delay={80}>
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs floating-text-orange tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-orange-400">
                    <img src={IMAGES.iconTrafficRadar} alt="Radar Icon" className="w-full h-full object-cover" />
                  </div>
                  TACTICAL HUD OVERLAY
                </span>
                <span className="font-mono text-[10px] uppercase floating-text-muted bg-black/60 border border-orange-950 px-2 py-0.5 rounded">
                  SIMULATION DATA
                </span>
              </div>
            </ScrollReveal>

            {/* HUD Card 1: LIVE TRAFFIC */}
            <ScrollReveal direction="left" delay={110}>
              <div 
                onClick={() => setActiveHudCard(activeHudCard === 'traffic' ? null : 'traffic')}
                className={`glass-hud rounded-2xl p-5 cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  activeHudCard === 'traffic' ? 'border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.35)]' : 'hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-500/40 flex-shrink-0 shadow-lg group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.8)] group-hover:scale-105 transition-all duration-300">
                      <img 
                        src={IMAGES.iconTrafficRadar} 
                        alt="Traffic Radar" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] floating-text-orange tracking-wider uppercase">
                        LIVE TRAFFIC
                      </div>
                      <div className="font-display text-2xl font-bold floating-text-primary mt-0.5">
                        Bengaluru
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-950/80 border border-orange-500/40">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="font-mono text-xs font-semibold text-orange-200">
                      84% network flow
                    </span>
                  </div>
                </div>

                {/* Mini visual flow bar */}
                <div className="mt-4 pt-3 border-t border-orange-950/80">
                  <div className="flex justify-between text-[11px] font-mono floating-text-sub mb-1.5">
                    <span>Arterial Corridor Velocity</span>
                    <span className="text-orange-300 font-semibold">41.2 km/h avg</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/80 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-400 rounded-full w-[84%]" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* HUD Card 2: ROUTE OPTIMIZED */}
            <ScrollReveal direction="left" delay={140}>
              <div 
                onClick={() => setActiveHudCard(activeHudCard === 'route' ? null : 'route')}
                className={`glass-hud rounded-2xl p-5 cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  activeHudCard === 'route' ? 'border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.35)]' : 'hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-500/40 flex-shrink-0 shadow-lg group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.8)] group-hover:scale-105 transition-all duration-300">
                      <img 
                        src={IMAGES.iconNeuralRoute} 
                        alt="Neural Route" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] floating-text-orange tracking-wider uppercase">
                        ROUTE OPTIMIZED
                      </div>
                      <div className="font-display text-2xl font-bold floating-text-primary mt-0.5 flex items-baseline gap-2">
                        12.4 km
                        <span className="text-sm font-mono floating-text-muted font-normal">/ 24 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-950/80 border border-orange-500/40 text-orange-300 font-mono text-xs font-bold">
                    -8 min saved
                  </div>
                </div>

                {/* Waypoint micro timeline */}
                <div className="mt-4 pt-3 border-t border-orange-950/80 flex items-center justify-between text-[11px] font-mono floating-text-sub">
                  <span>Koramangala 80ft</span>
                  <span className="text-orange-400">→ Elevated Flyover →</span>
                  <span>Indiranagar</span>
                </div>
              </div>
            </ScrollReveal>

            {/* HUD Card 3: INCIDENT DETECTED */}
            <ScrollReveal direction="left" delay={170}>
              <div 
                onClick={() => setActiveHudCard(activeHudCard === 'incident' ? null : 'incident')}
                className={`glass-hud rounded-2xl p-5 cursor-pointer transition-all duration-300 relative group overflow-hidden border-amber-600/35 ${
                  activeHudCard === 'incident' ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.35)]' : 'hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 flex-shrink-0 shadow-lg group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] group-hover:scale-105 transition-all duration-300">
                      <img 
                        src={IMAGES.iconQuantumShield} 
                        alt="Quantum Shield" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] text-amber-300 tracking-wider uppercase">
                        INCIDENT DETECTED
                      </div>
                      <div className="font-sans text-sm font-medium floating-text-primary mt-0.5">
                        Silk Board Northbound bottleneck
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-amber-200 bg-amber-950/90 border border-amber-500/40 px-2 py-1 rounded">
                    +14 min delayed
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-orange-950/80 flex items-center justify-between">
                  <span className="text-xs font-mono floating-text-orange">
                    Alternative route calculated
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/60">
                    BYPASS READY
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Live Indicator footnote */}
            <ScrollReveal direction="left" delay={200}>
              <div className="text-right">
                <span className="font-mono text-[10px] floating-text-muted">
                  DISHA SIMULATED SENSOR FEED • 4,820 ACTIVE VEHICLES
                </span>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
};
