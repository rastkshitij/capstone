/**
 * useSandbox Custom Hook - Level 2 Architecture
 * Exposes sandbox creation, file selection, and environment status
 */

import { useSandboxContext } from '../context/SandboxContext';

export function useSandbox() {
  const {
    sandboxId,
    previewUrl,
    status,
    errorMessage,
    fileList,
    fileMap,
    activeFile,
    selectFile,
    handleSaveFileContent,
    handleStartSandbox,
    exitWorkspace,
    refreshFiles,
  } = useSandboxContext();

  return {
    sandboxId,
    previewUrl,
    status,
    errorMessage,
    fileList,
    fileMap,
    activeFile,
    selectFile,
    saveFile: handleSaveFileContent,
    startSandbox: handleStartSandbox,
    exitWorkspace,
    refreshFiles,
    isReady: status === 'ready',
    isCreating: status === 'creating',
  };
}
