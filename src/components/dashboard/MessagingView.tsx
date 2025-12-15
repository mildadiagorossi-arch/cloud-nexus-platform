import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChatService, Conversation, ChatMessage } from '@/services/chat.service';

export default function MessagingView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    const loadConvs = () => {
      setConversations(ChatService.getAllConversations());
    };
    loadConvs();
    const interval = setInterval(loadConvs, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      ChatService.markAsRead(selectedConversation.id);
      const loadMsgs = () => {
        setMessages(ChatService.getMessages(selectedConversation.id));
      };
      loadMsgs();
      const interval = setInterval(loadMsgs, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  // Auto scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Admin sends message
    ChatService.sendMessage(selectedConversation.id, 'admin', 'Support', newMessage.trim());
    setNewMessage('');
    // Refresh messages immediately
    setMessages(ChatService.getMessages(selectedConversation.id));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Messagerie</h1>
        <p className="text-muted-foreground">Communiquez avec vos clients en temps réel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations ({conversations.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.length === 0 && (
                <p className="p-4 text-center text-muted-foreground text-sm">Aucune conversation pour le moment.</p>
              )}
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors border-b border-border",
                    selectedConversation?.id === conv.id && "bg-muted"
                  )}
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {conv.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.userName}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedConversation.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.userName}</CardTitle>
                    <p className="text-sm text-muted-foreground">En ligne</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4 h-[400px]">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === 'admin';
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-lg px-4 py-2",
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p>{message.content}</p>
                            <p className={cn(
                              "text-xs mt-1",
                              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
