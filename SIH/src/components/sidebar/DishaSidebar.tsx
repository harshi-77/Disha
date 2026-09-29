import React from 'react';
import {
  Navigation,
  Car,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Layers,
  HelpCircle,
  Bookmark,
  History,
  Settings,
  User,
  X,
  Sparkles,
  ShieldCheck,
  Server,
  Activity,
  Sliders,
} from 'lucide-react';
import { isLiveMode } from '../../services/api/apiClient';

export type SidebarTab =
  | 'plan'
  | 'routes'
  | 'saved'
  | 'traffic'
  | 'prediction'
  | 'incidents'
  | 'smart_route'
  | 'spillback'
  | 'future_congestion'
  | 'comparison'
  | 'why_disha'
  | 'profile'
  | 'history'
  | 'settings';

interface DishaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onReturnToLanding?: () => void;
}

export const DishaSidebar: React.FC<DishaSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenAuth,
  onReturnToLanding,
}) => {
  if (!isOpen) return null;

  const live = isLiveMode();

  const handleItemClick = (tab: SidebarTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Card */}
      <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 font-sans text-gray-800">
        {/* Header Banner */}
        <div className="p-4 border-b border-gray-100 flex items-start justify-between bg-blue-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-lg font-bold text-gray-900 tracking-tight">DISHA Maps</span>
            </div>
            <div className="text-[11px] text-gray-500 font-normal mt-0.5">
              Predict. Optimize. Adapt.
            </div>
            <div className="mt-2 text-[11px] text-gray-500 font-medium">
              Intelligent mobility workspace
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item Groups */}
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-gray-100">
          {/* Group 1: General Navigation */}
          <div className="px-2 py-1 space-y-0.5">
            <button
              onClick={() => handleItemClick('plan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'plan' || activeTab === 'routes'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Directions</span>
            </button>

            <button
              onClick={() => handleItemClick('saved')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'saved' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Saved Places</span>
            </button>

            <button
              onClick={() => handleItemClick('history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'history' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4 text-gray-500" />
              <span>Your Timeline & History</span>
            </button>
          </div>

          {/* Group 2: Live Telemetry */}
          <div className="px-2 py-2">
            <div className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Live Conditions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleItemClick('traffic')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'traffic' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Live Traffic Feed</span>
              </button>

              <button
                onClick={() => handleItemClick('prediction')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'prediction' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Traffic Congestion Forecast (+30m, +60m)</span>
              </button>
            </div>
          </div>

          {/* Group 3: DISHA Intelligence */}
          <div className="px-2 py-2">
            <div className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Smart Features
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleItemClick('smart_route')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'smart_route' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Smart Route Optimization</span>
              </button>

              <button
                onClick={() => handleItemClick('spillback')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'spillback' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Congestion & Delay Simulation</span>
              </button>

              <button
                onClick={() => handleItemClick('comparison')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'comparison' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Route Trade-Off Comparison</span>
              </button>

              <button
                onClick={() => handleItemClick('why_disha')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'why_disha' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-cyan-600" />
                <span>Why This Route? (Intelligent Analysis)</span>
              </button>
            </div>
          </div>

          {/* Group 4: Account & Settings */}
          <div className="px-2 py-2">
            <div className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Account & Configuration
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4 text-gray-600" />
                <span>User Profile</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <span>Settings & Connection</span>
              </button>

              {onReturnToLanding && (
                <button
                  onClick={() => {
                    onReturnToLanding();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-blue-600 rotate-180" />
                  <span>Return to Home Overview</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between bg-gray-50">
          <span>DISHA Mobility Engine</span>
          <span>Navigation workspace</span>
        </div>
      </div>
    </div>
  );
};
