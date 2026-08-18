/**
 * useTerminal Custom Hook - Level 2 Architecture
 * Manages socket terminal data streams and input submissions
 */

import { useSandboxContext } from '../context/SandboxContext';

export function useTerminal() {
  const { terminalOutput, terminalConnected, sendTerminalCommand } = useSandboxContext();

  return {
    output: terminalOutput,
    isConnected: terminalConnected,
    sendCommand: sendTerminalCommand,
  };
}
