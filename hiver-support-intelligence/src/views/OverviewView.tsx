import React from 'react';
import { ArrowRight, Sparkles, Shield, CheckCircle2, AlertOctagon, User } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { PipelineVisualizer } from '../components/PipelineVisualizer';
import { ConversationCase, SystemMetrics } from '../types';
import { NavItemKey } from '../components/Sidebar';

interface OverviewViewProps {
  metrics: SystemMetrics | null;
  recentCases: ConversationCase[];
  onNavigate: (tab: NavItemKey) => void;
  onSelectCase: (caseItem: ConversationCase) => void;
  activeBrand: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  recentCases,
  onNavigate,
  onSelectCase,
  activeBrand,
}) => {
  return (
    <div id="overview-view" className="space-y-6 pb-12 animate-fade-in">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="metric-f1"
          title="Intent Macro F1"
          value={metrics ? metrics.intent_macro_f1.toFixed(2) : '0.79'}
          caption="Across 10 intent categories"
          comparison={metrics?.f1_trend_delta || '+0.18 vs TF-IDF'}
          trend="positive"
          tooltip="Macro-averaged F1 score evaluates class-balanced performance across all 10 customer support intents, preventing rare high-risk intents from being overshadowed by common billing queries."
        />

        <MetricCard
          id="metric-quality"
          title="Reply Quality"
          value={metrics ? `${metrics.reply_quality_score.toFixed(1)} / 5` : '4.1 / 5'}
          caption="LLM judge + human validated"
          comparison={metrics?.reply_quality_delta || '+0.9 vs retrieval'}
          trend="positive"
          tooltip="Evaluated across 5 dimensions: Groundedness, Helpfulness, Correctness, Tone, and Safety against a held-out human-annotated test set."
        />

        <MetricCard
          id="metric-coverage"
          title="Auto-Handle Coverage"
          value={metrics ? `${metrics.auto_handle_coverage}%` : '68%'}
          caption="Cases safely automated"
          comparison="Calibrated operating point"
          trend="neutral"
          tooltip="Proportion of incoming cases processed autonomously without requiring human tier-2 intervention, under strict confidence and sentinel rules."
        />

        <MetricCard
          id="metric-unsafe"
          title="Unsafe Auto-Handle Rate"
          value={metrics ? `${metrics.unsafe_auto_handle_rate}%` : '3.2%'}
          caption="Lower is better"
          comparison="Target < 5.0% (Baseline 18%)"
          trend="negative"
          highlight={true}
          tooltip="The percentage of automated cases that delivered incorrect policy advice or failed to escalate high-risk queries. Lower is strictly better."
        />
      </div>

      {/* System Pipeline Visualization */}
      <PipelineVisualizer onNavigate={onNavigate} />

      {/* Recent Cases Section */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Recent Evaluated Conversations</span>
              <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                @{activeBrand}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live sample of recent customer queries and resulting autonomous decisions.
            </p>
          </div>
          <button
            type="button"
            id="btn-view-all-conversations"
            onClick={() => onNavigate('conversations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore full dataset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Message</th>
                <th className="py-3 px-4">Predicted Intent</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4">Reply Quality</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCases.slice(0, 7).map((item) => {
                const isAuto = item.decision === 'AUTO_HANDLE';
                return (
                  <tr
                    key={item.id}
                    id={`case-row-${item.id}`}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectCase(item)}
                  >
                    {/* Customer Message */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">
                        "{item.customer_message}"
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {item.customer_handle} • #{item.tweet_id.slice(-6)}
                      </div>
                    </td>

                    {/* Intent */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200 capitalize">
                        {item.intent.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              item.confidence >= 0.85 ? 'bg-blue-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.round(item.confidence * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-700 font-semibold">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    </td>

                    {/* Decision Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-semibold border ${
                          isAuto
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAuto ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        />
                        {item.decision}
                      </span>
                    </td>

                    {/* Reply Quality */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-slate-800 font-medium">
                        {item.reply_quality.toFixed(1)} <span className="text-slate-400">/ 5.0</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        id={`btn-view-case-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(item);
                        }}
                        className="text-xs text-blue-600 font-medium hover:text-blue-800 group-hover:underline flex items-center justify-end gap-1 ml-auto"
                      >
                        <span>View Case</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
