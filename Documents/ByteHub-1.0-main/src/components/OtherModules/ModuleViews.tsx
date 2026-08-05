import React, { useState } from 'react';
import { MainNavSection, TaskItem, TaskStatus, TeamMember, SocialPostItem, PostStatus, DayOfWeek } from '../../types';
import { WeeklyPostPlanner } from '../SocialPlanner/WeeklyPostPlanner';
import { EditorialCalendar } from '../SocialPlanner/EditorialCalendar';
import { GirassolLogo } from '../GirassolLogo';
import {
  CheckSquare,
  CalendarDays,
  CalendarRange,
  Lightbulb,
  Share2,
  Youtube,
  Globe,
  Tv,
  Radio,
  Video,
  Camera,
  Palette,
  Film,
  FolderKanban,
  Users,
  Tv2,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Play,
  Download,
  ExternalLink,
  Sliders,
  Trash2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  UserPlus,
  ShieldAlert,
  Database,
  KeyRound,
  ShieldCheck,
  ImageIcon,
  Upload,
  RefreshCw,
  Check,
  Lock
} from 'lucide-react';

interface ModuleViewProps {
  section: MainNavSection;
  tasks: TaskItem[];
  posts: SocialPostItem[];
  teamMembers: TeamMember[];
  currentUser?: TeamMember;
  onOpenNewTaskModal: (defaultSec?: MainNavSection) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewMemberModal: () => void;
  onDeleteTeamMember: (memberId: string) => void;
  onOpenResetModal: () => void;
  onOpenNewPostModal: (defaultDay?: DayOfWeek) => void;
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
  onDeletePost: (postId: string) => void;
  onSelectPostForPreview: (post: SocialPostItem) => void;
  onOpenCredentialsModal?: () => void;
}

