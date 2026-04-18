import { useNavigate } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface ListingCardProps {
  id?: string;
  title: string;
  price: string;
  location: string;
  time: string;
  image: string;
}

const ListingCard = ({ id, title, price, location, time, image }: ListingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate("/auth"); return; }
    if (!id) return;
    
    if (favorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", id);
      setFavorited(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: id });
      setFavorited(true);
    }
  };

  return (
    <div
      onClick={() => id && navigate(`/anuncio/${id}`)}
      className="group relative rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-[var(--shadow-card-hover)] animate-fade-in cursor-pointer"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <button
        onClick={handleFavorite}
        className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-colors ${
          favorited ? "text-destructive" : "text-muted-foreground hover:text-destructive"
        }`}
      >
        <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
      </button>
      <div className="p-3">
        <p className="text-lg font-extrabold text-foreground">{price}</p>
        <h3 className="text-sm text-foreground line-clamp-2 mt-0.5">{title}</h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
          <span className="mx-1">·</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
