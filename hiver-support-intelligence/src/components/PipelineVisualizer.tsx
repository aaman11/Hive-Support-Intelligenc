import React from 'react';
import {
  MessageSquareText,
  Tags,
  SearchCode,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface PipelineVisualizerProps {
  onNavigate: (tab: NavItemKey) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ onNavigate }) => {
  const stages: {
    id: string;
    targetTab: NavItemKey;
    name: string;
    step: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    metric: string;
    status: 'active' | 'success';
  }[] = [
    {
      id: 'pipe-input',
      targetTab: 'agent',
      name: 'Incoming Message',
      step: '01',
      desc: 'Twitter customer query ingested',
      icon: MessageSquareText,
      metric: 'Real-time',
      status: 'active',
    },
    {
      id: 'pipe-intent',
      targetTab: 'intents',
      name: 'Intent Classification',
      step: '02',
      desc: '10-class calibrated taxonomy',
      icon: Tags,
      metric: 'Macro F1: 0.79',
      status: 'success',
    },
    {
      id: 'pipe-retrieval',
      targetTab: 'retrieval',
      name: 'Historical Retrieval',
      step: '03',
      desc: 'Dense + BM25 hybrid search',
      icon: SearchCode,
      metric: 'Top-3 Recall: 88.6%',
      status: 'success',
    },
    {
      id: 'pipe-generation',
      targetTab: 'agent',
      name: 'Evidence-Grounded Reply',
      step: '04',
      desc: 'Strict policy grounding, zero hallucination',
      icon: Sparkles,
      metric: 'Quality: 4.1/5',
      status: 'success',
    },
    {
      id: 'pipe-risk',
      targetTab: 'failures',
      name: 'Risk Assessment',
      step: '05',
      desc: 'Confidence & Sentinel sentinel check',
      icon: ShieldAlert,
      metric: 'Unsafe: 3.2%',
      status: 'success',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>End-to-End Decision Pipeline</span>
            <span className="text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Interactive Architecture
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every customer support interaction transitions through five verifiable stages before execution.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Deterministic & Auditable
          </span>
        </div>
      </div>

      {/* Horizontal Pipeline flow */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="relative group">
              <button
                type="button"
                id={`btn-${stage.id}`}
                onClick={() => onNavigate(stage.targetTab)}
                className="w-full text-left p-3.5 rounded-md border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-400/80 transition-all cursor-pointer relative"
              >
                {/* Step pill */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    STAGE {stage.step}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    {stage.name}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                  {stage.desc}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Benchmark:</span>
                  <span className="font-mono font-medium text-slate-700">{stage.metric}</span>
                </div>

                <div className="mt-1.5 text-[10px] text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Inspect module</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* Arrow divider on desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-slate-200 text-slate-400 items-center justify-center shadow-xs">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Output Branch */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/70 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Autonomous Branching:</span>
          <span className="text-slate-500">
            Cases scoring below <strong className="text-slate-700 font-mono">0.85</strong> confidence or triggering safety sentinels automatically divert to human Tier-2 agents.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded bg-emerald-100/70 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-300/50">
            AUTO-HANDLE (68%)
          </span>
          <span className="text-slate-400 font-mono">or</span>
          <span className="px-2.5 py-1 rounded bg-amber-100/70 text-amber-800 font-mono font-bold text-[11px] border border-amber-300/50">
            ESCALATE TO HUMAN (32%)
          </span>
        </div>
      </div>
    </div>
  );
};
