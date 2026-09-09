import React from 'react';
import { X, BookOpen, GitBranch, Check, Terminal, ExternalLink } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="readme-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="readme-modal-content"
        className="w-full max-w-3xl bg-white max-h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hiver Support Intelligence — Engineering Documentation
              </h2>
              <p className="text-xs text-slate-500">
                Architecture, reproducibility instructions, and evaluation specifications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
          {/* Core premise */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-md">
            <div className="font-bold text-blue-900 text-sm mb-1">
              Core Design Maxim: "Do not maximize automation. Maximize trustworthy automation."
            </div>
            <p className="text-blue-800">
              Unlike generic chatbots that hallucinate policies and maximize autonomous reply volume, Hiver Support Intelligence evaluates real Twitter support interactions and enforces calibrated abstention. If confidence is below 85% or security sentinels trigger, cases immediately escalate to human agents.
            </p>
          </div>

          {/* Quick Start instructions */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-700" />
              1. Reproducibility & Quick Start (&lt; 3 minutes)
            </h3>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded font-mono text-[11px] space-y-2 border border-slate-800">
              <div className="text-slate-400"># 1. Full-Stack Web Application (Port 3000)</div>
              <div>npm install && npm run dev</div>
              <div className="text-slate-400 pt-1"># 2. Standalone Python Backend & Benchmark CLI</div>
              <div>python3 -m venv venv && source venv/bin/activate</div>
              <div>pip install -r requirements.txt</div>
              <div>pytest tests/</div>
              <div>python scripts/evaluate.py</div>
            </div>
          </div>

          {/* Golden Evaluation Benchmarks */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              2. Golden Set v1.0 Primary Benchmarks
            </h3>
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-2.5">System</th>
                    <th className="p-2.5">Intent Macro F1</th>
                    <th className="p-2.5">Reply Quality (1-5)</th>
                    <th className="p-2.5">Auto Coverage</th>
                    <th className="p-2.5">Unsafe Auto Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2.5 text-slate-500 font-sans">Majority Baseline</td>
                    <td className="p-2.5">0.12</td>
                    <td className="p-2.5">2.1</td>
                    <td className="p-2.5">100%</td>
                    <td className="p-2.5 text-red-600">18.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-500 font-sans">TF-IDF + Retrieval</td>
                    <td className="p-2.5">0.61</td>
                    <td className="p-2.5">3.2</td>
                    <td className="p-2.5">82%</td>
                    <td className="p-2.5 text-amber-600">9.0%</td>
                  </tr>
                  <tr className="bg-blue-50/50 font-bold">
                    <td className="p-2.5 text-blue-900 font-sans flex items-center gap-1">
                      <span>EvidenceGrounded Agent</span>
                      <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded">Our Model</span>
                    </td>
                    <td className="p-2.5 text-blue-900">0.79</td>
                    <td className="p-2.5 text-blue-900">4.1 / 5</td>
                    <td className="p-2.5 text-blue-900">68%</td>
                    <td className="p-2.5 text-emerald-700">3.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Architectural Decisions */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              3. Architectural Principles from Decision Log
            </h3>
            <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
              <li><strong>Single-brand focus:</strong> Avoids cross-brand policy contamination between streaming, telecom, and banking.</li>
              <li><strong>Macro F1 over Micro Accuracy:</strong> Ensures critical rare intents (like Account Security, 7% of traffic) are not overwhelmed by high-volume billing queries.</li>
              <li><strong>Hybrid Retrieval (Dense + BM25):</strong> Dense embeddings match paraphrased user complaints; BM25 enforces exact error codes and model numbers.</li>
              <li><strong>Rule-Based Escalation Sentinels:</strong> Hard guardrails catch legal threats and account takeover attacks regardless of statistical confidence.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Hiver Support Intelligence • Take-Home Engineering Submission
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
