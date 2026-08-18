import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Sparkles, Terminal, Code2, Cpu, Rocket, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import { useSandbox } from '../../hooks/useSandbox';

export function HeroSection({ onSelectTemplate }) {
  const { startSandbox, isCreating, errorMessage } = useSandbox();
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCreateCustom = () => {
    startSandbox(customPrompt || null);
  };

  return (
    <div className="relative pt-24 pb-16 px-6 max-w-6xl mx-auto text-center">
      {/* Background Decorative Shaders */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-inner">
        <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Next-Gen Isolated React Sandbox Engine</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Instant Sandbox Creation.{' '}
        <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
          AI Frontend Generation.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
        Launch a live browser sandbox with full interactive terminal access over Socket.IO, real-time dynamic preview URL, and AI agent to generate frontends on demand.
      </p>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Main Start Sandbox Action Control */}
      <div className="max-w-2xl mx-auto bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row gap-2 mb-12">
        <div className="flex-1 flex items-center px-4 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <Terminal className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Describe what frontend you want AI to generate..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCustom()}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <Button
          size="lg"
          variant="glow"
          onClick={handleCreateCustom}
          isLoading={isCreating}
          className="shrink-0"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Start Sandbox
        </Button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Kubernetes Pods</h4>
            <p className="text-[11px] text-slate-500">Subdomain isolation</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Socket.IO Terminal</h4>
            <p className="text-[11px] text-slate-500">Real-time shell commands</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">AI Code Generation</h4>
            <p className="text-[11px] text-slate-500">Agent API file updates</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Live Preview Router</h4>
            <p className="text-[11px] text-slate-500">Dynamic HMR iframe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
