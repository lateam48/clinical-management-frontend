'use client'

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParticipantList } from './ParticipantList';
import { ChatArea } from './ChatArea';
import { ChatMessage, ChatParticipant } from '@/types/chat';
import { roleLabels } from '@/lib/chat';

interface ChatInterfaceProps {
  participants: ChatParticipant[];
  messages: ChatMessage[];
  selectedParticipant: ChatParticipant | null;
  onSelectParticipant: (participant: ChatParticipant) => void;
  onSendMessage: (content: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onDeleteAllMessages?: () => void;
  onMarkAsRead?: (senderId: number) => void;
  isSending?: boolean;
  isDeletingAll?: boolean;
  isMarkingAsRead?: boolean;
  currentUserId?: number;
  unreadCount?: number | { total: number; byConversation: Record<string, number> };
  title: string;
  participantRole: keyof typeof roleLabels;
  reverseDisplay?: boolean;
}

export function ChatInterface({
  participants,
  messages,
  selectedParticipant,
  onSelectParticipant,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onDeleteAllMessages,
  onMarkAsRead,
  isSending = false,
  isDeletingAll = false,
  isMarkingAsRead = false,
  currentUserId,
  unreadCount = 0,
  title,
  participantRole,
  reverseDisplay = false,
}: Readonly<ChatInterfaceProps>) {
  const [isClient, setIsClient] = useState(false);

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true);
  }

  // Filter participants by role
  const availableParticipants = participants.filter(participant => participant.role === participantRole);

  const getParticipantTitle = () => {
    return roleLabels[participantRole] || participantRole;
  };

  const getParticipantPlaceholder = () => {
    return `Sélectionner un ${roleLabels[participantRole]?.toLowerCase() || participantRole.toLowerCase()}`;
  };

  const getParticipantEmptyMessage = () => {
    return `Aucun ${roleLabels[participantRole]?.toLowerCase() || participantRole.toLowerCase()} disponible`;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">Chat privé avec les {roleLabels[participantRole]?.toLowerCase() || participantRole.toLowerCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {(() => {
              const count = typeof unreadCount === 'object' ? unreadCount.total : (unreadCount || 0);
              return `${count} message${count > 1 ? 's' : ''} non lu${count > 1 ? 's' : ''}`;
            })()}
          </Badge>
          {onDeleteAllMessages && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDeleteAllMessages}
              disabled={isDeletingAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Chat layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full flex-1 min-h-0">
        {/* Participants */}
        <ParticipantList
          participants={availableParticipants}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={onSelectParticipant}
          title={getParticipantTitle()}
          placeholder={getParticipantPlaceholder()}
          emptyMessage={getParticipantEmptyMessage()}
        />

        {/* Chat area */}
        <div className="lg:col-span-2 h-full">
          <ChatArea
            messages={messages}
            selectedParticipant={selectedParticipant}
            onSendMessage={onSendMessage}
            onAddReaction={onAddReaction}
            onDeleteMessage={onDeleteMessage}
            onMarkAsRead={onMarkAsRead} 
            isSending={isSending}
            isMarkingAsRead={isMarkingAsRead}
            currentUserId={currentUserId}
            unreadCount={unreadCount}
            reverseDisplay={reverseDisplay}
          />
        </div>
      </div>
    </div>
  );
}
