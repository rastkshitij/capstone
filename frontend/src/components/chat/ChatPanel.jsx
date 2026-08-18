import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../../hooks/useAIChat';
import { ChatMessage } from './ChatMessage';
import { Send, Sparkles, Loader2, Code2, Zap } from 'lucide-react';
import { STARTER_TEMPLATES } from '../../services/aiService';

export function ChatPanel() {
  const { messages, isGenerating, sendPrompt } = useAIChat();
  const [promptText, setPromptText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!promptText.trim() || isGenerating) return;
    sendPrompt(promptText);
    setPromptText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border-r border-slate-800">
      {/* Panel Header */}
      <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            AI Frontend Architect
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Agent API Ready
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isGenerating && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-purple-500/30 text-purple-300 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400 shrink-0" />
            <span>AI is designing React components & writing files to sandbox workspace...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 border-t border-slate-900 bg-slate-950/90 flex gap-1.5 overflow-x-auto no-scrollbar">
        {STARTER_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => !isGenerating && sendPrompt(tmpl.prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-400 hover:text-purple-300 transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-purple-400" /> {tmpl.name}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask AI to build or modify frontend components..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isGenerating}
            className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!promptText.trim() || isGenerating}
            className="absolute right-1.5 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-30 disabled:pointer-events-none transition shadow-md shadow-purple-500/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
