'use client'

import { useRef, useEffect } from 'react';
import { MessageCircle, CheckCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { EmptyState } from '@/components/global/empty-state';
import { ChatMessage, ChatParticipant } from '@/types/chat';

interface ChatAreaProps {
  messages: ChatMessage[];
  selectedParticipant: ChatParticipant | null;
  onSendMessage: (content: string) => void;
  onAddReaction: (messageId: number, emoji: string) => void;
  onDeleteMessage?: (messageId: number) => void;
  onMarkAsRead?: (senderId: number) => void;
  isSending?: boolean;
  isMarkingAsRead?: boolean;
  currentUserId?: number;
  unreadCount?: number | { total: number; byConversation: Record<string, number> };
  reverseDisplay?: boolean;
}

export function ChatArea({
  messages,
  selectedParticipant,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onMarkAsRead,
  isSending = false,
  isMarkingAsRead = false,
  currentUserId,
  unreadCount = 0,
  reverseDisplay = false,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isOwnMessage = (message: ChatMessage) => message.senderId === currentUserId;

  // Extract the count value from unreadCount
  const count = typeof unreadCount === 'object' ? unreadCount.total : unreadCount || 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
            {selectedParticipant && (
              <span className="text-sm font-normal text-muted-foreground">
                - {selectedParticipant.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <Badge variant="secondary">
                {count} non lu{count > 1 ? 's' : ''}
              </Badge>
            )}
            {selectedParticipant && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead?.(selectedParticipant.id)}
                disabled={isMarkingAsRead || count === 0 || !onMarkAsRead}
                className="h-8 px-3"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                {isMarkingAsRead ? 'Marquage...' : 'Marquer comme lu'}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {!selectedParticipant ? (
            <EmptyState
              icon={MessageCircle}
              title="Aucun participant sélectionné"
              description="Sélectionnez un participant pour voir les messages"
            />
          ) : messages.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Aucun message"
              description="Aucun message dans cette conversation. Commencez à discuter !"
            />
          ) : (
            <>
              {messages
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage(message)}
                    onAddReaction={onAddReaction}
                    onDeleteMessage={onDeleteMessage}
                    currentUserId={currentUserId}
                    reverseDisplay={reverseDisplay}
                  />
                ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input */}
        {selectedParticipant && (
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={!selectedParticipant}
            isLoading={isSending}
            placeholder={`Message à ${selectedParticipant.name}...`}
          />
        )}
      </CardContent>
    </Card>
  );
}
