import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface FloatingAskDishaButtonProps {
  onClick: () => void;
}

export const FloatingAskDishaButton: React.FC<FloatingAskDishaButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:group-hover:flex items-center mr-3 glass-hud px-3 py-1.5 rounded-xl border border-orange-500/50 text-xs font-mono floating-text-orange shadow-2xl animate-in fade-in slide-in-from-right-2 pointer-events-none">
        <span>Ask DISHA Travel AI</span>
      </div>

      <button
        onClick={onClick}
        title="Ask DISHA AI Assistant"
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black shadow-[0_0_30px_rgba(249,115,22,0.7)] hover:shadow-[0_0_50px_rgba(249,115,22,1)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-black/40 cursor-pointer overflow-hidden"
      >
        {/* Radar ping ring */}
        <span className="absolute inset-0 rounded-2xl border-2 border-orange-300 opacity-60 animate-ping pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Sparkles className="w-6 h-6 text-black fill-black" />
          <span className="text-[9px] font-mono font-black uppercase tracking-tighter -mt-0.5">DISHA</span>
        </div>
      </button>
    </div>
  );
};
