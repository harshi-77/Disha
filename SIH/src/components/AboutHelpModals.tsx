import React from 'react';
import { X } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-black border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-950/70 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-orange-500/50 shadow-md">
            <img src={IMAGES.iconNavArrow} alt="About DISHA" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold floating-text-primary">About DISHA</h2>
            <p className="text-xs floating-text-orange font-mono">Intelligent Mobility & Route Planning Platform</p>
          </div>
        </div>

        <div className="space-y-4 floating-text-sub text-sm leading-relaxed font-sans">
          <p>
            DISHA (Direction / Path in Sanskrit) was conceived to address the fundamental structural failure of modern navigation in hyper-dense metropolitan ecosystems like Bengaluru, Mumbai, and Delhi NCR.
          </p>

          <div className="p-4 rounded-xl bg-stone-950/60 border border-orange-950 space-y-2">
            <h4 className="font-display font-bold floating-text-primary text-base">The Core Problem:</h4>
            <p className="text-xs floating-text-muted">
              Legacy navigation apps treat urban roads as static graphs with velocity tags. When a bottleneck occurs, they reroute thousands of cars into the same narrow residential lane, shifting the choke point and degrading neighborhood infrastructure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/60 border border-orange-950 space-y-2">
            <h4 className="font-display font-bold floating-text-primary text-base">The DISHA Breakthrough:</h4>
            <ul className="text-xs floating-text-sub space-y-2 list-disc pl-4">
              <li><strong>Predictive Shockwave Modeling:</strong> Simulating urban traffic flow 35 minutes into the future.</li>
              <li><strong>Road Quality Calibration:</strong> Factoring pothole density, speed bumps, and monsoon water accumulation into routing decisions.</li>
              <li><strong>Multi-Objective Pareto Arbitration:</strong> Balancing time, fuel cost, brake wear, and vehicle health.</li>
            </ul>
          </div>

          <p className="text-xs floating-text-muted font-mono">
            DISHA is designed with zero-telemetry surveillance. No personal location history is ever sold or tracked across third-party advertisers.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-orange-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-black border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-950/70 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-orange-500/50 shadow-md">
            <img src={IMAGES.iconTrafficRadar} alt="Help" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold floating-text-primary">DISHA Help & Documentation</h2>
            <p className="text-xs floating-text-sub font-mono">Frequently Asked Questions & Usage Guide</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does DISHA know traffic 45 minutes in advance?',
              a: 'DISHA uses graph neural networks trained on historic multi-sensor throughput, weather forecasts, and city traffic signal cadence to predict downstream shockwave ripples before congestion solidifies.',
            },
            {
              q: 'What is the Road Quality Score (RQS)?',
              a: 'RQS is a 0-100 composite index tracking asphalt roughness, pothole frequency, speed bump height, and monsoon puddle depth mapped by crowd-sourced vehicle suspension telematics.',
            },
            {
              q: 'How does EV routing differ from standard sedan routing?',
              a: 'EV mode factors regenerative braking downhill gradients, highway air drag curves at varying speeds, and proximity to DC fast chargers with real-time slot availability.',
            },
            {
              q: 'Can I use DISHA without signing up?',
              a: 'Yes. All public corridor monitoring, simulation routes, and live traffic telemetry are accessible as a guest without creating an account.',
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-stone-950/60 border border-orange-950">
              <h4 className="font-display font-bold floating-text-orange text-sm mb-1.5">{item.q}</h4>
              <p className="text-xs floating-text-sub leading-relaxed font-sans">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-orange-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 border border-orange-950 hover:border-orange-500/40 text-stone-300 font-mono text-xs font-bold uppercase transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
