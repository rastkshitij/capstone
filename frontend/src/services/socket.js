/**
 * Socket.IO Terminal Connection Manager - Level 1 Architecture
 * Manages real-time WebSocket connection to sandbox agent for terminal commands
 */

import { io } from 'socket.io-client';
import { getAgentBaseUrl } from './api';

class TerminalSocketManager {
  constructor() {
    this.socket = null;
    this.sandboxId = null;
    this.outputListeners = new Set();
    this.statusListeners = new Set();
    this.isConnected = false;
  }

  /**
   * Connects to sandbox agent terminal socket
   * @param {string} sandboxId
   */
  connect(sandboxId) {
    if (this.socket && this.sandboxId === sandboxId) {
      return this.socket;
    }

    this.disconnect();
    this.sandboxId = sandboxId;

    const agentUrl = getAgentBaseUrl(sandboxId);
    console.log(`[Socket] Connecting terminal socket to ${agentUrl}`);

    try {
      this.socket = io(agentUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log(`[Socket] Connected to sandbox terminal ${sandboxId}`);
        this.isConnected = true;
        this.notifyStatus('connected');
        this.notifyOutput('\r\n\x1b[32m[Connected to Sandbox Terminal]\x1b[0m\r\n$ ');
      });

      this.socket.on('terminal-output', (data) => {
        this.notifyOutput(data);
      });

      this.socket.on('disconnect', (reason) => {
        console.log(`[Socket] Disconnected: ${reason}`);
        this.isConnected = false;
        this.notifyStatus('disconnected');
        this.notifyOutput('\r\n\x1b[31m[Terminal Disconnected]\x1b[0m\r\n');
      });

      this.socket.on('connect_error', (error) => {
        console.warn(`[Socket] Connection error:`, error.message);
        this.isConnected = false;
        this.notifyStatus('error');
      });
    } catch (err) {
      console.error(`[Socket] Exception creating socket connection:`, err);
      this.isConnected = false;
      this.notifyStatus('error');
    }

    return this.socket;
  }

  /**
   * Sends command string or keystrokes to terminal
   * Event: terminal-input
   * @param {string} input
   */
  sendInput(input) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('terminal-input', input);
    } else {
      console.warn('[Socket] Cannot send input: Socket not connected');
      // Echo locally for simulated terminal fallback
      this.notifyOutput(input);
    }
  }

  /**
   * Subscribe to terminal output streams
   */
  onOutput(callback) {
    this.outputListeners.add(callback);
    return () => this.outputListeners.delete(callback);
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback) {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  notifyOutput(data) {
    this.outputListeners.forEach((cb) => cb(data));
  }

  notifyStatus(status) {
    this.statusListeners.forEach((cb) => cb(status));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.sandboxId = null;
    this.isConnected = false;
  }
}

export const terminalSocket = new TerminalSocketManager();
