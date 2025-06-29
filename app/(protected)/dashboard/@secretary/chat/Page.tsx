"use client"

import { useChat } from "@/hooks/UseChat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, Trash2, Users, Clock, Check, CheckCheck, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  // Mock current user ID (à remplacer par l'ID réel de l'utilisateur connecté)
  const currentUserId = 2 // Secrétaire

  // Filtrer les participants : les secrétaires voient seulement les docteurs
  const availableParticipants = participants.filter(participant => participant.role === 'DOCTOR')

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

  const isOwnMessage = (message: any) => message.senderId === currentUserId

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
          <h1 className="text-2xl font-bold">Chat Test - Secrétaire</h1>
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
        {/* Participants - Menu déroulant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Docteurs ({availableParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    {selectedParticipant ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {selectedParticipant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{selectedParticipant.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Sélectionner un docteur</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {availableParticipants.length === 0 ? (
                  <DropdownMenuItem disabled>
                    <span className="text-muted-foreground">Aucun docteur disponible</span>
                  </DropdownMenuItem>
                ) : (
                  availableParticipants.map((participant) => (
                    <DropdownMenuItem
                      key={participant.id}
                      onClick={() => selectParticipant(participant)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{participant.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <p className="text-xs text-muted-foreground">
                            {participant.isOnline ? 'En ligne' : 'Hors ligne'}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Participant sélectionné - Affichage détaillé */}
            {selectedParticipant && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedParticipant.avatar} />
                    <AvatarFallback>
                      {selectedParticipant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{selectedParticipant.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedParticipant.role.toLowerCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${selectedParticipant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <p className="text-xs text-muted-foreground">
                        {selectedParticipant.isOnline ? 'En ligne' : 'Hors ligne'}
                      </p>
                      {!selectedParticipant.isOnline && selectedParticipant.lastSeen && isClient && (
                        <span className="text-xs text-muted-foreground">
                          • Dernière connexion: {new Date(selectedParticipant.lastSeen).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                <p>Sélectionnez un docteur pour voir les messages</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun message dans cette conversation</p>
                <p className="text-sm">Utilisez le bouton "Test Message" pour envoyer un message</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto p-4">
                {messages.map((message) => {
                  const isOwn = isOwnMessage(message)
                  return (
                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                        {/* Avatar - seulement pour les messages reçus */}
                        {!isOwn && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {message.senderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                          {/* Sender name - seulement pour les messages reçus */}
                          {!isOwn && (
                            <p className="text-xs text-muted-foreground mb-1 px-2">
                              {message.senderName}
                            </p>
                          )}
                          
                          {/* Message content */}
                          <div className={`rounded-lg px-3 py-2 max-w-full ${
                            isOwn 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm break-words">{message.content}</p>
                            
                            {/* Reactions */}
                            {message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {message.reactions.map((reaction) => (
                                  <Badge key={reaction.id} variant="secondary" className="text-xs">
                                    {reaction.emoji} {reaction.userName}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Message info */}
                          <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            {isClient && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            )}
                            
                            {/* Message status for own messages */}
                            {isOwn && (
                              <div className="flex items-center gap-1">
                                {message.isRead ? (
                                  <CheckCheck className="h-3 w-3 text-blue-500" />
                                ) : (
                                  <Check className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Action buttons */}
                          <div className={`flex gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => addReaction(message.id, "👍")}
                            >
                              👍
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => addReaction(message.id, "❤️")}
                            >
                              ❤️
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => addReaction(message.id, "😊")}
                            >
                              😊
                            </Button>
                            {isOwn && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => deleteMessage(message.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
              <p className="font-medium">Docteurs disponibles:</p>
              <p className="text-muted-foreground">{availableParticipants.length}</p>
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