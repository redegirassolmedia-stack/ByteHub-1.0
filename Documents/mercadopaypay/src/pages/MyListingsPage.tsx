import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import { useRegion } from "@/hooks/useRegion";

const MyListingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useRegion();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("listings")
      .select("*, categories(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, [user]);

  const deleteListing = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Anúncio excluído");
    fetchListings();
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "active" ? "paused" : "active";
    const { error } = await supabase.from("listings").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(newStatus === "active" ? "Anúncio ativado" : "Anúncio pausado");
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">Meus anúncios</h1>
          <Button onClick={() => navigate("/anunciar")} className="gap-1.5 font-bold">
            <Plus className="h-4 w-4" /> Novo anúncio
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Você ainda não tem anúncios</p>
            <Button onClick={() => navigate("/anunciar")} className="font-bold">Criar primeiro anúncio</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="flex gap-4 rounded-xl border bg-card p-4">
                <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={listing.images?.[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                      <p className="text-lg font-extrabold text-foreground">
                        {formatPrice(listing.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${listing.status === "active" ? "bg-accent text-accent-foreground" :
                            listing.status === "sold" ? "bg-muted text-muted-foreground" :
                              "bg-secondary text-secondary-foreground"
                          }`}>
                          {listing.status === "active" ? "Ativo" : listing.status === "sold" ? "Vendido" : "Pausado"}
                        </span>
                        <span className="text-xs text-muted-foreground">{listing.categories?.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggleStatus(listing.id, listing.status)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                        {listing.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => navigate(`/anuncio/${listing.id}`)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteListing(listing.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
