/**
 * Sandbox Global Context Provider - Level 2 Architecture
 * Provides state management across Landing and Workspace Views
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { startSandbox, listSandboxFiles, readSandboxFiles, updateSandboxFiles, createSandboxFiles } from '../services/api';
import { generateFrontendCode, STARTER_TEMPLATES } from '../services/aiService';
import { terminalSocket } from '../services/socket';

const SandboxContext = createContext(null);

export function SandboxProvider({ children }) {
  // State
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'workspace'
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'creating' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  // File state
  const [fileList, setFileList] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const [activeFile, setActiveFile] = useState('src/App.jsx');
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to Sandbox AI Studio! Describe the frontend application you would like to generate or pick one of the template presets below.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [terminalConnected, setTerminalConnected] = useState(false);

  // Initialize Socket output listener
  useEffect(() => {
    const unsubscribeOutput = terminalSocket.onOutput((data) => {
      setTerminalOutput((prev) => [...prev, data]);
    });

    const unsubscribeStatus = terminalSocket.onStatusChange((sockStatus) => {
      setTerminalConnected(sockStatus === 'connected');
    });

    return () => {
      unsubscribeOutput();
      unsubscribeStatus();
    };
  }, []);

  /**
   * Action: Create / Start a new Sandbox
   */
  const handleStartSandbox = async (initialPrompt = null) => {
    setStatus('creating');
    setErrorMessage('');
    try {
      const data = await startSandbox();
      setSandboxId(data.sandboxId);
      setPreviewUrl(data.previewUrl);
      setStatus('ready');
      setActiveView('workspace');

      // Connect terminal socket
      terminalSocket.connect(data.sandboxId);

      // Load initial files
      await refreshFiles(data.sandboxId);

      // If user provided a prompt from landing screen template, process it!
      if (initialPrompt) {
        handleSendPrompt(initialPrompt, data.sandboxId);
      }
    } catch (err) {
      console.error('Error launching sandbox:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to initialize sandbox environment.');
    }
  };

  /**
   * Action: Refresh file tree & active file content
   */
  const refreshFiles = async (id = sandboxId) => {
    if (!id) return;
    try {
      const files = await listSandboxFiles(id);
      if (files && files.length > 0) {
        setFileList(files);
        // Default read App.jsx and main files
        const contents = await readSandboxFiles(id, files.slice(0, 10));
        setFileMap((prev) => ({ ...prev, ...contents }));
      } else {
        // Fallback default files for local/mock sandbox experience
        setFileList(['src/App.jsx', 'src/main.jsx', 'package.json', 'src/index.css']);
        setFileMap({
          'src/App.jsx': `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">\n      <h1 className="text-3xl font-bold">Sandbox Environment Ready</h1>\n    </div>\n  );\n}`,
          'src/main.jsx': `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
          'package.json': `{\n  "name": "sandbox-app",\n  "private": true,\n  "version": "0.0.0"\n}`,
        });
      }
    } catch (err) {
      console.warn('Error refreshing files:', err);
    }
  };

  /**
   * Action: Select active file to view/edit
   */
  const selectFile = async (filePath) => {
    setActiveFile(filePath);
    if (!fileMap[filePath] && sandboxId) {
      const contents = await readSandboxFiles(sandboxId, [filePath]);
      setFileMap((prev) => ({ ...prev, ...contents }));
    }
  };

  /**
   * Action: Update a file content manually
   */
  const handleSaveFileContent = async (filePath, newContent) => {
    setFileMap((prev) => ({ ...prev, [filePath]: newContent }));
    if (sandboxId) {
      await updateSandboxFiles(sandboxId, [{ file: filePath, content: newContent }]);
    }
  };

  /**
   * Action: Send AI prompt to generate code
   */
  const handleSendPrompt = async (promptText, overrideSandboxId = sandboxId) => {
    if (!promptText.trim()) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const result = await generateFrontendCode(promptText, overrideSandboxId, fileMap);

      // Update file map with generated contents
      const newUpdates = {};
      result.generatedFiles.forEach((gf) => {
        newUpdates[gf.file] = gf.content;
      });

      setFileMap((prev) => ({ ...prev, ...newUpdates }));
      
      // Update file list if new files were created
      setFileList((prev) => {
        const set = new Set([...prev, ...result.generatedFiles.map((gf) => gf.file)]);
        return Array.from(set);
      });

      // Add AI response message
      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: result.explanation,
        generatedFiles: result.generatedFiles,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI generation error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'ai',
          text: `Error generating UI: ${err.message}`,
          isError: true,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Action: Send terminal input command
   */
  const sendTerminalCommand = (cmd) => {
    terminalSocket.sendInput(cmd);
  };

  /**
   * Action: Exit workspace back to landing
   */
  const exitWorkspace = () => {
    terminalSocket.disconnect();
    setSandboxId(null);
    setPreviewUrl('');
    setStatus('idle');
    setActiveView('landing');
  };

  return (
    <SandboxContext.Provider
      value={{
        activeView,
        setActiveView,
        sandboxId,
        previewUrl,
        status,
        errorMessage,
        fileList,
        fileMap,
        activeFile,
        selectFile,
        handleSaveFileContent,
        chatMessages,
        isGenerating,
        handleStartSandbox,
        handleSendPrompt,
        terminalOutput,
        terminalConnected,
        sendTerminalCommand,
        exitWorkspace,
        refreshFiles,
      }}
    >
      {children}
    </SandboxContext.Provider>
  );
}

export function useSandboxContext() {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error('useSandboxContext must be used within a SandboxProvider');
  }
  return context;
}
