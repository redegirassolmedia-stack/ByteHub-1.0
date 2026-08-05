import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import { useRegion } from "@/hooks/useRegion";

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useRegion();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("listing_id, listings(*, categories(name))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setListings(data?.map((f: any) => f.listings).filter(Boolean) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-extrabold mb-6">Favoritos</h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum favorito ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {listings.map((listing) => (
              <div key={listing.id} onClick={() => navigate(`/anuncio/${listing.id}`)} className="cursor-pointer">
                <ListingCard
                  title={listing.title}
                  price={formatPrice(listing.price)}
                  location={[listing.city, listing.state].filter(Boolean).join(", ")}
                  time={new Date(listing.created_at).toLocaleDateString("pt-BR")}
                  image={listing.images?.[0] || "/placeholder.svg"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
