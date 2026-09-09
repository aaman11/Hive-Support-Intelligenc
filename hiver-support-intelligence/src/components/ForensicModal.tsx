import React from 'react';
import {
  X,
  Shield,
  MessageSquare,
  FileCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Clock,
  User,
} from 'lucide-react';
import { ConversationCase } from '../types';

interface ForensicModalProps {
  conversation: ConversationCase | null;
  onClose: () => void;
}

export const ForensicModal: React.FC<ForensicModalProps> = ({ conversation, onClose }) => {
  if (!conversation) return null;

  const isAutoHandle = conversation.decision === 'AUTO_HANDLE';

  return (
    <div
      id="forensic-drawer-overlay"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        id="forensic-drawer-content"
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Tweet #{conversation.tweet_id}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Brand: @{conversation.brand}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Forensic Case Audit Review
            </h2>
          </div>
          <button
            type="button"
            id="btn-close-forensic"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Forensic Pipeline Trace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Customer Message Input */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                1. Customer Interaction
              </span>
              <span className="font-mono text-slate-400">{conversation.customer_handle}</span>
            </div>
            <div className="text-sm font-medium text-slate-900 p-3 bg-white rounded border border-slate-200/80 shadow-2xs">
              "{conversation.customer_message}"
            </div>
          </div>

          {/* 2. Intent Prediction Trace */}
          <div className="rounded-lg border border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">
                2. Intent Classification Analysis
              </span>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Calibrated Conf: {Math.round(conversation.confidence * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-[11px] text-slate-500">Predicted Intent</div>
                <div className="text-sm font-bold text-slate-900 capitalize mt-0.5">
                  {conversation.intent.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-[11px] text-slate-500">Calculated Risk Level</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      conversation.risk_level === 'HIGH'
                        ? 'bg-red-500'
                        : conversation.risk_level === 'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>{conversation.risk_level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Retrieved Historical Evidence */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                3. Historical Resolution Retrieval
              </span>
              <span className="text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {conversation.evidence_count} Verified Pairs Grounded
              </span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="p-3 bg-white rounded border border-slate-200 text-xs shadow-2xs">
                <div className="text-slate-400 font-mono text-[10px] mb-1">
                  HISTORICAL OFFICIAL @{conversation.brand} RESOLUTION:
                </div>
                <div className="text-slate-800 italic">
                  "{conversation.historical_brand_reply}"
                </div>
              </div>
            </div>
          </div>

          {/* 4. Generated Response */}
          <div className="rounded-lg border border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                4. Evidence-Grounded AI Reply
              </span>
              <span className="font-mono text-xs text-slate-600">
                Quality: {conversation.reply_quality} / 5.0
              </span>
            </div>
            <div className="p-3.5 bg-blue-50/40 rounded border border-blue-100 text-sm text-slate-900 leading-relaxed">
              {conversation.generated_reply}
            </div>
          </div>

          {/* 5. Automation Decision & Audit Factors */}
          <div
            className={`rounded-lg border p-4 ${
              isAutoHandle
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-xs tracking-wider uppercase text-slate-700">
                5. System Automation Decision
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  isAutoHandle
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {conversation.decision}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {isAutoHandle
                ? 'Action executed: Auto-reply dispatched because intent confidence exceeded threshold (0.85) with policy-verified historical retrieval and zero detected security/fraud sentinels.'
                : 'Action executed: Case escalated to human Tier-2 specialist. Safety sentinels or sensitive intent detected, requiring mandatory human identity and compliance authorization.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Audit Status: Validated by Golden Benchmark</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
