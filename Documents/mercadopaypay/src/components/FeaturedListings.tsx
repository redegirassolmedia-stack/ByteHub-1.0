import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "./ListingCard";
import { useRegion } from "@/hooks/useRegion";

const FeaturedListings = () => {
  const navigate = useNavigate();
  const { selectedCountry } = useRegion();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("listings")
      .select("*, categories(name)")
      .eq("status", "active")
      .eq("country", selectedCountry.name)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        setListings(data || []);
        setLoading(false);
      });
  }, [selectedCountry]);

  if (loading) {
    return (
      <section className="container py-8">
        <h2 className="text-lg font-bold mb-4">Anúncios em destaque</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="container py-8">
        <h2 className="text-lg font-bold mb-4">Anúncios em destaque</h2>
        <p className="text-center text-muted-foreground py-8">
          Ainda não há anúncios. Seja o primeiro a anunciar!
        </p>
      </section>
    );
  }

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Anúncios em destaque</h2>
        <button onClick={() => navigate("/buscar")} className="text-sm font-semibold text-primary hover:underline">Ver todos</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {listings.map((listing, i) => (
          <div key={listing.id} style={{ animationDelay: `${i * 50}ms` }}>
            <ListingCard
              id={listing.id}
              title={listing.title}
              price={`R$ ${Number(listing.price).toLocaleString("pt-BR")}`}
              location={[listing.city, listing.state].filter(Boolean).join(", ")}
              time={new Date(listing.created_at).toLocaleDateString("pt-BR")}
              image={listing.images?.[0] || "/placeholder.svg"}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
