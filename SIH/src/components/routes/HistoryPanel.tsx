import React from 'react';
import { JourneyHistoryItem } from '../../types';
import { History, ArrowRight, Clock, Navigation, Leaf, ArrowLeft, X } from 'lucide-react';

interface HistoryPanelProps {
  historyItems: JourneyHistoryItem[];
  onRerunJourney: (item: JourneyHistoryItem) => void;
  onClose?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  historyItems,
  onRerunJourney,
  onClose,
}) => {
  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200/60"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900">Recent Journeys & History</div>
            <div className="text-[11px] text-gray-500 font-normal">
              Logged mobility runs & carbon savings
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-xs space-y-2 shadow-2xs"
          >
            {/* Origin to Destination */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 truncate">
                {item.origin.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="font-semibold text-gray-900 truncate">
                {item.destination.name}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 py-1.5 border-y border-gray-100 text-[11px]">
              <div>
                <span className="text-[10px] text-gray-500 block">Distance</span>
                <span className="text-gray-800 font-semibold">{item.distanceKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Duration</span>
                <span className="text-gray-800 font-semibold">{item.durationMin} min</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">CO2 Offset</span>
                <span className="text-[#188038] font-bold">-{item.co2SavedKg} kg</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>{item.completedAt}</span>
              <button
                onClick={() => onRerunJourney(item)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
              >
                Re-calculate Route
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
