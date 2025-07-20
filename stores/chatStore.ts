import { create } from 'zustand'
import { ChatMessage, ChatParticipant, ChatRoom, MessageReaction } from '@/types/chat'

interface ChatStore {
  conversations: ChatRoom[]
  currentConversation: ChatRoom | null
  messages: ChatMessage[]
  participants: ChatParticipant[]
  selectedParticipant: ChatParticipant | null
  unreadCount: number
  currentUserId: number | null;
  setConversations: (conversations: ChatRoom[]) => void
  setCurrentConversation: (conversation: ChatRoom | null) => void
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setParticipants: (participants: ChatParticipant[]) => void
  setSelectedParticipant: (participant: ChatParticipant | null) => void
  setUnreadCount: (count: number) => void
  markMessageAsRead: (messageId: string) => void
  addReactionToMessage: (messageId: string, reaction: MessageReaction) => void
  removeMessage: (messageId: string) => void
  clearMessages: () => void
  updateParticipantStatus: (participantId: number, isOnline: boolean) => void
  setCurrentUserId: (id: number) => void;
  replaceMessage: (messageId: string, newMessage: ChatMessage) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  participants: [],
  selectedParticipant: null,
  unreadCount: 0,
  currentUserId: null,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setParticipants: (participants) => set({ participants }),
  setSelectedParticipant: (participant) => set({ selectedParticipant: participant }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  markMessageAsRead: (messageId) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === messageId ? { ...msg, isRead: true } : msg
    )
  })),
  addReactionToMessage: (messageId, reaction) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === messageId
        ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
        : msg
    )
  })),
  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter((msg) => msg.id !== messageId)
  })),
  clearMessages: () => set({ messages: [] }),
  updateParticipantStatus: (participantId, isOnline) => set((state) => ({
    participants: state.participants.map((p) =>
      p.id === participantId ? { ...p, isOnline } : p
    )
  })),
  setCurrentUserId: (id) => set({ currentUserId: id }),
  replaceMessage: (messageId, newMessage) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === messageId ? newMessage : msg
    )
  })),
})) 