import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, User, LogOut, Shield, Loader2, Facebook, Twitter, Linkedin, Globe, Newspaper, ShoppingBag } from "lucide-react";
import { categories, getCategorySlug } from "@/constants/categories";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";
import CurrencyWidget from "./CurrencyWidget";
import OpinionsCarousel from "./OpinionsCarousel";

interface HeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSearch?: (query: string) => void;
}

const Header = ({ selectedCategory = "Destaque", onCategoryChange, onSearch }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, isAdmin, isEditor, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
  // Capitalizar a primeira letra
  const formattedDate = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
      toast.success("Sessão encerrada com sucesso");
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchQuery("");
      onSearch?.("");
    }
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      onSearch?.("");
    }
  };

  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    } else {
      // Se não houver onCategoryChange (páginas internas como detalhe de artigo), 
      // navegamos para a rota de categoria correspondente
      if (category === "Destaque") {
        navigate("/");
      } else if (category === "Opinião") {
        navigate("/opinioes");
      } else {
        navigate(`/${getCategorySlug(category)}`);
      }
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="container flex items-center justify-between py-2 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="news-timestamp hidden sm:block border-r border-border pr-4 mr-1">{formattedDate}</span>
          <div className="flex items-center">
            <CurrencyWidget />
          </div>
          <div className="hidden md:flex items-center gap-3 border-l border-border pl-4 ml-1">
            <a href="https://facebook.com/angolasemfiltros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://twitter.com/angolasemfiltros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a href="https://linkedin.com/company/angolasemfiltros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Ubuntu</span>
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="nav-link text-xs">Newsletter</button>
          {(isAdmin || isEditor) && (
            <button
              onClick={() => navigate("/admin")}
              className="nav-link text-xs flex items-center gap-1 text-primary"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
          <button
            onClick={handleAuthClick}
            disabled={loading}
            className="nav-link text-xs flex items-center gap-1 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : user ? (
              <LogOut className="w-3.5 h-3.5" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {loading ? "A carregar..." : user ? "Sair" : "Entrar"}
            </span>
          </button>
          {!loading && !user && (
            <button
              onClick={() => navigate("/auth")}
              className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Assinar
            </button>
          )}
        </div>
      </div>

      {/* Logo + Search */}
      <div className="container flex items-center justify-between py-4">
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div
          onClick={() => {
            navigate("/");
            onCategoryChange?.("Destaque");
          }}
          className="flex items-center mx-auto lg:mx-0 cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Sem Filtros"
            width={200}
            height={80}
            fetchPriority="high"
            className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const sib = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (sib) sib.style.display = 'block';
            }}
          />
          <span className="font-heading text-2xl sm:text-3xl md:text-3xl font-black tracking-tight text-foreground uppercase hidden">
            Sem Filtros
          </span>
        </div>

        <OpinionsCarousel />

        <div className="flex items-center gap-2">
          {/* Campo de pesquisa expandível */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? "w-48 sm:w-64 opacity-100" : "w-0 opacity-0"
              }`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Pesquisar artigos..."
              className="w-full px-3 py-1.5 text-sm bg-secondary text-foreground border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleSearchToggle}
            className={`text-foreground hover:text-primary transition-colors ${searchOpen ? "text-primary" : ""
              }`}
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          <div className="h-6 w-px bg-border mx-1" />
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${menuOpen ? "block" : "hidden"} lg:block border-t border-border`}>
        <div className="container overflow-x-auto">
          <ul className="flex items-center gap-6 py-3 min-w-max">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`nav-link ${selectedCategory === cat ? "nav-link-active" : ""}`}
                >
                  {cat}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate("/edicao-digital")}
                className={`nav-link flex items-center gap-2 text-primary font-bold bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 hover:bg-primary/20 transition-all`}
              >
                <Newspaper className="w-4 h-4" />
                Jornal Digital
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/servicos")}
                className={`nav-link flex items-center gap-2 text-[#00a651] font-bold bg-[#00a651]/5 px-4 py-1.5 rounded-full border border-[#00a651]/10 hover:bg-[#00a651]/20 transition-all`}
              >
                <ShoppingBag className="w-4 h-4" />
                Nossos Serviços
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
