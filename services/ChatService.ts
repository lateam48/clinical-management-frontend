import { apiClient } from '@/lib/axios'
import { ChatParticipant, ChatConversation, ChatMessage, UnreadCount } from '@/types/chat'

class ChatService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1'

  // Utility function to map database names to display names
  private getDisplayName(dbName: string): string {
    switch (dbName?.toLowerCase()) {
      case 'doctor':
        return 'Dr. Martin Dupont'
      case 'secretary':
        return '' // Empty string for secretary
      default:
        return dbName || 'Unknown'
    }
  }

  // Get all participants (users that can chat)
  async getParticipants(): Promise<ChatParticipant[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/chat/participants`)
      // API returns array directly: [{ "fullName": "secretary" }]
      const data = response.data || []
      
      // Transform to match our ChatParticipant interface
      return data.map((participant: any) => ({
        id: participant.id || Math.random(), // Generate ID if not provided
        name: this.getDisplayName(participant.fullName || participant.username),
        originalName: participant.fullName || participant.username, // Keep original name for API calls
        role: participant.fullName?.toLowerCase().includes('secretary') ? 'SECRETARY' : 'DOCTOR',
        avatar: participant.avatar,
        isOnline: true, // Default to true for now
        lastSeen: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error fetching participants:', error)
      return []
    }
  }

  // Get all conversations for the current user
  async getConversations(): Promise<ChatConversation[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/chat/conversations`)
      // API returns array of messages directly
      const messages = response.data || []
      
      // Group messages by conversation (sender-recipient pair)
      const conversationsMap = new Map<string, ChatConversation>()
      
      messages.forEach((message: any) => {
        const conversationKey = `${Math.min(message.senderId, message.recipientId)}-${Math.max(message.senderId, message.recipientId)}`
        
        if (!conversationsMap.has(conversationKey)) {
          conversationsMap.set(conversationKey, {
            id: conversationKey,
            participants: [
              {
                id: message.senderId,
                name: this.getDisplayName(message.senderName),
                role: message.senderName.toLowerCase().includes('secretary') ? 'SECRETARY' : 'DOCTOR',
                isOnline: true,
                lastSeen: new Date().toISOString()
              },
              {
                id: message.recipientId,
                name: this.getDisplayName(message.recipientName),
                role: message.recipientName.toLowerCase().includes('secretary') ? 'SECRETARY' : 'DOCTOR',
                isOnline: true,
                lastSeen: new Date().toISOString()
              }
            ],
            lastMessage: message,
            unreadCount: message.isRead ? 0 : 1,
            createdAt: message.createdAt,
            updatedAt: message.createdAt
          })
        } else {
          const conversation = conversationsMap.get(conversationKey)!
          if (new Date(message.createdAt) > new Date(conversation.lastMessage?.createdAt || '1970-01-01')) {
            conversation.lastMessage = message
            conversation.updatedAt = message.createdAt
          }
          if (!message.isRead) {
            conversation.unreadCount++
          }
        }
      })
      
      return Array.from(conversationsMap.values())
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  // Get all messages
  async getMessages(conversationId?: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/chat`)
      // API returns array directly
      const data = response.data || []
      return data
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  // Send a message
  async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/chat`, {
        content,
        recipientName: conversationId // Using conversationId as recipientName for now
      })
      // API returns the created message directly
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Get unread message count
  async getUnreadCount(): Promise<UnreadCount> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/chat/unread/count`)
      // API returns number directly
      const count = response.data || 0
      return { 
        total: count, 
        byConversation: {} // We'll need to implement this if needed
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return { total: 0, byConversation: {} }
    }
  }

  // Mark messages as read
  async markAsRead(senderId: string): Promise<void> {
    try {
      await apiClient.put(`${this.baseUrl}/chat/read/${senderId}`)
    } catch (error) {
      console.error('Error marking as read:', error)
      throw error
    }
  }

  // Add reaction to a message
  async addReaction(messageId: number, reaction: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/chat/message/${messageId}/react?reaction=${reaction}`)
    } catch (error) {
      console.error('Error adding reaction:', error)
      throw error
    }
  }

  // Remove reaction from a message
  async removeReaction(messageId: number, reaction: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/chat/message/${messageId}/react?reaction=${reaction}`)
    } catch (error) {
      console.error('Error removing reaction:', error)
      throw error
    }
  }

  // Delete a message
  async deleteMessage(messageId: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/chat/message/${messageId}`)
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  }

  // Delete all messages
  async deleteAllMessages(): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/chat/all`)
    } catch (error) {
      console.error('Error deleting all messages:', error)
      throw error
    }
  }
}

export const chatService = new ChatService() 