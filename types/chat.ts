export interface ChatMessage {
  id: number
  content: string
  senderId: number
  senderName: string
  recipientId: number
  recipientName: string
  createdAt: string
  isRead: boolean
  readAt: string | null
  type: string
  reactions: MessageReaction[] | null
}

export interface MessageReaction {
  id: string
  emoji: string
  userId: number
  userName: string
  timestamp: string
}

export interface ChatAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
}

export interface ChatRoom {
  id: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatConversation {
  id: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatParticipant {
  id: number
  name: string
  originalName?: string
  role: 'DOCTOR' | 'SECRETARY'
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

export interface UnreadCount {
  total: number
  byConversation: Record<string, number>
}

// WebSocket Events
export interface WebSocketMessage {
  type: 'message' | 'reaction' | 'typing' | 'read' | 'online_status'
  data: any
  timestamp: string
}

export interface SendMessageRequest {
  content: string
  recipientId: number
  attachments?: File[]
}

export interface SendReactionRequest {
  messageId: number
  emoji: string
}

export interface ChatApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Emoji categories for picker
export const EMOJI_CATEGORIES = {
  smileys: '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇',
  gestures: '👍 👎 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉',
  hearts: '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔',
  objects: '💻 📱 📞 📺 📻 🎮 🎲 🎯 🎪 🎨',
  nature: '🌸 🌺 🌻 🌹 🌷 🌼 🌿 🍀 🌱 🌲',
  food: '🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍒',
  activities: '⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸',
  travel: '🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐'
} as const

export type EmojiCategory = keyof typeof EMOJI_CATEGORIES 