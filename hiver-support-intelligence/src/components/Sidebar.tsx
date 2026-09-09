import React from 'react';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  BookOpen,
  GitBranch,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export type NavItemKey =
  | 'overview'
  | 'agent'
  | 'conversations'
  | 'intents'
  | 'retrieval'
  | 'evaluation'
  | 'failures'
  | 'decisions';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  onOpenDocs: () => void;
  activeBrand: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenDocs,
  activeBrand,
}) => {
  const navItems: { key: NavItemKey; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'agent', label: 'Support Agent', icon: Bot, badge: 'Live' },
    { key: 'conversations', label: 'Conversations', icon: MessageSquare },
    { key: 'intents', label: 'Intent Analytics', icon: BarChart3 },
    { key: 'retrieval', label: 'Retrieval Explorer', icon: Search },
    { key: 'evaluation', label: 'Evaluation', icon: CheckCircle2, badge: 'F1: 0.79' },
    { key: 'failures', label: 'Failure Analysis', icon: AlertTriangle, badge: '5 cases' },
    { key: 'decisions', label: 'Decision Log', icon: FileCode2, badge: '14' },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 select-none h-screen sticky top-0"
    >
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
              H
            </div>
            <div>
              <div className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-1.5">
                Hiver
                <span className="text-[10px] bg-blue-500/20 text-blue-400 font-mono px-1.5 py-0.5 rounded border border-blue-500/30">
                  AI
                </span>
              </div>
              <div className="text-[11px] text-slate-400 tracking-tight">Support Intelligence</div>
            </div>
          </div>
          <div className="mt-3.5 px-2.5 py-1.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] flex items-center justify-between">
            <span className="text-slate-400">Target Model Brand:</span>
            <span className="text-blue-400 font-mono font-medium">@{activeBrand}</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                id={`nav-item-${item.key}`}
                onClick={() => onSelectTab(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-blue-700/80 text-blue-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Decision Engine
          </span>
          <span className="font-mono text-slate-400">v1.0.0</span>
        </div>

        <button
          id="btn-project-docs"
          onClick={onOpenDocs}
          className="w-full flex items-center justify-start gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Project Documentation</span>
        </button>

        <a
          id="btn-github-repo"
          href="https://github.com/hiver-support-intelligence"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            onOpenDocs();
          }}
          className="w-full flex items-center justify-start gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5 text-slate-400" />
          <span>GitHub Repository</span>
        </a>

        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800/60 leading-relaxed">
          "Do not maximize automation. Maximize trustworthy automation."
        </div>
      </div>
    </aside>
  );
};
