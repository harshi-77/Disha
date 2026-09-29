import React, { useState } from 'react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: '01',
      title: 'UNDERSTAND',
      subtitle: 'Continuous Multi-Spectral Ingestion',
      iconImage: IMAGES.iconTrafficRadar,
      detail: 'DISHA assimilates millions of continuous data streams: anonymized vehicle velocity telematics, municipal light cycles, road surface roughness indexes, and micro-weather patterns.',
      stats: '1.2B data points/sec ingested across city nodes',
      tags: ['Telematics Feed', 'Signal Status', 'Surface Sensors'],
    },
    {
      number: '02',
      title: 'ANALYZE',
      subtitle: 'Spatial Graph Neural Prediction',
      iconImage: IMAGES.iconNeuralRoute,
      detail: 'Using proprietary graph neural networks (GNNs), DISHA models urban traffic as a fluid topological network, forecasting choke points and secondary ripple delays before brake lights appear.',
      stats: '35-45 min predictive lead time with 98.4% accuracy',
      tags: ['Topological GNN', 'Bottleneck Forecast', 'Shockwave Modeling'],
    },
    {
      number: '03',
      title: 'COMPARE',
      subtitle: 'Multi-Objective Pareto Arbitration',
      iconImage: IMAGES.iconNavArrow,
      detail: 'Thousands of corridor permutations are evaluated concurrently against vehicle profile, fuel efficiency, suspension health, and arrival certainty to produce optimal route candidates.',
      stats: 'Over 4,200 permutations solved in <12ms',
      tags: ['Pareto Optimization', 'EV Energy Curves', 'Surface Grading'],
    },
    {
      number: '04',
      title: 'GUIDE',
      subtitle: 'Proactive Dynamic Course Direction',
      iconImage: IMAGES.iconQuantumShield,
      detail: 'Clear, timely notifications guide you through green waves and execute seamless diversions before you reach the trapped queue of an arterial bottleneck.',
      stats: 'Average commute time curtailed by 23%',
      tags: ['Adaptive Reroute', 'Green Wave Sync', 'Zero Surprise Guarantee'],
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 bg-transparent overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-orange-950/20 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={60}>
          <div className="max-w-3xl mb-16">
            <div className="font-mono text-xs font-semibold tracking-widest uppercase mb-3.5 flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400">
                <img src={IMAGES.iconNeuralRoute} alt="Pipeline Icon" className="w-full h-full object-cover" />
              </div>
              <span className="floating-text-orange">04 // THE INTELLIGENCE PIPELINE</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight">
              <span className="floating-text-primary">FROM SIGNAL TO DECISION.</span>
            </h2>
            <p className="mt-4 floating-text-sub text-base sm:text-lg">
              How raw sensor turbulence is transformed into deterministic route intelligence in sub-second cycles.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Steps Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <ScrollReveal key={step.number} direction="up" delay={80 * (idx + 1)}>
                <div
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative flex flex-col justify-between border ${
                    isActive
                      ? 'glass-hud border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.35)] bg-black/80 -translate-y-1'
                      : 'bg-black/50 border-orange-950 hover:border-orange-800 hover:bg-black/70'
                  }`}
                >
                  <div>
                    {/* Top Bar with Number & Icon Image */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-2xl font-black floating-text-orange">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-500/40 shadow-md">
                        <img 
                          src={step.iconImage} 
                          alt={step.title}
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-display text-xl font-bold floating-text-primary tracking-wide mb-1">
                      {step.title}
                    </h3>
                    <div className="font-mono text-xs text-amber-300 mb-4">
                      {step.subtitle}
                    </div>

                    {/* Description */}
                    <p className="floating-text-sub text-xs sm:text-sm leading-relaxed mb-6">
                      {step.detail}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {step.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950/80 border border-orange-950 floating-text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats Footer */}
                    <div className="pt-3 border-t border-orange-950 text-[11px] font-mono floating-text-orange flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                        <img src={IMAGES.iconTrafficRadar} alt="Stat" className="w-full h-full object-cover" />
                      </div>
                      <span>{step.stats}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Dynamic Simulated Synthesis Box */}
        <ScrollReveal direction="up" delay={180}>
          <div className="mt-12 glass-hud rounded-2xl p-6 sm:p-8 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-orange-400/40 flex-shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.35)]">
                <img src={IMAGES.iconQuantumShield} alt="Security Mesh" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display text-lg font-bold floating-text-primary">
                  Closed-Loop Urban Optimization Engine
                </div>
                <p className="text-xs sm:text-sm floating-text-sub mt-0.5">
                  Every route suggestion is continuously recalculated against emergent real-world velocity anomalies until your vehicle safely docks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-mono text-xs text-orange-400 flex items-center gap-2 bg-orange-950/80 border border-orange-500/40 px-3.5 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                GNN NODE CLUSTER: SYNCED
              </span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
