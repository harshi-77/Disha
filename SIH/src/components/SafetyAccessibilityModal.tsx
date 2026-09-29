import React, { useState } from 'react';
import { X, ShieldAlert, Share2, PhoneCall, Accessibility, Volume2, Eye, Check } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface SafetyAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyAccessibilityModal: React.FC<SafetyAccessibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'accessibility'>('safety');
  const [sosActive, setSosActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Accessibility toggles
  const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
  const [avoidStairs, setAvoidStairs] = useState(true);
  const [voiceNav, setVoiceNav] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  if (!isOpen) return null;

  const handleShareLiveLocation = () => {
    navigator.clipboard.writeText('https://disha-mobility.ai/live-share/blr-84920');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTriggerSos = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-xl bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 p-6 animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-orange-950 pb-4">
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'safety'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Safety & Emergency</span>
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'accessibility'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>Accessibility Suite</span>
          </button>
        </div>

        {/* Tab 1: Safety & Emergency */}
        {activeTab === 'safety' && (
          <div className="space-y-4">
            
            {/* SOS Emergency Assistance */}
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-rose-300 text-sm">One-Touch SOS Protocol</h4>
                <p className="text-[11px] font-mono text-rose-200/80">
                  Transmits GPS telemetry to Bengaluru Traffic Police & 112 emergency services.
                </p>
              </div>
              <button
                onClick={handleTriggerSos}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.6)] cursor-pointer"
              >
                {sosActive ? 'SOS Dispatched!' : 'Trigger SOS'}
              </button>
            </div>

            {/* Live Location Sharing */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-orange-950 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold floating-text-primary text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-orange-400" />
                  Live Trip Share Link
                </h4>
                <p className="text-[11px] font-mono floating-text-sub">
                  Share real-time moving coordinates & dynamic ETA with family or colleagues.
                </p>
              </div>
              <button
                onClick={handleShareLiveLocation}
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 border border-orange-950 hover:border-orange-500 text-xs font-mono text-orange-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Trusted Contacts */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-orange-950">
              <h4 className="font-display font-bold floating-text-primary text-sm mb-2 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-orange-400" />
                Trusted Safety Contacts
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-orange-950/60">
                  <span className="text-white">Emergency Contact 1 (Harshitha)</span>
                  <span className="text-orange-400">+91 98450 XXXXX</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-orange-950/60">
                  <span className="text-white">Bengaluru Police Control Room</span>
                  <span className="text-rose-400">112 / 100</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Accessibility */}
        {activeTab === 'accessibility' && (
          <div className="space-y-3">
            {[
              {
                id: 'wheelchair',
                title: 'Wheelchair-Friendly Routes',
                desc: 'Prioritizes ramps, wide flat sidewalks, and elevators at transit hubs.',
                state: wheelchairFriendly,
                setter: setWheelchairFriendly,
              },
              {
                id: 'stairs',
                title: 'Avoid Overbridge Stairs',
                desc: 'Reroutes pedestrian segments via street-level zebra crossings with audible signals.',
                state: avoidStairs,
                setter: setAvoidStairs,
              },
              {
                id: 'voice',
                title: 'High-Fidelity Voice Guidance',
                desc: 'Reads out turn cues, lane positions, and upcoming potholes in English / Kannada.',
                state: voiceNav,
                setter: setVoiceNav,
              },
              {
                id: 'contrast',
                title: 'High-Contrast Road Map',
                desc: 'Maximizes arterial boundary outlines for low-vision navigation in night conditions.',
                state: highContrast,
                setter: setHighContrast,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-stone-950/70 border border-orange-950 flex items-center justify-between"
              >
                <div className="pr-4">
                  <h4 className="font-display font-bold text-sm floating-text-primary">{item.title}</h4>
                  <p className="text-[11px] font-mono floating-text-sub mt-0.5">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => item.setter(!item.state)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    item.state ? 'bg-orange-500' : 'bg-stone-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      item.state ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-orange-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
