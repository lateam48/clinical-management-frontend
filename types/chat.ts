export interface ChatMessage {
  id: string
  content: string
  senderId: number
  senderName: string
  senderRole: 'DOCTOR' | 'SECRETARY'
  createdAt: string
  isRead: boolean
  reactions: MessageReaction[]
  attachments?: ChatAttachment[]
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

export interface ChatParticipant {
  id: number;
  name: string;
  username: string;
  role: 'DOCTOR' | 'SECRETARY';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

// WebSocket Events
export interface WebSocketMessage {
  type: 'message' | 'reaction' | 'typing' | 'read' | 'online_status'
  data: unknown
  timestamp: string
}

export interface SendMessageRequest {
  content: string;
  recipientName: string;
  attachments?: File[];
}

export interface SendReactionRequest {
  messageId: string
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