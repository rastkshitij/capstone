import React, { useState, useEffect } from 'react';
import { useSandbox } from '../../hooks/useSandbox';
import { Save, Copy, Check, FileCode, Edit3, Code } from 'lucide-react';

export function CodeViewer() {
  const { activeFile, fileMap, saveFile } = useSandbox();
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(fileMap[activeFile] || '');
  }, [activeFile, fileMap]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    saveFile(activeFile, content);
    setIsEditing(false);
  };

  const lines = content.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-950/95 font-mono">
      {/* Code Editor Header */}
      <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <FileCode className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-semibold">{activeFile}</span>
          {isEditing && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-sans font-semibold flex items-center gap-1 shadow transition"
            >
              <Save className="w-3 h-3" /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 text-xs font-sans flex items-center gap-1 hover:bg-slate-800 transition"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-auto p-4 text-xs leading-relaxed flex">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent text-slate-200 font-mono focus:outline-none resize-none selection:bg-purple-900/50"
            spellCheck={false}
          />
        ) : (
          <div className="w-full flex">
            {/* Line Numbers */}
            <div className="select-none pr-4 text-right text-slate-600 border-r border-slate-800/80 mr-4 shrink-0 font-mono">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Lines */}
            <div className="overflow-x-auto text-slate-300 font-mono whitespace-pre w-full">
              {lines.map((line, i) => (
                <div key={i} className="hover:bg-slate-900/60 rounded px-1">
                  {line || ' '}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
