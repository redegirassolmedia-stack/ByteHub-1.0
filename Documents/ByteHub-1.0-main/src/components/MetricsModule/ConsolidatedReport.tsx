import React from 'react';
import { MetricReport, PlatformType } from '../../types';
import { GirassolLogo } from '../GirassolLogo';
import {
  PLATFORM_NAMES,
  formatNumber,
  formatPercent,
  getPlatformSummary,
  getPlatformFollowers,
  getPlatformReach,
  getPlatformEngagement,
  getPlatformPublications
} from '../../utils/metricsCalculator';
import { X, Globe, Video, FileSpreadsheet, Layers, Sparkles } from 'lucide-react';

interface ConsolidatedReportProps {
  report: MetricReport;
  previousReport?: MetricReport;
  onClose: () => void;
}

export const ConsolidatedReport: React.FC<ConsolidatedReportProps> = ({
  report,
  previousReport,
  onClose
}) => {
  const summary = getPlatformSummary(report, previousReport);

  const totalFollowers = summary.reduce((acc, r) => acc + r.followers, 0);
  const totalFollowersGrowth = summary.reduce((acc, r) => acc + r.followersGrowth, 0);
  const totalReach = summary.reduce((acc, r) => acc + r.reach, 0);
  const totalEngagement = summary.reduce((acc, r) => acc + r.engagement, 0);
  const totalPublications = summary.reduce((acc, r) => acc + r.publications, 0);

  // Extract specific video counts from platform metrics
  const totalReels = (report.metrics.facebook?.reelsCount || 0) + (report.metrics.instagram?.reelsCount || 0);
  const totalTikToks = report.metrics.tiktok?.videosPublished || 0;
  const totalShorts = report.metrics.youtube?.shortsPublished || 0;
  const totalLives = (report.metrics.facebook?.livesCount || 0) +
    (report.metrics.instagram?.livesCount || 0) +
    (report.metrics.youtube?.livesCount || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-xl flex items-center justify-center">
              <GirassolLogo className="h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">RELATÓRIO CONSOLIDADO — TOTAL DIGITAL</h3>
              <p className="text-xs text-amber-400">Agregação Geral Transversal de Toda a Presença nas Redes Sociais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TOTAL DIGITAL Highlight Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>ECOSSISTEMA DIGITAL GLOBAL — CONTENT HUB</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">Período: {report.startDate} a {report.endDate}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Total de Seguidores</div>
                <div className="text-2xl font-black text-white mt-1">{formatNumber(totalFollowers)}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-1">+{formatNumber(totalFollowersGrowth)} novos</div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Alcance Total</div>
                <div className="text-2xl font-black text-indigo-200 mt-1">{formatNumber(totalReach)}</div>
                <div className="text-[10px] text-indigo-300 mt-1">Impressões e visualizações</div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Engagement Total</div>
                <div className="text-2xl font-black text-amber-300 mt-1">{formatNumber(totalEngagement)}</div>
                <div className="text-[10px] text-amber-200 mt-1">Interacções do público</div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Total Publicações</div>
                <div className="text-2xl font-black text-white mt-1">{formatNumber(totalPublications)}</div>
                <div className="text-[10px] text-slate-300 mt-1">Conteúdos divulgados</div>
              </div>
            </div>

            {/* Video Format Breakdown */}
            <div className="border-t border-indigo-800/60 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-indigo-900/50 p-2.5 rounded-lg">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">Reels (IG/FB)</div>
                <div className="text-base font-black text-white mt-0.5">{totalReels} publicados</div>
              </div>
              <div className="bg-indigo-900/50 p-2.5 rounded-lg">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">TikToks</div>
                <div className="text-base font-black text-white mt-0.5">{totalTikToks} publicados</div>
              </div>
              <div className="bg-indigo-900/50 p-2.5 rounded-lg">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">YouTube Shorts</div>
                <div className="text-base font-black text-white mt-0.5">{totalShorts} publicados</div>
              </div>
              <div className="bg-indigo-900/50 p-2.5 rounded-lg">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">Transmissões Ao Vivo</div>
                <div className="text-base font-black text-white mt-0.5">{totalLives} lives realizadas</div>
              </div>
            </div>
          </div>

          {/* Individual Platform Breakdown Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-800">Desempenho Consolidado por Plataforma Individual</h4>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white uppercase text-[10px]">
                  <tr>
                    <th className="p-3 border-r border-slate-800">Plataforma</th>
                    <th className="p-3 border-r border-slate-800">Seguidores</th>
                    <th className="p-3 border-r border-slate-800">Alcance Total</th>
                    <th className="p-3 border-r border-slate-800">Engagement</th>
                    <th className="p-3">Publicações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.map((row) => (
                    <tr key={row.platform} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 border-r">{row.platformName}</td>
                      <td className="p-3 border-r">{formatNumber(row.followers)}</td>
                      <td className="p-3 border-r">{formatNumber(row.reach)}</td>
                      <td className="p-3 border-r">{formatNumber(row.engagement)}</td>
                      <td className="p-3">{row.publications}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
