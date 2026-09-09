import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { AnalysisResponse, DecisionFactor, HistoricalEvidence } from '../types';

interface AgentViewProps {
  onAnalyzeMessage: (message: string) => Promise<AnalysisResponse>;
  activeBrand: string;
}

export const AgentView: React.FC<AgentViewProps> = ({ onAnalyzeMessage, activeBrand }) => {
  const [inputMessage, setInputMessage] = useState(
    'I was charged twice for my subscription this morning. Can you check my account?'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const quickPrompts = [
    'My account was charged twice',
    "I can't log into my account",
    'My payment is pending',
    'Someone accessed my account',
    'Cancel my subscription and issue a refund',
    'App crashes when opening offline playlist on iOS 19',
    'My lawyer will file a lawsuit for unauthorized fraudulent charges',
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze ?? inputMessage).trim();
    if (!text) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await onAnalyzeMessage(text);
      setAnalysis(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze message');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial analysis on first mount if no analysis yet
  React.useEffect(() => {
    if (!analysis && !isLoading) {
      handleAnalyze(inputMessage);
    }
  }, []);

  const handleCopyReply = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.generated_reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAuto = analysis?.decision.action === 'AUTO_HANDLE';

  return (
    <div id="agent-view" className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner explaining principle */}
      <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
            Support Agent Operational Sandbox
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Test custom customer support messages against our intent classifier, hybrid retrieval engine, and rule-based escalation sentinels.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] bg-slate-800 px-3 py-1.5 rounded font-mono text-slate-300 shrink-0 border border-slate-700">
          <span>Active Context:</span>
          <span className="text-blue-400 font-semibold">@{activeBrand}</span>
        </div>
      </div>

      {/* Two Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customer Message Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
            <label
              htmlFor="customer-message-input"
              className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2"
            >
              Customer Support Message Input
            </label>

            <div className="relative">
              <textarea
                id="customer-message-input"
                rows={5}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Paste a customer support message..."
                className="w-full text-sm p-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-sans text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Quick Prompt Pills */}
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Example Quick Test Queries:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    id={`prompt-pill-${idx}`}
                    onClick={() => {
                      setInputMessage(prompt);
                      handleAnalyze(prompt);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze CTA Button */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {inputMessage.length} characters
              </span>
              <button
                type="button"
                id="btn-analyze-message"
                disabled={isLoading || !inputMessage.trim()}
                onClick={() => handleAnalyze()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Explainability Callout */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Inspection Protocol</span>
            </div>
            <p className="leading-relaxed">
              The agent evaluates the query sequentially: intent prediction with calibrated confidence bars, top-3 historical resolution retrieval from our verified repository, evidence-grounded response generation, and safety sentinel evaluation.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AI ANALYSIS (Steps 1 to 4) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">
                Executing Multi-Stage Support Pipeline
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Running intent classification, querying hybrid vector/BM25 index, synthesizing grounded response, and verifying safety sentinels...
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* STEP 1: Intent Classification */}
              <div
                id="analysis-step-1"
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Intent Classification
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Confidence: <strong className="text-slate-900">{Math.round(analysis.intent.confidence * 100)}%</strong>
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">
                      {analysis.intent.name}
                    </span>
                    <span className="font-mono text-xs text-blue-700 font-semibold">
                      {(analysis.intent.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Primary Confidence Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        analysis.intent.confidence >= 0.85 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.round(analysis.intent.confidence * 100)}%` }}
                    />
                  </div>

                  {/* Alternative intents */}
                  {analysis.intent.alternatives && analysis.intent.alternatives.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Alternative Intent Probabilities:
                      </div>
                      <div className="space-y-1.5">
                        {analysis.intent.alternatives.map((alt, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">{alt.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-400"
                                  style={{ width: `${Math.round(alt.confidence * 100)}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] text-slate-500 w-7 text-right">
                                {Math.round(alt.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: Historical Evidence */}
              <div
                id="analysis-step-2"
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Historical Evidence
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    {analysis.retrieval.length} similar historical cases found
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {analysis.retrieval.map((item: HistoricalEvidence, idx: number) => (
                    <div
                      key={item.id || idx}
                      className="p-3 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-200/70 px-1.5 py-0.2 rounded">
                          EVIDENCE #{idx + 1} • {item.intent.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          Similarity: {item.similarity}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-semibold">
                            Customer:
                          </span>{' '}
                          <span className="text-slate-800 italic">
                            "{item.customer_message}"
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-600 text-[10px] uppercase font-semibold">
                            Historical Brand Response:
                          </span>{' '}
                          <span className="text-slate-700">
                            "{item.brand_reply}"
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3: Generated Reply */}
              <div
                id="analysis-step-3"
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Generated Reply
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="btn-copy-reply"
                      onClick={handleCopyReply}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      id="btn-regenerate-reply"
                      onClick={() => handleAnalyze()}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  {/* Speech Bubble */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-slate-900 text-sm leading-relaxed relative">
                    <div className="font-sans">
                      {analysis.generated_reply}
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Grounded in: {analysis.grounded_in_count} historical support cases
                    </span>
                    <span className="font-mono text-[10px]">
                      Latency: {analysis.processing_time_ms}ms • Mode: {analysis.execution_mode}
                    </span>
                  </div>
                </div>
              </div>

              {/* STEP 4: Automation Decision Card */}
              <div
                id="analysis-step-4"
                className={`rounded-lg border p-5 shadow-2xs ${
                  isAuto ? 'bg-emerald-50/30 border-emerald-300' : 'bg-amber-50/30 border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Automation Decision
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    Confidence: {Math.round(analysis.decision.confidence * 100)}%
                  </span>
                </div>

                <div className="mt-4">
                  {/* Large Decision Action Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-base font-mono font-black px-4 py-1.5 rounded-md border tracking-wider ${
                          isAuto
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        }`}
                      >
                        {analysis.decision.action === 'AUTO_HANDLE'
                          ? 'AUTO-HANDLE'
                          : 'ESCALATE TO HUMAN'}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Risk Level:{' '}
                        <strong
                          className={
                            analysis.decision.risk_level === 'HIGH'
                              ? 'text-red-700'
                              : analysis.decision.risk_level === 'MEDIUM'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }
                        >
                          {analysis.decision.risk_level}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Decision Reason */}
                  <p className="mt-3 text-xs text-slate-800 font-medium leading-relaxed bg-white/70 p-3 rounded border border-slate-200/60">
                    <strong>Decision Reasoning:</strong> {analysis.decision.reason}
                  </p>

                  {/* Reasoning Factors Checklist */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Sentinel & Safety Audit Factors:
                    </div>
                    {analysis.decision.factors.map((factor: DecisionFactor) => (
                      <div
                        key={factor.id}
                        className="flex items-start gap-2 text-xs py-0.5"
                      >
                        {factor.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="text-slate-700">
                          <strong className={factor.passed ? 'text-slate-900' : 'text-amber-900 font-semibold'}>
                            {factor.name}:
                          </strong>{' '}
                          <span className="text-slate-600">{factor.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Type or select a message on the left to run the AI customer support pipeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
