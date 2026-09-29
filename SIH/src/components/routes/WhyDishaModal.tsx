import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, Info } from 'lucide-react';
import { DishaExplanation } from '../../types';

interface WhyDishaModalProps {
  explanation: DishaExplanation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyDishaModal: React.FC<WhyDishaModalProps> = ({
  explanation,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !explanation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900">
                Why DISHA Chose This Route
              </div>
              <div className="text-xs text-gray-500 font-normal">
                Autonomous Mobility Intelligence Explanation
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 leading-relaxed font-sans">
            <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Recommendation Synthesis</span>
            </div>
            <p className="text-gray-700 text-xs">{explanation.summarySentence}</p>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Analyzed Objectives (Multi-Objective Optimization)
            </div>
            <div className="space-y-1.5">
              {explanation.analyzedFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-gray-800 font-medium">{factor.factor}</span>
                  </div>
                  <span className="font-mono text-[11px] text-blue-700 font-bold">{factor.metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tradeoff reasoning */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-gray-700 leading-relaxed">
            <strong className="text-amber-900">Why not Route A (24 min)?</strong>
            <p className="mt-1">
              While Route A currently displays a 3-minute faster instantaneous travel time, the
              downstream simulation anticipates a 78% shockwave gridlock at Silk Board Choke Point within 15 minutes,
              which will degrade travel time to 39 minutes (+15m delay). Route C guarantees high velocity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
