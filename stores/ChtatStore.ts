import { create } from 'zustand'
import { ChatMessage, ChatRoom, ChatParticipant } from '@/types/chat'

interface ChatState {
  // State
  conversations: ChatRoom[]
  currentConversation: ChatRoom | null
  messages: ChatMessage[]
  participants: ChatParticipant[]
  selectedParticipant: ChatParticipant | null
  isLoading: boolean
  error: string | null
  unreadCount: number

  // Actions
  setConversations: (conversations: ChatRoom[]) => void
  setCurrentConversation: (conversation: ChatRoom | null) => void
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setParticipants: (participants: ChatParticipant[]) => void
  setSelectedParticipant: (participant: ChatParticipant | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUnreadCount: (count: number) => void
  markMessageAsRead: (messageId: number) => void
  addReactionToMessage: (messageId: number, reaction: any) => void
  removeMessage: (messageId: number) => void
  clearMessages: () => void
  updateParticipantStatus: (participantId: number, isOnline: boolean) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  messages: [],
  participants: [],
  selectedParticipant: null,
  isLoading: false,
  error: null,
  unreadCount: 0,

  // Actions
  setConversations: (conversations) => set({ conversations }),
  
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => {
    // Don't increment unread count for messages sent by the current user
    // We can determine this by checking if the message is not read and the sender is not the current user
    const shouldIncrementUnread = !message.isRead && message.senderId !== 2 // TODO: Get current user ID dynamically
    
    return {
      messages: [...state.messages, message],
      unreadCount: shouldIncrementUnread ? state.unreadCount + 1 : state.unreadCount
    }
  }),
  
  setParticipants: (participants) => set({ participants }),
  
  setSelectedParticipant: (participant) => set({ selectedParticipant: participant }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  
  markMessageAsRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      ),
    }))
  },
  
  addReactionToMessage: (messageId: number, reaction: any) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              reactions: message.reactions ? [...message.reactions, reaction] : [reaction],
            }
          : message
      ),
    }))
  },
  
  removeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    }))
  },
  
  clearMessages: () => set({ messages: [], unreadCount: 0 }),
  
  updateParticipantStatus: (participantId, isOnline) => set((state) => ({
    participants: state.participants.map(participant => 
      participant.id === participantId 
        ? { ...participant, isOnline, lastSeen: isOnline ? new Date().toISOString() : participant.lastSeen }
        : participant
    )
  }))
}))
