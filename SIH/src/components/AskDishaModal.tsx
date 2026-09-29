import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface AskDishaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanRouteWithPrompt?: (prompt: string, routeId?: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'disha';
  text: string;
  recommendedRouteId?: string;
}

export const AskDishaModal: React.FC<AskDishaModalProps> = ({
  isOpen,
  onClose,
  onPlanRouteWithPrompt,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'disha',
      text: "Namaskara! I am DISHA, your Bengaluru neural mobility co-pilot. Ask me for route recommendations, waterlogging reports, pothole-free detours, or optimal departure windows.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const SUGGESTED_QUERIES = [
    "What is the smoothest route from Koramangala to Indiranagar avoiding potholes?",
    "Is Outer Ring Road flooded right now near Bellandur?",
    "When should I leave Whitefield to reach BLR Airport by 6:00 PM?",
    "Find an EV route with fast DC chargers along Hosur Road.",
  ];

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { askDishaAI } = await import('../lib/api');
      const aiData = await askDishaAI(queryText);
      
      const reply = aiData?.reply;
      let suggestedRoute: string | undefined = undefined;

      if (aiData?.route_recommendation?.recommended_route?.route_id) {
        suggestedRoute = aiData.route_recommendation.recommended_route.route_id;
      }

      if (!reply) {
        throw new Error('Ask DISHA returned an empty response.');
      }

      const botMsg: Message = {
        id: `disha-${Date.now()}`,
        sender: 'disha',
        text: reply,
        recommendedRouteId: suggestedRoute,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.warn('AI query error:', e);
      const fallbackMsg: Message = {
        id: `disha-${Date.now()}`,
        sender: 'disha',
        text: "Ask DISHA could not reach Gemini right now. Please check the backend connection and GEMINI_API_KEY, then try again.",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 p-5 sm:p-6 flex flex-col h-[80vh] max-h-[700px] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-orange-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-orange-400 shadow-md">
              <img src={IMAGES.iconNeuralRoute} alt="DISHA AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg floating-text-primary flex items-center gap-2">
                Ask DISHA AI Assistant
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 border border-orange-800 px-2 py-0.5 rounded">
                  GEMINI & SENSOR GNN
                </span>
              </h3>
              <p className="text-xs floating-text-sub font-mono">
                Natural-language trajectory arbitration for Bengaluru mobility
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'disha' && (
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-orange-400 flex-shrink-0 mt-0.5">
                  <img src={IMAGES.iconTrafficRadar} alt="DISHA" className="w-full h-full object-cover" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs font-mono leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold'
                    : 'glass-hud border-orange-500/30 text-stone-200'
                }`}
              >
                <div>{m.text}</div>
                {m.recommendedRouteId && onPlanRouteWithPrompt && (
                  <button
                    onClick={() => {
                      onClose();
                      onPlanRouteWithPrompt(m.text, m.recommendedRouteId);
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-black border border-orange-400 text-orange-300 font-mono text-[11px] font-bold flex items-center gap-2 hover:bg-orange-950/60 transition-colors cursor-pointer"
                  >
                    <span>Inspect In Route Canvas</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-orange-950 border border-orange-400 flex items-center justify-center text-orange-300 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs font-mono floating-text-orange">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span>DISHA is synthesizing multi-node sensor telemetry...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Pills */}
        <div className="py-2 border-t border-orange-950/80">
          <div className="text-[10px] font-mono floating-text-muted mb-1.5 uppercase">
            Suggested Prompts:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-stone-950 border border-orange-950 hover:border-orange-500/50 text-[10px] font-mono text-stone-300 hover:text-orange-200 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about traffic, pothole-free routes, departure times..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 bg-stone-950 border border-orange-950 rounded-xl px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-xs font-mono transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
