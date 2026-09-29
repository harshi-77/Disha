import React, { useEffect, useState } from 'react';
import { X, Cloud, RefreshCw } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { fetchUserSavedRoutes, FirestoreSavedRoute } from '../lib/firebase';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email: string; name: string; uid?: string } | null;
  onOpenPlanner: () => void;
  onSignOut: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenPlanner,
  onSignOut,
}) => {
  const [savedRoutes, setSavedRoutes] = useState<FirestoreSavedRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadSavedRoutes();
    }
  }, [isOpen, user]);

  const loadSavedRoutes = async () => {
    setLoadingRoutes(true);
    try {
      const routes = await fetchUserSavedRoutes();
      setSavedRoutes(routes);
    } catch (e) {
      console.error('Failed to load user saved routes', e);
    } finally {
      setLoadingRoutes(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-950/90 border-b border-orange-950 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-orange-500/50 shadow-md">
              <img src={IMAGES.navSignIn} alt="Pilot" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold floating-text-primary flex items-center gap-2">
                {user.name}'s Mobility Dashboard
                <span className="flex items-center gap-1 text-[10px] font-mono text-orange-400 bg-orange-950/80 border border-orange-800 px-2 py-0.5 rounded">
                  <Cloud className="w-3 h-3 text-orange-400" />
                  SUPABASE SYNCED
                </span>
              </h2>
              <p className="text-xs floating-text-sub font-mono">
                {user.email} • ID: {user.uid ? `${user.uid.slice(0, 10)}...` : 'demo_pilot'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Lifetime Impact Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-orange-950">
              <div className="text-[10px] font-mono floating-text-muted uppercase flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                  <img src={IMAGES.iconTrafficRadar} alt="Time" className="w-full h-full object-cover" />
                </div>
                Time Saved
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold floating-text-orange mt-1">
                18.4 hrs
              </div>
              <div className="text-[10px] font-mono text-orange-400/80 mt-0.5">+2.1 hrs this week</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-orange-950">
              <div className="text-[10px] font-mono floating-text-muted uppercase flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-amber-400">
                  <img src={IMAGES.iconNeuralRoute} alt="Fuel" className="w-full h-full object-cover" />
                </div>
                Fuel Conserved
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                34.8 L
              </div>
              <div className="text-[10px] font-mono text-amber-500/80 mt-0.5">₹3,480 saved</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-orange-950">
              <div className="text-[10px] font-mono floating-text-muted uppercase flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                  <img src={IMAGES.iconQuantumShield} alt="CO2" className="w-full h-full object-cover" />
                </div>
                CO₂ Offset
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold floating-text-primary mt-1">
                82.6 kg
              </div>
              <div className="text-[10px] font-mono text-stone-400 mt-0.5">Green commute rating: A+</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-orange-950">
              <div className="text-[10px] font-mono floating-text-muted uppercase flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
                  <img src={IMAGES.iconNavArrow} alt="Potholes" className="w-full h-full object-cover" />
                </div>
                Potholes Avoided
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-orange-400 mt-1">
                142
              </div>
              <div className="text-[10px] font-mono text-orange-400/80 mt-0.5">Suspension index: 96%</div>
            </div>
          </div>

          {/* Quick Route Actions */}
          <div className="p-5 rounded-2xl bg-stone-950/60 border border-orange-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold floating-text-primary text-base">Plan Next Urban Journey</h4>
              <p className="text-xs floating-text-sub font-mono">
                Real-time multi-objective prediction based on live Bengaluru corridor flow.
              </p>
            </div>
            <button
              onClick={() => { onClose(); onOpenPlanner(); }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] whitespace-nowrap cursor-pointer"
            >
              Open Route Planner →
            </button>
          </div>

          {/* Saved Destinations & Vehicle Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Saved Locations from Firestore */}
            <div className="p-5 rounded-2xl bg-stone-950/60 border border-orange-950">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-bold floating-text-primary text-sm flex items-center gap-2">
                  <span>Saved Frequent Corridors</span>
                  <span className="text-[10px] text-orange-400 font-mono bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800">
                    {savedRoutes.length > 0 ? `${savedRoutes.length} in Cloud` : 'Presets'}
                  </span>
                </h4>
                <button
                  onClick={loadSavedRoutes}
                  title="Reload routes"
                  className="p-1 text-stone-400 hover:text-orange-400 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingRoutes ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {savedRoutes.length > 0 ? (
                  savedRoutes.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/60 border border-orange-950/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-medium floating-text-sub truncate max-w-[200px]">
                          {item.origin} → {item.destination}
                        </div>
                        <div className="text-[10px] font-mono floating-text-muted">
                          {item.distanceKm} km • {item.routeId.toUpperCase()}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-orange-400 bg-orange-950/60 border border-orange-900 px-2 py-0.5 rounded">
                        {item.durationMin}m (-{item.savingsMin}m)
                      </span>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Home → Whitefield ITPL', dist: '18.4 km', bestTime: '32m via ORR' },
                    { name: 'Koramangala 80ft → Indiranagar', dist: '7.2 km', bestTime: '16m via Inner Ring' },
                    { name: 'HSR Sector 1 → BLR Airport', dist: '44.0 km', bestTime: '55m via Express' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/60 border border-orange-950/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-medium floating-text-sub">{item.name}</div>
                        <div className="text-[10px] font-mono floating-text-muted">{item.dist}</div>
                      </div>
                      <span className="font-mono text-[11px] text-orange-400 bg-orange-950/60 border border-orange-900 px-2 py-0.5 rounded">
                        {item.bestTime}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Registered Vehicle */}
            <div className="p-5 rounded-2xl bg-stone-950/60 border border-orange-950">
              <h4 className="font-display font-bold floating-text-primary text-sm mb-3">Active Vehicle Profile</h4>
              <div className="p-3.5 rounded-xl bg-black/60 border border-orange-950/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="floating-text-muted">Vehicle Model:</span>
                  <span className="font-bold floating-text-sub">Tata Nexon EV Max 40.5kWh</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="floating-text-muted">Regen Calibration:</span>
                  <span className="text-orange-400">Level 3 (Adaptive Descent)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="floating-text-muted">Surface Clearance:</span>
                  <span className="text-stone-300">205 mm (High Roughness Tolerance)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="floating-text-muted">Algorithm Preference:</span>
                  <span className="text-amber-400">Pareto (Energy Recovery Priority)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-orange-950 flex justify-between items-center">
                <span className="text-xs font-mono floating-text-muted flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Cloud Database Connected
                </span>
                <button
                  onClick={onSignOut}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
