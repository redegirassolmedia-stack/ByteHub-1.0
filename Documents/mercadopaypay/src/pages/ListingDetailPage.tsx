import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";

const ListingDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, categories(name)")
        .eq("id", id)
        .single();
      if (error || !data) {
        toast.error("Anúncio não encontrado");
        navigate("/");
        return;
      }
      setListing(data);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user_id)
        .single();
      setSeller(profile);

      if (user) {
        const { data: fav } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("listing_id", id)
          .maybeSingle();
        setIsFavorited(!!fav);
      }
      setLoading(false);
    };
    fetchListing();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!id) return;
    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", id);
      setIsFavorited(false);
      toast.success("Removido dos favoritos");
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: id });
      setIsFavorited(true);
      toast.success("Adicionado aos favoritos");
    }
  };

  const startConversation = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!listing) return;
    if (user.id === listing.user_id) { toast.error("Você não pode conversar consigo mesmo"); return; }

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("buyer_id", user.id)
      .maybeSingle();

    if (existing) {
      navigate(`/mensagens/${existing.id}`);
    } else {
      const { data, error } = await supabase
        .from("conversations")
        .insert({ listing_id: listing.id, buyer_id: user.id, seller_id: listing.user_id })
        .select("id")
        .single();
      if (error) { toast.error(error.message); return; }
      navigate(`/mensagens/${data.id}`);
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

  if (!listing) return null;

  const images = listing.images?.length ? listing.images : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Images */}
          <div className="md:col-span-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <img src={images[currentImage]} alt={listing.title} className="h-full w-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-card/80 backdrop-blur">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setCurrentImage((p) => (p + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-card/80 backdrop-blur">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_: string, i: number) => (
                      <div key={i} className={`h-2 w-2 rounded-full ${i === currentImage ? "bg-primary" : "bg-card/60"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${i === currentImage ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <p className="text-3xl font-extrabold text-foreground">
                R$ {Number(listing.price).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
              <h1 className="text-lg text-foreground mt-1">{listing.title}</h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {[listing.city, listing.state, listing.country].filter(Boolean).join(", ") || "Localização não informada"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Publicado em {new Date(listing.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={startConversation} className="flex-1 font-bold gap-2">
                <MessageCircle className="h-4 w-4" /> Chat
              </Button>
              <Button variant="outline" onClick={toggleFavorite} className={isFavorited ? "text-destructive border-destructive" : ""}>
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Seller */}
            {seller && (
              <div className="rounded-xl border p-4">
                <p className="text-sm font-semibold">{seller.display_name}</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{[seller.city, seller.state, seller.country].filter(Boolean).join(", ")}</span>
                  </div>

                  {/* Contact Visibility Rule: Only Premium Sellers or within Trial */}
                  {(seller.subscription_tier === "premium" || (seller.trial_expires_at && new Date() < new Date(seller.trial_expires_at))) ? (
                    seller.phone && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Contato</p>
                        <p className="font-bold text-primary">{seller.phone}</p>
                      </div>
                    )
                  ) : (
                    <div className="pt-2 border-t bg-muted/30 p-2 rounded">
                      <p className="text-[10px] text-muted-foreground text-center italic">
                        Contatos disponíveis apenas para Vendedores Premium
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {listing.categories && (
              <div className="text-xs text-muted-foreground">
                Categoria: <span className="font-semibold text-foreground">{listing.categories.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Descrição</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;
