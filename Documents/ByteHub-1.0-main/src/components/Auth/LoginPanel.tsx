import React, { useState } from 'react';
import { TeamMember } from '../../types';
import { GirassolLogo } from '../GirassolLogo';
import {
  Lock,
  Mail,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface LoginPanelProps {
  teamMembers: TeamMember[];
  onLoginSuccess: (user: TeamMember) => void;
}

type PanelMode = 'login' | 'recovery' | 'recovery-result';

export const LoginPanel: React.FC<LoginPanelProps> = ({
  teamMembers,
  onLoginSuccess
}) => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery state
  const [mode, setMode] = useState<PanelMode>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveredUser, setRecoveredUser] = useState<TeamMember | null>(null);
  const [showRecoveredPassword, setShowRecoveredPassword] = useState(false);

  const fallbackAdmin: TeamMember = {
    id: 'admin-001',
    name: 'Ivan Lima',
    role: 'Coordenador de Redes Sociais',
    department: 'Redes Sociais',
    email: 'ivan.lima@girassol.ao',
    avatar: 'https://ui-avatars.com/api/?name=Ivan+Lima&background=f59e0b&color=0f172a&size=128&bold=true',
    activeTasks: 0,
    password: 'admin',
    isAdmin: true,
  };

  const adminUser = teamMembers.find((m) => m.isAdmin || m.email === 'ivan.lima@girassol.ao') || teamMembers[0] || fallbackAdmin;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const foundUser = teamMembers.find(
        (m) =>
          m.email.toLowerCase().trim() === email.toLowerCase().trim() &&
          (m.password || 'admin') === password.trim()
      );

      if (foundUser) {
        onLoginSuccess(foundUser);
      } else {
        setErrorMsg('E-mail ou palavra-passe incorretos. Verifique os dados introduzidos.');
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    const found = teamMembers.find(
      (m) => m.email.toLowerCase().trim() === recoveryEmail.toLowerCase().trim()
    );

    if (found) {
      setRecoveredUser(found);
      setMode('recovery-result');
    } else {
      setRecoveryError('Nenhuma conta foi encontrada com este e-mail. Verifique o endereço introduzido.');
    }
  };

  const handleGoBackToLogin = () => {
    setMode('login');
    setRecoveryEmail('');
    setRecoveryError('');
    setRecoveredUser(null);
    setShowRecoveredPassword(false);
    if (recoveredUser) {
      setEmail(recoveredUser.email);
      setPassword(recoveredUser.password || 'admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-md overflow-hidden z-10">

        {/* Left Side: Brand & Admin Highlight */}
        <div className="lg:col-span-5 p-8 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-r border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
                <GirassolLogo variant="white-text" className="h-9" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Acesso Restrito & Seguro
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Gestão Centralizada com Administrador
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aceda ao sistema de gestão de posts, relatórios de métricas executivas e controlo da equipa de redes sociais.
              </p>
            </div>

            {/* Highlight Admin */}
            {adminUser && (
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-400/30 shadow-md">
                <div className="flex items-center space-x-3">
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                      Administrador Principal
                    </span>
                    <h3 className="text-sm font-bold text-white">{adminUser.name}</h3>
                    <p className="text-[11px] text-slate-300">{adminUser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>© 2026 Girassol Media</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sinal Ativo
            </span>
          </div>
        </div>

        {/* Right Side: Dynamic Panel */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center space-y-6">

          {/* ── LOGIN MODE ── */}
          {mode === 'login' && (
            <>
              <div>
                <h2 className="text-xl font-black text-white mb-1">Iniciar Sessão no Painel</h2>
                <p className="text-xs text-slate-400">Introduza as suas credenciais para aceder ao sistema</p>
              </div>

              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">E-mail Corporativo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ivan.lima@girassol.ao"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-300">Palavra-passe</label>
                    <button
                      type="button"
                      onClick={() => { setMode('recovery'); setRecoveryEmail(email); }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Esqueci a palavra-passe
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'A AUTENTICAR...' : 'ENTRAR NO PAINEL'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-[10px] text-slate-500 text-center">
                Sistema seguro de autenticação Girassol Media • Acesso Restrito
              </div>
            </>
          )}

          {/* ── RECOVERY MODE ── */}
          {mode === 'recovery' && (
            <>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400/15 border border-amber-400/30 rounded-xl">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white mb-0.5">Recuperar Acesso</h2>
                  <p className="text-xs text-slate-400">Introduza o seu e-mail corporativo para recuperar a palavra-passe</p>
                </div>
              </div>

              {recoveryError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{recoveryError}</span>
                </div>
              )}

              <form onSubmit={handleRecovery} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">E-mail Corporativo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="o-seu-email@girassol.ao"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Introduza o e-mail associado à sua conta. As credenciais serão exibidas no ecrã.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>RECUPERAR PALAVRA-PASSE</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setMode('login'); setRecoveryError(''); }}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white font-bold transition-colors cursor-pointer mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao Início de Sessão
              </button>
            </>
          )}

          {/* ── RECOVERY RESULT MODE ── */}
          {mode === 'recovery-result' && recoveredUser && (
            <>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-400/15 border border-emerald-400/30 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white mb-0.5">Conta Encontrada!</h2>
                  <p className="text-xs text-slate-400">As suas credenciais de acesso foram recuperadas com sucesso</p>
                </div>
              </div>

              {/* User Card */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-4 text-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                  <img
                    src={recoveredUser.avatar}
                    alt={recoveredUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <p className="font-black text-white text-sm">{recoveredUser.name}</p>
                    <p className="text-slate-400 text-[11px]">{recoveredUser.role}</p>
                    {recoveredUser.isAdmin && (
                      <span className="text-[10px] font-bold text-amber-400">⭐ Administrador</span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">E-mail</p>
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-200 text-[11px] flex-1">{recoveredUser.email}</span>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Palavra-passe</p>
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono text-emerald-300 font-bold text-sm flex-1 tracking-widest">
                      {showRecoveredPassword ? (recoveredUser.password || 'admin') : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRecoveredPassword(!showRecoveredPassword)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showRecoveredPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoBackToLogin}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>INICIAR SESSÃO COM ESTAS CREDENCIAIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setRecoveredUser(null); setShowRecoveredPassword(false); }}
                  className="w-full py-2 text-slate-400 hover:text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar ao Início de Sessão
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
