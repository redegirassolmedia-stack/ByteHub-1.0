import React from 'react';
import { MainNavSection, TeamMember } from '../types';
import { GirassolLogo } from './GirassolLogo';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Share2,
  CheckSquare,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  X,
  Sparkles,
  Send
} from 'lucide-react';

interface SidebarProps {
  currentSection: MainNavSection;
  currentUser?: TeamMember;
  onSelectSection: (section: MainNavSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  currentUser,
  onSelectSection,
  isOpenMobile,
  onCloseMobile
}) => {
  const activeUser = currentUser || {
    name: 'Ivan Lima',
    role: 'Coordenador de Redes Sociais',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isAdmin: true
  };

  const navItems: { id: MainNavSection; label: string; icon: React.ReactNode; isPrimary?: boolean; badge?: string; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'planeamento', label: 'Planeamento de Posts', icon: <Send className="w-5 h-5" />, isPrimary: true, badge: 'Planeamento' },
    { id: 'calendario', label: 'Calendário Editorial', icon: <CalendarRange className="w-5 h-5" /> },
    { id: 'redes_sociais', label: 'Gestão por Redes', icon: <Share2 className="w-5 h-5" /> },
    { id: 'tarefas', label: 'Tarefas de Produção', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'banco_conteudos', label: 'Banco de Mídia', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'metricas', label: 'Métricas & Relatórios', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'equipa', label: 'Equipa de Redes', icon: <Users className="w-5 h-5" />, adminOnly: true },
    { id: 'definicoes', label: 'Definições', icon: <Settings className="w-5 h-5" />, adminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || activeUser.isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <GirassolLogo variant="white-text" className="h-8" />
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsible user quick info */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center space-x-3">
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className={`w-9 h-9 rounded-full object-cover border-2 ${activeUser.isAdmin ? 'border-amber-500' : 'border-slate-500'}`}
          />
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1">
              <span>{activeUser.name}</span>
            </div>
            <div className="text-[10px] text-amber-400 font-medium truncate">
              {activeUser.role}
            </div>
          </div>
        </div>

        {/* Scrollable Nav List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {visibleNavItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? item.isPrimary
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : item.isPrimary
                    ? 'text-amber-400 hover:bg-slate-800/90 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className={isActive ? (item.isPrimary ? 'text-slate-950' : 'text-white') : item.isPrimary ? 'text-amber-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isPrimary && !isActive && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Novo
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer status */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sistema Online</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v2.8 - 2026</span>
        </div>
      </aside>
    </>
  );
};
