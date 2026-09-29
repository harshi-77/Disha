import React from 'react';
import { TrendingUp, Clock, DollarSign, Leaf, RotateCcw, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface PersonalMobilityInsightsProps {
  onRepeatTrip: (origin: string, destination: string) => void;
}

export const PersonalMobilityInsights: React.FC<PersonalMobilityInsightsProps> = ({
  onRepeatTrip,
}) => {
  const INSIGHTS = [
    { label: 'Total Urban Trips', val: '42 Trips', sub: '+6 this week', color: 'floating-text-primary' },
    { label: 'Distance Navigated', val: '584 Km', sub: 'Across Bengaluru Grid', color: 'text-orange-400' },
    { label: 'Cumulative Time Saved', val: '24.8 Hrs', sub: 'vs Legacy Google Maps', color: 'floating-text-orange' },
    { label: 'Fuel / Energy Saved', val: '₹4,120', sub: 'Pareto optimized flow', color: 'text-amber-400' },
    { label: 'CO₂ Footprint Offset', val: '104.2 Kg', sub: 'Green mobility index: A+', color: 'text-emerald-400' },
  ];

  const RECENT_TRIPS = [
    {
      id: 't1',
      origin: 'Koramangala 80ft Road',
      destination: 'Whitefield ITPL Main Road',
      time: '32 min',
      date: 'Yesterday at 8:30 AM',
      savings: '14 min saved',
      fuel: '₹140',
    },
    {
      id: 't2',
      origin: 'HSR Layout Sector 1',
      destination: 'Indiranagar 100ft Road',
      time: '18 min',
      date: 'Sep 23 at 6:15 PM',
      savings: '9 min saved',
      fuel: '₹84',
    },
    {
      id: 't3',
      origin: 'Koramangala 80ft Road',
      destination: 'Kempegowda Airport (BLR)',
      time: '52 min',
      date: 'Sep 21 at 4:00 PM',
      savings: '22 min saved',
      fuel: '₹340',
    },
  ];

  return (
    <section id="insights" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-orange-950/60">
      <ScrollReveal direction="up" delay={50}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="font-mono text-xs floating-text-orange uppercase tracking-wider block mb-1">
              METRIC SYNTHESIS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl floating-text-primary">
              Personal Mobility Insights
            </h2>
          </div>
          <p className="text-xs font-mono floating-text-sub max-w-md">
            Quantified commute efficiency, carbon footprint mitigation, and suspension savings.
          </p>
        </div>
      </ScrollReveal>

      {/* 5-Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10">
        {INSIGHTS.map((item, i) => (
          <ScrollReveal key={i} direction="up" delay={50 * (i + 1)}>
            <div className="p-4 rounded-2xl glass-hud bg-stone-950/70 border border-orange-950/80">
              <div className="text-[10px] font-mono floating-text-muted uppercase mb-1">
                {item.label}
              </div>
              <div className={`font-display font-bold text-2xl sm:text-3xl ${item.color} mt-1`}>
                {item.val}
              </div>
              <div className="text-[10px] font-mono floating-text-sub mt-1">
                {item.sub}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Recent Trips with 1-Click Repeat */}
      <div className="glass-hud rounded-3xl p-6 sm:p-8 border border-orange-500/30 bg-black/80">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-orange-950/80">
          <div>
            <h3 className="font-display font-bold text-lg floating-text-primary">Recent Urban Trajectories</h3>
            <p className="text-xs font-mono floating-text-sub">Instant 1-click trajectory dispatch with live conditions</p>
          </div>
          <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 border border-orange-800 px-2 py-1 rounded">
            SYNCED WITH CLOUD
          </span>
        </div>

        <div className="space-y-3">
          {RECENT_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="p-4 rounded-2xl bg-stone-950/80 border border-orange-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-500/40 transition-colors"
            >
              <div>
                <div className="font-display font-bold text-sm floating-text-primary">
                  {trip.origin} <span className="text-orange-400">→</span> {trip.destination}
                </div>
                <div className="text-[11px] font-mono floating-text-muted mt-0.5 flex items-center gap-3">
                  <span>{trip.date}</span>
                  <span>•</span>
                  <span>{trip.time} duration</span>
                  <span>•</span>
                  <span className="text-emerald-400">{trip.savings}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-stone-300 bg-stone-900 px-2.5 py-1 rounded border border-stone-800">
                  Fuel: {trip.fuel}
                </span>
                <button
                  onClick={() => onRepeatTrip(trip.origin, trip.destination)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(249,115,22,0.35)] cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Repeat Journey</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
