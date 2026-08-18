import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { TemplateSelector } from '../components/landing/TemplateSelector';
import { Terminal, Shield, Zap, Sparkles, Code, Cpu } from 'lucide-react';

export function LandingView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-900 selection:text-purple-200">
      {/* Top Brand Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Sandbox AI Studio
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-slate-400 border border-slate-800 rounded-full px-3 py-1 bg-slate-900/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>API Server Online</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col justify-between">
        <div>
          <HeroSection />
          <TemplateSelector />
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span>Built with React 19, Socket.IO & Tailwind CSS v4</span>
            </div>
            <p>Subdomain Router & Sandbox Container Management Platform</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
