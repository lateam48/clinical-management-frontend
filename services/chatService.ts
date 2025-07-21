import { apiClient } from "@/lib/axios";
import {
  ChatMessage,
  ChatRoom,
  SendMessageRequest,
  ChatApiResponse,
  MessageReaction,
  ChatAttachment,
  ChatParticipant,
} from "@/types";

const BASE_URL = "/chat";

// Utility to map backend participant to ChatParticipant
function mapParticipant(raw: unknown): ChatParticipant {
  const obj = raw as Record<string, unknown>;
  return {
    id: obj.id as number,
    name: (obj.fullName as string) || (obj.name as string) || '',
    username: (obj.username as string) || (obj.email as string) || '',
    role: ((obj.role as string) || 'DOCTOR') as 'DOCTOR' | 'SECRETARY',
    avatar: (obj.avatar as string) || undefined,
    isOnline: (obj.isOnline as boolean) ?? true,
    lastSeen: (obj.lastSeen as string) || undefined,
  };
}

// Utility to map backend message to ChatMessage
function mapMessage(raw: unknown): ChatMessage {
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj.id),
    content: obj.content as string,
    senderId: obj.senderId as number,
    senderName: obj.senderName as string,
    senderRole: ((obj.senderRole as string) || 'DOCTOR') as 'DOCTOR' | 'SECRETARY',
    createdAt: (obj.createdAt as string) || (obj.timestamp as string),
    isRead: obj.isRead as boolean,
    reactions: Array.isArray(obj.reactions)
      ? (obj.reactions as MessageReaction[])
      : [],
    attachments: (obj.attachments as ChatAttachment[]) || [],
  };
}

// Utility to map backend conversation to ChatRoom
function mapConversation(raw: unknown): ChatRoom {
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj.id),
    participants: Array.isArray(obj.participants)
      ? (obj.participants as unknown[]).map(mapParticipant)
      : [],
    lastMessage: obj.lastMessage ? mapMessage(obj.lastMessage) : undefined,
    unreadCount: (obj.unreadCount as number) ?? 0,
    createdAt: obj.createdAt as string,
    updatedAt: obj.updatedAt as string,
  };
}

class ChatService {
  // GET /chat/conversations
  async getConversations(): Promise<ChatApiResponse<ChatRoom[]>> {
    const res = await apiClient.get(`${BASE_URL}/conversations`);
    const data = Array.isArray(res.data)
      ? res.data.map(mapConversation)
      : [];
    return {
      success: true,
      data,
      message: "Conversations récupérées avec succès",
    };
  }

  // GET /chat/conversation/{userId}
  async getConversation(userId: number): Promise<ChatApiResponse<ChatMessage[]>> {
    const res = await apiClient.get(`${BASE_URL}/conversation/${userId}`);
    const data = Array.isArray(res.data)
      ? res.data.map(mapMessage)
      : [];
    return {
      success: true,
      data,
      message: "Messages de la conversation récupérés",
    };
  }

  // POST /chat
  async sendMessage(request: SendMessageRequest): Promise<ChatApiResponse<ChatMessage>> {
    const res = await apiClient.post(`${BASE_URL}`, {
      content: request.content,
      recipientName: request.recipientName,
    });
    return {
      success: true,
      data: mapMessage(res.data),
      message: "Message envoyé avec succès",
    };
  }

  // GET /chat/unread/count
  async getUnreadCount(): Promise<ChatApiResponse<number>> {
    const res = await apiClient.get(`${BASE_URL}/unread/count`);
    return {
      success: true,
      data: typeof res.data === "number" ? res.data : 0,
      message: "Nombre de messages non lus récupéré",
    };
  }

  // PUT /chat/read/{senderId}
  async markAsRead(senderId: number): Promise<ChatApiResponse<void>> {
    await apiClient.put(`${BASE_URL}/read/${senderId}`);
    return {
      success: true,
      data: undefined,
      message: "Messages marqués comme lus",
    };
  }

  // POST /chat/message/{id}/react?reaction={emoji}
  async addReaction(messageId: string, emoji: string): Promise<ChatApiResponse<void>> {
    await apiClient.post(`${BASE_URL}/message/${messageId}/react?reaction=${encodeURIComponent(emoji)}`);
    return {
      success: true,
      data: undefined,
      message: "Réaction ajoutée avec succès",
    };
  }

  // DELETE /chat/message/{messageId}
  async deleteMessage(messageId: string): Promise<ChatApiResponse<void>> {
    await apiClient.delete(`${BASE_URL}/message/${messageId}`);
    return {
      success: true,
      data: undefined,
      message: "Message supprimé avec succès",
    };
  }

  // DELETE /chat/all
  async deleteAllMessages(): Promise<ChatApiResponse<void>> {
    await apiClient.delete(`${BASE_URL}/all`);
    return {
      success: true,
      data: undefined,
      message: "Tous les messages ont été supprimés",
    };
  }
}

export const chatService = new ChatService();
