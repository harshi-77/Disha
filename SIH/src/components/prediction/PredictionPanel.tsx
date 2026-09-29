import React, { useState } from 'react';
import { TrafficPrediction } from '../../types';
import { Clock, TrendingUp, AlertTriangle, Info, ArrowLeft, X } from 'lucide-react';

interface PredictionPanelProps {
  prediction: TrafficPrediction;
  onClose?: () => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction, onClose }) => {
  const [selectedHorizon, setSelectedHorizon] = useState<number>(30);

  const activeForecast =
    prediction.forecasts.find((f) => f.minutesFromNow === selectedHorizon) ||
    prediction.forecasts[1];

  // SVG Area / Line Chart
  const chartHeight = 110;
  const chartWidth = 320;
  const paddingX = 20;
  const paddingY = 15;

  const points = prediction.hourlyForecast.map((item, idx) => {
    const x =
      paddingX +
      (idx / (prediction.hourlyForecast.length - 1)) *
        (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      (item.congestionPercent / 100) * (chartHeight - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${
    chartHeight - paddingY
  } L ${points[0].x},${chartHeight - paddingY} Z`;

  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-amber-50/40">
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
              <span>Traffic Congestion Forecast</span>
            </div>
            <div className="text-[11px] text-gray-500 font-normal">
              Expected road conditions for your area
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
            TRAFFIC OUTLOOK
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metric Boxes */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Current */}
          <div
            onClick={() => setSelectedHorizon(0)}
            className={`p-2 rounded-xl border cursor-pointer transition-all ${
              selectedHorizon === 0
                ? 'border-blue-500 bg-blue-50 shadow-xs'
                : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="text-[10px] font-semibold text-gray-500 uppercase">Now</div>
            <div className="text-base font-bold text-gray-900 font-sans mt-0.5">
              {prediction.currentCongestionPercent}%
            </div>
            <div className="text-[9px] text-emerald-700 font-medium">Normal</div>
          </div>

          {/* +15 MIN */}
          <div
            onClick={() => setSelectedHorizon(15)}
            className={`p-2 rounded-xl border cursor-pointer transition-all ${
              selectedHorizon === 15
                ? 'border-blue-500 bg-blue-50 shadow-xs'
                : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="text-[10px] font-semibold text-gray-500 uppercase">+15 min</div>
            <div className="text-base font-bold text-amber-600 font-sans mt-0.5">
              51%
            </div>
            <div className="text-[9px] text-amber-700">+9% rise</div>
          </div>

          {/* +30 MIN */}
          <div
            onClick={() => setSelectedHorizon(30)}
            className={`p-2 rounded-xl border cursor-pointer transition-all ${
              selectedHorizon === 30
                ? 'border-blue-500 bg-blue-50 shadow-xs'
                : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="text-[10px] font-semibold text-gray-500 uppercase">+30 min</div>
            <div className="text-base font-bold text-orange-600 font-sans mt-0.5">
              63%
            </div>
            <div className="text-[9px] text-orange-700">+21% rise</div>
          </div>

          {/* +60 MIN */}
          <div
            onClick={() => setSelectedHorizon(60)}
            className={`p-2 rounded-xl border cursor-pointer transition-all ${
              selectedHorizon === 60
                ? 'border-blue-500 bg-blue-50 shadow-xs'
                : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="text-[10px] font-semibold text-gray-500 uppercase">+60 min</div>
            <div className="text-base font-bold text-red-600 font-sans mt-0.5">
              70%
            </div>
            <div className="text-[9px] text-red-700 font-bold">Peak</div>
          </div>
        </div>

        {/* Selected Forecast Detail Card */}
        <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">
              {selectedHorizon === 0
                ? 'Current Traffic Baseline'
                : `Horizon Forecast: +${selectedHorizon} Minutes`}
            </span>
            <span className="text-blue-700 font-bold text-[11px]">
              Avg Speed: ~{activeForecast.projectedSpeedKmh} km/h
            </span>
          </div>
          <div className="text-[11px] text-gray-600 leading-relaxed">
            {selectedHorizon > 0 ? (
              <>
                Congestion is projected to rise to{' '}
                <strong className="text-gray-900">{activeForecast.congestionPercent}%</strong> as
                Silk Board and Central Arterials accumulate inflow. DISHA recommends departing via
                Route C before +20 min.
              </>
            ) : (
              'Corridors flowing at baseline speeds. Anticipated evening commuter surge initiates at 17:30.'
            )}
          </div>
        </div>

        {/* 24-Hour Graph */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Day Congestion Trend</span>
            </div>
            <span className="text-[10px] text-gray-400 font-normal">Expected trend</span>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 bg-white">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-28 overflow-visible"
            >
              <defs>
                <linearGradient id="gmapPredictionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#e5e7eb"
                strokeDasharray="2,2"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="#e5e7eb"
                strokeDasharray="2,2"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#d1d5db"
                strokeWidth="1"
              />

              {/* Area & Line */}
              <path d={areaD} fill="url(#gmapPredictionGrad)" />
              <path
                d={pathD}
                fill="none"
                stroke="#1a73e8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3"
                  fill="#ffffff"
                  stroke="#1a73e8"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* Time axis */}
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1 px-1">
              <span>07:00</span>
              <span>10:00</span>
              <span>13:00</span>
              <span>16:00</span>
              <span className="text-red-600 font-bold">18:00 Peak</span>
              <span>21:00</span>
            </div>
          </div>
        </div>

        {/* Info notice */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-gray-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            This outlook is an estimate. Check road conditions before you leave.
          </div>
        </div>
      </div>
    </div>
  );
};
