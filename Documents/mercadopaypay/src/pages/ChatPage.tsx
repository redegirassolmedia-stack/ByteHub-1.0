import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import Header from "@/components/Header";

const ChatPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const [otherName, setOtherName] = useState("Usuário");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;

    const fetchConversation = async () => {
      const { data: conv } = await supabase
        .from("conversations")
        .select("*, listings(title, images, price)")
        .eq("id", id)
        .single();
      if (!conv) { navigate("/mensagens"); return; }
      setConversation(conv);

      const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", otherUserId).single();
      setOtherName(profile?.display_name || "Usuário");

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      setMessages(msgs || []);
      setLoading(false);
    };

    fetchConversation();

    // Realtime subscription
    const channel = supabase
      .channel(`messages:${id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      // Update conversation updated_at
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Chat header */}
      <div className="border-b bg-card px-4 py-3">
        <div className="container max-w-2xl flex items-center gap-3">
          <button onClick={() => navigate("/mensagens")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          {conversation?.listings && (
            <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
              <img src={conversation.listings.images?.[0] || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{otherName}</p>
            <p className="text-xs text-muted-foreground truncate">{conversation?.listings?.title}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-2xl py-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <form onSubmit={sendMessage} className="container max-w-2xl flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="rounded-full"
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
