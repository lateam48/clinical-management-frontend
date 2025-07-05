import { Client, Message } from '@stomp/stompjs';

function createWebSocketService() {
  let client: Client;

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
      subscribeToPublicChat();
      subscribeToPrivateChat();
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  return {
    connect: () => client.activate(),
    disconnect: () => client.deactivate(),
    sendMessage: (destination: string, body: any) => {
      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    },
  };
}

export const webSocketService = createWebSocketService();
