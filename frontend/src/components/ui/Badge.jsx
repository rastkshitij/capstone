import React from 'react';

export function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    info: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
}
