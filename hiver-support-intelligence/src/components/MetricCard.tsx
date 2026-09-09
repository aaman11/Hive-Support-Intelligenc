import React, { useState } from 'react';
import { Info, ArrowUpRight, ArrowDownRight, Check, AlertCircle } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  caption: string;
  comparison?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  tooltip: string;
  unit?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  caption,
  comparison,
  trend = 'neutral',
  tooltip,
  unit,
  highlight = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      id={id}
      className={`relative bg-white rounded-lg border p-5 transition-shadow hover:shadow-xs ${
        highlight ? 'border-blue-500/40 bg-blue-50/10' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-tight uppercase">
          {title}
        </span>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label={`More info about ${title}`}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 focus:outline-none"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-6 z-30 w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded shadow-lg border border-slate-700 leading-relaxed pointer-events-none">
              {tooltip}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
      </div>

      <div className="mt-1 text-xs text-slate-500">{caption}</div>

      {comparison && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">{comparison}</span>
          {trend === 'positive' && (
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              Optimal
            </span>
          )}
          {trend === 'negative' && (
            <span className="text-slate-600 font-medium flex items-center gap-0.5">
              <Check className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          )}
        </div>
      )}
    </div>
  );
};
