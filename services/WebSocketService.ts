import { Client, Message } from '@stomp/stompjs';

class WebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8888/ws', // Your WebSocket endpoint
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.subscribeToPublicChat();
        this.subscribeToPrivateChat();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });
  }

  connect() {
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  subscribeToPublicChat() {
    this.client.subscribe('/topic/public', (message: Message) => {
      console.log('Received public message:', message.body);
      // Handle public message
    });
  }

  subscribeToPrivateChat() {
    this.client.subscribe('/user/queue/private', (message: Message) => {
      console.log('Received private message:', message.body);
      // Handle private message
    });
  }

  sendMessage(destination: string, body: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}

export const webSocketService = new WebSocketService();
