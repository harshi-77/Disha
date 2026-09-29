import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTraffic: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenTraffic,
}) => {
  if (!isOpen) return null;

  const NOTIFICATIONS = [
    {
      id: '1',
      title: 'Silk Board Northbound Flow Restored',
      desc: 'Accident cleared on elevated ramp. Average velocity improved from 12 km/h to 44 km/h.',
      time: '6m ago',
      type: 'success',
    },
    {
      id: '2',
      title: 'Monsoon Alert: Outer Ring Road Puddles',
      desc: 'Heavy rain detected near Bellandur junction. Low ground-clearance sedans advised to take Marathahalli bypass.',
      time: '18m ago',
      type: 'warning',
    },
    {
      id: '3',
      title: 'Recommended Departure for Work Trip',
      desc: 'Leave by 8:45 AM to reach Electronic City before downstream shockwave delay forms at HSR signal.',
      time: '32m ago',
      type: 'info',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 p-6 animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-orange-400 shadow-md">
            <img src={IMAGES.iconTrafficRadar} alt="Notifications" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl floating-text-primary">
              Corridor Notifications
            </h3>
            <p className="text-xs floating-text-sub font-mono">
              Live automated alerts from Bengaluru sensor grid
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-2xl bg-stone-950/70 border border-orange-950 flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-black border border-orange-500/30 flex-shrink-0 mt-0.5">
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {n.type === 'info' && <Clock className="w-4 h-4 text-orange-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm floating-text-primary">{n.title}</h4>
                  <span className="text-[10px] font-mono floating-text-muted">{n.time}</span>
                </div>
                <p className="text-xs font-mono floating-text-sub mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-orange-950 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenTraffic();
            }}
            className="text-xs font-mono text-orange-400 hover:underline cursor-pointer"
          >
            Inspect Live Radar →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            Mark as Read
          </button>
        </div>

      </div>
    </div>
  );
};
