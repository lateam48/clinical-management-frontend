// Central chat configuration

import { UserRoles } from '@/types';

export const CHAT_ROLES = [UserRoles.DOCTOR, UserRoles.SECRETARY, UserRoles.ADMIN] as const;
export type ChatRole = typeof CHAT_ROLES[number];

export const roleLabels: Record<ChatRole, string> = {
  [UserRoles.DOCTOR]: 'docteurs',
  [UserRoles.SECRETARY]: 'secrétaires',
  [UserRoles.ADMIN]: 'administrateurs',
};

// --- WebSocket Chat Service ---

export type ChatWebSocketEvent =
  | { type: 'message'; data: unknown }
  | { type: 'reaction'; data: unknown }
  | { type: 'typing'; data: unknown }
  | { type: 'read'; data: unknown }
  | { type: 'online_status'; data: unknown };

type Listener = (event: ChatWebSocketEvent) => void;

class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Listener[] = [];
  private url: string;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isConnected = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(token: string) {
    if (this.ws) this.disconnect();
    this.ws = new WebSocket(`${this.url}?token=${encodeURIComponent(token)}`);
    this.ws.onopen = () => {
      this.isConnected = true;
    };
    this.ws.onclose = () => {
      this.isConnected = false;
      this.reconnect();
    };
    this.ws.onerror = () => {
      this.isConnected = false;
      this.reconnect();
    };
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach((cb) => cb(data));
      } catch {}
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  send(event: ChatWebSocketEvent) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(event));
    }
  }

  onEvent(cb: Listener) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private reconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      // You should get a fresh token here if needed
      // this.connect(token)
      this.reconnectTimeout = null;
    }, 3000);
  }
}

// Usage: import { chatWebSocketService } from '@/lib/chat'
// chatWebSocketService.connect(token)
// chatWebSocketService.onEvent(cb)

export const chatWebSocketService = new ChatWebSocketService(
  process.env.NEXT_PUBLIC_CHAT_WS_URL || 'http://localhost:8888/ws'
);