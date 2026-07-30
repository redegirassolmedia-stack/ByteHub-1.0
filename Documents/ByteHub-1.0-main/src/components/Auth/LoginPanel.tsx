import React, { useState } from 'react';
import { TeamMember } from '../../types';
import { GirassolLogo } from '../GirassolLogo';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoginPanelProps {
  teamMembers: TeamMember[];
  onLoginSuccess: (user: TeamMember) => void;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({
  teamMembers,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('ivan.lima@girassol.ao');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminUser = teamMembers.find((m) => m.isAdmin || m.email === 'ivan.lima@girassol.ao') || teamMembers[0];

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

            {/* Highlight Admin Ivan Lima */}
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

        {/* Right Side: Login Form & Quick Credentials */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Iniciar Sessão no Painel</h2>
            <p className="text-xs text-slate-400">Introduza as suas credenciais para aceder ao sistema</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Palavra-passe</label>
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
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <span>{isSubmitting ? 'A AUTENTICAR...' : 'ENTRAR NO PAINEL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Standard Login Footer */}
          <div className="pt-2 text-[10px] text-slate-500 text-center">
            Sistema seguro de autenticação Girassol Media • Acesso Restrito
          </div>
        </div>
      </div>
    </div>
  );
};
