import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { MessageCircle } from "lucide-react";

const ConversationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*, listings(title, images, price)")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (data) {
        // Fetch other user profiles
        const enriched = await Promise.all(data.map(async (conv: any) => {
          const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
          const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", otherUserId).single();
          
          // Get last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          return { ...conv, otherName: profile?.display_name || "Usuário", lastMessage: lastMsg };
        }));
        setConversations(enriched);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-8">
        <h1 className="text-2xl font-extrabold mb-6">Mensagens</h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma conversa ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/mensagens/${conv.id}`)}
                className="w-full flex gap-3 rounded-xl border bg-card p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img src={conv.listings?.images?.[0] || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">{conv.otherName}</p>
                    {conv.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.lastMessage.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.listings?.title}</p>
                  {conv.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage.content}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
