import { apiClient } from "@/lib/axios"
import { 
  ChatMessage, 
  ChatRoom, 
  ChatParticipant, 
  SendMessageRequest, 
  SendReactionRequest,
  ChatApiResponse 
} from "@/types/chat"

// Mock data for testing
const mockParticipants: ChatParticipant[] = [
  {
    id: 1,
    name: "Dr. Martin Dupont",
    role: "DOCTOR",
    avatar: "/avatars/doctor1.jpg",
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: 2,
    name: "Marie Laurent",
    role: "SECRETARY",
    avatar: "/avatars/secretary1.jpg",
    isOnline: false,
    lastSeen: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
  },
  {
    id: 3,
    name: "Dr. Sophie Bernard",
    role: "DOCTOR",
    avatar: "/avatars/doctor2.jpg",
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: 4,
    name: "Claire Dubois",
    role: "SECRETARY",
    avatar: "/avatars/secretary2.jpg",
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: 5,
    name: "Dr. Jean Moreau",
    role: "DOCTOR",
    avatar: "/avatars/doctor3.jpg",
    isOnline: false,
    lastSeen: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
  },
  {
    id: 6,
    name: "Sophie Martin",
    role: "SECRETARY",
    avatar: "/avatars/secretary3.jpg",
    isOnline: true,
    lastSeen: new Date().toISOString()
  }
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Bonjour ! Avez-vous reçu les résultats du patient Martin ?",
    senderId: 1,
    senderName: "Dr. Martin Dupont",
    senderRole: "DOCTOR",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isRead: true,
    reactions: [
      { id: "r1", emoji: "👍", userId: 2, userName: "Marie Laurent", timestamp: new Date().toISOString() }
    ]
  },
  {
    id: "2",
    content: "Oui, je les ai reçus ce matin. Je vais les organiser dans le dossier.",
    senderId: 2,
    senderName: "Marie Laurent",
    senderRole: "SECRETARY",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    isRead: true,
    reactions: []
  },
  {
    id: "3",
    content: "Parfait ! Merci beaucoup 😊",
    senderId: 1,
    senderName: "Dr. Martin Dupont",
    senderRole: "DOCTOR",
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    isRead: false,
    reactions: []
  }
]

const mockConversations: ChatRoom[] = [
  {
    id: "conv1",
    participants: [mockParticipants[0], mockParticipants[1]],
    lastMessage: mockMessages[2],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString()
  },
  {
    id: "conv2",
    participants: [mockParticipants[0], mockParticipants[2]],
    lastMessage: undefined,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
]

class ChatService {
  // GET /api/v1/chat/conversations
  async getConversations(): Promise<ChatApiResponse<ChatRoom[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      data: mockConversations,
      message: "Conversations récupérées avec succès"
    }
  }

  // GET /api/v1/chat/participants
  async getParticipants(): Promise<ChatApiResponse<ChatParticipant[]>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: mockParticipants,
      message: "Participants récupérés avec succès"
    }
  }

  // GET /api/v1/chat/conversation/{userId}
  async getConversation(userId: number): Promise<ChatApiResponse<ChatMessage[]>> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Filter messages for this conversation
    const conversationMessages = mockMessages.filter(msg => 
      msg.senderId === userId || mockParticipants.find(p => p.id === userId)
    )
    
    return {
      success: true,
      data: conversationMessages,
      message: "Messages de la conversation récupérés"
    }
  }

  // POST /api/v1/chat
  async sendMessage(request: SendMessageRequest): Promise<ChatApiResponse<ChatMessage>> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: request.content,
      senderId: 1, // Mock current user ID
      senderName: "Dr. Martin Dupont", // Mock current user name
      senderRole: "DOCTOR", // Mock current user role
      timestamp: new Date().toISOString(),
      isRead: false,
      reactions: []
    }
    
    // Add to mock messages
    mockMessages.push(newMessage)
    
    return {
      success: true,
      data: newMessage,
      message: "Message envoyé avec succès"
    }
  }

  // GET /api/v1/chat/unread/count
  async getUnreadCount(): Promise<ChatApiResponse<number>> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const unreadCount = mockMessages.filter(msg => !msg.isRead).length
    
    return {
      success: true,
      data: unreadCount,
      message: "Nombre de messages non lus récupéré"
    }
  }

  // PUT /api/v1/chat/read/{senderId}
  async markAsRead(senderId: number): Promise<ChatApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mark messages as read
    mockMessages.forEach(msg => {
      if (msg.senderId === senderId) {
        msg.isRead = true
      }
    })
    
    return {
      success: true,
      data: undefined,
      message: "Messages marqués comme lus"
    }
  }

  // POST /api/v1/chat/message/{id}/react?reaction={emoji}
  async addReaction(messageId: string, emoji: string): Promise<ChatApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const message = mockMessages.find(msg => msg.id === messageId)
    if (message) {
      const newReaction = {
        id: Date.now().toString(),
        emoji,
        userId: 1, // Mock current user ID
        userName: "Dr. Martin Dupont", // Mock current user name
        timestamp: new Date().toISOString()
      }
      message.reactions.push(newReaction)
    }
    
    return {
      success: true,
      data: undefined,
      message: "Réaction ajoutée avec succès"
    }
  }

  // DELETE /api/v1/chat/message/{messageId}
  async deleteMessage(messageId: string): Promise<ChatApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockMessages.findIndex(msg => msg.id === messageId)
    if (index !== -1) {
      mockMessages.splice(index, 1)
    }
    
    return {
      success: true,
      data: undefined,
      message: "Message supprimé avec succès"
    }
  }

  // DELETE /api/v1/chat/all
  async deleteAllMessages(): Promise<ChatApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    mockMessages.length = 0
    
    return {
      success: true,
      data: undefined,
      message: "Tous les messages ont été supprimés"
    }
  }
}

export const chatService = new ChatService()
