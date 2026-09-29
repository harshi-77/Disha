import React from 'react';
import { TrafficSegment, TrafficIncident } from '../../types';
import { CONGESTION_COLORS } from '../../config/constants';
import { AlertCircle, Gauge, Activity, RefreshCw, ArrowLeft, X } from 'lucide-react';
import { isLiveMode } from '../../services/api/apiClient';

interface TrafficPanelProps {
  segments: TrafficSegment[];
  incidents: TrafficIncident[];
  onRefresh: () => void;
  isLoading: boolean;
  onClose?: () => void;
}

export const TrafficPanel: React.FC<TrafficPanelProps> = ({
  segments,
  incidents,
  onRefresh,
  isLoading,
  onClose,
}) => {
  const live = isLiveMode();

  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-emerald-50/50">
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
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>Traffic Conditions</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded uppercase">
                ROAD CONDITIONS
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-normal">
              Road speed and delay information
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            title="Refresh traffic"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Traffic Levels Indicator Bar */}
        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Current Traffic Levels
          </div>
          <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-center">
            <div className="p-1 rounded bg-emerald-50 text-[#188038] border border-emerald-200">
              Low
            </div>
            <div className="p-1 rounded bg-amber-50 text-[#ea8600] border border-amber-200">
              Moderate
            </div>
            <div className="p-1 rounded bg-orange-50 text-[#d93025] border border-orange-200">
              Heavy
            </div>
            <div className="p-1 rounded bg-red-50 text-[#a50e0e] border border-red-200">
              Severe
            </div>
          </div>
        </div>

        {/* Incident Alerts */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Road alerts</span>
            </span>
            <span className="text-[10px] text-gray-400 font-normal">Active Chokepoints</span>
          </div>

          {incidents.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
              No road alerts currently active.
            </div>
          )}

          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-3 rounded-xl border border-red-200 bg-red-50/50 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900">{inc.title}</span>
                <span className="text-[10px] font-mono text-red-700 font-bold">
                  +{inc.impactDelayMin} min delay
                </span>
              </div>
              <div className="text-[11px] text-gray-700 leading-relaxed">
                {inc.description}
              </div>
              <div className="text-[10px] text-gray-500 flex items-center justify-between pt-1 border-t border-red-200/60">
                <span>{inc.roadName}</span>
                <span>{inc.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Monitored Corridors */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Monitored Road Corridors</span>
          </div>

          <div className="space-y-2">
            {segments.map((seg) => {
              const color = CONGESTION_COLORS[seg.level];

              return (
                <div
                  key={seg.id}
                  className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs space-y-2 hover:bg-white hover:shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 truncate pr-2">{seg.name}</div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="text-[11px] font-bold uppercase"
                        style={{ color }}
                      >
                        {seg.level} ({seg.congestionPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Flow progress bar */}
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${seg.congestionPercent}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 pt-1 border-t border-gray-200/60 font-mono">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-gray-400" />
                      <span>Speed: <strong className="text-gray-800">{seg.currentSpeedKmh}</strong> / {seg.freeFlowSpeedKmh} km/h</span>
                    </div>
                    <div className="text-right">
                      <span>Flow: <strong className="text-gray-800">{seg.vehiclesPerHour}</strong> veh/hr</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
