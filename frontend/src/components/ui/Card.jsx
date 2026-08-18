import React from 'react';

export function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div
      className={`rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md p-6 ${glow ? 'glow-purple' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
