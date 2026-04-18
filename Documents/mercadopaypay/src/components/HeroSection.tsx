import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buscar?q=${encodeURIComponent(search)}`);
  };

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="container relative z-10 py-12 md:py-24">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Compre e venda<br />perto de você
          </h1>
          <p className="mt-4 text-primary-foreground/90 text-xl font-medium">
            Milhares de anúncios esperando por você. Encontre o que precisa.
          </p>
          <form onSubmit={handleSearch} className="mt-6 flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-lg max-w-lg">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="O que você está procurando?"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-accent-foreground hover:opacity-90 transition-all shadow-md active:scale-95">
              Buscar
            </button>
          </form>
        </div>
      </div>
      <div className="absolute -right-20 -bottom-10 hidden lg:block opacity-20">
        <div className="h-80 w-80 rounded-full bg-primary-foreground/20" />
      </div>
    </section>
  );
};

export default HeroSection;
