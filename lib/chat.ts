// Central chat configuration

import { UserRoles } from '@/types';
import { getEnv } from '@/lib/env';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
  getEnv().wsUrl ?? ""
);

// --- STOMP/SockJS Chat Service ---
type StompMessageListener = (msg: unknown) => void;

class StompChatService {
  private client: Client | null = null;
  private messageListeners: StompMessageListener[] = [];
  private connected = false;

  connect(token: string) {
    if (this.client) {
      this.disconnect();
    }
    this.client = new Client({
      webSocketFactory: () => new SockJS(getEnv().wsUrl || 'http://localhost:8888/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: () => {},
      reconnectDelay: 5000,
    });
    this.client.onConnect = () => {
      this.connected = true;
      // Subscribe to private queue for messages
      this.client?.subscribe('/user/queue/messages', (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          this.messageListeners.forEach((cb) => cb(data));
        } catch {}
      });
    };
    this.client.onDisconnect = () => {
      this.connected = false;
    };
    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
    }
  }

  onMessage(cb: StompMessageListener) {
    this.messageListeners.push(cb);
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== cb);
    };
  }

  sendMessage(destination: string, body: unknown) {
    if (this.client && this.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }
}

export const stompChatService = new StompChatService();