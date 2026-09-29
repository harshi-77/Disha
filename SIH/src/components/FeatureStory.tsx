import React, { useState } from 'react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

export const FeatureStory: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features = [
    {
      index: '01',
      title: 'TRAFFIC',
      headline: 'Predictive Velocity Matrices, Not Static Red Lines.',
      description: 'Conventional GPS paints the map crimson only after thousands of cars have already ground to a dead halt. DISHA deploys neural network flow prediction to evaluate traffic accumulation up to 45 minutes ahead, routing you through steady green waves before the surge crests.',
      iconImage: IMAGES.iconTrafficRadar,
      metrics: [
        { label: 'Latency Prediction', value: '45 mins ahead' },
        { label: 'Stop-and-Go Reduction', value: '-38%' },
      ],
      hotspot: { x: '35%', y: '48%', label: 'Corridor Velocity Sensor' },
    },
    {
      index: '02',
      title: 'ROAD CONDITIONS',
      headline: 'Micro-Surface Telemetry Calibrated for Real Indian Roads.',
      description: 'A 2-kilometer detour is faster than creeping over cratered asphalt and violent speed breakers. DISHA builds continuous road surface index maps—quantifying pothole clusters, monsoon waterlogging vulnerabilities, and ongoing infrastructure construction zones.',
      iconImage: IMAGES.iconNeuralRoute,
      metrics: [
        { label: 'Surface Indexing', value: '0.5m granularity' },
        { label: 'Suspension Protection', value: 'High' },
      ],
      hotspot: { x: '68%', y: '36%', label: 'Surface Roughness Radar' },
    },
    {
      index: '03',
      title: 'ROUTE INTELLIGENCE',
      headline: 'Multi-Objective Synthesis Tailored to Your Vehicle.',
      description: 'One algorithm cannot serve an electric vehicle, an emergency responder, and a heavy logistics truck equally. DISHA dynamically optimizes for battery regeneration gradients, fuel efficiency, road width clearance, and arrival confidence.',
      iconImage: IMAGES.iconQuantumShield,
      metrics: [
        { label: 'Optimization Engine', value: 'Multi-Objective Pareto' },
        { label: 'Fuel/Energy Saved', value: 'Up to 22%' },
      ],
      hotspot: { x: '52%', y: '64%', label: 'Multi-Branch Node Optimizer' },
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-transparent overflow-hidden">
      
      {/* Orange ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-orange-950/25 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={60}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="font-mono text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400">
                  <img src={IMAGES.iconNavArrow} alt="Perception Icon" className="w-full h-full object-cover" />
                </div>
                <span className="floating-text-orange">02 // PERCEPTION & COGNITION</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight">
                <span className="floating-text-primary block">DISHA SEES MORE</span>
                <span className="floating-text-orange block">THAN A ROAD.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="floating-text-sub text-sm sm:text-base leading-relaxed">
                Standard navigation sees simple line graphs with length and speed limits. DISHA perceives topology, vehicle kinetics, surface degradation, and human behavioral flow.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature Grid & Visual Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: 3 Editorial Features Accordion */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {features.map((feature, idx) => {
              const isActive = activeFeature === idx;
              return (
                <ScrollReveal key={feature.index} direction="right" delay={90 * (idx + 1)}>
                  <div
                    onClick={() => setActiveFeature(idx)}
                    className={`p-6 sm:p-7 rounded-2xl transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? 'glass-hud border-orange-400/80 shadow-[0_0_35px_rgba(249,115,22,0.3)] bg-black/85'
                        : 'bg-black/50 border-orange-950 hover:border-orange-700/60 hover:bg-black/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-orange-400/50">
                          <img src={feature.iconImage} alt={feature.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-mono text-xs tracking-widest floating-text-orange font-bold">
                          {feature.index} // {feature.title}
                        </span>
                      </div>
                      {isActive && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
                        </span>
                      )}
                    </div>

                    <h3 className={`font-display text-xl sm:text-2xl font-bold mb-2 transition-colors ${
                      isActive ? 'floating-text-primary' : 'floating-text-sub'
                    }`}>
                      {feature.headline}
                    </h3>

                    <p className={`text-sm leading-relaxed transition-colors ${
                      isActive ? 'floating-text-sub' : 'floating-text-muted line-clamp-2'
                    }`}>
                      {feature.description}
                    </p>

                    {/* Active Metrics Bar */}
                    {isActive && (
                      <div className="mt-5 pt-4 border-t border-orange-950 flex items-center gap-6">
                        {feature.metrics.map((m, mIdx) => (
                          <div key={mIdx}>
                            <div className="text-[10px] font-mono floating-text-muted uppercase">{m.label}</div>
                            <div className="font-mono text-sm font-bold text-orange-300 mt-0.5">{m.value}</div>
                          </div>
                        ))}
                        <div className="ml-auto">
                          <span className="text-[10px] font-mono text-orange-300 bg-orange-950/80 border border-orange-500/30 px-2 py-1 rounded">
                            TELEMETRY READY
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right Column: High-Tech Road Condition Visualizer */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal direction="left" delay={120}>
              <div className="relative rounded-3xl overflow-hidden border border-orange-500/35 glass-hud shadow-2xl">
                
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={IMAGES.roadConditions}
                    alt="DISHA road conditions view with glowing orange lane analysis"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 scale-100 hover:scale-105"
                  />

                  {/* Dark tech gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                  {/* Dynamic Hotspot pin */}
                  <div 
                    className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                    style={{
                      left: features[activeFeature].hotspot.x,
                      top: features[activeFeature].hotspot.y,
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-orange-400 opacity-60" />
                      <div className="relative flex items-center justify-center w-7 h-7 rounded-full overflow-hidden border border-orange-300 shadow-[0_0_20px_#f97316]">
                        <img src={features[activeFeature].iconImage} alt="Hotspot" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute left-9 whitespace-nowrap glass-hud px-3 py-1 rounded-md text-[11px] font-mono floating-text-orange border border-orange-400/50 shadow-lg">
                        {features[activeFeature].hotspot.label}
                      </div>
                    </div>
                  </div>

                  {/* Simulated Radar Ring */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                    <div className="w-64 h-64 border border-orange-500/40 rounded-full animate-ping duration-1000" />
                  </div>
                </div>

                {/* Bottom Telemetry Bar */}
                <div className="p-4 sm:p-5 bg-black/95 border-t border-orange-950 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5 floating-text-sub">
                    <div className="w-5 h-5 rounded-md overflow-hidden border border-orange-400/40">
                      <img src={IMAGES.iconNeuralRoute} alt="Sensor Array" className="w-full h-full object-cover" />
                    </div>
                    <span>SURFACE SENSING ARRAY</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                      82 Nodes Calibrated
                    </span>
                    <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                      SIMULATION
                    </span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
