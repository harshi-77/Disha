import React, { useState } from 'react';
import { Plus, Minus, Navigation, Layers, Check } from 'lucide-react';
import { TILE_PROVIDERS } from '../../config/constants';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateUser: () => void;
  onResetView: () => void;
  showTrafficOverlay: boolean;
  onToggleTraffic: () => void;
  showSpillbackZones: boolean;
  onToggleSpillback: () => void;
  tileLayerKey: keyof typeof TILE_PROVIDERS;
  onChangeTileLayer: (key: keyof typeof TILE_PROVIDERS) => void;
  isLocating?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocateUser,
  onResetView,
  showTrafficOverlay,
  onToggleTraffic,
  showSpillbackZones,
  onToggleSpillback,
  tileLayerKey,
  onChangeTileLayer,
  isLocating,
}) => {
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  return (
    <>
      {/* Bottom-Left Google Maps Layers Button & Popover */}
      <div className="absolute left-4 bottom-7 z-20">
        {showLayersMenu && (
          <div className="mb-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.18)] border border-gray-200/80 p-3 w-64 text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-700">Map details</span>
              <button
                onClick={() => setShowLayersMenu(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                ✕
              </button>
            </div>

            {/* Map Styles */}
            <div className="text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Map Type
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {(Object.keys(TILE_PROVIDERS) as (keyof typeof TILE_PROVIDERS)[]).map((key) => {
                const isSelected = tileLayerKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => onChangeTileLayer(key)}
                    className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-7 rounded border mb-1 flex items-center justify-center text-[10px] ${
                        key === 'cartoVoyager'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : key === 'cartoDark'
                          ? 'bg-slate-900 text-slate-100 border-slate-700'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {key === 'cartoVoyager' ? 'City' : key === 'cartoDark' ? 'Satellite' : 'Road'}
                    </div>
                    <span className="text-[10px] leading-tight truncate w-full">
                      {key === 'cartoVoyager' ? 'City' : key === 'cartoDark' ? 'Satellite' : 'Road'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map Details & Overlays */}
            <div className="text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Overlays
            </div>
            <div className="space-y-1">
              <label
                onClick={onToggleTraffic}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-800 font-medium">Traffic conditions</span>
                </div>
                <input
                  type="checkbox"
                  checked={showTrafficOverlay}
                  onChange={() => {}}
                  className="rounded text-blue-600 focus:ring-0 accent-blue-600"
                />
              </label>

              <label
                onClick={onToggleSpillback}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-800 font-medium">Spillback danger zones</span>
                </div>
                <input
                  type="checkbox"
                  checked={showSpillbackZones}
                  onChange={() => {}}
                  className="rounded text-blue-600 focus:ring-0 accent-blue-600"
                />
              </label>
            </div>
          </div>
        )}

        {/* Google Maps Authentic "Layers" button */}
        <button
          onClick={() => setShowLayersMenu((p) => !p)}
          className="flex flex-col items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.18)] border border-gray-200/90 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] group"
          title="Map layers & traffic details"
        >
          <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium text-gray-700 mt-0.5">Layers</span>
        </button>
      </div>

      {/* Bottom-Right Google Maps Controls: Location + Zoom */}
      <div className="absolute right-4 bottom-7 z-20 flex flex-col items-center gap-3">
        {/* Google Maps Location Target circle button */}
        <button
          onClick={onLocateUser}
          disabled={isLocating}
          title="Show your location"
          className="w-10 h-10 bg-white hover:bg-gray-50 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.22)] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all active:scale-95"
        >
          <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Google Maps Zoom Box (+ / -) */}
        <div className="bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.22)] border border-gray-200 flex flex-col divide-y divide-gray-100 overflow-hidden w-10">
          <button
            onClick={onZoomIn}
            title="Zoom in"
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={onZoomOut}
            title="Zoom out"
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};
