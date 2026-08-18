import React from 'react';
import { STARTER_TEMPLATES } from '../../services/aiService';
import { LayoutDashboard, Briefcase, Kanban, ShoppingBag, ArrowRight } from 'lucide-react';
import { useSandbox } from '../../hooks/useSandbox';

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Kanban,
  ShoppingBag,
};

export function TemplateSelector() {
  const { startSandbox, isCreating } = useSandbox();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Starter App Presets</h2>
          <p className="text-xs text-slate-400">Launch a sandbox pre-configured with AI generation instructions</p>
        </div>
        <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Ready to Deploy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STARTER_TEMPLATES.map((tmpl) => {
          const Icon = iconMap[tmpl.icon] || LayoutDashboard;
          return (
            <div
              key={tmpl.id}
              onClick={() => !isCreating && startSandbox(tmpl.prompt)}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-100 text-base mb-2 group-hover:text-purple-300 transition">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {tmpl.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Launch & Build</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
