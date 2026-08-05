import React from 'react';
import { MainNavSection, TeamMember } from '../types';
import { Menu, Bell, PlusCircle, FileSpreadsheet, RotateCcw, KeyRound, LogOut, ShieldCheck, Lock } from 'lucide-react';

interface HeaderProps {
  currentSection: MainNavSection;
  currentUser?: TeamMember;
  onOpenMobileSidebar: () => void;
  onOpenNewReport: () => void;
  onOpenConsolidated: () => void;
  onOpenNewTask: () => void;
  onOpenResetModal?: () => void;
  onOpenCredentialsModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  currentUser,
  onOpenMobileSidebar,
  onOpenNewReport,
  onOpenConsolidated,
  onOpenNewTask,
  onOpenResetModal,
  onOpenCredentialsModal,
  onLogout
}) => {
  const getSectionTitle = (section: MainNavSection): string => {
    switch (section) {
      case 'dashboard': return 'Dashboard Principal de Redes Sociais';
      case 'planeamento': return 'Planeamento & Agendamento Semanal de Posts';
      case 'calendario': return 'Calendário Editorial de Redes Sociais';
      case 'redes_sociais': return 'Gestão de Canais (Instagram, Facebook, TikTok, YT, LinkedIn, X)';
      case 'tarefas': return 'Gestão de Tarefas & Produção de Conteúdos';
      case 'banco_conteudos': return 'Banco de Mídia & Recursos Visuais';
      case 'metricas': return '📊 Métricas & Relatórios de Performance Executiva';
      case 'equipa': return 'Equipa & Gestão de Utilizadores (Coordenação: Ivan Lima)';
      case 'definicoes': return 'Definições & Reset de Dados do Sistema';
      default: return 'Redes Sociais';
    }
  };

  const activeUser = currentUser || {
    name: 'Ivan Lima',
    role: 'Coordenador de Redes Sociais',
    email: 'ivan.lima@girassol.ao',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isAdmin: true
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              {getSectionTitle(currentSection)}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              Área de Redes Sociais — Gestão de Conteúdos & Indicadores de Desempenho
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenConsolidated}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Relatório Consolidado</span>
          </button>

          <button
            onClick={onOpenNewTask}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">+ NOVA TAREFA</span>
          </button>

          <button
            onClick={onOpenNewReport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors border border-amber-500/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">+ NOVO RELATÓRIO</span>
          </button>

          {/* Credenciais: apenas administradores */}
          {onOpenCredentialsModal && activeUser.isAdmin && (
            <button
              onClick={onOpenCredentialsModal}
              title="Gerir Credenciais e Palavras-passe da Equipa"
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-300"
            >
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Credenciais</span>
            </button>
          )}

          {/* Reset: apenas administradores */}
          {onOpenResetModal && activeUser.isAdmin && (
            <button
              onClick={onOpenResetModal}
              title="Resetar / Restaurar Dados do Sistema (Incluindo Utilizadores)"
              className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* User profile & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <button
              onClick={activeUser.isAdmin ? onOpenCredentialsModal : undefined}
              title={activeUser.isAdmin ? 'Gerir Credenciais da Equipa' : `${activeUser.name} — ${activeUser.role}`}
              className={`flex items-center space-x-2 p-1 rounded-xl transition-all text-left ${
                activeUser.isAdmin ? 'hover:bg-slate-100 cursor-pointer group' : 'cursor-default'
              }`}
            >
              <div className="relative">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className={`w-9 h-9 rounded-full object-cover border-2 shrink-0 shadow-2xs transition-colors ${
                    activeUser.isAdmin
                      ? 'border-amber-400 group-hover:border-indigo-600'
                      : 'border-slate-300'
                  }`}
                />
                <span className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full border border-white text-[9px] transition-colors ${
                  activeUser.isAdmin
                    ? 'bg-slate-900 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950'
                    : 'bg-slate-500 text-white'
                }`}>
                  {activeUser.isAdmin
                    ? <KeyRound className="w-2.5 h-2.5" />
                    : <Lock className="w-2.5 h-2.5" />}
                </span>
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                  <span>{activeUser.name}</span>
                  {activeUser.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />}
                </div>
                <div className="text-[10px] text-amber-600 font-semibold">{activeUser.role}</div>
              </div>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sair do Painel (Terminar Sessão)"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
