import React from 'react';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { ScrollReveal } from './ScrollReveal';

interface FinalCTAProps {
  onStartPlanning: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartPlanning }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-32 bg-transparent border-t border-orange-950/60">
      
      {/* City Horizon backdrop pass-through layer with rich orange glow */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.futuristicRoadHorizon}
          alt="Futuristic highway leading toward glowing city horizon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 opacity-80 brightness-110"
        />

        {/* Ambient Gradients for orange & black atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-950/25 via-amber-950/15 to-black/85" />

        {/* Vertical horizon glow beam in orange */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-transparent via-orange-500/60 to-transparent blur-sm pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle badge with 3D orange icon image */}
        <ScrollReveal direction="down" delay={40}>
          <div className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#180f08]/90 border border-orange-500/40 font-mono text-xs font-semibold tracking-widest uppercase mb-8 shadow-[0_0_25px_rgba(249,115,22,0.35)] hover:border-orange-400 hover:shadow-[0_0_35px_rgba(249,115,22,0.7)] transition-all cursor-pointer">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400/80 group-hover:scale-110 transition-transform">
              <img src={IMAGES.iconNavArrow} alt="DISHA Logo" className="w-full h-full object-cover" />
            </div>
            <span className="floating-text-orange">DISHA INTELLIGENT PLATFORM</span>
          </div>
        </ScrollReveal>

        {/* Requested Headline: YOUR JOURNEY STARTS HERE. */}
        <ScrollReveal direction="up" delay={60}>
          <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
            <span className="floating-text-primary block">
              YOUR JOURNEY
            </span>
            <span className="floating-text-orange block mt-1">
              STARTS HERE.
            </span>
          </h2>
        </ScrollReveal>

        {/* Supporting Copy */}
        <ScrollReveal direction="up" delay={90}>
          <p className="text-xl sm:text-2xl floating-text-sub max-w-xl mx-auto font-normal leading-relaxed mb-10">
            Let DISHA find a smarter way forward.
          </p>
        </ScrollReveal>

        {/* Prominent Action Buttons at the END OF THE WEBSITE: Start Planning & Start Your Journey */}
        <ScrollReveal direction="up" delay={120}>
          <div className="flex items-center justify-center">
            {/* Primary Action Button: START PLANNING → */}
            <button
              onClick={onStartPlanning}
              className="group relative inline-flex items-center justify-center gap-3.5 px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black font-display font-black text-lg tracking-wide uppercase transition-all duration-300 shadow-[0_0_45px_rgba(249,115,22,0.65)] hover:shadow-[0_0_70px_rgba(249,115,22,0.9)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-black shadow-inner group-hover:scale-110 transition-transform">
                <img src={IMAGES.iconNeuralRoute} alt="Route Planning" className="w-full h-full object-cover" />
              </div>
              <span>START PLANNING</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>
        </ScrollReveal>

        {/* Telemetry footnote */}
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-12 text-xs font-mono floating-text-muted flex flex-wrap items-center justify-center gap-4">
            <span>● ZERO CREDIT CARD REQUIRED</span>
            <span>● READY FOR BENGALURU & METRO HUBS</span>
            <span>● REAL-TIME PREDICTIVE ROUTING</span>
          </div>
        </ScrollReveal>

      </div>

    </section>
  );
};
