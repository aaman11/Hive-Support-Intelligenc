import React from 'react';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeBrand: string;
  onChangeBrand: (brand: string) => void;
  datasetVersion: string;
  onOpenAgent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBrand,
  onChangeBrand,
  datasetVersion,
  onOpenAgent,
}) => {
  return (
    <header
      id="top-header"
      className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-10"
    >
      {/* Title & Tagline */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Support Intelligence</h1>
          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-200/60">
            Production Quality
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Evidence-grounded customer support automation with measurable trust.
        </p>
      </div>

      {/* Dataset & Brand Selectors */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Brand Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs">
          <span className="text-slate-500 font-medium">Brand:</span>
          <select
            id="select-brand"
            value={activeBrand}
            onChange={(e) => onChangeBrand(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs pr-1"
          >
            <option value="SpotifyCares">SpotifyCares (Primary)</option>
            <option value="ChaseSupport">ChaseSupport</option>
            <option value="AppleSupport">AppleSupport</option>
          </select>
        </div>

        {/* Evaluation Dataset Pill */}
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs">
          <span className="text-slate-500 font-medium">Eval Dataset:</span>
          <span className="font-mono text-slate-700 font-medium">{datasetVersion}</span>
        </div>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md px-2.5 py-1 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Pipeline Active</span>
        </div>

        {/* Quick CTA to Support Agent */}
        <button
          id="btn-header-test-agent"
          onClick={onOpenAgent}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Analyze Message</span>
        </button>
      </div>
    </header>
  );
};
