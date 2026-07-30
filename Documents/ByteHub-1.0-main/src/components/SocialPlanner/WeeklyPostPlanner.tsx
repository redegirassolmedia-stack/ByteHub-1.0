import React, { useState } from 'react';
import { SocialPostItem, DayOfWeek, PostStatus, PlatformType, TeamMember } from '../../types';
import {
  CalendarDays,
  Plus,
  Filter,
  Search,
  Clock,
  Send,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Trash2,
  Edit,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  Image as ImageIcon,
  Video,
  Layers,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Hash
} from 'lucide-react';

interface WeeklyPostPlannerProps {
  posts: SocialPostItem[];
  teamMembers: TeamMember[];
  onOpenNewPostModal: (defaultDay?: DayOfWeek) => void;
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
  onDeletePost: (postId: string) => void;
  onSelectPostForPreview: (post: SocialPostItem) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export const WeeklyPostPlanner: React.FC<WeeklyPostPlannerProps> = ({
  posts,
  teamMembers,
  onOpenNewPostModal,
  onUpdatePostStatus,
  onDeletePost,
  onSelectPostForPreview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.copy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.assignee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform =
      selectedPlatform === 'todos' || post.platforms.includes(selectedPlatform as PlatformType);

    const matchesStatus =
      selectedStatus === 'todos' || post.status === selectedStatus;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Get platform icon & badge color
  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'facebook':
        return { label: 'FB', bg: 'bg-blue-600 text-white', icon: '📘' };
      case 'instagram':
        return { label: 'IG', bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white', icon: '📸' };
      case 'tiktok':
        return { label: 'TT', bg: 'bg-slate-950 text-white border border-slate-700', icon: '🎵' };
      case 'youtube':
        return { label: 'YT', bg: 'bg-red-600 text-white', icon: '▶️' };
      case 'linkedin':
        return { label: 'LN', bg: 'bg-sky-700 text-white', icon: '💼' };
      case 'x':
        return { label: 'X', bg: 'bg-slate-900 text-white', icon: '✖️' };
      default:
        return { label: platform, bg: 'bg-slate-700 text-white', icon: '🌐' };
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'Publicado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Agendado':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Em Aprovação':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Rascunho':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Ideia':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'Reels':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Carrossel':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Vídeo':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Story':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Live':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Metrics
  const totalPosts = posts.length;
  const agendadosCount = posts.filter((p) => p.status === 'Agendado').length;
  const publicadosCount = posts.filter((p) => p.status === 'Publicado').length;
  const emAprovacaoCount = posts.filter((p) => p.status === 'Em Aprovação').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Send className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Plano Semanal de Conteúdos</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Gestão e Planeamento de Posts nas Redes Sociais
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Organize as publicações nos dias da semana, defina horários nobres de engajamento, aprove rascunhos e acompanhe o estado dos posts no Instagram, Facebook, TikTok, YouTube, LinkedIn e X.
            </p>
          </div>

          <button
            onClick={() => onOpenNewPostModal()}
            className="px-5 py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ PLANEAR NOVO POST</span>
          </button>
        </div>

        {/* Quick KPI Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">Total de Posts Planeados</span>
            <span className="text-xl font-black text-white">{totalPosts}</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-indigo-300 block font-medium">Agendados para Envio</span>
            <span className="text-xl font-black text-indigo-400">{agendadosCount}</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-emerald-300 block font-medium">Já Publicados</span>
            <span className="text-xl font-black text-emerald-400">{publicadosCount}</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-amber-300 block font-medium">Pendente de Aprovação</span>
            <span className="text-xl font-black text-amber-400">{emAprovacaoCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por título, texto ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto text-xs">
          {/* Platform filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
            <span className="text-slate-500 font-bold whitespace-nowrap text-[11px]">Rede:</span>
            {[
              { id: 'todos', label: 'Todas' },
              { id: 'facebook', label: 'Facebook' },
              { id: 'instagram', label: 'Instagram' },
              { id: 'tiktok', label: 'TikTok' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'linkedin', label: 'LinkedIn' },
              { id: 'x', label: 'X' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border whitespace-nowrap ${
                  selectedPlatform === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
            <span className="text-slate-500 font-bold whitespace-nowrap text-[11px]">Estado:</span>
            {['todos', 'Ideia', 'Rascunho', 'Em Aprovação', 'Agendado', 'Publicado'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WEEKLY GRID (MONDAY TO SUNDAY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayPosts = filteredPosts.filter((p) => p.dayOfWeek === day);
          const isWeekend = day === 'Sábado' || day === 'Domingo';

          return (
            <div
              key={day}
              className={`flex flex-col rounded-2xl border ${
                isWeekend ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white border-slate-200'
              } shadow-2xs overflow-hidden min-h-[380px]`}
            >
              {/* Day Column Header */}
              <div
                className={`p-3 border-b flex items-center justify-between ${
                  isWeekend
                    ? 'bg-slate-100/80 border-slate-200 text-slate-700'
                    : 'bg-slate-900 text-white border-slate-800'
                }`}
              >
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">{day}</h3>
                  <span className="text-[10px] opacity-75 font-mono">
                    {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenNewPostModal(day)}
                  title={`Adicionar post para ${day}`}
                  className={`p-1 rounded-lg transition-colors text-xs flex items-center justify-center ${
                    isWeekend
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Posts List */}
              <div className="p-2 flex-1 space-y-2 overflow-y-auto max-h-[600px] custom-scrollbar">
                {dayPosts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center text-slate-400 space-y-2 my-8">
                    <CalendarDays className="w-6 h-6 stroke-1 text-slate-300" />
                    <p className="text-[11px] font-medium text-slate-400">Sem posts para este dia</p>
                    <button
                      onClick={() => onOpenNewPostModal(day)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      + Agendar Post
                    </button>
                  </div>
                ) : (
                  dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-2 group relative"
                    >
                      {/* Media Image preview if available */}
                      {post.mediaUrl && (
                        <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                          <img
                            src={post.mediaUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-1.5 right-1.5 flex gap-1">
                            {post.platforms.map((pf) => {
                              const badge = getPlatformBadge(pf);
                              return (
                                <span
                                  key={pf}
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs ${badge.bg}`}
                                >
                                  {badge.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {!post.mediaUrl && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {post.platforms.map((pf) => {
                            const badge = getPlatformBadge(pf);
                            return (
                              <span
                                key={pf}
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs ${badge.bg}`}
                              >
                                {badge.label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Header info: time & format */}
                      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                          <Clock className="w-3 h-3 text-indigo-600" />
                          {post.time}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded border font-semibold ${getFormatBadge(post.format)}`}>
                          {post.format}
                        </span>
                      </div>

                      {/* Post Title */}
                      <h4
                        onClick={() => onSelectPostForPreview(post)}
                        className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
                      >
                        {post.title}
                      </h4>

                      {/* Copy snippet */}
                      <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                        "{post.copy}"
                      </p>

                      {/* Status select badge */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                        <select
                          value={post.status}
                          onChange={(e) => onUpdatePostStatus(post.id, e.target.value as PostStatus)}
                          className={`px-1.5 py-0.5 rounded font-bold border text-[10px] cursor-pointer ${getStatusBadge(post.status)}`}
                        >
                          <option value="Ideia">Ideia</option>
                          <option value="Rascunho">Rascunho</option>
                          <option value="Em Aprovação">Em Aprovação</option>
                          <option value="Agendado">Agendado</option>
                          <option value="Publicado">Publicado</option>
                        </select>

                        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onSelectPostForPreview(post)}
                            title="Ver Detalhes do Post"
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePost(post.id)}
                            title="Apagar Post"
                            className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
