import React from 'react';
import { Settings, ShieldCheck, Zap, User, Menu, X } from 'lucide-react';
import { isLiveMode } from '../../services/api/apiClient';

interface TopNavBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenAuth,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const live = isLiveMode();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 relative select-none">
      {/* Zone 1: Single Brand Element */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <a href="/" className="flex items-baseline gap-2 group">
          <span className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400 group-hover:scale-110 transition-transform"></span>
            DISHA
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-normal">
            Dynamic Intelligent System for Holistic Access
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation Links (Single-line, quiet hover states) */}
      <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
        <button
          onClick={() => onSelectTab('plan')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
            activeTab === 'plan' || activeTab === 'routes'
              ? 'bg-slate-800 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Directions
        </button>
        <button
          onClick={() => onSelectTab('traffic')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
            activeTab === 'traffic'
              ? 'bg-slate-800 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Live Traffic
        </button>
        <button
          onClick={() => onSelectTab('prediction')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
            activeTab === 'prediction'
              ? 'bg-slate-800 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Predictions
        </button>
        <button
          onClick={() => onSelectTab('smart_route')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
            activeTab === 'smart_route'
              ? 'bg-slate-800 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Smart Routing
        </button>
        <button
          onClick={() => onSelectTab('spillback')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
            activeTab === 'spillback'
              ? 'bg-slate-800 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Congestion Simulator
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* Operating Mode Status (Unboxed / clean button) */}
        <button
          onClick={onOpenSettings}
          title="Click to configure API Base URL or toggle mode"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              live ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
            }`}
          />
          <span className="text-slate-300">{live ? 'LIVE API' : 'DEMO MODE'}</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="Settings & External Integrations"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAuth}
          title="Account & Mobility Profile"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
