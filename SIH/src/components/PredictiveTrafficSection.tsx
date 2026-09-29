import React, { useState } from 'react';
import { Clock, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const PredictiveTrafficSection: React.FC = () => {
  const [timeOffset, setTimeOffset] = useState<number>(15);

  const CORRIDORS = [
    {
      name: 'Outer Ring Road (Silk Board → Bellandur)',
      currentSpeed: 38,
      predictedSpeed: timeOffset === 0 ? 38 : timeOffset === 15 ? 24 : timeOffset === 30 ? 14 : timeOffset === 45 ? 18 : 28,
      status: timeOffset >= 30 ? 'Severe Choke' : timeOffset === 15 ? 'Forming Wave' : 'Optimal Flow',
      color: timeOffset >= 30 ? 'text-rose-400' : timeOffset === 15 ? 'text-amber-400' : 'text-emerald-400',
    },
    {
      name: 'Airport Elevated Expressway (Hebbal → BLR)',
      currentSpeed: 68,
      predictedSpeed: timeOffset >= 45 ? 45 : 65,
      status: timeOffset >= 45 ? 'Moderate' : 'Free Flowing',
      color: timeOffset >= 45 ? 'text-amber-400' : 'text-emerald-400',
    },
    {
      name: 'Hosur Road Electronic City Flyover',
      currentSpeed: 52,
      predictedSpeed: timeOffset >= 30 ? 36 : 50,
      status: timeOffset >= 30 ? 'Dense' : 'Optimal Flow',
      color: timeOffset >= 30 ? 'text-amber-400' : 'text-emerald-400',
    },
    {
      name: 'Old Airport Road → Marathahalli',
      currentSpeed: 29,
      predictedSpeed: timeOffset >= 15 ? 16 : 29,
      status: timeOffset >= 15 ? 'Bottleneck' : 'Moderate',
      color: timeOffset >= 15 ? 'text-rose-400' : 'text-amber-400',
    },
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-orange-950/60">
      <ScrollReveal direction="up" delay={50}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="font-mono text-xs floating-text-orange uppercase tracking-wider block mb-1">
              GRAPH NEURAL PREDICTION
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl floating-text-primary">
              Predictive Traffic Modeling
            </h2>
          </div>
          <div className="text-xs font-mono floating-text-sub flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Recommended Optimal Departure: <strong>Right Now (within 12 mins)</strong></span>
          </div>
        </div>
      </ScrollReveal>

      {/* Time Offset Slider Box */}
      <ScrollReveal direction="up" delay={80}>
        <div className="glass-hud rounded-3xl p-6 sm:p-8 border border-orange-500/35 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-display font-bold text-lg floating-text-primary">
                Simulated Time Offset: <span className="floating-text-orange">+{timeOffset} Minutes</span>
              </div>
              <p className="text-xs font-mono floating-text-sub mt-0.5">
                Simulating downstream ripple effects and vehicle queue accumulations across 4.8M daily kilometers.
              </p>
            </div>

            {/* Quick offset buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-orange-950">
              {[0, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimeOffset(mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    timeOffset === mins
                      ? 'bg-orange-500 text-black font-bold shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {mins === 0 ? 'Now' : `+${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Corridor Prediction Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORRIDORS.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/60 border border-orange-950/80 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-bold floating-text-primary mb-1">{c.name}</div>
                  <div className="text-[10px] font-mono floating-text-muted flex items-center gap-3">
                    <span>Current: {c.currentSpeed} km/h</span>
                    <span>→ Predicted: <strong className="text-orange-300">{c.predictedSpeed} km/h</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border border-current/30 ${c.color} bg-black`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
