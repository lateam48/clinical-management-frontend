'use client'

import { ChatInterface } from './ChatInterface'
import { ChatMessage, ChatParticipant } from '@/types/chat'

interface ChatProps {
  participants: ChatParticipant[]
  messages: ChatMessage[]
  selectedParticipant: ChatParticipant | null
  onSelectParticipant: (participant: ChatParticipant) => void
  onSendMessage: (content: string) => void
  onAddReaction: (messageId: string, emoji: string) => void
  onDeleteMessage?: (messageId: string) => void
  onDeleteAllMessages?: () => void
  isSending?: boolean
  isDeletingAll?: boolean
  currentUserId?: number
  unreadCount?: number
  title: string
  participantRole: 'DOCTOR' | 'SECRETARY'
}

export function Chat(props: ChatProps) {
  return <ChatInterface {...props} />
}
