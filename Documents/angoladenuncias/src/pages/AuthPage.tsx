import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Newspaper } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const AuthPage = () => {
  const { user, isAdmin, isEditor, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin || isEditor) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, isEditor, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Seu e-mail ainda não foi confirmado. Insira o código enviado por e-mail.");
          setOtpMode(true);
          setMode("signup"); // Ensure we are in a state that shows OTP if needed
        } else {
          setError(error.message === "Invalid login credentials"
            ? "Email ou senha incorretos."
            : error.message);
        }
      } else if (data.user) {
        const metadata = data.user.user_metadata;
        const role = metadata?.role;
        if (role === 'admin' || role === 'editor') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(error.message === "User already registered"
          ? "Este e-mail já está registado. Se ainda não confirmou, insira o código abaixo."
          : error.message);
        if (error.message === "User already registered" || error.message.includes("rate limit")) {
          setOtpMode(true);
        }
      } else if (data?.session) {
        setSuccess("Conta criada com sucesso! A entrar...");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setSuccess("Conta criada! Introduza o código que recebeu no seu e-mail.");
        setOtpMode(true);
      }
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpToken.trim(),
      type: 'signup'
    });

    if (error) {
      if (error.message.includes("Expired") || error.message.includes("expired")) {
        setError("O código expirou. Clique em 'Reenviar' para receber um novo.");
      } else if (error.message.includes("invalid") || error.message.includes("Invalid")) {
        setError("Código inválido. Verifique se digitou corretamente.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else if (data.user) {
      setSuccess("E-mail confirmado com sucesso! Bem-vindo.");
      setTimeout(() => {
        const metadata = data.user?.user_metadata;
        const role = metadata?.role;
        if (role === 'admin' || role === 'editor') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess("Novo código enviado para o seu e-mail.");
      setResendCountdown(60);
      setLoading(false);

      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
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
            Sem Filtros
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Portal de notícias</p>
        </div>

        <div className="bg-card border border-border p-8">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-border">
            <button
              className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${mode === "login"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            >
              Entrar
            </button>
            <button
              className={`flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${mode === "signup"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            >
              Criar conta
            </button>
          </div>

          {otpMode ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Código de Verificação (6 dígitos)
                </label>
                <input
                  type="text"
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                  className="w-full bg-secondary border border-border text-foreground px-3 py-2.5 text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  Enviámos um código para <strong>{email}</strong>
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-success/10 border border-success/30 text-success text-sm px-3 py-2 font-medium">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              >
                {loading ? "A verificar..." : "Confirmar Código"}
              </button>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || resendCountdown > 0}
                  className="w-full text-xs text-primary hover:underline transition-colors py-1 disabled:text-muted-foreground"
                >
                  {resendCountdown > 0
                    ? `Aguarde ${resendCountdown}s para reenviar`
                    : "Não recebeu o código? Reenviar"}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpMode(false)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Voltar ao registo
                </button>
              </div>
            </form>
          ) : (
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
                <div className="bg-success/10 border border-success/30 text-success text-sm px-3 py-2 font-medium">
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

              {mode === "signup" && (
                <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpMode(true)}
                    className="text-xs text-primary hover:underline transition-colors"
                  >
                    Já tem um código de verificação? Clique aqui
                  </button>
                </div>
              )}
            </form>
          )}

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