const LogoSettingsCard: React.FC = () => {
  const [logoMsg, setLogoMsg] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha um ficheiro de imagem de até 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('girassol_custom_logo', dataUrl);
        window.dispatchEvent(new Event('girassol_logo_updated'));
        setLogoMsg('Logótipo atualizado com sucesso em todo o sistema!');
        setTimeout(() => setLogoMsg(''), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreDefault = () => {
    localStorage.removeItem('girassol_custom_logo');
    window.dispatchEvent(new Event('girassol_logo_updated'));
    setLogoMsg('Logótipo original restaurado com sucesso!');
    setTimeout(() => setLogoMsg(''), 4000);
  };

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 md:col-span-2">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-sm">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          <span>SUBSTITUIÇÃO DE LOGÓTIPO & IDENTIDADE VISUAL</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-md">
          Aplica-se aos Relatórios, Menus e Login
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Preview Box */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center shrink-0 w-full sm:w-64 h-32 relative">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visualização Atual</span>
          <GirassolLogo className="h-12" />
        </div>

        {/* Action Controls */}
        <div className="space-y-3 flex-1 w-full">
          <p className="text-xs text-slate-600 leading-relaxed">
            Carregue uma nova imagem do logótipo da <strong>Rede Girassol</strong> (formatos suportados: PNG, JPG, WEBP ou SVG). A alteração é refletida instantaneamente na barra lateral, ecrã de login e relatórios PDF gerados.
          </p>

          {logoMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{logoMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <label className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Substituir Logótipo</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleRestoreDefault}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { getSupabaseCredentials, resetSupabaseInstance, SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import { testSupabaseConnection } from '../../services/supabaseSync';

const SupabaseSettingsCard: React.FC = () => {
  const initialCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(initialCreds.url);
  const [anonKey, setAnonKey] = useState(initialCreds.key);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ isConnected: boolean; message: string } | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setConnectionStatus(null);

    if (url) localStorage.setItem('girassol_supabase_url', url.trim());
    else localStorage.removeItem('girassol_supabase_url');

    if (anonKey) localStorage.setItem('girassol_supabase_anon_key', anonKey.trim());
    else localStorage.removeItem('girassol_supabase_anon_key');

    resetSupabaseInstance();

    const res = await testSupabaseConnection();
    setConnectionStatus(res);
    setIsTesting(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 md:col-span-2 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-emerald-400">
              INTEGRAÇÃO COM BASE DE DADOS SUPABASE
            </h4>
            <p className="text-[11px] text-slate-400">
              Sincronização persistente de tarefas, programas e configurações na nuvem
            </p>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase border ${
          connectionStatus?.isConnected
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : url && anonKey
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {connectionStatus?.isConnected
            ? '● Supabase Conetado'
            : url && anonKey
            ? '○ Pronto para Testar'
            : '○ Não Configurado'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
            Supabase Project URL
          </label>
          <input
            type="text"
            placeholder="https://xxxx.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 placeholder-slate-600 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
            Supabase Anon / Public Key
          </label>
          <input
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={anonKey}
            onChange={(e) => setAnonKey(e.target.value)}
            className="w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 placeholder-slate-600 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
        </div>
      </div>

      {connectionStatus && (
        <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
          connectionStatus.isConnected
            ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
            : 'bg-rose-950/80 border-rose-700/80 text-rose-300'
        }`}>
          {connectionStatus.isConnected ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{connectionStatus.message}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAndTest}
            disabled={isTesting}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isTesting ? (
              <span>A Testar Conexão...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Guardar & Testar Conexão Supabase</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowSql(!showSql)}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-2"
          >
            <span>{showSql ? 'Ocultar Script SQL' : '📜 Ver Script SQL para Supabase'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Nota: Também pode definir <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> no ficheiro <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">.env</code>.
        </p>
      </div>

      {showSql && (
        <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2 relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Script de Criação de Tabelas (SQL DDL)
            </span>
            <button
              onClick={handleCopySql}
              className="px-3 py-1 text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{copied ? 'Copiado!' : 'Copiar Script SQL'}</span>
            </button>
          </div>
          <pre className="text-slate-300 overflow-x-auto max-h-56 p-2 bg-slate-900 rounded-lg text-[11px] leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      )}
    </div>
  );
};

export const ModuleViews: React.FC<ModuleViewProps> = ({
  section,
  tasks,
  posts,
  teamMembers,
  currentUser,
  onOpenNewTaskModal,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenNewMemberModal,
  onDeleteTeamMember,
  onOpenResetModal,
  onOpenNewPostModal,
  onUpdatePostStatus,
  onDeletePost,
  onSelectPostForPreview,
  onOpenCredentialsModal
}) => {
  const isAdmin = !!currentUser?.isAdmin;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  // Planeamento de Posts — Vista Semanal por Dias (Kanban Semanal)
  if (section === 'planeamento') {
    return (
      <WeeklyPostPlanner
        posts={posts}
        teamMembers={teamMembers}
        onOpenNewPostModal={onOpenNewPostModal}
        onUpdatePostStatus={onUpdatePostStatus}
        onDeletePost={onDeletePost}
        onSelectPostForPreview={onSelectPostForPreview}
      />
    );
  }

  // Calendário Editorial — Vista Mensal Cronológica e Grelha
  if (section === 'calendario') {
    return (
      <EditorialCalendar
        posts={posts}
        onOpenNewPostModal={onOpenNewPostModal}
        onUpdatePostStatus={onUpdatePostStatus}
        onDeletePost={onDeletePost}
        onSelectPostForPreview={onSelectPostForPreview}
      />
    );
  }

  // 📱 GESTÃO DE CANAIS POR REDE SOCIAL
  if (section === 'redes_sociais') {
    const channels = [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://instagram.com',
        color: 'from-pink-500 to-purple-600',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-700',
        icon: '📸',
        postsThisWeek: posts.filter(p => p.platforms.includes('instagram')).length,
        scheduled: posts.filter(p => p.platforms.includes('instagram') && p.status === 'Agendado').length,
        published: posts.filter(p => p.platforms.includes('instagram') && p.status === 'Publicado').length,
      },
      {
        id: 'facebook',
        name: 'Facebook',
        url: 'https://facebook.com',
        color: 'from-blue-600 to-blue-700',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        icon: '👍',
        postsThisWeek: posts.filter(p => p.platforms.includes('facebook')).length,
        scheduled: posts.filter(p => p.platforms.includes('facebook') && p.status === 'Agendado').length,
        published: posts.filter(p => p.platforms.includes('facebook') && p.status === 'Publicado').length,
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://tiktok.com',
        color: 'from-slate-800 to-slate-950',
        borderColor: 'border-slate-200',
        textColor: 'text-slate-700',
        icon: '🎵',
        postsThisWeek: posts.filter(p => p.platforms.includes('tiktok')).length,
        scheduled: posts.filter(p => p.platforms.includes('tiktok') && p.status === 'Agendado').length,
        published: posts.filter(p => p.platforms.includes('tiktok') && p.status === 'Publicado').length,
      },
      {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://youtube.com',
        color: 'from-red-600 to-red-700',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        icon: '▶️',
        postsThisWeek: posts.filter(p => p.platforms.includes('youtube')).length,
        scheduled: posts.filter(p => p.platforms.includes('youtube') && p.status === 'Agendado').length,
        published: posts.filter(p => p.platforms.includes('youtube') && p.status === 'Publicado').length,
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        url: 'https://linkedin.com',
        color: 'from-sky-700 to-sky-800',
        borderColor: 'border-sky-200',
        textColor: 'text-sky-700',
        icon: '💼',
        postsThisWeek: posts.filter(p => p.platforms.includes('linkedin')).length,
        scheduled: posts.filter(p => p.platforms.includes('linkedin') && p.status === 'Agendado').length,
        published: posts.filter(p => p.platforms.includes('linkedin') && p.status === 'Publicado').length,
      },
      {
        id: 'x',
        name: 'X (Twitter)',
        url: 'https://x.com',
        color: 'from-neutral-800 to-black',
        borderColor: 'border-neutral-200',
        textColor: 'text-neutral-700',
        icon: '✖️',
        postsThisWeek: posts.filter(p => p.platforms.includes('x')).length,
        scheduled: posts.filter(p => p.platforms.includes('x') && p.status === 'Agendado').length,
        published: posts.filter(p => p.platforms.includes('x') && p.status === 'Publicado').length,
      },
    ];

    const totalPosts = posts.length;
    const totalScheduled = posts.filter(p => p.status === 'Agendado').length;
    const totalPublished = posts.filter(p => p.status === 'Publicado').length;

    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-600" />
              <span>Gestão de Canais por Rede Social</span>
            </h3>
            <p className="text-xs text-slate-500">Estado, seguidores e plano de publicação de cada plataforma ativa</p>
          </div>

          <button
            onClick={() => onOpenNewPostModal()}
            className="px-4 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ PLANEAR NOVO POST</span>
          </button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Posts Planeados', value: totalPosts, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
            { label: 'Agendados', value: totalScheduled, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Publicados', value: totalPublished, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-2xl p-4 text-center`}>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {channels.map(channel => (
            <div key={channel.id} className={`bg-white rounded-2xl border ${channel.borderColor} shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col`}>
              {/* Card header with gradient */}
              <div className={`bg-gradient-to-r ${channel.color} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{channel.icon}</span>
                  <div>
                    <h4 className="font-black text-white text-sm">{channel.name}</h4>
                    <p className="text-white/70 text-[11px]">Consulte os Relatórios de Métricas para dados de seguidores</p>
                  </div>
                </div>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white text-[11px] font-bold flex items-center gap-1 border border-white/20 px-2 py-1 rounded-lg"
                >
                  <ExternalLink className="w-3 h-3" /> Abrir
                </a>
              </div>

              {/* Card body */}
              <div className="p-4 flex-1 space-y-3 text-xs">

                {/* Post stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div className="text-center p-2 bg-slate-50 rounded-xl">
                    <div className="font-black text-slate-900 text-base">{channel.postsThisWeek}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Planeados</div>
                  </div>
                  <div className="text-center p-2 bg-amber-50 rounded-xl">
                    <div className="font-black text-amber-700 text-base">{channel.scheduled}</div>
                    <div className="text-[10px] text-amber-600 uppercase tracking-wider">Agendados</div>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-xl">
                    <div className="font-black text-emerald-700 text-base">{channel.published}</div>
                    <div className="text-[10px] text-emerald-600 uppercase tracking-wider">Publicados</div>
                  </div>
                </div>

                {/* Posts list for this channel */}
                {posts.filter(p => p.platforms.includes(channel.id as any)).length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Próximos Posts</span>
                    {posts
                      .filter(p => p.platforms.includes(channel.id as any))
                      .slice(0, 3)
                      .map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="truncate text-slate-700 font-medium flex-1 pr-2">{p.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            p.status === 'Publicado' ? 'bg-emerald-100 text-emerald-700' :
                            p.status === 'Agendado' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>{p.status}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenNewPostModal()}
                  className={`text-[11px] font-bold ${channel.textColor} hover:underline flex items-center gap-1`}
                >
                  <Plus className="w-3 h-3" /> Planear Post
                </button>
                <span className="text-[10px] text-slate-400 italic">Seguidores: ver Relatórios</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'todos' || t.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgente':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Alta':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Média':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Concluído':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Em Progresso':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Pendente Aprovação':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // 📋 TAREFAS
  if (section === 'tarefas') {
    return (
      <div className="space-y-6 pb-12">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              <span>Gestão de Tarefas & Fluxo de Produção</span>
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhamento de tarefas por equipa: Editorial, Vídeo, Design, Métricas e Emissão
            </p>
          </div>
          <button
            onClick={() => onOpenNewTaskModal('tarefas')}
            className="px-4 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ CRIAR NOVA TAREFA</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por título, responsável ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
            <span className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Estado:
            </span>
            {['todos', 'Pendente', 'Em Progresso', 'Pendente Aprovação', 'Concluído'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap border ${
                  selectedStatusFilter === st
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {st === 'todos' ? 'Todas' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Nenhuma tarefa encontrada</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não existem tarefas correspondentes aos filtros seleccionados. Clique abaixo para registar uma nova tarefa.
            </p>
            <button
              onClick={() => onOpenNewTaskModal('tarefas')}
              className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
            >
              + Criar Tarefa Agora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-100">
                      {task.tag}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 leading-snug">{task.title}</h4>

                  {task.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>
                  )}

                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                    <div className="text-slate-600">
                      Responsável: <strong className="text-slate-900">{task.assignee}</strong>
                    </div>
                    <div className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Data Limite: <strong className="text-slate-800">{task.dueDate}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status selector & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(task.status)}`}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Progresso">Em Progresso</option>
                    <option value="Pendente Aprovação">Pendente Aprovação</option>
                    <option value="Concluído">Concluído</option>
                  </select>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Remover Tarefa"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 👥 EQUIPA & UTILIZADORES
  if (section === 'equipa') {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Gestão de Equipa & Utilizadores</span>
            </h3>
            <p className="text-xs text-slate-500">Membros, funções e credenciais de acesso ({teamMembers.length} registados)</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Gerir Credenciais: apenas admin */}
            {onOpenCredentialsModal && isAdmin && (
              <button
                onClick={onOpenCredentialsModal}
                className="px-3 py-2 text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Gerir Credenciais</span>
              </button>
            )}

            {/* Resetar: apenas admin */}
            {isAdmin && (
              <button
                onClick={onOpenResetModal}
                className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetar Utilizadores</span>
              </button>
            )}

            {/* Adicionar: apenas admin */}
            {isAdmin ? (
              <button
                onClick={onOpenNewMemberModal}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Adicionar Utilizador</span>
              </button>
            ) : (
              <span className="px-3 py-2 text-[11px] text-slate-400 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Apenas Administrador
              </span>
            )}
          </div>
        </div>

        {teamMembers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Sem utilizadores registados</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Nenhum utilizador encontrado. Adicione um novo elemento ou restaure a lista original.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenNewMemberModal}
                className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
              >
                + Adicionar Utilizador
              </button>
              <button
                onClick={onOpenResetModal}
                className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200"
              >
                Restauração de Fábrica
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((m) => {
              const memberTasksCount = tasks.filter((t) => t.assignee === m.name && t.status !== 'Concluído').length;
              return (
                <div key={m.id} className="bg-white p-5 rounded-xl border border-slate-200 flex items-center space-x-4 shadow-2xs hover:shadow-sm transition-all">
                  <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{m.name}</h4>
                      {/* Eliminar membro: apenas admin */}
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteTeamMember(m.id)}
                          title="Remover Utilizador"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-amber-600 font-semibold">{m.role}</div>
                    <div className="text-[11px] text-slate-500 truncate">{m.department} — {m.email}</div>
                    <div className="text-[10px] text-indigo-700 font-bold mt-1.5 flex items-center justify-between">
                      <span>{memberTasksCount} tarefas ativas no sistema</span>
                      <button
                        onClick={() => onOpenNewTaskModal(section)}
                        className="text-amber-600 hover:underline font-bold"
                      >
                        + Atribuir Tarefa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ⚙️ DEFINIÇÕES & RESET DE DADOS
  if (section === 'definicoes') {
    return (
      <div className="space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-slate-900 text-amber-400 rounded-xl">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">DEFINIÇÕES DO SISTEMA & GESTÃO DE DADOS</h3>
              <p className="text-xs text-slate-500">
                Parâmetros globais do Content Hub, utilizadores e integridade de base de dados
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Card 1: Reset System Data */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-rose-700 font-black text-sm">
                  <RotateCcw className="w-5 h-5 text-rose-600" />
                  <span>RESETAÇÃO & RESTAURAÇÃO DE DADOS</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permite restaurar ou apagar dados do sistema, incluindo <strong>Utilizadores/Equipa</strong>, <strong>Relatórios de Métricas</strong> e <strong>Tarefas de Produção</strong>. Ideal para reiniciar demonstrações ou limpar registos de teste.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Estado: Operacional</span>
                {isAdmin ? (
                  <button
                    onClick={onOpenResetModal}
                    className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>RESETAR DADOS (INCLUINDO UTILIZADORES)</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Apenas Administrador
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: User / Team Management Shortcut */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-indigo-900 font-black text-sm">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>GERIR UTILIZADORES DA EQUIPA</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Actualmente existem <strong>{teamMembers.length} utilizadores ativos</strong> registados no Content Hub. Pode criar novos elementos, alterar responsabilidades ou remover membros existentes.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">{teamMembers.length} Membros Registados</span>
                {isAdmin ? (
                  <button
                    onClick={onOpenNewMemberModal}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Adicionar Utilizador</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Apenas Administrador
                  </span>
                )}
              </div>
            </div>

            {/* Card 3: Supabase Database Integration */}
            <SupabaseSettingsCard />

            {/* Card 4: Brand Logo Customization */}
            <LogoSettingsCard />
          </div>
        </div>
      </div>
    );
  }

  // 📺 BANCO DE CONTEÚDOS / PROGRAMAS — usa tarefas para gerir
  if (section === 'banco_conteudos' || section === 'programas' as any) {
    const contentTasks = tasks.filter(t => t.tag === 'Audiovisual' || t.tag === 'TV' || t.tag === 'Rádio' || t.tag === 'Digital' || t.tag === 'Podcast' || t.tag === 'Conteúdo');
    return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Tv2 className="w-5 h-5 text-indigo-600" />
              <span>Banco de Conteúdos e Programas</span>
            </h3>
            <p className="text-xs text-slate-500">Gestão de produção audiovisual, programas de TV, Rádio e Digital</p>
          </div>
          <button
            onClick={() => onOpenNewTaskModal('tarefas')}
            className="px-4 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ NOVA TAREFA DE PRODUÇÃO</span>
          </button>
        </div>

        {contentTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
            <Tv2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Sem tarefas de produção registadas</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Crie tarefas de produção com a tag <strong>Audiovisual</strong>, <strong>TV</strong>, <strong>Rádio</strong> ou <strong>Digital</strong> para que apareçam aqui organizadas.
            </p>
            <button
              onClick={() => onOpenNewTaskModal('tarefas')}
              className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
            >
              + Criar Tarefa de Produção
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentTasks.map((task) => (
              <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase bg-slate-900 text-amber-400 px-2.5 py-1 rounded">
                    {task.tag}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    task.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    task.status === 'Em Progresso' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <h4 className="font-black text-base text-slate-900">{task.title}</h4>
                {task.description && <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>}
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Responsável: <strong className="text-slate-700">{task.assignee}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // GENERAL DEFAULT VIEW FOR OTHER MODULES
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 uppercase">
                MÓDULO: {section.replace('_', ' ')}
              </h3>
              <p className="text-xs text-slate-500">
                Área totalmente integrada ao Centro de Comando Content Hub
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenNewTaskModal(section)}
            className="px-4 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ CRIAR TAREFA EM {section.toUpperCase()}</span>
          </button>
        </div>

        {/* Section Tasks */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-bold text-xs uppercase text-slate-800 mb-3">
            Tarefas Ativas no Módulo {section.toUpperCase()}
          </h4>

          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 space-y-3">
              <Sliders className="w-8 h-8 text-slate-400 mx-auto" />
              <h5 className="font-bold text-sm text-slate-800">
                Sem tarefas pendentes neste módulo
              </h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Todos os registos e tarefas criados nesta área sincronizam automaticamente com a equipa e alimentam o módulo de Métricas e Relatórios.
              </p>
              <button
                onClick={() => onOpenNewTaskModal(section)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
              >
                + Adicionar Nova Tarefa em {section}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">{t.title}</span>
                    <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">{t.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Responsável: {t.assignee} — Limite: {t.dueDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
