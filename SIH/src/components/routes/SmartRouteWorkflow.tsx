import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Play,
  Layers,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';
import { QpsoOptimizationStep } from '../../types';
import { routeService } from '../../services/api/routeService';

interface SmartRouteWorkflowProps {
  onApplyRoute: () => void;
  onClose?: () => void;
}

export const SmartRouteWorkflow: React.FC<SmartRouteWorkflowProps> = ({ onApplyRoute, onClose }) => {
  const [steps, setSteps] = useState<QpsoOptimizationStep[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const startWorkflowSimulation = async () => {
    setIsSimulating(true);
    const initialSteps = await routeService.runQpsoSimulationWorkflow();
    setSteps(initialSteps.map((s) => ({ ...s, status: 'pending' })));

    for (let i = 0; i < initialSteps.length; i++) {
      setCurrentStepIndex(i);
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx < i) return { ...step, status: 'completed' };
          if (idx === i) return { ...step, status: 'active' };
          return { ...step, status: 'pending' };
        })
      );
      await new Promise((r) => setTimeout(r, 500));
    }

    setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
    setIsSimulating(false);
  };

  React.useEffect(() => {
    routeService.runQpsoSimulationWorkflow().then((res) => {
      setSteps(res);
    });
  }, []);

  const getStepIcon = (key: string) => {
    switch (key) {
      case 'candidate_eval':
        return <Layers className="w-4 h-4 text-blue-600" />;
      case 'qpso_optimizing':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'proposed_found':
        return <Activity className="w-4 h-4 text-amber-600" />;
      case 'spillback_sim':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'future_congestion':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'reoptimizing':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case 'final_converged':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-blue-50/50">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200/60"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>Smart Route Optimization</span>
            </div>
            <div className="text-[11px] text-gray-500 font-normal">
              Finding a route that balances time and road conditions
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
            Route analysis
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <button
          onClick={startWorkflowSimulation}
          disabled={isSimulating}
          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isSimulating ? 'Optimizing Corridors...' : 'Re-Run Optimization'}</span>
        </button>
        <button
          onClick={onApplyRoute}
          className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg text-xs font-medium transition-colors"
        >
          View Route
        </button>
      </div>

      {/* Stepper Pipeline Flow */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative before:absolute before:left-7 before:top-6 before:bottom-6 before:w-[2px] before:bg-gray-200">
        {steps.map((s) => {
          const isDone = s.status === 'completed';
          const isActive = s.status === 'active';

          return (
            <div
              key={s.step}
              className={`relative pl-8 transition-opacity ${
                s.status === 'pending' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Stepper Dot */}
              <div
                className={`absolute left-3.5 top-1.5 w-4 h-4 rounded-full -translate-x-1/2 flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-white shadow-xs'
                    : isActive
                    ? 'bg-blue-600 ring-4 ring-blue-100 animate-pulse'
                    : 'bg-gray-300 ring-4 ring-white'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>

              {/* Step Card */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : isDone
                    ? 'border-gray-200 bg-white shadow-2xs'
                    : 'border-gray-200/60 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    {getStepIcon(s.step)}
                    <span>{s.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 capitalize">
                    {s.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 leading-relaxed mb-2">
                  {s.description}
                </div>

                {s.metrics && (
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100 font-mono text-[10px]">
                    {s.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="bg-gray-50 p-1.5 rounded border border-gray-100">
                        <span className="text-gray-500 block">{m.label}</span>
                        <span className="text-blue-700 font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
