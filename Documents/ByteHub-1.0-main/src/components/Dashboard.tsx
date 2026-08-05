import React from 'react';
import { MainNavSection, MetricReport, TaskItem, SocialPostItem, TeamMember } from '../types';
import {
  formatNumber,
  getPlatformSummary,
} from '../utils/metricsCalculator';
import {
  BarChart3,
  CheckSquare,
  CalendarRange,
  Tv,
  Share2,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  PlusCircle,
  FileText,
  AlertCircle,
  CalendarDays,
  Inbox,
} from 'lucide-react';

interface DashboardProps {
  reports: MetricReport[];
  tasks: TaskItem[];
  posts: SocialPostItem[];
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  onNavigateSection: (section: MainNavSection) => void;
  onOpenPdfView: (report: MetricReport) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  reports,
  tasks,
  posts,
  teamMembers,
  currentUser,
  onNavigateSection,
  onOpenPdfView,
}) => {
  const latestReport = reports[0];
  const previousReport = reports[1];

  const summary = latestReport ? getPlatformSummary(latestReport, previousReport) : [];

  const totalFollowers = summary.reduce((acc, r) => acc + r.followers, 0);
  const totalReach = summary.reduce((acc, r) => acc + r.reach, 0);
  const totalEngagement = summary.reduce((acc, r) => acc + r.engagement, 0);
  const totalPublications = summary.reduce((acc, r) => acc + r.publications, 0);

  // Task stats
  const myTasks = tasks.filter((t) => t.assignee === currentUser.name);
  const pendingTasks = tasks.filter((t) => t.status === 'Pendente').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'Em Progresso').length;
  const pendingApprovalTasks = tasks.filter((t) => t.status === 'Pendente Aprovação').length;

  // Post stats
  const scheduledPosts = posts.filter((p) => p.status === 'Agendado').length;
  const publishedPosts = posts.filter((p) => p.status === 'Publicado').length;
  const draftPosts = posts.filter((p) => p.status === 'Rascunho' || p.status === 'Ideia').length;

  // Best performing platform
  const bestPlatform = summary.length > 0
    ? summary.reduce((best, cur) => cur.followersGrowthPct > best.followersGrowthPct ? cur : best, summary[0])
    : null;
  const growthPlatform = summary.length > 0
    ? summary.reduce((best, cur) => cur.reach > best.reach ? cur : best, summary[0])
    : null;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = currentUser.name.split(' ')[0];

  const isEmpty = reports.length === 0 && tasks.length === 0 && posts.length === 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Centro de Comando Digital
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            {currentUser.isAdmin
              ? `Bem-vindo ao painel de administração. Está a gerir ${teamMembers.length} membro${teamMembers.length !== 1 ? 's' : ''} da equipa.`
              : `Bem-vindo ao Content Hub. Tem ${myTasks.length} tarefa${myTasks.length !== 1 ? 's' : ''} atribuída${myTasks.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        <button
          onClick={() => onNavigateSection('metricas')}
          className="px-5 py-2.5 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <BarChart3 className="w-4 h-4" />
          <span>LANÇAR MÉTRICAS</span>
        </button>
      </div>

      {/* Empty State Onboarding */}
      {isEmpty && (
        <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-indigo-200 text-center space-y-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900">Sistema pronto para uso</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              O Content Hub está configurado e operacional. Comece por criar tarefas, planear posts ou lançar o primeiro relatório de métricas.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateSection('tarefas')}
              className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              Criar Primeira Tarefa
            </button>
            <button
              onClick={() => onNavigateSection('planeamento')}
              className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" />
              Planear Posts
            </button>
            <button
              onClick={() => onNavigateSection('metricas')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              Novo Relatório
            </button>
          </div>
        </div>
      )}

      {/* Metrics Summary — only when there are reports */}
      {latestReport && (
        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500 text-slate-950 font-black rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight">
                  📊 PERFORMANCE DIGITAL — RESUMO EXECUTIVO
                </h3>
                <p className="text-xs text-slate-500">
                  {latestReport.title} • {latestReport.platforms.length} plataforma{latestReport.platforms.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenPdfView(latestReport)}
              className="px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span>VER RELATÓRIO COMPLETO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Seguidores</div>
              <div className="text-base font-black text-slate-900 mt-1">{formatNumber(totalFollowers)}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Total consolidado</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Alcance</div>
              <div className="text-base font-black text-indigo-900 mt-1">{formatNumber(totalReach)}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">No período</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Engagement</div>
              <div className="text-base font-black text-pink-600 mt-1">{formatNumber(totalEngagement)}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Interações totais</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Publicações</div>
              <div className="text-base font-black text-slate-900 mt-1">{totalPublications}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">No período</div>
            </div>

            {bestPlatform && (
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Maior Crescimento</div>
                <div className="text-base font-black text-emerald-950 mt-1 capitalize">{bestPlatform.platformName}</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  +{bestPlatform.followersGrowthPct.toFixed(1)}% seguidores
                </div>
              </div>
            )}

            {growthPlatform && (
              <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200">
                <div className="text-[10px] font-bold text-indigo-800 uppercase">Maior Alcance</div>
                <div className="text-base font-black text-indigo-950 mt-1 capitalize">{growthPlatform.platformName}</div>
                <div className="text-[10px] text-indigo-700 mt-0.5">
                  {formatNumber(growthPlatform.reach)} pessoas
                </div>
              </div>
            )}

            {reports.length > 1 && (
              <div className="sm:col-span-2 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                <div className="text-[10px] font-bold text-amber-800 uppercase">Relatórios Disponíveis</div>
                <div className="text-base font-black text-amber-950 mt-1">{reports.length}</div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  Último: {latestReport.endDate}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Row */}
      {!isEmpty && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateSection('tarefas')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-amber-600">{pendingTasks + inProgressTasks}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Tarefas Abertas</h4>
              <p className="text-[11px] text-slate-500">{inProgressTasks} em progresso · {pendingApprovalTasks} em aprovação</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateSection('planeamento')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CalendarRange className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-indigo-600">{scheduledPosts}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Posts Agendados</h4>
              <p className="text-[11px] text-slate-500">{publishedPosts} publicados · {draftPosts} em rascunho</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateSection('equipa')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-emerald-600">{teamMembers.length}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Membros da Equipa</h4>
              <p className="text-[11px] text-slate-500">
                {teamMembers.filter(m => m.isAdmin).length} admin · {teamMembers.filter(m => !m.isAdmin).length} colaboradores
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateSection('metricas')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-rose-600">{reports.length}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Relatórios</h4>
              <p className="text-[11px] text-slate-500">
                {reports.filter(r => r.status === 'completo').length} completos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Tarefas Recentes
            </h3>
            <button
              onClick={() => onNavigateSection('tarefas')}
              className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{task.title}</p>
                  <p className="text-slate-500 text-[11px]">{task.assignee} · {task.tag}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap border ${
                    task.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    task.status === 'Em Progresso' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                    task.status === 'Pendente Aprovação' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap ${
                    task.priority === 'Urgente' ? 'bg-rose-100 text-rose-700' :
                    task.priority === 'Alta' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts preview */}
      {posts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              Posts Recentes
            </h3>
            <button
              onClick={() => onNavigateSection('planeamento')}
              className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {posts.slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{post.title}</p>
                  <p className="text-slate-500 text-[11px]">
                    {post.dayOfWeek} · {post.time} · {post.platforms.join(', ')}
                  </p>
                </div>
                <span className={`ml-3 px-2 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap border ${
                  post.status === 'Publicado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                  post.status === 'Agendado' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  post.status === 'Em Aprovação' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
