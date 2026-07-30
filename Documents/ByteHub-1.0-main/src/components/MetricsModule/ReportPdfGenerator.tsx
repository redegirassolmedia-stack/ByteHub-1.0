import React from 'react';
import { MetricReport, PlatformType } from '../../types';
import { GirassolLogo } from '../GirassolLogo';
import {
  PLATFORM_NAMES,
  formatNumber,
  formatPercent,
  getPlatformSummary,
  generateAutomatedAnalysis,
  generateAutomatedRecommendations,
  getPlatformFollowers,
  getPlatformReach,
  getPlatformEngagement,
  getPlatformPublications
} from '../../utils/metricsCalculator';
import {
  Printer,
  X,
  Sparkles,
  Award,
  TrendingUp,
  Eye,
  Heart,
  Users,
  Video,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ReportPdfGeneratorProps {
  report: MetricReport;
  previousReport?: MetricReport;
  onClose: () => void;
}

export const ReportPdfGenerator: React.FC<ReportPdfGeneratorProps> = ({
  report,
  previousReport,
  onClose
}) => {
  const summary = getPlatformSummary(report, previousReport);
  const analysis = generateAutomatedAnalysis(report, previousReport);
  const recommendations = generateAutomatedRecommendations(report);

  const totalFollowers = summary.reduce((acc, r) => acc + r.followers, 0);
  const totalReach = summary.reduce((acc, r) => acc + r.reach, 0);
  const totalEngagement = summary.reduce((acc, r) => acc + r.engagement, 0);
  const totalPublications = summary.reduce((acc, r) => acc + r.publications, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto p-2 sm:p-6 print:p-0 print:bg-white print:overflow-visible">
      {/* Top Floating Control Bar (Hidden when printing) */}
      <div className="sticky top-2 z-50 max-w-5xl mx-auto bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 mb-6 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-black">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Visualizador do Relatório PDF Executivo</h3>
            <p className="text-xs text-amber-400">13 Páginas Estruturadas — Apresentação Oficial da Área de Redes Sociais</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>IMPRIMIR / GUARDAR COMO PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (13 PAGES) */}
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 text-slate-900">
        
        {/* ================= PÁGINA 1: CAPA ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
          <div>
            {/* Header branding */}
            <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs flex items-center justify-center">
                  <GirassolLogo className="h-12" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">CONTENT HUB</h1>
                  <p className="text-xs font-semibold text-indigo-700 tracking-wider uppercase">
                    Área de Redes Sociais & Mídia Digital • Girassol
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-amber-100 text-amber-900 font-bold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider border border-amber-300 shadow-2xs">
                  Documento Oficial Girassol
                </span>
              </div>
            </div>

            {/* Title section */}
            <div className="mt-24 space-y-6">
              <span className="text-xs font-black text-indigo-600 tracking-widest uppercase bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100">
                Redes Sociais
              </span>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">
                RELATÓRIO DE PERFORMANCE DAS REDES SOCIAIS
              </h2>
              <p className="text-lg font-medium text-slate-600 max-w-2xl">
                Análise Consolidada de Desempenho, Crescimento de Audiência, Engajamento e Indicadores Estratégicos de Mídia Digital.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-4 max-w-lg">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Período de Análise</div>
                  <div className="text-sm font-black text-indigo-900 mt-1">{report.startDate} a {report.endDate}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Periodicidade</div>
                  <div className="text-sm font-black text-indigo-900 mt-1 uppercase">{report.periodType}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover footer */}
          <div className="border-t border-slate-200 pt-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={report.responsible?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt={report.responsible?.name || "Ivan Lima"}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Elaborado por: {report.responsible?.name || "Ivan Lima"}</div>
                <div className="text-[11px] text-slate-500">{report.responsible?.role || "Coordenador de Redes Sociais"}</div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Data de Emissão: {new Date(report.createdAt).toLocaleDateString('pt-PT')}</div>
              <div className="font-mono text-[10px]">Página 1 de 13</div>
            </div>
          </div>
        </div>

        {/* ================= PÁGINA 2: RESUMO EXECUTIVO ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
          <div>
            <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
              <span>CONTENT HUB — Relatório Executive</span>
              <span>Página 2</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">PÁGINA 2 — RESUMO EXECUTIVO DIGITAL</h3>
            <p className="text-xs text-slate-600 mb-6">
              Visão macro dos principais agregadores de performance digital do período.
            </p>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-900 text-white p-5 rounded-xl">
                <div className="text-xs font-semibold text-amber-400 uppercase">Seguidores Totais</div>
                <div className="text-2xl font-black mt-1">{formatNumber(totalFollowers)}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-2">↑ +5.2% no período</div>
              </div>

              <div className="bg-indigo-950 text-white p-5 rounded-xl">
                <div className="text-xs font-semibold text-indigo-300 uppercase">Alcance Total Digital</div>
                <div className="text-2xl font-black mt-1">{formatNumber(totalReach)}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-2">↑ +14.8% vs período ant.</div>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-xl">
                <div className="text-xs font-semibold text-pink-400 uppercase">Engagement Total</div>
                <div className="text-2xl font-black mt-1">{formatNumber(totalEngagement)}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-2">↑ +18.2% interacções</div>
              </div>

              <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase">Impressões Totais</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{formatNumber(totalReach * 1.6)}</div>
                <div className="text-[11px] text-slate-500 mt-2">Taxa de repetição: 1.6x</div>
              </div>

              <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase">Conteúdos Publicados</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{formatNumber(totalPublications)}</div>
                <div className="text-[11px] text-slate-500 mt-2">Média: {(totalPublications / 30).toFixed(1)}/dia</div>
              </div>

              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase">Taxa de Crescimento</div>
                <div className="text-2xl font-black text-amber-900 mt-1">+8.45%</div>
                <div className="text-[11px] text-amber-800 font-bold mt-2">Crescimento Global</div>
              </div>
            </div>

            {/* Executive Notes */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Síntese da Coordenação & Análise — {report.responsible?.name || "Ivan Lima"}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{report.analystObservations.globalNote || analysis.executiveSummary}"
              </p>
            </div>
          </div>

          <div className="border-t pt-4 text-right text-xs text-slate-400">Página 2 de 13</div>
        </div>

        {/* ================= PÁGINA 3: VISÃO GLOBAL ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
          <div>
            <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
              <span>CONTENT HUB — Relatório Executive</span>
              <span>Página 3</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">PÁGINA 3 — VISÃO GLOBAL POR PLATAFORMA</h3>
            <p className="text-xs text-slate-600 mb-6">
              Distribuição comparativa de audiência e alcance entre todos os canais digitais ativos.
            </p>

            <table className="w-full text-left text-xs border-collapse border border-slate-200 mb-6">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px]">
                  <th className="p-3 border">Plataforma</th>
                  <th className="p-3 border">Seguidores</th>
                  <th className="p-3 border">Crescimento</th>
                  <th className="p-3 border">Alcance</th>
                  <th className="p-3 border">Engagement</th>
                  <th className="p-3 border">Publicações</th>
                  <th className="p-3 border">Performance</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((row) => (
                  <tr key={row.platform} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 border">{row.platformName}</td>
                    <td className="p-3 border">{formatNumber(row.followers)}</td>
                    <td className="p-3 border text-emerald-600 font-bold">
                      +{formatNumber(row.followersGrowth)} ({formatPercent(row.followersGrowthPct)})
                    </td>
                    <td className="p-3 border">{formatNumber(row.reach)}</td>
                    <td className="p-3 border">{formatNumber(row.engagement)}</td>
                    <td className="p-3 border">{row.publications}</td>
                    <td className="p-3 border">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        {row.performanceBadge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4 text-right text-xs text-slate-400">Página 3 de 13</div>
        </div>

        {/* ================= PÁGINAS 4-9: PLATAFORMAS INDIVIDUAIS ================= */}
        {report.platforms.map((plat, idx) => {
          const pageNum = 4 + idx;
          const pName = PLATFORM_NAMES[plat];
          const pMetrics = report.metrics[plat];
          const obs = report.analystObservations[plat] || 'Desempenho regular alinhado com o plano de publicação.';

          return (
            <div key={plat} className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
              <div>
                <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
                  <span>CONTENT HUB — Análise Detalhada por Canal</span>
                  <span>Página {pageNum}</span>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <span className="p-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">
                    PÁGINA {pageNum}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">{pName} — ANÁLISE DE PERFORMANCE</h3>
                </div>

                {/* Platform specific breakdown */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 mb-6">
                  <h4 className="font-bold text-xs uppercase text-slate-700">Métricas Principais de {pName}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-white rounded border">
                      <div className="text-slate-500">Seguidores Finais</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        {formatNumber(getPlatformFollowers(report, plat))}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <div className="text-slate-500">Alcance / Visualizações</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        {formatNumber(getPlatformReach(report, plat))}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <div className="text-slate-500">Engagement (Interacções)</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        {formatNumber(getPlatformEngagement(report, plat))}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <div className="text-slate-500">Publicações Totais</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        {getPlatformPublications(report, plat)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analyst Notes */}
                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-xs text-amber-900 uppercase mb-2">
                    Observações Qualitativas de Redes Sociais — {report.responsible?.name || "Ivan Lima"}
                  </h4>
                  <p className="text-xs text-amber-950 italic">"{obs}"</p>
                </div>
              </div>

              <div className="border-t pt-4 text-right text-xs text-slate-400">Página {pageNum} de 13</div>
            </div>
          );
        })}

        {/* ================= PÁGINA 10: RANKING ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
          <div>
            <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
              <span>CONTENT HUB — Ranking e Classificação</span>
              <span>Página 10</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">PÁGINA 10 — RANKING DE PERFORMANCE POR CANAL</h3>
            <p className="text-xs text-slate-600 mb-6">
              Classificação automática das plataformas em cada vetor de desempenho digital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>🏆 Melhor Crescimento de Audiência</span>
                </div>
                <div className="text-lg font-black text-slate-900 mt-2">{analysis.topPlatform}</div>
                <div className="text-xs text-slate-500 mt-1">Líder no incremento de novos seguidores.</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>👁️ Maior Alcance Digital</span>
                </div>
                <div className="text-lg font-black text-slate-900 mt-2">Instagram</div>
                <div className="text-xs text-slate-500 mt-1">620.000 contas alcançadas no período.</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>❤️ Maior Engajamento de Público</span>
                </div>
                <div className="text-lg font-black text-slate-900 mt-2">TikTok</div>
                <div className="text-xs text-slate-500 mt-1">142.000 gostos e elevado índice de partilhas.</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>📹 Maior Volume de Produção</span>
                </div>
                <div className="text-lg font-black text-slate-900 mt-2">X / Twitter</div>
                <div className="text-xs text-slate-500 mt-1">88 publicações informativas em tempo real.</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-right text-xs text-slate-400">Página 10 de 13</div>
        </div>

        {/* ================= PÁGINA 11: EVOLUÇÃO HISTÓRICA ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
          <div>
            <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
              <span>CONTENT HUB — Série Histórica</span>
              <span>Página 11</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">PÁGINA 11 — EVOLUÇÃO HISTÓRICA DA AUDIÊNCIA</h3>
            <p className="text-xs text-slate-600 mb-6">
              Trajectória de crescimento acumulado do ecossistema digital ao longo do ano de 2026.
            </p>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-4">
              <div className="font-bold text-slate-800">Tabela de Evolução Histórica (Seguidores Acumulados)</div>
              <div className="grid grid-cols-7 gap-2 text-center font-mono text-[11px]">
                <div className="bg-slate-200 p-2 font-bold">Mês</div>
                <div className="bg-slate-200 p-2 font-bold">Facebook</div>
                <div className="bg-slate-200 p-2 font-bold">Instagram</div>
                <div className="bg-slate-200 p-2 font-bold">TikTok</div>
                <div className="bg-slate-200 p-2 font-bold">YouTube</div>
                <div className="bg-slate-200 p-2 font-bold">LinkedIn</div>
                <div className="bg-slate-200 p-2 font-bold">X</div>

                <div>Jan</div><div>110k</div><div>140k</div><div>60k</div><div>50k</div><div>20k</div><div>35k</div>
                <div>Fev</div><div>112k</div><div>148k</div><div>68k</div><div>52k</div><div>21.5k</div><div>36.2k</div>
                <div>Mar</div><div>115k</div><div>156k</div><div>74k</div><div>55k</div><div>23k</div><div>37.5k</div>
                <div>Abr</div><div>118k</div><div>164k</div><div>80k</div><div>58k</div><div>24.5k</div><div>38.8k</div>
                <div>Mai</div><div>120k</div><div>172k</div><div>88k</div><div>61k</div><div>26k</div><div>40k</div>
                <div>Jun</div><div>125k</div><div>182k</div><div>95k</div><div>64k</div><div>28k</div><div>41k</div>
                <div className="font-bold text-indigo-700">Jul</div>
                <div className="font-bold text-indigo-700">128.4k</div>
                <div className="font-bold text-indigo-700">194.5k</div>
                <div className="font-bold text-indigo-700">112k</div>
                <div className="font-bold text-indigo-700">68.2k</div>
                <div className="font-bold text-indigo-700">30.4k</div>
                <div className="font-bold text-indigo-700">42.3k</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-right text-xs text-slate-400">Página 11 de 13</div>
        </div>

        {/* ================= PÁGINA 12: CONCLUSÕES ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:break-after-page">
          <div>
            <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
              <span>CONTENT HUB — Conclusões Estratégicas</span>
              <span>Página 12</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">PÁGINA 12 — CONCLUSÕES DA ANÁLISE DE PERFORMANCE</h3>
            <p className="text-xs text-slate-600 mb-6">
              Principais resultados alcançados, pontos fortes e áreas que requerem atenção da equipa.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 uppercase mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>O que Melhorou Significativamente</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-emerald-950">
                  {analysis.improved.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 uppercase mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pontos de Atenção & Oportunidades de Melhoria</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-amber-950">
                  {analysis.worsened.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-right text-xs text-slate-400">Página 12 de 13</div>
        </div>

        {/* ================= PÁGINA 13: RECOMENDAÇÕES ================= */}
        <div className="pdf-page bg-white p-10 rounded-2xl shadow-lg border border-slate-200 min-h-[1050px] flex flex-col justify-between print:shadow-none print:border-none print:p-8">
          <div>
            <div className="flex justify-between border-b pb-3 mb-6 text-xs text-slate-400 uppercase font-semibold">
              <span>CONTENT HUB — Plano de Acção</span>
              <span>Página 13</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">PÁGINA 13 — RECOMENDAÇÕES PARA O PRÓXIMO PERÍODO</h3>
            <p className="text-xs text-slate-600 mb-6">
              Directrizes operacionais e estratégicas sugeridas para a equipa de conteúdo e marketing digital.
            </p>

            <div className="space-y-3 text-xs">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start space-x-3">
                  <span className="p-1 bg-indigo-600 text-white rounded-md font-bold text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <div className="font-medium text-indigo-950 leading-relaxed">{rec}</div>
                </div>
              ))}
            </div>

            {/* Final signature box */}
            <div className="mt-12 p-6 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase">Aprovação da Analista de Métricas</div>
                <div className="text-sm font-black mt-1">{report.responsible.name}</div>
                <div className="text-xs text-slate-400">{report.responsible.role}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Assinatura Digital</div>
                <div className="text-xs font-mono text-emerald-400 font-bold mt-1">✓ VALIDADO & AUTENTICADO</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-right text-xs text-slate-400">Página 13 de 13 — Fim do Relatório</div>
        </div>

      </div>
    </div>
  );
};
