/**
 * useAIChat Custom Hook - Level 2 Architecture
 * Manages AI prompt execution, chat message history, and code generation state
 */

import { useSandboxContext } from '../context/SandboxContext';

export function useAIChat() {
  const { chatMessages, isGenerating, handleSendPrompt } = useSandboxContext();

  return {
    messages: chatMessages,
    isGenerating,
    sendPrompt: handleSendPrompt,
  };
}
