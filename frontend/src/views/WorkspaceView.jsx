import React, { useState } from 'react';
import { HeaderBar } from '../components/workspace/HeaderBar';
import { ChatPanel } from '../components/chat/ChatPanel';
import { FileExplorer } from '../components/editor/FileExplorer';
import { CodeViewer } from '../components/editor/CodeViewer';
import { PreviewPanel } from '../components/preview/PreviewPanel';
import { TerminalPanel } from '../components/terminal/TerminalPanel';

export function WorkspaceView() {
  const [activeTab, setActiveTab] = useState('split'); // 'split' | 'code' | 'preview'
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);

  const toggleTerminal = () => {
    setIsTerminalOpen((prev) => !prev);
  };

  const toggleTerminalExpand = () => {
    setIsTerminalExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <HeaderBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleTerminal={toggleTerminal}
        isTerminalOpen={isTerminalOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side AI Chat Panel */}
        <div className="w-80 sm:w-96 shrink-0 h-full border-r border-slate-800">
          <ChatPanel />
        </div>

        {/* Center / Right Dynamic Workspace Panels */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Main Content Panels depending on tab */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code / Editor Section */}
            {(activeTab === 'split' || activeTab === 'code') && (
              <div className="flex-1 flex h-full overflow-hidden border-r border-slate-800">
                <div className="w-48 sm:w-56 shrink-0 h-full">
                  <FileExplorer />
                </div>
                <div className="flex-1 h-full overflow-hidden">
                  <CodeViewer />
                </div>
              </div>
            )}

            {/* Live Preview Section */}
            {(activeTab === 'split' || activeTab === 'preview') && (
              <div className="flex-1 h-full overflow-hidden">
                <PreviewPanel />
              </div>
            )}
          </div>

          {/* Bottom Socket Terminal Panel */}
          {isTerminalOpen && (
            <div
              className={`transition-all duration-200 shrink-0 ${
                isTerminalExpanded ? 'h-96' : 'h-48'
              }`}
            >
              <TerminalPanel
                onClose={toggleTerminal}
                isExpanded={isTerminalExpanded}
                toggleExpand={toggleTerminalExpand}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
