import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

import { useAuth } from "@/contexts/AuthContext";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const SupportWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Persistence
    useEffect(() => {
        const savedMessages = localStorage.getItem("support_messages");
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Convert string dates back to Date objects
                setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
            } catch (e) {
                console.error("Error loading chat messages", e);
            }
        } else {
            // Default first message
            setMessages([
                {
                    id: "1",
                    text: "Olá! Sou o Assistente IA do Mercado PayPay. Como posso te ajudar hoje?",
                    sender: "ai",
                    timestamp: new Date(),
                },
            ]);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("support_messages", JSON.stringify(messages));
        }
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getSimulatedResponse(inputValue),
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const getSimulatedResponse = (query: string) => {
        const q = query.toLowerCase();
        if (q.includes("preço") || q.includes("valor")) return "Você pode consultar os valores na nossa página de Planos. Temos opções para todos os tamanhos de negócio! Atualmente oferecemos 3 meses grátis para novos usuários.";
        if (q.includes("anunciar")) return "Para anunciar, basta clicar no botão azul 'Anunciar' no topo da página. É rápido e fácil!";
        if (q.includes("pagamento") || q.includes("pagar")) return "Aceitamos pagamentos via Multicaixa (Referência), PayPay e Airtm. Confira os detalhes na página de Planos.";
        if (q.includes("admin")) return "O Painel Admin está disponível apenas para administradores autorizados. Se você for um, clique no seu perfil para acessá-lo.";
        if (q.includes("ajuda") || q.includes("suporte")) return "Você pode entrar em contato com nosso suporte via email em suporte@mercadopaypay.com ou usar esta IA para dúvidas rápidas.";
        if (q.includes("seguro") || q.includes("segurança")) return "Sua segurança é nossa prioridade. Recomendamos sempre encontrar compradores/vendedores em locais públicos e nunca fazer pagamentos antecipados sem ver o produto.";
        return "Entendi! Sou uma IA em treinamento focada no Mercado PayPay. Posso te ajudar com dúvidas sobre anúncios, planos, pagamentos e segurança. Como posso ser útil?";
    };

    const clearChat = () => {
        if (confirm("Deseja apagar o histórico de conversa?")) {
            const initialMessage = {
                id: "1",
                text: "Histórico limpo. Como posso te ajudar agora?",
                sender: "ai" as const,
                timestamp: new Date(),
            };
            setMessages([initialMessage]);
            localStorage.setItem("support_messages", JSON.stringify([initialMessage]));
        }
    };


    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={cn(
                        "mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card border rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in",
                        "backdrop-blur-xl bg-card/95"
                    )}
                >
                    {/* Header */}
                    <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-lg">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Suporte IA</h3>
                                {user && (
                                    <div className="text-[9px] opacity-70 font-mono truncate max-w-[150px]">
                                        {user.email}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
                                <Minimize2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col max-w-[80%]",
                                        msg.sender === "user" ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                            msg.sender === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted text-foreground rounded-tl-none border border-border/50"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex flex-col items-start max-w-[80%]">
                                    <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-tl-none border border-border/50 flex gap-1 items-center">
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t bg-muted/30">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Escreva sua mensagem..."
                                className="w-full bg-background border rounded-full pl-4 pr-12 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all border-border/60"
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 w-8 h-8 rounded-full"
                                disabled={!inputValue.trim() || isTyping}
                                onClick={handleSend}
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-3">
                            Powered by <span className="font-bold text-primary">Mercado PayPay AI</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
                    isOpen ? "bg-card text-foreground border border-border shadow-primary/20 scale-90" : "bg-primary text-primary-foreground hover:shadow-primary/40"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </div>
                )}
            </Button>
        </div>
    );
};

export default SupportWidget;
