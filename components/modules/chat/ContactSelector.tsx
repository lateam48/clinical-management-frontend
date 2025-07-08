'use client'

import { ParticipantList } from './ParticipantList'
import { ChatParticipant } from '@/types/chat'

interface ContactSelectorProps {
  participants: ChatParticipant[]
  selectedParticipant: ChatParticipant | null
  onSelectParticipant: (participant: ChatParticipant) => void
  title: string
  placeholder: string
  emptyMessage: string
  currentUserId?: number
}

export function ContactSelector({
  participants,
  selectedParticipant,
  onSelectParticipant,
  title,
  placeholder,
  emptyMessage,
}: Readonly<ContactSelectorProps>) {
  return (
    <ParticipantList
      participants={participants}
      selectedParticipant={selectedParticipant}
      onSelectParticipant={onSelectParticipant}
      title={title}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
    />
  )
}
