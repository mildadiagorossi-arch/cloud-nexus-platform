import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
}

export default function ChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Bonjour ! Comment pouvons-nous vous aider ?", sender: 'other', time: '10:00' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        // Simulate response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Un agent va prendre en charge votre demande dans un instant.",
                sender: 'other',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-80 h-96 shadow-2xl flex flex-col animate-in slide-in-from-bottom-2">
                    <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-base">Support en ligne</CardTitle>
                            <p className="text-xs opacity-90">En direct avec un agent</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.sender === 'me'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted text-foreground rounded-tl-none'
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <span className="text-[10px] opacity-70 mt-1 block text-right">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                            <Input
                                placeholder="Message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
