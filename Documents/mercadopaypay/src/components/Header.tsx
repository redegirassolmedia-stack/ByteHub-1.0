import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, User, PlusCircle, Heart, MessageCircle, LogOut, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRegion } from "@/hooks/useRegion";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { selectedCountry, setRegion, countries } = useRegion();
  const navigate = useNavigate();


  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buscar?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center shrink-0">
          <img
            src="/logo.png"
            alt="Mercado PayPay"
            className="h-16 w-auto md:h-20 transition-all hover:scale-105 drop-shadow-sm"
          />
        </a>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 hover:bg-muted font-medium">
                <span className="text-base">{selectedCountry.flag}</span>
                <span className="hidden lg:inline">{selectedCountry.name}</span>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 overflow-y-auto max-h-[300px]">
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => setRegion(country.code)}
                  className="gap-2"
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  {selectedCountry.code === country.code && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-full border bg-background px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos, marcas e muito mais..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="hidden lg:flex" onClick={() => navigate("/planos")}>
                  Planos
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => navigate("/favoritos")}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => navigate("/mensagens")}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/planos")}>Planos Premium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/meus-anuncios")}>Meus anúncios</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/favoritos")}>Favoritos</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/mensagens")}>Mensagens</DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="font-bold text-primary">
                        Painel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { signOut(); navigate("/"); }}>
                      <LogOut className="h-4 w-4 mr-2" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="gap-1.5 rounded-full font-bold" onClick={() => navigate("/anunciar")}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Anunciar</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5" onClick={() => navigate("/auth")}>
                  <User className="h-4 w-4" />
                  <span>Entrar</span>
                </Button>
                <Button size="sm" className="gap-1.5 rounded-full font-bold" onClick={() => navigate("/auth")}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Anunciar</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
