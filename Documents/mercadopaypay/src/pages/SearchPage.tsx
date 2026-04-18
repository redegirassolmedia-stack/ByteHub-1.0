import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import { useRegion } from "@/hooks/useRegion";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCountry } = useRegion();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("categoria") || "";
  const sort = searchParams.get("ordenar") || "recent";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";

  useEffect(() => {
    supabase.from("categories").select("id, name, slug").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select("*, categories(name)")
        .eq("status", "active");

      if (q) {
        query = query.textSearch("search_vector", q, { type: "websearch", config: "portuguese" });
      }
      if (category) {
        const cat = categories.find((c) => c.slug === category);
        if (cat) query = query.eq("category_id", cat.id);
      }

      query = query.eq("country", selectedCountry.name);
      if (minPrice) query = query.gte("price", parseFloat(minPrice));
      if (maxPrice) query = query.lte("price", parseFloat(maxPrice));

      if (sort === "price_asc") query = query.order("price", { ascending: true });
      else if (sort === "price_desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const { data } = await query.limit(50);
      setListings(data || []);
      setLoading(false);
    };
    fetchListings();
  }, [q, category, sort, minPrice, maxPrice, categories, selectedCountry]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 rounded-full border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-card hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in">
            <Select value={category} onValueChange={(v) => updateParam("categoria", v === "all" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => updateParam("ordenar", v)}>
              <SelectTrigger><SelectValue placeholder="Ordenar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="price_asc">Menor preço</SelectItem>
                <SelectItem value="price_desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Preço mín" value={minPrice} onChange={(e) => updateParam("min", e.target.value)} />
            <Input type="number" placeholder="Preço máx" value={maxPrice} onChange={(e) => updateParam("max", e.target.value)} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum resultado encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {listings.map((listing) => (
              <div key={listing.id} onClick={() => navigate(`/anuncio/${listing.id}`)} className="cursor-pointer">
                <ListingCard
                  title={listing.title}
                  price={`R$ ${Number(listing.price).toLocaleString("pt-BR")}`}
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

export default SearchPage;
