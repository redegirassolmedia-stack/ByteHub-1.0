import { useState } from "react";
import { Search, Menu, X, User, LogOut, Shield } from "lucide-react";
import { categories } from "@/data/newsData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    console.log("Header handleAuthClick triggered. Current user:", user ? user.email : "none");
    if (user) {
      console.log("Calling signOut from handleAuthClick...");
      signOut();
    } else {
      console.log("Navigating to /auth from handleAuthClick...");
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="container flex items-center justify-between py-2 border-b border-border">
        <span className="news-timestamp hidden sm:block">Quinta-feira, 20 de Fevereiro de 2026</span>
        <div className="flex items-center gap-4">
          <button className="nav-link text-xs">Newsletter</button>
          {isAdmin && (
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
            className="nav-link text-xs flex items-center gap-1"
          >
            {user ? <LogOut className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{user ? "Sair" : "Entrar"}</span>
          </button>
          {!user && (
            <button
              onClick={() => navigate("/auth")}
              className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Assinar
            </button>
          )}
        </div>
      </div>

      {/* Logo */}
      <div className="container flex items-center justify-between py-4">
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1
          onClick={() => navigate("/")}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mx-auto lg:mx-0 uppercase cursor-pointer"
        >
          OBSERVADOR
        </h1>
        <button className="text-foreground hover:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className={`${menuOpen ? "block" : "hidden"} lg:block border-t border-border`}>
        <div className="container overflow-x-auto">
          <ul className="flex items-center gap-6 py-3 min-w-max">
            {categories.map((cat, i) => (
              <li key={cat}>
                <button className={`nav-link ${i === 0 ? "nav-link-active" : ""}`}>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
