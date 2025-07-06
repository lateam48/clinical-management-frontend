import { Client, Message } from '@stomp/stompjs';

function createWebSocketService() {
  let client: Client;
  let isConnected = false;

  const subscribeToPublicChat = () => {
    client.subscribe('/topic/public', (message: Message) => {
      console.log('Received public message:', message.body);
      // Handle public message
    });
  };

  const subscribeToPrivateChat = () => {
    client.subscribe('/user/queue/private', (message: Message) => {
      console.log('Received private message:', message.body);
      // Handle private message
    });
  };

  client = new Client({
    brokerURL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8888/ws',
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('Connected to WebSocket');
      isConnected = true;
      subscribeToPublicChat();
      subscribeToPrivateChat();
    },
    onDisconnect: () => {
      console.log('Disconnected from WebSocket');
      isConnected = false;
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
      isConnected = false;
    },
    onWebSocketError: (error) => {
      console.error('WebSocket connection error:', error);
      isConnected = false;
    },
  });

  return {
    connect: () => {
      try {
        client.activate();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    },
    disconnect: () => {
      try {
        client.deactivate();
        isConnected = false;
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }
    },
    sendMessage: (destination: string, body: any) => {
      if (!isConnected || !client.connected) {
        console.warn('WebSocket not connected. Message not sent:', { destination, body });
        return false;
      }
      try {
        client.publish({
          destination,
          body: JSON.stringify(body),
        });
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    },
    isConnected: () => isConnected,
  };
}

export const webSocketService = createWebSocketService();
