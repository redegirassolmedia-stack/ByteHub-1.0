import React, { useState } from 'react';
import { MetricReport, PlatformType } from '../../types';
import {
  PLATFORM_NAMES,
  PLATFORM_COLORS,
  getPlatformSummary,
  getPlatformFollowers,
  getPlatformReach,
  getPlatformEngagement,
  getPlatformPublications
} from '../../utils/metricsCalculator';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Layers, History, HelpCircle } from 'lucide-react';

interface MetricsChartsProps {
  currentReport: MetricReport;
  previousReport?: MetricReport;
}

export const MetricsCharts: React.FC<MetricsChartsProps> = ({
  currentReport,
  previousReport
}) => {
  const [activeTab, setActiveTab] = useState<'comparativo' | 'historico' | 'conteudos'>('comparativo');

  const summary = getPlatformSummary(currentReport, previousReport);

  // Data for Chart 1, 2, 3: Followers, Reach, Engagement by platform
  const platformChartData = summary.map((row) => ({
    name: row.platformName,
    followers: row.followers,
    growth: row.followersGrowth,
    reach: row.reach,
    engagement: row.engagement,
    publications: row.publications,
    color: PLATFORM_COLORS[row.platform]
  }));

  // Data for Chart 4: Current vs Previous period
  const comparisonData = summary.map((row) => {
    const prevReach = previousReport ? getPlatformReach(previousReport, row.platform) : row.reach * 0.88;
    const prevEng = previousReport ? getPlatformEngagement(previousReport, row.platform) : row.engagement * 0.85;
    return {
      name: row.platformName,
      'Alcance Actual': row.reach,
      'Alcance Anterior': Math.round(prevReach),
      'Engagement Actual': row.engagement,
      'Engagement Anterior': Math.round(prevEng)
    };
  });

  // Data for Chart 5: Content publication types distribution
  const contentDistribution = summary.map((row) => ({
    name: row.platformName,
    value: row.publications,
    color: PLATFORM_COLORS[row.platform]
  }));

  // Historical evolution data (Jan to Jul 2026 simulated trend)
  const historicalEvolutionData = [
    { mes: 'Jan', Facebook: 110000, Instagram: 140000, TikTok: 60000, YouTube: 50000, LinkedIn: 20000, X: 35000 },
    { mes: 'Fev', Facebook: 112000, Instagram: 148000, TikTok: 68000, YouTube: 52000, LinkedIn: 21500, X: 36200 },
    { mes: 'Mar', Facebook: 115000, Instagram: 156000, TikTok: 74000, YouTube: 55000, LinkedIn: 23000, X: 37500 },
    { mes: 'Abr', Facebook: 118000, Instagram: 164000, TikTok: 80000, YouTube: 58000, LinkedIn: 24500, X: 38800 },
    { mes: 'Mai', Facebook: 120000, Instagram: 172000, TikTok: 88000, YouTube: 61000, LinkedIn: 26000, X: 40000 },
    { mes: 'Jun', Facebook: 125000, Instagram: 182000, TikTok: 95000, YouTube: 64000, LinkedIn: 28000, X: 41000 },
    { mes: 'Jul', Facebook: 128400, Instagram: 194500, TikTok: 112000, YouTube: 68200, LinkedIn: 30400, X: 42300 }
  ];

  const historicalReachData = [
    { mes: 'Jan', TotalAlcance: 1200000, TotalEngagement: 140000 },
    { mes: 'Fev', TotalAlcance: 1350000, TotalEngagement: 165000 },
    { mes: 'Mar', TotalAlcance: 1480000, TotalEngagement: 190000 },
    { mes: 'Abr', TotalAlcance: 1620000, TotalEngagement: 210000 },
    { mes: 'Mai', TotalAlcance: 1750000, TotalEngagement: 235000 },
    { mes: 'Jun', TotalAlcance: 1950000, TotalEngagement: 265000 },
    { mes: 'Jul', TotalAlcance: 2315000, TotalEngagement: 312000 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-6">
      {/* Header and selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Painel Visual de Gráficos de Performance</span>
          </h3>
          <p className="text-xs text-slate-500">
            Análise gráfica comparativa das métricas principais por canal e evolução temporal
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('comparativo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'comparativo'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por Plataforma
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'historico'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Evolução Histórica
          </button>
          <button
            onClick={() => setActiveTab('conteudos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'conteudos'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Conteúdos Publicados
          </button>
        </div>
      </div>

      {/* TAB 1: COMPARATIVO POR PLATAFORMA */}
      {activeTab === 'comparativo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Crescimento de Seguidores por Plataforma */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráfico 1 — Crescimento Absoluto de Seguidores
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [new Intl.NumberFormat('pt-PT').format(val), 'Novos Seguidores']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                    {platformChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Alcance por Plataforma */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráfico 2 — Alcance Total / Visualizações por Plataforma
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [new Intl.NumberFormat('pt-PT').format(val), 'Alcance']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="reach" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 3: Engagement por Plataforma */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráfico 3 — Engagement Total (Interacções) por Plataforma
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [new Intl.NumberFormat('pt-PT').format(val), 'Interacções']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="engagement" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 4: Comparação entre Período Actual e Anterior */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráfico 4 — Período Actual VS Período Anterior (Alcance)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Alcance Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Alcance Anterior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVOLUÇÃO HISTÓRICA */}
      {activeTab === 'historico' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 6: Evolução histórica dos seguidores */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 lg:col-span-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráfico 6 — Evolução Histórica dos Seguidores (Jan - Jul 2026)
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalEvolutionData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Facebook" stroke={PLATFORM_COLORS.facebook} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Instagram" stroke={PLATFORM_COLORS.instagram} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="TikTok" stroke={PLATFORM_COLORS.tiktok} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="YouTube" stroke={PLATFORM_COLORS.youtube} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="LinkedIn" stroke={PLATFORM_COLORS.linkedin} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="X" stroke={PLATFORM_COLORS.x} strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 7 & 8: Evolução do Alcance e Engagement Global */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 lg:col-span-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráficos 7 & 8 — Tendência Global de Alcance e Engagement (Rede Digital)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalReachData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="TotalAlcance" name="Alcance Total Digital" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="TotalEngagement" name="Engagement Total" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTEÚDOS PUBLICADOS */}
      {activeTab === 'conteudos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico 5: Quantidade de conteúdos publicados por plataforma */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Gráfico 5 — Produção de Conteúdos por Plataforma
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => [val, 'Publicações']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="publications" fill="#0284c7" radius={[4, 4, 0, 0]}>
                    {platformChartData.map((entry, index) => (
                      <Cell key={`pub-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Distribuição Relativa de Publicações (%)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {contentDistribution.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
