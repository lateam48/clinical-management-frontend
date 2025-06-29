"use client"

import { useChat } from "@/hooks/UseChat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, Trash2, Users, Clock } from "lucide-react"

export default function ChatPage() {
  const {
    conversations,
    participants,
    selectedParticipant,
    messages,
    unreadCount,
    isLoading,
    error,
    isClient,
    selectParticipant,
    sendMessage,
    addReaction,
    deleteMessage,
    deleteAllMessages,
    isSending,
    isDeletingAll
  } = useChat()

  const handleSendTestMessage = () => {
    if (selectedParticipant) {
      sendMessage(`Message de test envoyé à ${selectedParticipant.name} - ${new Date().toLocaleTimeString()}`)
    }
  }

  const handleAddTestReaction = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      addReaction(lastMessage.id, "👍")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Chargement du chat...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p>Erreur: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chat Test - Docteur</h1>
          <p className="text-muted-foreground">Test des fonctionnalités du chat</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
          </Badge>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={deleteAllMessages}
            disabled={isDeletingAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Tout supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedParticipant?.id === participant.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => selectParticipant(participant)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{participant.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{participant.role.toLowerCase()}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {!participant.isOnline && participant.lastSeen && isClient && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(participant.lastSeen).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
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
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSendTestMessage}
                  disabled={!selectedParticipant || isSending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Test Message
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddTestReaction}
                  disabled={messages.length === 0}
                >
                  👍 Test Reaction
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedParticipant ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez un participant pour voir les messages</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun message dans cette conversation</p>
                <p className="text-sm">Utilisez le bouton "Test Message" pour envoyer un message</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {message.senderRole.toLowerCase()}
                          </span>
                          {isClient && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                          {!message.isRead && (
                            <Badge variant="outline" className="text-xs">
                              Non lu
                            </Badge>
                          )}
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{message.content}</p>
                          {message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.reactions.map((reaction) => (
                                <Badge key={reaction.id} variant="secondary" className="text-xs">
                                  {reaction.emoji} {reaction.userName}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => addReaction(message.id, "👍")}
                          >
                            👍
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => addReaction(message.id, "❤️")}
                          >
                            ❤️
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => addReaction(message.id, "😊")}
                          >
                            😊
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Conversations:</p>
              <p className="text-muted-foreground">{conversations.length}</p>
            </div>
            <div>
              <p className="font-medium">Participants:</p>
              <p className="text-muted-foreground">{participants.length}</p>
            </div>
            <div>
              <p className="font-medium">Messages:</p>
              <p className="text-muted-foreground">{messages.length}</p>
            </div>
            <div>
              <p className="font-medium">Non lus:</p>
              <p className="text-muted-foreground">{unreadCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 