import React, { useState } from 'react';
import { FileCode2, CheckCircle, Sliders, Filter, Search, Tag } from 'lucide-react';
import { DecisionLogItem } from '../types';

interface DecisionsViewProps {
  decisions: DecisionLogItem[];
}

export const DecisionsView: React.FC<DecisionsViewProps> = ({ decisions }) => {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const tags = ['ALL', 'Architecture', 'Data', 'Evaluation', 'Agent', 'UX'];

  const filteredDecisions = decisions.filter((d) => {
    if (selectedTag !== 'ALL' && d.tag !== selectedTag) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchDecision = d.decision.toLowerCase().includes(q);
      const matchContext = d.context.toLowerCase().includes(q);
      if (!matchTitle && !matchDecision && !matchContext) return false;
    }
    return true;
  });

  return (
    <div id="decisions-view" className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Engineering Architecture Decision Records (ADRs)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fourteen architectural trade-offs, empirical justifications, and system constraints.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200 font-medium">
              14 ADRs Documented
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tag Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium mr-1">Filter Tag:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                id={`filter-tag-${tag.toLowerCase()}`}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search text */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search ADRs..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.map((item) => (
          <div
            key={item.id}
            id={`adr-card-${item.id}`}
            className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
          >
            {/* Header of ADR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ADR-{String(item.id).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Tag: {item.tag}
              </span>
            </div>

            {/* 4 RFC Sections: Context, Decision, Why, Trade-off */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Context */}
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Context & Problem Statement:
                </div>
                <p className="text-slate-700 leading-relaxed font-sans">
                  {item.context}
                </p>
              </div>

              {/* Decision */}
              <div className="p-3.5 rounded bg-blue-50/50 border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900 uppercase tracking-wider text-[10px]">
                  Engineered Decision:
                </div>
                <p className="text-blue-950 font-semibold leading-relaxed font-sans">
                  {item.decision}
                </p>
              </div>

              {/* Why */}
              <div className="p-3.5 rounded bg-emerald-50/40 border border-emerald-200/80 space-y-1">
                <div className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">
                  Empirical Justification (Why):
                </div>
                <p className="text-emerald-950 leading-relaxed font-sans">
                  {item.why}
                </p>
              </div>

              {/* Trade-off */}
              <div className="p-3.5 rounded bg-amber-50/40 border border-amber-200/80 space-y-1">
                <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                  Engineering Trade-Off:
                </div>
                <p className="text-amber-950 leading-relaxed font-sans">
                  {item.tradeoff}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
