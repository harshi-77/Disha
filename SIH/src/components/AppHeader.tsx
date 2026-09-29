import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, Sparkles, Navigation, LogOut, Globe, UserCheck } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface AppHeaderProps {
  onOpenPlanner: () => void;
  onOpenAuth: () => void;
  onOpenLiveTraffic: () => void;
  onOpenDashboard: () => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  onOpenAskDisha: () => void;
  onOpenNotifications: () => void;
  currentUser: { email: string; name: string } | null;
  onSignOut: () => void;
  isPortalMode: boolean;
  onTogglePortalMode: (portal: boolean) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenPlanner,
  onOpenAuth,
  onOpenLiveTraffic,
  onOpenDashboard,
  onOpenAbout,
  onOpenHelp,
  onOpenAskDisha,
  onOpenNotifications,
  currentUser,
  onSignOut,
  isPortalMode,
  onTogglePortalMode,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-orange-500/25 py-2.5 shadow-[0_10px_35px_rgba(20,8,0,0.8)]' 
          : 'bg-gradient-to-b from-black/95 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo with 3D Holographic Orange Navigation Icon */}
          <div 
            onClick={() => {
              if (isPortalMode) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                scrollTo('overview');
              }
            }}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden glowing-icon-border shadow-[0_0_20px_rgba(249,115,22,0.6)] group-hover:scale-105 transition-all duration-300">
              <img 
                src={IMAGES.iconNavArrow} 
                alt="DISHA Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-black tracking-wider floating-text-primary leading-none">
                DISHA
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] floating-text-orange font-bold mt-0.5">
                INTELLIGENT MOBILITY
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            
            {/* When inside Authenticated Portal Mode */}
            {isPortalMode ? (
              <>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Home
                </button>

                <button 
                  onClick={() => scrollTo('how-it-works')}
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Explore
                </button>

                <button 
                  onClick={onOpenDashboard}
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  My Trips
                </button>

                <button 
                  onClick={() => scrollTo('insights')}
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Insights
                </button>

                {/* Notifications Button with Glowing Badge */}
                <button
                  onClick={onOpenNotifications}
                  title="Corridor Notifications"
                  className="relative p-2 rounded-xl glass-hud hover:border-orange-400 text-stone-300 hover:text-orange-300 transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-400" />
                </button>

                {/* Ask DISHA AI Travel Assistant */}
                <button
                  onClick={onOpenAskDisha}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 hover:border-orange-400 text-orange-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.35)] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>Ask DISHA</span>
                </button>

                {/* User Profile Dropdown */}
                {currentUser && (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-hud hover:border-orange-400 transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-orange-400/60 shadow-sm">
                        <img 
                          src={IMAGES.navSignIn} 
                          alt="Pilot Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-mono font-medium floating-text-primary">
                        {currentUser.name.split(' ')[0]}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-black border border-orange-500/40 shadow-2xl p-2 font-mono text-xs z-50 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-2 border-b border-orange-950">
                          <div className="font-bold text-white truncate">{currentUser.name}</div>
                          <div className="text-[10px] text-stone-400 truncate">{currentUser.email}</div>
                        </div>
                        <button
                          onClick={() => { setUserDropdownOpen(false); onOpenDashboard(); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-950/50 text-stone-200 hover:text-orange-300 transition-colors cursor-pointer"
                        >
                          My Mobility Profile
                        </button>
                        <button
                          onClick={() => { setUserDropdownOpen(false); onTogglePortalMode(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-950/50 text-stone-200 hover:text-orange-300 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          <span>View Public Landing</span>
                        </button>
                        <button
                          onClick={() => { setUserDropdownOpen(false); onSignOut(); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* When in Clean Public Landing Page Mode */
              <>
                <button 
                  onClick={() => scrollTo('overview')} 
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollTo('how-it-works')} 
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollTo('features')} 
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={onOpenLiveTraffic} 
                  className="text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span>Live Traffic</span>
                </button>
                <button 
                  onClick={onOpenAbout} 
                  className="text-xs font-mono uppercase tracking-wider floating-text-sub hover:text-orange-400 transition-colors cursor-pointer"
                >
                  About
                </button>

                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTogglePortalMode(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer"
                    >
                      Open Portal →
                    </button>
                    <button
                      onClick={onOpenDashboard}
                      className="p-1.5 rounded-xl glass-hud hover:border-orange-400 text-stone-200"
                    >
                      <UserCheck className="w-4 h-4 text-orange-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </>
            )}

          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isPortalMode && (
              <button
                onClick={onOpenAskDisha}
                className="p-2 rounded-xl bg-orange-950 border border-orange-500/50 text-orange-300 text-xs"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl glass-hud hover:border-orange-400 text-stone-200 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-orange-950 px-6 py-6 space-y-4 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 font-mono text-xs">
            {isPortalMode ? (
              <>
                <button 
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  Home (Portal)
                </button>
                <button 
                  onClick={() => scrollTo('how-it-works')}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  Explore
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  My Trips
                </button>
                <button 
                  onClick={() => scrollTo('insights')}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  Insights
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenNotifications(); }}
                  className="text-left py-2 text-orange-300 hover:text-orange-200 flex items-center justify-between"
                >
                  <span>Notifications</span>
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenAskDisha(); }}
                  className="text-left py-2 text-orange-400 font-bold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask DISHA AI Assistant</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onTogglePortalMode(false); }}
                  className="text-left py-2 text-stone-400 hover:text-stone-200"
                >
                  View Public Landing Page
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onSignOut(); }}
                  className="text-left py-2 text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => scrollTo('overview')}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollTo('how-it-works')}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollTo('features')}
                  className="text-left py-2 floating-text-sub hover:text-orange-400"
                >
                  Features
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenLiveTraffic(); }}
                  className="text-left py-2 text-orange-400"
                >
                  Live Traffic
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenAbout(); }}
                  className="text-left py-2 floating-text-sub"
                >
                  About
                </button>
                {currentUser ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onTogglePortalMode(true); }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold uppercase"
                  >
                    Open Portal →
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold uppercase"
                  >
                    Sign In / Register
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
