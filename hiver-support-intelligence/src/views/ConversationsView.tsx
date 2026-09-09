import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';
import { ConversationCase, IntentLabel } from '../types';

interface ConversationsViewProps {
  conversations: ConversationCase[];
  onSelectCase: (caseItem: ConversationCase) => void;
  activeBrand: string;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  conversations,
  onSelectCase,
  activeBrand,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('ALL');
  const [selectedDecision, setSelectedDecision] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered dataset
  const filteredData = useMemo(() => {
    return conversations.filter((item) => {
      // Intent filter
      if (selectedIntent !== 'ALL' && item.intent !== selectedIntent) {
        return false;
      }
      // Decision filter
      if (selectedDecision !== 'ALL' && item.decision !== selectedDecision) {
        return false;
      }
      // Confidence threshold
      if (item.confidence < minConfidence) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMsg = item.customer_message.toLowerCase().includes(q);
        const matchesHandle = item.customer_handle.toLowerCase().includes(q);
        const matchesId = item.tweet_id.toLowerCase().includes(q);
        if (!matchesMsg && !matchesHandle && !matchesId) return false;
      }
      return true;
    });
  }, [conversations, selectedIntent, selectedDecision, minConfidence, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const uniqueIntents: string[] = Array.from(new Set(conversations.map((c) => String(c.intent))));

  return (
    <div id="conversations-view" className="space-y-5 pb-12 animate-fade-in">
      {/* Header & Controls bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Customer Support Conversation Corpus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Forensic audit log of Twitter customer support interactions, ground truth intents, and autonomous outcomes.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
            Showing <strong className="text-slate-900">{filteredData.length}</strong> of{' '}
            {conversations.length} records
          </div>
        </div>

        {/* Filter controls row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-conversations"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search message, @handle, tweet..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Intent Filter */}
          <div>
            <select
              id="filter-intent"
              value={selectedIntent}
              onChange={(e) => {
                setSelectedIntent(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Intents ({uniqueIntents.length})</option>
              {uniqueIntents.map((intent) => (
                <option key={intent} value={intent}>
                  {intent.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Decision Filter */}
          <div>
            <select
              id="filter-decision"
              value={selectedDecision}
              onChange={(e) => {
                setSelectedDecision(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Decisions</option>
              <option value="AUTO_HANDLE">AUTO-HANDLE Only</option>
              <option value="ESCALATE">ESCALATE Only</option>
            </select>
          </div>

          {/* Confidence Slider Filter */}
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-xs">
            <span className="text-slate-500 whitespace-nowrap text-[11px]">Min Conf:</span>
            <input
              type="range"
              id="filter-confidence-range"
              min="0"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => {
                setMinConfidence(parseFloat(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-blue-600 cursor-pointer h-1.5"
            />
            <span className="font-mono text-slate-700 font-semibold text-[11px] w-8 text-right">
              {Math.round(minConfidence * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-mono text-[11px]">Tweet ID</th>
                <th className="py-3 px-4">Customer Message</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Intent</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No conversations matched your active filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const isAuto = item.decision === 'AUTO_HANDLE';
                  return (
                    <tr
                      key={item.id}
                      id={`row-conv-${item.id}`}
                      onClick={() => onSelectCase(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Tweet ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        #{item.tweet_id.slice(-6)}
                      </td>

                      {/* Customer Message */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-medium text-slate-900 truncate">
                          "{item.customer_message}"
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.customer_handle}
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                        @{item.brand}
                      </td>

                      {/* Intent */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200 capitalize">
                          {item.intent.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Decision */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${
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

                      {/* Confidence */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700 font-semibold">
                        {Math.round(item.confidence * 100)}%
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          id={`btn-open-audit-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(item);
                          }}
                          className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center justify-end gap-1 ml-auto group-hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-prev-page"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-next-page"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
