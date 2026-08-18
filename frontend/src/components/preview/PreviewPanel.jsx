import React, { useState } from 'react';
import { useSandbox } from '../../hooks/useSandbox';
import { RefreshCw, ExternalLink, Monitor, Tablet, Smartphone, ShieldCheck, Eye } from 'lucide-react';

export function PreviewPanel() {
  const { previewUrl, sandboxId, fileMap } = useSandbox();
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800">
      {/* Address Bar */}
      <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-md px-3 py-1 text-xs text-slate-300 w-64 sm:w-80 truncate font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{previewUrl || `http://${sandboxId || 'sandbox'}.preview.localhost`}</span>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1 rounded text-xs transition ${
              viewport === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1 rounded text-xs transition ${
              viewport === 'tablet' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1 rounded text-xs transition ${
              viewport === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1 text-slate-400 hover:text-purple-400 rounded hover:bg-slate-800 transition"
          title="Open preview in new window"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Preview Viewport Container */}
      <div className="flex-1 bg-slate-900/30 overflow-auto p-4 flex justify-center items-start">
        <div className={`h-full bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${viewportWidths[viewport]}`}>
          {previewUrl ? (
            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Sandbox Live Preview"
              className="w-full h-full border-0 bg-slate-950"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-4">
              <Eye className="w-12 h-12 text-purple-400 opacity-50" />
              <div>
                <h3 className="font-bold text-slate-200 text-base">Live Preview Initializing</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Connecting to sandbox proxy target at <code className="text-purple-400">*.preview.localhost</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
