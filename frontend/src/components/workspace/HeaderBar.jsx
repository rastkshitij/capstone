import React from 'react';
import { useSandbox } from '../../hooks/useSandbox';
import { useTerminal } from '../../hooks/useTerminal';
import { Terminal, ExternalLink, RefreshCw, LogOut, ShieldCheck, Sparkles, Layout, Code, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function HeaderBar({ activeTab, setActiveTab, toggleTerminal, isTerminalOpen }) {
  const { sandboxId, previewUrl, exitWorkspace, refreshFiles } = useSandbox();
  const { isConnected } = useTerminal();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 px-4 flex items-center justify-between shrink-0 z-30">
      {/* Brand & Sandbox Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-100 hidden sm:inline tracking-tight">
            Sandbox AI Studio
          </span>
        </div>

        {sandboxId && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-slate-300 font-medium max-w-[120px] sm:max-w-[200px] truncate">
              {sandboxId}
            </span>
          </div>
        )}

        <Badge variant={isConnected ? 'success' : 'neutral'}>
          {isConnected ? 'Socket Connected' : 'Socket Reconnecting'}
        </Badge>
      </div>

      {/* Center View Layout Toggles (Mobile/Responsive) */}
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('split')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
            activeTab === 'split' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> <span className="hidden md:inline">Split View</span>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
            activeTab === 'code' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" /> <span className="hidden md:inline">Code</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
            activeTab === 'preview' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> <span className="hidden md:inline">Preview</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTerminal}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
            isTerminalOpen 
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> Terminal
        </button>

        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-purple-400 hover:text-purple-300 hover:border-purple-500/30 transition"
          >
            Open App <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <Button variant="ghost" size="sm" onClick={exitWorkspace} title="Exit Sandbox">
          <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition" />
        </Button>
      </div>
    </header>
  );
}
