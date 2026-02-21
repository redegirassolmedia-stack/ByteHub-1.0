import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Newspaper } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials"
          ? "Email ou senha incorretos."
          : error.message);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Conta criada! Verifique o seu email para confirmar o registo.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground uppercase">
            OBSERVADOR
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Portal de notícias</p>
        </div>

        <div className="bg-card border border-border p-8">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-border">
            <button
              className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                mode === "login"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            >
              Entrar
            </button>
            <button
              className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                mode === "signup"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="O seu nome"
                  className="w-full bg-secondary border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@exemplo.com"
                className="w-full bg-secondary border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-secondary border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-accent/10 border border-accent/30 text-accent text-sm px-3 py-2">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? "A processar..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar ao site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
