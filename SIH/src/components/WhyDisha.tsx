import React from 'react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

export const WhyDisha: React.FC = () => {
  const pillars = [
    {
      title: 'INTELLIGENT ROUTING',
      subtitle: 'Multi-parametric Pareto Optimization',
      iconImage: IMAGES.iconNavArrow,
      description: 'Moving beyond single-variable shortest-time math. DISHA synthesizes road surface index, brake-wear cycles, and regenerative braking profiles to determine true trip economy.',
      metric: '22% lower fuel wastage',
    },
    {
      title: 'REAL-TIME AWARENESS',
      subtitle: 'Predictive Shockwave Simulation',
      iconImage: IMAGES.iconTrafficRadar,
      description: 'Legacy GPS reacts after you are already stuck behind hundreds of red taillights. DISHA runs fluid-dynamic simulation models to forecast bottlenecks 35 minutes in advance.',
      metric: '35-min forward projection',
    },
    {
      title: 'INCIDENT DETECTION',
      subtitle: 'Sub-second Anomaly Ingestion',
      iconImage: IMAGES.iconQuantumShield,
      description: 'When lead vehicles decelerate abnormally or municipal roadworks deploy barriers, DISHA recognizes the topological slowdown pattern immediately and activates diversion vectors.',
      metric: '1.2s reroute response',
    },
    {
      title: 'ROUTE ALTERNATIVES',
      subtitle: 'Deterministic, Transparent Choice',
      iconImage: IMAGES.iconNeuralRoute,
      description: 'No cryptic algorithmic surprises through impassable alleyways. DISHA presents clearly characterized options: Fastest, Balanced, Low-Traffic, and Surface-Safe.',
      metric: 'Zero narrow alleyway traps',
    },
  ];

  const comparison = [
    { feature: 'Congestion Awareness', legacy: 'Reactive (shows where cars are already stopped)', disha: 'Predictive (models where choke points will form in 35 mins)' },
    { feature: 'Road Surface & Potholes', legacy: 'Ignored completely', disha: 'Continuous surface telemetry & pothole avoidance' },
    { feature: 'Route Characterization', legacy: 'Single black-box suggestion', disha: 'Transparent trade-offs: Fastest, Balanced, Low-Traffic' },
    { feature: 'Vehicle Tuning', legacy: 'Generic passenger car assumption', disha: 'Vehicle-specific kinematics (EV, Sedan, Logistics)' },
    { feature: 'Narrow Street Avoidance', legacy: 'Frequently routes into jammed 6-ft lanes', disha: 'Arterial priority with width clearance enforcement' },
  ];

  return (
    <section className="relative py-32 bg-transparent overflow-hidden border-t border-orange-950/60">
      
      {/* Background glow in orange amber */}
      <div className="absolute bottom-1/4 left-10 w-[600px] h-[600px] bg-orange-950/20 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={60}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#180f08]/90 border border-orange-500/40 font-mono text-xs font-semibold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-orange-400">
                <img src={IMAGES.iconNavArrow} alt="Advantage" className="w-full h-full object-cover" />
              </div>
              <span className="floating-text-orange">06 // ARCHITECTURAL ADVANTAGE</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight">
              <span className="floating-text-primary">WHY DISHA.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg floating-text-sub">
              Engineered specifically to solve the unpredictable kinetic chaos of high-density metropolitan road networks.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            return (
              <ScrollReveal key={idx} direction="up" delay={80 * (idx + 1)}>
                <div className="glass-hud rounded-2xl p-6 flex flex-col justify-between border border-orange-500/25 hover:border-orange-400/70 transition-all duration-300 group h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-orange-500/40 mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={pillar.iconImage} 
                        alt={pillar.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h3 className="font-display text-lg font-bold floating-text-primary tracking-wide mb-1">
                      {pillar.title}
                    </h3>
                    <div className="font-mono text-xs text-amber-300 mb-3">
                      {pillar.subtitle}
                    </div>
                    <p className="text-xs sm:text-sm floating-text-sub leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-950 text-xs font-mono floating-text-orange flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                      <img src={pillar.iconImage} alt="Metric" className="w-full h-full object-cover" />
                    </div>
                    <span>{pillar.metric}</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Comparison Table */}
        <ScrollReveal direction="up" delay={150}>
          <div className="glass-hud rounded-3xl overflow-hidden border border-orange-950">
            <div className="p-6 bg-black/80 border-b border-orange-950 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold floating-text-primary">
                The Evolution of Navigation
              </h3>
              <span className="font-mono text-xs floating-text-orange uppercase">
                PARADIGM SHIFT
              </span>
            </div>

            <div className="divide-y divide-orange-950/80 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-black/90 floating-text-muted uppercase tracking-wider">
                    <th className="py-3.5 px-6">Capability</th>
                    <th className="py-3.5 px-6 text-stone-500">Legacy Navigation Apps</th>
                    <th className="py-3.5 px-6 text-orange-400">DISHA Intelligent Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-950/60 font-sans">
                  {comparison.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-black/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold floating-text-primary">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 floating-text-muted flex items-center gap-2.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{row.legacy}</span>
                      </td>
                      <td className="py-4 px-6 text-orange-200 font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full overflow-hidden border border-orange-400 flex-shrink-0">
                            <img src={IMAGES.iconNavArrow} alt="Check" className="w-full h-full object-cover" />
                          </div>
                          <span>{row.disha}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
