import React from 'react';
import { useSandbox } from '../../hooks/useSandbox';
import { FileCode, Folder, RefreshCw, FileText, Code2, Plus } from 'lucide-react';

export function FileExplorer() {
  const { fileList, activeFile, selectFile, refreshFiles } = useSandbox();

  return (
    <div className="flex flex-col h-full bg-slate-950/90 border-r border-slate-800 select-none">
      {/* Explorer Header */}
      <div className="h-10 border-b border-slate-800 px-3 flex items-center justify-between shrink-0 bg-slate-900/30">
        <span className="font-semibold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-purple-400" /> Workspace Files
        </span>
        <button
          onClick={() => refreshFiles()}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          title="Refresh File Tree"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {fileList && fileList.length > 0 ? (
          fileList.map((file) => {
            const isActive = activeFile === file;
            const isJsx = file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.js');
            const isCss = file.endsWith('.css');
            const isJson = file.endsWith('.json');

            return (
              <button
                key={file}
                onClick={() => selectFile(file)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {isJsx ? (
                  <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : isCss ? (
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                ) : isJson ? (
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className="truncate">{file}</span>
              </button>
            );
          })
        ) : (
          <div className="p-4 text-center text-slate-500 text-xs">
            No files listed yet
          </div>
        )}
      </div>
    </div>
  );
}
