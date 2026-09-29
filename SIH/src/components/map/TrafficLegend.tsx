import React from 'react';
import { CONGESTION_COLORS } from '../../config/constants';

export const TrafficLegend: React.FC = () => {
  return (
    <div className="absolute left-24 bottom-7 z-10 bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-lg px-3 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.16)] text-xs pointer-events-auto flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-gray-800">Traffic</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-500">Fast</span>
        <div className="flex h-2 w-20 rounded-full overflow-hidden">
          <div className="flex-1 bg-[#188038]" title="Low" />
          <div className="flex-1 bg-[#ea8600]" title="Moderate" />
          <div className="flex-1 bg-[#d93025]" title="Slow" />
          <div className="flex-1 bg-[#a50e0e]" title="Severe" />
        </div>
        <span className="text-[10px] text-gray-500">Slow</span>
      </div>
    </div>
  );
};
