import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LIVE_CORRIDORS, TrafficCorridor } from '../data/mobilityData';
import { IMAGES } from '../constants/images';

interface LiveTrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTrafficModal: React.FC<LiveTrafficModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'optimal' | 'congested'>('all');
  const [corridors] = useState<TrafficCorridor[]>(LIVE_CORRIDORS);
  const [activeCorridorId, setActiveCorridorId] = useState<string>('bengaluru-orr');

  if (!isOpen) return null;

  const filteredCorridors = corridors.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'optimal') return c.status === 'optimal';
    if (filter === 'congested') return c.status === 'congested' || c.status === 'moderate';
    return true;
  });

  const active = corridors.find(c => c.id === activeCorridorId) || corridors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-stone-950/90 border-b border-orange-950 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-orange-500/50 shadow-md">
              <img src={IMAGES.iconTrafficRadar} alt="Radar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold floating-text-primary flex items-center gap-2">
                Bengaluru Live Mobility Radar
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 border border-orange-800 px-2 py-0.5 rounded">
                  LIVE TELEMETRY FEED [SIMULATION]
                </span>
              </h2>
              <p className="text-xs floating-text-sub font-mono">
                Real-time arterial throughput, incident clustering, and corridor velocity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 bg-black/60 border-b border-orange-950 flex items-center justify-between flex-wrap gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="floating-text-muted">Filter By Status:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-orange-500 text-black font-bold' : 'bg-stone-950 text-stone-400 hover:text-white'}`}
            >
              All (5)
            </button>
            <button
              onClick={() => setFilter('optimal')}
              className={`px-3 py-1 rounded-md transition-colors ${filter === 'optimal' ? 'bg-amber-500 text-black font-bold' : 'bg-stone-950 text-stone-400 hover:text-white'}`}
            >
              Optimal Flow
            </button>
            <button
              onClick={() => setFilter('congested')}
              className={`px-3 py-1 rounded-md transition-colors ${filter === 'congested' ? 'bg-rose-500 text-white font-bold' : 'bg-stone-950 text-stone-400 hover:text-white'}`}
            >
              Congestion / Alert
            </button>
          </div>

          <div className="floating-text-orange flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>22,460 VEHICLES MONITORED</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Corridors List */}
          <div className="lg:col-span-5 space-y-3 max-h-[460px] overflow-y-auto pr-2">
            {filteredCorridors.map((corridor) => {
              const isSelected = corridor.id === activeCorridorId;
              return (
                <div
                  key={corridor.id}
                  onClick={() => setActiveCorridorId(corridor.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected 
                      ? 'glass-hud border-orange-400 bg-stone-950/90 shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
                      : 'bg-black/70 border-orange-950 hover:border-orange-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-display font-bold text-sm floating-text-primary">{corridor.name}</div>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      corridor.status === 'optimal' ? 'bg-orange-950 text-orange-400' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {corridor.flowPercentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono floating-text-muted mt-2">
                    <span>Avg Velocity: <strong className="floating-text-primary">{corridor.avgSpeedKmph} km/h</strong></span>
                    <span>{corridor.activeVehicles} vehicles</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Corridor Inspector */}
          <div className="lg:col-span-7 bg-black/90 rounded-2xl border border-orange-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-orange-950">
                <div>
                  <span className="font-mono text-xs floating-text-orange uppercase">
                    CORRIDOR TELEMETRY INSPECTION
                  </span>
                  <h3 className="font-display text-2xl font-bold floating-text-primary mt-1">
                    {active.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-orange-400 bg-orange-950/80 border border-orange-900 px-3 py-1 rounded">
                  {active.trend.toUpperCase()} TREND
                </span>
              </div>

              {/* Corridor Metrics */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-orange-950">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Velocity Profile</div>
                  <div className="font-mono text-2xl font-bold floating-text-primary mt-1">
                    {active.avgSpeedKmph} <span className="text-xs floating-text-muted">km/h</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-orange-950">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Arterial Flow</div>
                  <div className="font-mono text-2xl font-bold text-orange-400 mt-1">
                    {active.flowPercentage}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-orange-950">
                  <div className="text-[10px] font-mono floating-text-muted uppercase">Density Load</div>
                  <div className="font-mono text-2xl font-bold floating-text-primary mt-1">
                    {active.activeVehicles}
                  </div>
                </div>
              </div>

              {/* Real-time incident banner */}
              {active.incidentText ? (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-3 mb-4">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 flex-shrink-0">
                    <img src={IMAGES.iconQuantumShield} alt="Alert" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-200">Incident Alert</div>
                    <div>{active.incidentText}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/30 text-xs font-mono text-orange-200 flex items-center gap-3 mb-4">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400 flex-shrink-0">
                    <img src={IMAGES.iconNeuralRoute} alt="Clear" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-orange-200">Unobstructed Flow</div>
                    <div>No major bottlenecks or construction interruptions detected.</div>
                  </div>
                </div>
              )}

              {/* Simulated CCTV Node info */}
              <div className="p-4 rounded-xl bg-stone-950/50 border border-orange-950 text-xs font-mono">
                <div className="flex items-center justify-between floating-text-muted mb-2">
                  <span className="flex items-center gap-2 floating-text-orange">
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                      <img src={IMAGES.iconTrafficRadar} alt="Node" className="w-full h-full object-cover" />
                    </div>
                    Simulated Optical Node #BLR-{(active.id.length * 17)}
                  </span>
                  <span className="text-orange-400">99.2% OCR READ RATE</span>
                </div>
                <p className="floating-text-sub text-[11px] leading-relaxed">
                  Autonomous vehicle density counters verify lane distribution and average speed every 3 seconds to update DISHA's spatial graph networks.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-orange-950 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-mono text-xs font-bold uppercase transition-colors"
              >
                Close Radar View
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
