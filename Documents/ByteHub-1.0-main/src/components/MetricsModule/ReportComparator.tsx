import React, { useState } from 'react';
import { MetricReport, PlatformType } from '../../types';
import {
  PLATFORM_NAMES,
  formatNumber,
  formatPercent,
  calculateDelta,
  getPlatformFollowers,
  getPlatformReach,
  getPlatformEngagement,
  getPlatformPublications
} from '../../utils/metricsCalculator';
import { X, ArrowRight, TrendingUp, BarChart2, CheckCircle2, ArrowUpDown } from 'lucide-react';

interface ReportComparatorProps {
  reports: MetricReport[];
  initialReportA?: MetricReport;
  initialReportB?: MetricReport;
  onClose: () => void;
}

export const ReportComparator: React.FC<ReportComparatorProps> = ({
  reports,
  initialReportA,
  initialReportB,
  onClose
}) => {
  const [reportAId, setReportAId] = useState<string>(initialReportA?.id || reports[0]?.id || '');
  const [reportBId, setReportBId] = useState<string>(initialReportB?.id || reports[1]?.id || reports[0]?.id || '');

  const reportA = reports.find((r) => r.id === reportAId) || reports[0];
  const reportB = reports.find((r) => r.id === reportBId) || reports[1] || reports[0];

  const commonPlatforms: PlatformType[] = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'x'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">COMPARADOR DE RELATÓRIOS E PERÍODOS</h3>
              <p className="text-xs text-amber-400">Análise Comparativa Directa entre Dois Relatórios Historicamente Registados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selectors Bar */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Relatório A (Período Base)
            </label>
            <select
              value={reportAId}
              onChange={(e) => setReportAId(e.target.value)}
              className="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg bg-slate-50"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.startDate} a {r.endDate})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Relatório B (Período de Comparação)
            </label>
            <select
              value={reportBId}
              onChange={(e) => setReportBId(e.target.value)}
              className="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg bg-slate-50"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.startDate} a {r.endDate})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Métricas Agregadas da Rede Digital (Relatório A vs Relatório B)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Seguidores Totais',
                valA: commonPlatforms.reduce((acc, p) => acc + getPlatformFollowers(reportA, p), 0),
                valB: commonPlatforms.reduce((acc, p) => acc + getPlatformFollowers(reportB, p), 0)
              },
              {
                label: 'Alcance Total',
                valA: commonPlatforms.reduce((acc, p) => acc + getPlatformReach(reportA, p), 0),
                valB: commonPlatforms.reduce((acc, p) => acc + getPlatformReach(reportB, p), 0)
              },
              {
                label: 'Engagement Total',
                valA: commonPlatforms.reduce((acc, p) => acc + getPlatformEngagement(reportA, p), 0),
                valB: commonPlatforms.reduce((acc, p) => acc + getPlatformEngagement(reportB, p), 0)
              }
            ].map((item, idx) => {
              const delta = calculateDelta(item.valB, item.valA, 'agg', item.label);
              return (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase">{item.label}</div>
                  <div className="flex items-center justify-between mt-2 text-sm font-bold">
                    <span>Base: {formatNumber(item.valA)}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="text-indigo-900">Novo: {formatNumber(item.valB)}</span>
                  </div>
                  <div className={`mt-2 text-xs font-bold ${delta.iconColor}`}>
                    {delta.symbol} Variação: {formatNumber(delta.diffAbsolute)} ({formatPercent(delta.diffPercentage)})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Platform Side by Side Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-800">Comparativo por Plataforma Individual</h4>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Plataforma</th>
                    <th className="p-3">Seguidores (A vs B)</th>
                    <th className="p-3">Variação Seguidores</th>
                    <th className="p-3">Alcance (A vs B)</th>
                    <th className="p-3">Variação Alcance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commonPlatforms.map((p) => {
                    const folA = getPlatformFollowers(reportA, p);
                    const folB = getPlatformFollowers(reportB, p);
                    const folDelta = calculateDelta(folB, folA, 'fol', 'Seguidores');

                    const rchA = getPlatformReach(reportA, p);
                    const rchB = getPlatformReach(reportB, p);
                    const rchDelta = calculateDelta(rchB, rchA, 'rch', 'Alcance');

                    return (
                      <tr key={p} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{PLATFORM_NAMES[p]}</td>
                        <td className="p-3">{formatNumber(folA)} → <strong className="text-indigo-900">{formatNumber(folB)}</strong></td>
                        <td className={`p-3 font-bold ${folDelta.iconColor}`}>
                          {folDelta.symbol} {formatPercent(folDelta.diffPercentage)}
                        </td>
                        <td className="p-3">{formatNumber(rchA)} → <strong className="text-indigo-900">{formatNumber(rchB)}</strong></td>
                        <td className={`p-3 font-bold ${rchDelta.iconColor}`}>
                          {rchDelta.symbol} {formatPercent(rchDelta.diffPercentage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
