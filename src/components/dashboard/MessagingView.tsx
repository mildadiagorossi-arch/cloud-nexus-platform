import { useState } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  avatar: string;
}

const conversations: Conversation[] = [
  { id: '1', name: 'Jean Dupont', lastMessage: 'Merci pour votre réponse !', unread: 2, avatar: 'JD' },
  { id: '2', name: 'Marie Martin', lastMessage: 'Le produit est-il disponible ?', unread: 0, avatar: 'MM' },
  { id: '3', name: 'Pierre Durand', lastMessage: 'Je souhaite un devis...', unread: 1, avatar: 'PD' },
  { id: '4', name: 'Sophie Bernard', lastMessage: 'Parfait, merci !', unread: 0, avatar: 'SB' },
];

const initialMessages: Message[] = [
  { id: '1', sender: 'Jean Dupont', content: 'Bonjour, je suis intéressé par le Routeur Cloud Pro.', timestamp: '10:30', isOwn: false },
  { id: '2', sender: 'Vous', content: 'Bonjour Jean ! Bien sûr, ce routeur est notre best-seller. Avez-vous des questions spécifiques ?', timestamp: '10:32', isOwn: true },
  { id: '3', sender: 'Jean Dupont', content: 'Oui, est-ce qu\'il supporte le WiFi 6 ?', timestamp: '10:35', isOwn: false },
  { id: '4', sender: 'Vous', content: 'Absolument ! Il supporte le WiFi 6 avec des vitesses jusqu\'à 3Gbps. Parfait pour les environnements professionnels.', timestamp: '10:37', isOwn: true },
  { id: '5', sender: 'Jean Dupont', content: 'Merci pour votre réponse !', timestamp: '10:40', isOwn: false },
];

export default function MessagingView() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: 'Vous',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Messagerie</h1>
        <p className="text-muted-foreground">Communiquez avec vos clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors border-b border-border",
                    selectedConversation.id === conv.id && "bg-muted"
                  )}
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {conv.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.name}</p>
                      {conv.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {conv.unread}
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

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {selectedConversation.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                <p className="text-sm text-muted-foreground">En ligne</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2",
                        message.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p>{message.content}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
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
        </Card>
      </div>
    </div>
  );
}
