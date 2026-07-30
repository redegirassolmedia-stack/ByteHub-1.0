import React from 'react';
import { MainNavSection, MetricReport } from '../types';
import {
  formatNumber,
  formatPercent,
  getPlatformSummary,
  generateAutomatedAnalysis
} from '../utils/metricsCalculator';
import {
  BarChart3,
  CheckSquare,
  CalendarRange,
  Tv,
  Radio,
  Share2,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  PlayCircle,
  FileSpreadsheet,
  Calendar,
  Clock,
  PlusCircle
} from 'lucide-react';

interface DashboardProps {
  reports: MetricReport[];
  onNavigateSection: (section: MainNavSection) => void;
  onOpenPdfView: (report: MetricReport) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  reports,
  onNavigateSection,
  onOpenPdfView
}) => {
  const latestReport = reports[0];
  const previousReport = reports[1];

  const summary = latestReport ? getPlatformSummary(latestReport, previousReport) : [];
  const analysis = latestReport ? generateAutomatedAnalysis(latestReport, previousReport) : null;

  const totalFollowers = summary.reduce((acc, r) => acc + r.followers, 0);
  const totalReach = summary.reduce((acc, r) => acc + r.reach, 0);
  const totalEngagement = summary.reduce((acc, r) => acc + r.engagement, 0);
  const totalPublications = summary.reduce((acc, r) => acc + r.publications, 0);

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
            CONTENT HUB — Painel de Controlo de Operações
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Gestão Integrada de Planeamento, Produção Audiovisual, Redes Sociais, Emissão TV/Rádio e Relatórios de Métricas.
          </p>
        </div>

        <button
          onClick={() => onNavigateSection('metricas')}
          className="px-5 py-2.5 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <BarChart3 className="w-4 h-4" />
          <span>IR PARA MÉTRICAS & RELATÓRIOS</span>
        </button>
      </div>

      {/* MONDAY METRICS MANDATORY LAUNCH NOTICE */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-4 rounded-2xl shadow-md border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-950 text-amber-400 rounded-xl font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-slate-950 text-amber-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                REGISTO OBRIGATÓRIO
              </span>
              <span className="text-xs font-bold text-slate-900">• TODAS AS SEGUNDAS-FEIRAS</span>
            </div>
            <p className="text-xs font-black text-slate-950 mt-0.5">
              Lançamento Semanal de Métricas por Plataforma Social
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateSection('metricas')}
          className="px-4 py-2 text-xs font-black bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>LANÇAR MÉTRICAS AGORA</span>
        </button>
      </div>

      {/* REQUIREMENT 33: Prominent PERFORMANCE DIGITAL Widget */}
      <div className="bg-white rounded-2xl p-6 shadow-2xs border-2 border-indigo-600/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 font-black rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <span>📊 PERFORMANCE DIGITAL — RESUMO EXECUTIVO</span>
              </h3>
              <p className="text-xs text-slate-500">
                Indicadores consolidados de redes sociais (Coordenação: Ivan Lima)
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateSection('metricas')}
            className="px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>VER RELATÓRIO COMPLETO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Metric Summaries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Seguidores</div>
            <div className="text-base font-black text-slate-900 mt-1">{formatNumber(totalFollowers)}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+5.2%</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Alcance Total</div>
            <div className="text-base font-black text-indigo-900 mt-1">{formatNumber(totalReach)}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+14.8%</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Engagement</div>
            <div className="text-base font-black text-pink-600 mt-1">{formatNumber(totalEngagement)}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+18.2%</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Publicações</div>
            <div className="text-base font-black text-slate-900 mt-1">{totalPublications}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">No período</div>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <div className="text-[10px] font-bold text-emerald-800 uppercase">Melhor Plataforma</div>
            <div className="text-base font-black text-emerald-950 mt-1">Instagram</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">🏆 Top Alcance</div>
          </div>

          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
            <div className="text-[10px] font-bold text-amber-800 uppercase">Maior Crescimento</div>
            <div className="text-base font-black text-amber-950 mt-1">TikTok</div>
            <div className="text-[10px] text-amber-700 mt-0.5">📈 +17.89%</div>
          </div>

          <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200">
            <div className="text-[10px] font-bold text-rose-800 uppercase">Atenção</div>
            <div className="text-base font-black text-rose-950 mt-1">X / Twitter</div>
            <div className="text-[10px] text-rose-700 mt-0.5">⚠️ Frequência</div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigateSection('calendario')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarRange className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-600">8 agendados hoje</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Calendário Editorial</h4>
            <p className="text-xs text-slate-500">Agendamento de redes sociais, portal e TV</p>
          </div>
        </div>

        <div
          onClick={() => onNavigateSection('tarefas')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600">14 em progresso</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Tarefas & Produção</h4>
            <p className="text-xs text-slate-500">Workflow de edição, design e aprovação</p>
          </div>
        </div>

        <div
          onClick={() => onNavigateSection('tv')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <Tv className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              NO AR
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Emissão TV & Rádio</h4>
            <p className="text-xs text-slate-500">Jornal do Meio-Dia em transmissão ao vivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};
