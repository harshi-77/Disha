import React, { useState } from 'react';
import { AlertTriangle, Plus, Filter, MapPin, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface RoadIntelligenceHubProps {
  onOpenReportModal: () => void;
}

export const RoadIntelligenceHub: React.FC<RoadIntelligenceHubProps> = ({
  onOpenReportModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'potholes' | 'waterlog' | 'accidents' | 'construction'>('all');

  const HAZARDS = [
    {
      id: 'h1',
      type: 'potholes',
      icon: '🕳️',
      title: 'Sony World Junction Trench',
      desc: 'Severe pothole cluster across lane 2. 14cm depth recorded by suspension telematics.',
      loc: 'Koramangala 80ft Road',
      time: '12m ago',
      verifiedCount: 42,
    },
    {
      id: 'h2',
      type: 'waterlog',
      icon: '🌊',
      title: 'Bellandur Service Road Waterlogging',
      desc: '12cm standing water accumulation following monsoon shower. Sedans advised to take flyover.',
      loc: 'Outer Ring Road Bellandur',
      time: '24m ago',
      verifiedCount: 88,
    },
    {
      id: 'h3',
      type: 'construction',
      icon: '🚧',
      title: 'Metro Pillar Barricade Shifting',
      desc: 'Left two lanes barricaded for girder installation. Speed reduced to 15 km/h.',
      loc: 'Silk Board Northbound Ramp',
      time: '1h ago',
      verifiedCount: 120,
    },
    {
      id: 'h4',
      type: 'accidents',
      icon: '💥',
      title: 'Stalled Heavy Vehicle',
      desc: 'Broken axle truck blocking flyover merge lane. Crane team dispatched.',
      loc: 'Domlur Flyover descent',
      time: '18m ago',
      verifiedCount: 35,
    },
  ];

  const filtered = filter === 'all' ? HAZARDS : HAZARDS.filter(h => h.type === filter);

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-orange-950/60">
      <ScrollReveal direction="up" delay={50}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs floating-text-orange uppercase tracking-wider block mb-1">
              COMMUNITY CROWDSOURCED SENSORS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl floating-text-primary">
              Live Road Hazard Intelligence
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report Road Issue</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {[
          { id: 'all', label: 'All Hazards (4)' },
          { id: 'potholes', label: '🕳️ Potholes' },
          { id: 'waterlog', label: '🌊 Waterlogging' },
          { id: 'accidents', label: '💥 Accidents' },
          { id: 'construction', label: '🚧 Construction' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              filter === tab.id
                ? 'bg-orange-500 text-black font-bold shadow-md'
                : 'glass-hud floating-text-sub hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hazards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl glass-hud bg-stone-950/70 border border-orange-950/80 flex flex-col justify-between hover:border-orange-500/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-mono text-orange-400/80 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-900/60">
                  {item.time}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm floating-text-primary mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] font-mono floating-text-sub leading-relaxed mb-3">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-orange-950/60 flex items-center justify-between text-[10px] font-mono floating-text-muted">
              <span className="flex items-center gap-1 truncate max-w-[130px]">
                <MapPin className="w-3 h-3 text-orange-400 flex-shrink-0" />
                <span className="truncate">{item.loc}</span>
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {item.verifiedCount} pilots
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
