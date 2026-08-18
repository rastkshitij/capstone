import React, { useEffect, useRef, useState } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import { Terminal as TerminalIcon, Send, Maximize2, Minimize2, Trash2, Shield, Circle } from 'lucide-react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

export function TerminalPanel({ onClose, isExpanded, toggleExpand }) {
  const { output, isConnected, sendCommand } = useTerminal();
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [inputVal, setInputVal] = useState('');

  // Initialize Xterm.js
  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#07090e',
        foreground: '#f3f4f6',
        cursor: '#a855f7',
        selectionBackground: 'rgba(168, 85, 247, 0.3)',
        black: '#000000',
        red: '#f43f5e',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#ffffff',
      },
      fontFamily: 'Consolas, Menlo, Monaco, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 1.2,
      rows: 12,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln('\x1b[1;35m═══ Interactive Sandbox Socket.IO Terminal ═══\x1b[0m');
    term.writeln('Type shell commands below to execute inside sandbox environment.\r\n');

    // Handle user keystrokes in xterm
    term.onData((data) => {
      sendCommand(data);
    });

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (err) {}
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  // Stream output into XTerm
  useEffect(() => {
    if (xtermRef.current && output.length > 0) {
      const latest = output[output.length - 1];
      xtermRef.current.write(latest);
    }
  }, [output]);

  const handleSendForm = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendCommand(inputVal + '\n');
    setInputVal('');
  };

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07090e] border-t border-slate-800">
      {/* Terminal Header */}
      <div className="h-9 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-950">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-xs text-slate-300 font-mono">
            bash ~ socket.io
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <Circle className={`w-2 h-2 fill-current ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-[10px] text-slate-500 font-mono">
              {isConnected ? 'ONLINE' : 'CONNECTING'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-900 transition"
            title="Clear Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleExpand}
            className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-900 transition"
            title={isExpanded ? 'Minimize Terminal' : 'Maximize Terminal'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="flex-1 overflow-hidden p-2 terminal-container relative">
        <div ref={terminalRef} className="w-full h-full" />
      </div>

      {/* Fallback Command Input Bar */}
      <form onSubmit={handleSendForm} className="h-9 border-t border-slate-800/80 px-3 bg-slate-950 flex items-center gap-2">
        <span className="text-purple-400 font-mono text-xs font-bold">$</span>
        <input
          type="text"
          placeholder="Send command to socket (e.g. npm install, ls -la)..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none placeholder-slate-600"
        />
        <button type="submit" className="p-1 text-purple-400 hover:text-purple-300">
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
