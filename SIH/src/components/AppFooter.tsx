import React from 'react';
import { IMAGES } from '../constants/images';
import { Mail, Phone, MapPin, Shield, FileText, Sparkles, Navigation } from 'lucide-react';

interface AppFooterProps {
  onOpenPlanner: () => void;
  onOpenLiveTraffic: () => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  onOpenAskDisha?: () => void;
  onOpenSafetyAccessibility?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onOpenPlanner,
  onOpenLiveTraffic,
  onOpenAbout,
  onOpenHelp,
  onOpenAskDisha,
  onOpenSafetyAccessibility,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-orange-500/20 pt-16 pb-12 relative overflow-hidden text-stone-400">
      
      {/* Top subtle orange hairline glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid with User's Requested Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-orange-950/60">
          
          {/* Column 1: Brand & About DISHA (4 cols) */}
          <div className="md:col-span-4 flex flex-col">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-orange-400/40 shadow-[0_0_20px_rgba(249,115,22,0.35)]">
                <img src={IMAGES.iconNavArrow} alt="DISHA Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display text-2xl font-black floating-text-primary tracking-wider">
                  DISHA
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.28em] floating-text-orange font-semibold -mt-1">
                  INTELLIGENT MOBILITY
                </span>
              </div>
            </div>

            <p className="text-xs floating-text-sub leading-relaxed max-w-sm mb-4 font-normal">
              AI-powered route intelligence for hyper-dense metropolitan ecosystems. Eliminating urban gridlock with predictive graph neural networks before congestion solidifies.
            </p>

            <button
              onClick={onOpenAbout}
              className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <span>Learn About DISHA Platform →</span>
            </button>
          </div>

          {/* Column 2: Route Planning (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold floating-text-orange uppercase tracking-wider mb-4 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-orange-400" />
              <span>Route Planning</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <button 
                  onClick={onOpenPlanner} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Interactive Map Canvas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('overview')} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Transport Modes (EV, Car, Bike)
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLiveTraffic} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Bengaluru Live Radar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('insights')} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Your Usual Commutes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: AI Features & Safety (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold floating-text-orange uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>AI Features & Safety</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <button 
                  onClick={onOpenAskDisha} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Ask DISHA Travel AI
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSafetyAccessibility} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Emergency SOS & Live Share
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSafetyAccessibility} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Accessibility & High-Contrast
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('insights')} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Personal Mobility Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs font-bold floating-text-orange uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>Contact & Legal</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <button 
                  onClick={onOpenAbout} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelp} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelp} 
                  className="floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono floating-text-muted gap-4">
          <div>
            © {new Date().getFullYear()} DISHA Intelligent Mobility Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-orange-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Bengaluru Mesh Connected
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
