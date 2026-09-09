import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Wrench,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { FailureCase } from '../types';

interface FailuresViewProps {
  failureCases: FailureCase[];
}

export const FailuresView: React.FC<FailuresViewProps> = ({ failureCases }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(failureCases[0]?.id || null);

  const filteredCases = failureCases.filter((c) => {
    if (selectedSeverity !== 'ALL' && c.severity !== selectedSeverity) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div id="failures-view" className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Failure Mode Taxonomy & Root Cause Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent dissection of edge cases, failure hypotheses, and concrete mitigation architectures.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
              5 Audited Failure Categories
            </span>
          </div>
        </div>

        {/* Severity filter */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Filter Severity:</span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                type="button"
                id={`filter-sev-${sev.toLowerCase()}`}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredCases.length} of {failureCases.length} cases
          </span>
        </div>
      </div>

      {/* Failure Mode Cards List */}
      <div className="space-y-4">
        {filteredCases.map((fCase) => {
          const isExpanded = expandedId === fCase.id;
          const isHigh = fCase.severity === 'HIGH';
          const isMed = fCase.severity === 'MEDIUM';

          return (
            <div
              key={fCase.id}
              id={`failure-card-${fCase.id}`}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs transition-shadow hover:shadow-xs"
            >
              {/* Top summary row (clickable) */}
              <div
                onClick={() => toggleExpand(fCase.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        isHigh
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : isMed
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {fCase.severity} SEVERITY
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {fCase.category}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="font-mono text-xs text-slate-500">
                      Intent: {fCase.predicted_intent.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    "{fCase.customer_message}"
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-blue-600 font-medium">
                    {isExpanded ? 'Collapse analysis' : 'Expand diagnosis'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-200 space-y-5 bg-white text-xs">
                  {/* System Generation Output vs Retrieved Evidence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: System Reply */}
                    <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        System Generated Reply:
                      </div>
                      <p className="text-slate-900 font-sans italic">
                        "{fCase.system_reply}"
                      </p>
                    </div>

                    {/* Right: Retrieved Historical Evidence */}
                    <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Retrieved Evidence Grounding:
                      </div>
                      <p className="text-slate-700 font-sans">
                        "{fCase.retrieved_evidence}"
                      </p>
                    </div>
                  </div>

                  {/* Hypothesis and Engineering Mitigation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hypothesis */}
                    <div className="p-4 rounded-md border border-amber-200/80 bg-amber-50/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Root Cause Hypothesis:</span>
                      </div>
                      <p className="text-amber-950 leading-relaxed font-medium">
                        {fCase.hypothesis}
                      </p>
                    </div>

                    {/* Concrete Mitigation */}
                    <div className="p-4 rounded-md border border-emerald-200/80 bg-emerald-50/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                        <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Proposed Engineering Mitigation:</span>
                      </div>
                      <p className="text-emerald-950 leading-relaxed font-medium">
                        {fCase.mitigation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
