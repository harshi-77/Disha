import React, { useState } from 'react';
import { Zap, Fuel, SquareParking, Utensils, Hospital, Bath, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const SmartStopsExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ev' | 'fuel' | 'parking' | 'food' | 'hospital' | 'restroom'>('ev');

  const STOPS_DATA = {
    ev: [
      { name: 'Ather Grid 60kW DC Fast Hub', loc: 'Indiranagar 100ft Road', status: '3/4 Slots Available', speed: '60 kW Fast', rating: '4.9 ★' },
      { name: 'Tata Power EZ Charge (CCS2)', loc: 'Koramangala Sony World', status: '2/2 Slots Available', speed: '50 kW DC', rating: '4.7 ★' },
      { name: 'Zeon Charging Fast Station', loc: 'Bellandur EcoSpace', status: '4/6 Slots Available', speed: '120 kW Superfast', rating: '4.8 ★' },
    ],
    fuel: [
      { name: 'Shell Auto Fuel & Deli', loc: 'Outer Ring Road, Bellandur', status: 'Open 24/7 • High Octane V-Power', speed: '0 min queue', rating: '4.9 ★' },
      { name: 'Indian Oil Swagat Oasis', loc: 'Hosur Road Electronic City', status: 'CNG + Petrol + Air Pressure', speed: '2 min queue', rating: '4.6 ★' },
      { name: 'Bharat Petroleum Speed Point', loc: 'Old Airport Road', status: 'Open 24/7 • EV Fast Charger on-site', speed: '1 min queue', rating: '4.7 ★' },
    ],
    parking: [
      { name: 'Garuda Mall Smart Multi-level', loc: 'Magrath Road, CBD', status: '84 Slots Open • Fastag Auto-Exit', speed: 'Covered / CCTV', rating: '4.8 ★' },
      { name: 'Metro Park & Ride Electronic City', loc: 'Phase 1 Metro Terminal', status: '120 4-Wheeler Slots', speed: 'Direct Footbridge', rating: '4.6 ★' },
    ],
    food: [
      { name: 'Third Wave Coffee Roasters Drive-Thru', loc: 'Koramangala 80ft Road', status: 'Open 7 AM - 1 AM • Restroom available', speed: 'Drive-Thru Lane', rating: '4.9 ★' },
      { name: 'Rameshwaram Cafe Express Point', loc: 'Indiranagar 12th Main', status: 'Hot South Indian Breakfast / Filter Coffee', speed: '5 min turnaround', rating: '4.8 ★' },
    ],
    hospital: [
      { name: 'Manipal Hospital Emergency 24x7', loc: 'HAL Old Airport Road', status: 'Trauma ICU & Ambulance Standby', speed: 'Emergency Gate', rating: '4.9 ★' },
      { name: 'Apollo Spectra Medical Hub', loc: 'Koramangala 5th Block', status: 'Emergency Response / Pharmacy', speed: '24x7 Counter', rating: '4.8 ★' },
    ],
    restroom: [
      { name: 'Shell Convenience Restroom Lounge', loc: 'Bellandur ORR', status: 'Sanitized Hourly • Wheelchair Accessible', speed: 'Keycard Access', rating: '4.9 ★' },
      { name: 'Metro Station Passenger Restroom', loc: 'Indiranagar Metro', status: 'Braille / Ramp Accessible', speed: 'Public Facility', rating: '4.7 ★' },
    ],
  };

  const currentList = STOPS_DATA[activeCategory] || STOPS_DATA.ev;

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-orange-950/60">
      <ScrollReveal direction="up" delay={50}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="font-mono text-xs floating-text-orange uppercase tracking-wider block mb-1">
              WAYPOINT INFRASTRUCTURE
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl floating-text-primary">
              Smart Stops Along Your Trajectory
            </h2>
          </div>
          <p className="text-xs font-mono floating-text-sub max-w-md">
            Integrated stops with real-time slot availability, EV charger speeds, and clean amenities.
          </p>
        </div>
      </ScrollReveal>

      {/* Categories Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {[
          { id: 'ev', icon: Zap, label: '⚡ EV Fast Charging' },
          { id: 'fuel', icon: Fuel, label: '⛽ Fuel & Air' },
          { id: 'parking', icon: SquareParking, label: '🅿️ Smart Parking' },
          { id: 'food', icon: Utensils, label: '🍽️ Food & Cafes' },
          { id: 'hospital', icon: Hospital, label: '🏥 24x7 Hospitals' },
          { id: 'restroom', icon: Bath, label: '🚻 Clean Restrooms' },
        ].map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  : 'glass-hud floating-text-sub hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentList.map((stop, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl glass-hud bg-stone-950/70 border border-orange-950/80 flex flex-col justify-between hover:border-orange-500/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  {stop.speed}
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">{stop.rating}</span>
              </div>
              <h3 className="font-display font-bold text-base floating-text-primary mb-1 group-hover:text-orange-200 transition-colors">
                {stop.name}
              </h3>
              <p className="text-xs font-mono floating-text-muted mb-3">{stop.loc}</p>
            </div>

            <div className="pt-3 border-t border-orange-950/60 flex items-center justify-between text-xs font-mono">
              <span className="text-orange-400 font-medium">{stop.status}</span>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
