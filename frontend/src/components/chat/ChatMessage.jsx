import React from 'react';
import { Sparkles, User, FileCode, Check } from 'lucide-react';
import { useSandbox } from '../../hooks/useSandbox';

export function ChatMessage({ message }) {
  const isAI = message.sender === 'ai';
  const { selectFile } = useSandbox();

  return (
    <div className={`flex gap-3 text-sm ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shrink-0 mt-0.5 shadow-md shadow-purple-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] space-y-2 ${isAI ? 'text-slate-200' : 'text-white'}`}>
        <div
          className={`p-3.5 rounded-2xl leading-relaxed text-xs sm:text-sm ${
            isAI
              ? 'bg-slate-900/90 border border-slate-800 rounded-tl-sm text-slate-300'
              : 'bg-purple-600 text-white rounded-tr-sm shadow-lg shadow-purple-500/20'
          }`}
        >
          {message.text}
        </div>

        {/* Generated Files Pills */}
        {message.generatedFiles && message.generatedFiles.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 space-y-2">
            <span className="text-[11px] font-semibold text-purple-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Files generated & patched into sandbox:
            </span>
            <div className="space-y-1">
              {message.generatedFiles.map((gf, idx) => (
                <button
                  key={idx}
                  onClick={() => selectFile(gf.file)}
                  className="w-full text-left px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between transition group"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <FileCode className="w-3.5 h-3.5 text-purple-400" /> {gf.file}
                  </span>
                  <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition">
                    View Code →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <span className="text-[10px] text-slate-500 block px-1">
          {message.timestamp}
        </span>
      </div>

      {!isAI && (
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
