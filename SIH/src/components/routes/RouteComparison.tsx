import React from 'react';
import { RouteOption } from '../../types';
import { Check, ShieldAlert, Zap, Clock, Leaf, ArrowLeft, X } from 'lucide-react';

interface RouteComparisonProps {
  routes: RouteOption[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  onClose?: () => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onClose,
}) => {
  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-blue-50/50">
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
            <div className="text-sm font-bold text-gray-900">Route Trade-Off Comparison</div>
            <div className="text-[11px] text-gray-500 font-normal">
              Multi-objective balance matrix
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

      {/* Comparison Route Cards */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isDisha = route.isDishaRecommended;

          return (
            <div
              key={route.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? isDisha
                    ? 'border-blue-500 bg-blue-50/40 shadow-sm'
                    : 'border-gray-400 bg-gray-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isDisha
                        ? 'bg-blue-100 text-blue-800'
                        : route.tag === 'FASTEST'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {route.tag}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 truncate">
                    {route.name.split('—')[0]}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-gray-900">
                    {route.durationMin}
                  </span>
                  <span className="text-xs text-gray-500">min</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-[11px] font-sans">
                <div>
                  <div className="text-gray-500 text-[10px]">Current Load</div>
                  <div className="text-gray-900 font-semibold">{route.currentCongestionPercent}%</div>
                </div>

                <div>
                  <div className="text-gray-500 text-[10px]">Predicted Load</div>
                  <div
                    className={`font-semibold ${
                      route.predictedCongestionPercent > 65
                        ? 'text-red-600'
                        : route.predictedCongestionPercent < 35
                        ? 'text-emerald-700'
                        : 'text-amber-600'
                    }`}
                  >
                    {route.predictedCongestionPercent}%
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-[10px]">Spillback Risk</div>
                  <div
                    className={`uppercase font-bold ${
                      route.spillbackRisk === 'high' || route.spillbackRisk === 'severe'
                        ? 'text-red-600'
                        : route.spillbackRisk === 'medium'
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {route.spillbackRisk}
                  </div>
                </div>
              </div>

              {/* Trade-off summary */}
              <div className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                {route.tradeOffSummary}
              </div>

              {/* Select Action Button */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-[10px] text-gray-500 font-medium">
                  CO2: {route.co2EmissionsKg} kg · Efficiency: {route.qpsoScore.toFixed(0)}%
                </div>
                <button
                  onClick={() => onSelectRoute(route.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                    isSelected
                      ? 'bg-gray-100 text-gray-700 border border-gray-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Choose Route'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
