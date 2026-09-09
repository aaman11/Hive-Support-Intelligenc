import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Info, Award, AlertTriangle } from 'lucide-react';
import { IntentMetricRow } from '../types';

interface IntentsViewProps {
  intentsData: IntentMetricRow[];
  insightText?: string;
}

export const IntentsView: React.FC<IntentsViewProps> = ({
  intentsData,
  insightText = 'Most classification errors occur between Billing and Subscription issues, suggesting overlapping intent boundaries.',
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    actual: string;
    predicted: string;
    count: number;
    pct: number;
  } | null>(null);

  // Intent labels for confusion matrix (compact 6x6 representation of core intents)
  const matrixLabels = [
    { key: 'payment_transaction', short: 'Payment' },
    { key: 'account_access', short: 'Access' },
    { key: 'technical_issue', short: 'Tech' },
    { key: 'subscription', short: 'Subscrip' },
    { key: 'billing_charge', short: 'Billing' },
    { key: 'account_security', short: 'Security' },
  ];

  // Realistic confusion matrix counts based on test evaluation
  const confusionData: Record<string, Record<string, number>> = {
    payment_transaction: { payment_transaction: 258, account_access: 6, technical_issue: 4, subscription: 12, billing_charge: 18, account_security: 2 },
    account_access: { payment_transaction: 3, account_access: 184, technical_issue: 14, subscription: 5, billing_charge: 4, account_security: 15 },
    technical_issue: { payment_transaction: 2, account_access: 8, technical_issue: 148, subscription: 11, billing_charge: 6, account_security: 12 },
    subscription: { payment_transaction: 10, account_access: 4, technical_issue: 6, subscription: 118, billing_charge: 22, account_security: 2 },
    billing_charge: { payment_transaction: 16, account_access: 3, technical_issue: 5, subscription: 24, billing_charge: 90, account_security: 0 },
    account_security: { payment_transaction: 1, account_access: 5, technical_issue: 1, subscription: 0, billing_charge: 0, account_security: 81 },
  };

  // Format chart data
  const chartData = [...intentsData].sort((a, b) => b.percentage - a.percentage);

  return (
    <div id="intents-view" className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Intent Taxonomy & Calibration Performance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              10-intent classification metrics, distribution frequencies, and pairwise confusion analysis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200 font-medium">
              Macro F1: 0.79
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left = Distribution Chart, Right = Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Distribution Chart */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Intent Traffic Distribution
              </h3>
              <span className="text-[11px] font-mono text-slate-500">10 categories</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-4">
              Volume skew in production customer support inquiries across Twitter streams.
            </p>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 25, left: 45, bottom: 0 }}
                >
                  <XAxis type="number" unit="%" domain={[0, 30]} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 10, fill: '#334155' }}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${val}% of support queries`, 'Distribution']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.is_best
                            ? '#16a34a'
                            : entry.is_worst
                            ? '#f59e0b'
                            : '#2563eb'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" />
              Standard Class
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
              Security (Critical)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              Highest Ambiguity
            </span>
          </div>
        </div>

        {/* RIGHT: Performance Table */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Classification Performance Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Precision, recall, and F1 across held-out golden test set ($N=1,250$).
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              Golden Set v1.0
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3.5">Intent Category</th>
                  <th className="py-2.5 px-3.5">Precision</th>
                  <th className="py-2.5 px-3.5">Recall</th>
                  <th className="py-2.5 px-3.5 font-bold text-slate-800">F1 Score</th>
                  <th className="py-2.5 px-3.5 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {intentsData.map((item) => (
                  <tr
                    key={item.label}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      item.is_best
                        ? 'bg-emerald-50/30'
                        : item.is_worst
                        ? 'bg-amber-50/30'
                        : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-sans font-medium text-slate-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.is_best && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans font-semibold">
                          Best
                        </span>
                      )}
                      {item.is_worst && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-sans font-semibold">
                          Boundary Drift
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">{item.precision.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{item.recall.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">{item.f1.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 text-right text-slate-500 font-sans">{item.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Confusion Matrix Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Interactive Intent Confusion Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hover over cells to inspect exact pair misclassifications between actual and predicted intents.
            </p>
          </div>
          {hoveredCell ? (
            <div className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded flex items-center gap-2 font-mono">
              <span>Actual: <strong className="text-blue-400">{hoveredCell.actual}</strong></span>
              <span>→</span>
              <span>Pred: <strong className="text-amber-400">{hoveredCell.predicted}</strong></span>
              <span>({hoveredCell.count} cases)</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">
              Hover over cells to inspect misclassifications
            </span>
          )}
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="text-center font-bold text-xs text-slate-600 mb-2 uppercase tracking-wider">
              Predicted Intent →
            </div>
            <div className="flex items-start">
              {/* Rotated Y-Axis Label */}
              <div className="w-8 -rotate-90 origin-center text-center font-bold text-xs text-slate-600 uppercase tracking-wider my-auto">
                Actual
              </div>

              {/* Matrix Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  <div className="font-semibold text-slate-400 text-[11px] p-2"></div>
                  {matrixLabels.map((lbl) => (
                    <div
                      key={lbl.key}
                      className="font-mono text-[11px] font-semibold text-slate-700 p-2 bg-slate-50 rounded"
                    >
                      {lbl.short}
                    </div>
                  ))}

                  {matrixLabels.map((actual) => (
                    <React.Fragment key={actual.key}>
                      <div className="font-mono text-[11px] font-semibold text-slate-700 p-2 bg-slate-50 rounded text-left truncate">
                        {actual.short}
                      </div>
                      {matrixLabels.map((predicted) => {
                        const count = confusionData[actual.key]?.[predicted.key] || 0;
                        const isDiagonal = actual.key === predicted.key;
                        const isHighError = !isDiagonal && count > 10;

                        return (
                          <div
                            key={`${actual.key}-${predicted.key}`}
                            onMouseEnter={() =>
                              setHoveredCell({
                                actual: actual.short,
                                predicted: predicted.short,
                                count,
                                pct: Math.round((count / 300) * 100),
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`p-2.5 rounded font-mono text-xs cursor-pointer transition-transform hover:scale-105 ${
                              isDiagonal
                                ? 'bg-blue-600 text-white font-bold'
                                : isHighError
                                ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                                : count > 0
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-slate-50 text-slate-300'
                            }`}
                          >
                            {count}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Insight Card */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Diagnostic ML Insight
          </div>
          <p className="text-xs text-amber-900 mt-1 leading-relaxed">
            "{insightText}"
          </p>
          <div className="mt-2 text-[11px] text-amber-800">
            <strong>Engineering Action:</strong> Hierarchical routing deployed in v1.1 will separate general recurring charges from explicit subscription plan downgrades before invoking downstream response generation.
          </div>
        </div>
      </div>
    </div>
  );
};
