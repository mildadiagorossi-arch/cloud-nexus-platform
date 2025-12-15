import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Send, Bot, FileText, Loader2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReactToPrint } from 'react-to-print';
import { ExecutiveSlide } from './ExecutiveSlide';

// This component is the "Intelligence" layer
// It simulates an LLM agent that understands data and generates output

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'report_preview';
    metadata?: any;
    timestamp: Date;
}

interface ExecutiveCopilotProps {
    onGenerateReport: () => any; // Callback to get fresh data for report
}

export default function ExecutiveCopilot({ onGenerateReport }: ExecutiveCopilotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Bonjour ! Je suis votre Copilote Exécutif. Je peux analyser vos données et générer des rapports stratégiques pour la direction. Essayez "Génère une vision PPT Exécutive".',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // For printing the slide
    const slideRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => slideRef.current,
        documentTitle: `Executive_Report_${new Date().toISOString().slice(0, 10)}`
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simulate AI Processing
        setTimeout(() => {
            const lowerInput = userMsg.content.toLowerCase();
            let responseMsg: Message;

            if (lowerInput.includes('ppt') || lowerInput.includes('rapport') || lowerInput.includes('exécutive') || lowerInput.includes('vision')) {
                // Trigger Report Generation Logic
                const reportData = onGenerateReport();

                responseMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "J'ai analysé les données de stock et de ventes en temps réel. Voici le rapport exécutif généré selon votre architecture cible. Vous pouvez l'exporter en PDF.",
                    type: 'report_preview',
                    metadata: reportData,
                    timestamp: new Date()
                };
            } else if (lowerInput.includes('stock') || lowerInput.includes('risk')) {
                responseMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "J'analyse les flux de stocks... J'ai détecté plusieurs produits avec une couverture inférieure à 14 jours. Consultez l'onglet 'Analyse Stock' dans l'explorateur pour les détails.",
                    timestamp: new Date()
                };
            } else {
                responseMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "Je peux vous aider à analyser vos KPI. Demandez-moi de générer un rapport PPT ou d'analyser les risques de rupture.",
                    timestamp: new Date()
                };
            }

            setIsThinking(false);
            setMessages(prev => [...prev, responseMsg]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Nexus Copilot AI</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-slate-500 font-medium">Connecté au Data Mart</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                            <Avatar className={cn("w-8 h-8 border", msg.role === 'assistant' ? "bg-white" : "bg-slate-200")}>
                                <AvatarFallback className={msg.role === 'assistant' ? "text-indigo-600 bg-indigo-50" : "text-slate-600"}>
                                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : "VO"}
                                </AvatarFallback>
                            </Avatar>

                            <div className={cn("max-w-[85%] space-y-2")}>
                                {/* Text Bubble */}
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                                )}>
                                    {msg.content}
                                </div>

                                {/* Rich Content: Report Preview */}
                                {msg.type === 'report_preview' && msg.metadata && (
                                    <div className="mt-2">
                                        <div className="border rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-[1.01] duration-300 origin-top-left">
                                            {/* We scale down the slide component to fit in chat */}
                                            <div className="w-[300px] sm:w-[500px] h-[300px] overflow-hidden bg-slate-100 relative group cursor-zoom-in">
                                                <div className="transform scale-[0.4] origin-top-left w-[250%] h-[250%]">
                                                    <ExecutiveSlide
                                                        ref={slideRef}
                                                        title="Vision Exécutive"
                                                        date={new Date().toLocaleDateString()}
                                                        kpis={msg.metadata.kpis}
                                                        insights={msg.metadata.insights}
                                                    />
                                                </div>
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button variant="secondary" onClick={handlePrint} className="shadow-xl">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Exporter PDF (Haute Qualité)
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={cn("text-[10px] text-slate-400 opacity-70", msg.role === 'user' ? "text-right" : "")}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8 bg-white border">
                                <AvatarFallback className="text-indigo-600 bg-indigo-50"><Bot className="w-5 h-5" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none text-sm shadow-sm flex items-center gap-2 text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                <span>Analyse des données en cours...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                    <Input
                        placeholder="Demandez une analyse ou un rapport..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        className={cn("bg-indigo-600 hover:bg-indigo-700 transition-all", !input.trim() && "opacity-50")}
                        disabled={!input.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                    <button onClick={() => setInput("Génère une vision PPT Exécutive")} className="text-[10px] whitespace-nowrap bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100">
                        ✨ Générer Vision PPT
                    </button>
                    <button onClick={() => setInput("Quels sont les risques de stock ?")} className="text-[10px] whitespace-nowrap bg-slate-50 text-slate-600 px-2 py-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200">
                        📦 Risques Stock
                    </button>
                    <button onClick={() => setInput("Analyse les ventes du mois")} className="text-[10px] whitespace-nowrap bg-slate-50 text-slate-600 px-2 py-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200">
                        📈 Tendance Ventes
                    </button>
                </div>
            </div>
        </div>
    );
}
