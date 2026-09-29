import React, { useState } from 'react';
import { SpillbackSimulationData } from '../../types';
import { spillbackService } from '../../services/api/spillbackService';
import { AlertTriangle, ArrowRight, ArrowLeft, Sliders, ShieldCheck, X } from 'lucide-react';

interface SpillbackAnalysisPanelProps {
  initialData: SpillbackSimulationData;
  onSelectAlternative: () => void;
  onClose?: () => void;
}

export const SpillbackAnalysisPanel: React.FC<SpillbackAnalysisPanelProps> = ({
  initialData,
  onSelectAlternative,
  onClose,
}) => {
  const [data, setData] = useState<SpillbackSimulationData>(initialData);
  const [additionalVehicles, setAdditionalVehicles] = useState<number>(500);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<'sequence' | 'schematic'>('sequence');

  const handleRunSimulation = async (vehCount: number) => {
    setIsSimulating(true);
    setAdditionalVehicles(vehCount);
    try {
      const result = await spillbackService.runSimulation({
        routeId: 'route-a',
        additionalVehiclesPerHour: vehCount,
      });
      setData(result);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-red-50/50">
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
              <span>Traffic Spillback Analysis</span>
            </div>
            <div className="text-[11px] text-gray-500 font-normal">
              Backward Queue Shockwave Propagation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 tracking-wider">
            SCENARIO ANALYSIS
          </span>
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

      {/* View Switcher: Sequence vs Network Comparison */}
      <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center gap-1 text-xs">
        <button
          onClick={() => setViewMode('sequence')}
          className={`flex-1 py-1 px-2 rounded-md font-semibold transition-colors ${
            viewMode === 'sequence'
              ? 'bg-white text-blue-600 shadow-2xs border border-gray-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Spillback Sequence
        </button>
        <button
          onClick={() => setViewMode('schematic')}
          className={`flex-1 py-1 px-2 rounded-md font-semibold transition-colors ${
            viewMode === 'schematic'
              ? 'bg-white text-blue-600 shadow-2xs border border-gray-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Before vs After Schematic
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {viewMode === 'schematic' ? (
          /* SECTION 19: BEFORE/AFTER NETWORK SCHEMATIC */
          <div className="space-y-4">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Network Corridor Comparison
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Left: Current Network */}
              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="font-bold text-gray-800 flex items-center justify-between border-b border-gray-200 pb-1">
                  <span>CURRENT</span>
                  <span className="text-emerald-700 font-normal">Moderate</span>
                </div>
                <div className="space-y-1 text-[11px] text-gray-600">
                  <p><strong>Route A:</strong> 24 min</p>
                  <p>Congestion: <span className="font-bold text-gray-800">42%</span></p>
                  <p>Queue length: ~120m</p>
                  <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-600 h-full w-[42%]" />
                  </div>
                  <p className="text-[10px] text-gray-400 pt-1">Silk Board flow stable</p>
                </div>
              </div>

              {/* Right: Predicted Network */}
              <div className="p-3 rounded-xl border border-red-300 bg-red-50/50 space-y-2">
                <div className="font-bold text-red-900 flex items-center justify-between border-b border-red-200 pb-1">
                  <span>PREDICTED</span>
                  <span className="text-red-700 font-bold uppercase">High Risk</span>
                </div>
                <div className="space-y-1 text-[11px] text-gray-600">
                  <p><strong>Route A:</strong> <span className="text-red-600 font-bold">39 min</span></p>
                  <p>Congestion: <span className="font-bold text-red-600">78%</span></p>
                  <p>Queue length: <span className="font-bold text-red-600">~850m</span></p>
                  <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-red-600 h-full w-[78%]" />
                  </div>
                  <p className="text-[10px] text-red-700 pt-1">Downstream queue spillback</p>
                </div>
              </div>
            </div>

            {/* Alternative Route Card */}
            <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recommended Alternative: Route C
                </span>
                <span className="font-bold text-[#188038]">27 min</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                By taking the Sarjapur divergence bypass, vehicles avoid the 850m queue backlog entirely with only 25% predicted congestion.
              </p>
              <button
                onClick={onSelectAlternative}
                className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <span>Select Route C Bypass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* SECTION 18: VISUALLY CLEAR SEQUENCE */
          <>
            {/* 1. CURRENT */}
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  CURRENT
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Route A
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="font-bold text-gray-900 text-xs">Central Arterial Expressway</div>
                <div className="text-right">
                  <span className="text-base font-bold text-gray-900 font-sans">24</span>
                  <span className="text-xs text-gray-500 ml-1">min</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-600 pt-1 border-t border-gray-200/80 flex justify-between">
                <span>Current Congestion: <strong>42%</strong></span>
                <span className="text-gray-500">Normal Flow</span>
              </div>
            </div>

            <div className="flex justify-center text-gray-400">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">↓ Inflow Surge (+500 veh/hr)</span>
            </div>

            {/* 2. VEHICLE ASSIGNMENT & STRESS */}
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-blue-600" />
                  VEHICLE ASSIGNMENT
                </span>
                <span className="text-[10px] text-blue-700 font-mono">
                  Cap: {data.simulationParameters.corridorCapacityVehicles} v/h
                </span>
              </div>

              <div className="text-xs text-gray-700">
                Additional simulated traffic:
                <strong className="text-blue-700 ml-1 font-bold">
                  +{additionalVehicles} veh/hr
                </strong>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={additionalVehicles}
                  onChange={(e) => handleRunSimulation(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>+200</span>
                  <span>+500 (Nominal)</span>
                  <span>+1200 (Extreme)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center text-gray-400">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">↓ Downstream Bottleneck Triggered</span>
            </div>

            {/* 3. PREDICTED FUTURE */}
            <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  PREDICTED FUTURE
                </span>
                <span className="text-[10px] font-bold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                  Spillback: HIGH
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="font-bold text-gray-900 text-xs">Route A (Shockwave Queue)</div>
                <div className="text-right">
                  <span className="text-base font-bold text-red-600 font-sans">39</span>
                  <span className="text-xs text-red-600 ml-1">min (+15m delay)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-red-200/80">
                <div>
                  <span className="text-gray-500 block text-[10px]">Predicted Congestion</span>
                  <span className="text-red-700 font-bold">78%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Queue Backlog</span>
                  <span className="text-red-700 font-bold">~850m queue</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center text-gray-400">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">↓ DISHA Re-Optimization</span>
            </div>

            {/* 4. RESULT */}
            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  RESULT: Route C
                </span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Spillback: LOW
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="font-bold text-gray-900 text-xs">
                  DISHA Smart Route (Adaptive Bypass)
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#188038] font-sans">27</span>
                  <span className="text-xs text-emerald-700 ml-1">min</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1 border-t border-emerald-200">
                <span>Predicted Congestion: <strong className="text-emerald-800">25%</strong></span>
                <span className="text-[#188038] font-bold">+12 min saved</span>
              </div>

              <button
                onClick={onSelectAlternative}
                className="w-full mt-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Adopt DISHA Recommended Bypass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* Bottleneck Intersections List */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            Critical Choke Points
          </div>
          {data.bottlenecks.map((bn) => (
            <div
              key={bn.id}
              className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="text-gray-900 font-medium truncate">{bn.name}</div>
                <div className="text-[10px] text-gray-500">Threshold: {bn.criticalThresholdMeters}m</div>
              </div>
              <div className="text-right shrink-0">
                <div className={bn.queueLengthMeters >= bn.criticalThresholdMeters ? 'text-red-600 font-bold' : 'text-gray-700'}>
                  {bn.queueLengthMeters}m backlog
                </div>
                <div className="text-[10px] text-gray-500">
                  Risk: {(bn.spillbackProb * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
