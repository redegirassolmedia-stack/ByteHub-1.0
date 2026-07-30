import React, { useState, useRef } from 'react';
import { GirassolLogo } from '../GirassolLogo';
import {
  MetricReport,
  PlatformType,
  ReportPeriodType,
  PlatformMetricData,
  EvidenceAttachment
} from '../../types';
import {
  CURRENT_RESPONSIBLE
} from '../../data/initialData';
import {
  PLATFORM_NAMES,
  validateReportData
} from '../../utils/metricsCalculator';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Upload,
  Calendar,
  Share2,
  FileText,
  CheckSquare,
  ShieldCheck,
  Plus,
  Trash2,
  Paperclip,
  File,
  Image as ImageIcon
} from 'lucide-react';

interface NewReportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReport: (report: MetricReport) => void;
}

export const NewReportWizard: React.FC<NewReportWizardProps> = ({
  isOpen,
  onClose,
  onSaveReport
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [reportTitle, setReportTitle] = useState<string>('Relatório de Performance - Agosto 2026');
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [endDate, setEndDate] = useState<string>('2026-08-31');
  const [periodType, setPeriodType] = useState<ReportPeriodType>('mensal');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    'facebook',
    'instagram',
    'tiktok',
    'youtube',
    'linkedin',
    'x'
  ]);

  // Tab for Step 3 platform metrics entry
  const [activePlatformTab, setActivePlatformTab] = useState<PlatformType>('facebook');

  // Metrics Data per platform
  const [metricsData, setMetricsData] = useState<PlatformMetricData>({
    facebook: {
      followersStart: 128400,
      followersEnd: 131500,
      newFollowers: 3900,
      lostFollowers: 800,
      totalReach: 495000,
      organicReach: 400000,
      paidReach: 95000,
      totalImpressions: 850000,
      reactions: 34000,
      comments: 6500,
      shares: 5100,
      clicks: 13000,
      saves: 1500,
      videoViews: 150000,
      videoViews3s: 115000,
      videoViews1m: 38000,
      watchTimeMinutes: 290000,
      postsCount: 45,
      photosCount: 20,
      videosCount: 15,
      reelsCount: 10,
      storiesCount: 70,
      livesCount: 2
    },
    instagram: {
      followersStart: 194500,
      followersEnd: 208000,
      newFollowers: 15200,
      lostFollowers: 1700,
      reachedAccounts: 680000,
      followerReach: 155000,
      nonFollowerReach: 525000,
      impressions: 1250000,
      likes: 95000,
      comments: 12400,
      shares: 21000,
      saves: 17500,
      replies: 4800,
      postsCount: 60,
      carouselsCount: 22,
      reelsCount: 28,
      storiesCount: 150,
      livesCount: 4,
      videoViews: 580000,
      watchTimeMinutes: 740000,
      retentionRate: 51.2
    },
    tiktok: {
      followersStart: 112000,
      followersEnd: 132000,
      newFollowers: 22000,
      videosPublished: 38,
      videoViews: 1450000,
      likes: 165000,
      comments: 21000,
      shares: 32000,
      favorites: 26000,
      totalWatchTimeMinutes: 1100000,
      avgWatchTimeSeconds: 24.5,
      completionRate: 38.5
    },
    youtube: {
      subscribersStart: 68200,
      subscribersEnd: 73500,
      newSubscribers: 5700,
      lostSubscribers: 400,
      views: 420000,
      impressions: 2700000,
      impressionsCtr: 8.9,
      likes: 28000,
      comments: 3800,
      shares: 6200,
      totalWatchTimeHours: 36000,
      avgDurationSeconds: 325,
      avgRetentionRate: 44.5,
      videosPublished: 18,
      shortsPublished: 32,
      livesCount: 5
    },
    linkedin: {
      followersStart: 30400,
      followersEnd: 33200,
      newFollowers: 3100,
      postsCount: 28,
      articlesCount: 5,
      videosCount: 8,
      impressions: 168000,
      reach: 112000,
      reactions: 9200,
      comments: 1800,
      shares: 1100,
      clicks: 5200
    },
    x: {
      followersStart: 42300,
      followersEnd: 43900,
      newFollowers: 1900,
      postsCount: 95,
      impressions: 340000,
      engagementCount: 21000,
      likes: 13800,
      replies: 3100,
      reposts: 2400,
      bookmarks: 1100,
      clicks: 3800
    }
  });

  // Analyst Observations
  const [analystNotes, setAnalystNotes] = useState<Record<string, string>>({
    globalNote: "Excelente progresso global na presença digital com superação de metas no Instagram e TikTok.",
    facebook: "Boa interação no feed e alcance contínuo dos programas gravados.",
    instagram: "Reels continuam a ser a principal fonte de alcance orgânico de não-seguidores.",
    tiktok: "Retenção média elevada devido aos cortes de comédia e bastidores de emissão.",
    youtube: "Shorts garantiram aumento expressivo de inscritos.",
    linkedin: "Forte impacto corporativo das publicações de bastidores.",
    x: "Frequência constante de posts durante as transmissões."
  });

  // Evidences & File Upload
  const [evidences, setEvidences] = useState<EvidenceAttachment[]>([
    {
      id: "ev-new-1",
      platform: "instagram",
      title: "Comprovativo Meta Business Suite - Agosto 2026",
      url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
      uploadedAt: "2026-08-29T10:00:00Z"
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = (e.target?.result as string) || '';
        const newEv: EvidenceAttachment = {
          id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          platform: activePlatformTab || 'instagram',
          title: file.name,
          url: fileUrl,
          uploadedAt: new Date().toISOString()
        };
        setEvidences((prev) => [...prev, newEv]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidences((prev) => prev.filter((ev) => ev.id !== id));
  };

  if (!isOpen) return null;

  const toggleSelectAllPlatforms = () => {
    if (selectedPlatforms.length === 6) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'x']);
    }
  };

  const togglePlatform = (p: PlatformType) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const updateMetricField = (platform: PlatformType, field: string, value: number) => {
    setMetricsData((prev) => ({
      ...prev,
      [platform]: {
        ...(prev[platform] || {}),
        [field]: value
      }
    }));
  };

  // Validation
  const validation = validateReportData({
    title: reportTitle,
    startDate,
    endDate,
    platforms: selectedPlatforms,
    metrics: metricsData
  });

  const handleFinish = () => {
    const finalReport: MetricReport = {
      id: `rep-${Date.now()}`,
      title: reportTitle,
      startDate,
      endDate,
      periodType,
      platforms: selectedPlatforms,
      metrics: metricsData,
      analystObservations: analystNotes as any,
      evidenceAttachments: evidences,
      responsible: CURRENT_RESPONSIBLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: validation.status,
      validationDetails: {
        isComplete: validation.isComplete,
        missingFields: validation.missingFields,
        warnings: validation.warnings
      }
    };

    onSaveReport(finalReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-xl flex items-center justify-center shrink-0">
              <GirassolLogo className="h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  LANÇAMENTO DE MÉTRICAS POR PLATAFORMA SOCIAL
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  Etapa {currentStep}/5
                </span>
              </div>
              <p className="text-xs text-amber-400">
                Relatório Oficial de Desempenho — Rede Girassol • Coordenador: {CURRENT_RESPONSIBLE.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3">
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
            {[
              { num: 1, label: '1. Período' },
              { num: 2, label: '2. Plataformas' },
              { num: 3, label: '3. Inserção Dados' },
              { num: 4, label: '4. Análise & Provas' },
              { num: 5, label: '5. Validação' }
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`py-1.5 px-2 rounded-lg transition-all text-ellipsis overflow-hidden whitespace-nowrap ${
                  currentStep === step.num
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                    : currentStep > step.num
                    ? 'bg-emerald-100 text-emerald-800 font-semibold'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ETAPA 1 — PERÍODO */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>ETAPA 1 — Identificação e Período do Relatório</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Defina o nome do relatório, datas de início e fim e a periodicidade de análise.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome do Relatório *
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Relatório Mensal - Agosto 2026"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Data Inicial *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Data Final *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tipo / Periodicidade do Relatório
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'semanal', label: 'Semanal' },
                      { id: 'quinzenal', label: 'Quinzenal' },
                      { id: 'mensal', label: 'Mensal' },
                      { id: 'trimestral', label: 'Trimestral' },
                      { id: 'personalizado', label: 'Personalizado' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPeriodType(type.id as ReportPeriodType)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                          periodType === type.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2 — PLATAFORMAS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-600" />
                    <span>ETAPA 2 — Seleção de Plataformas Digitais</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Selecione quais plataformas serão analisadas neste relatório.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleSelectAllPlatforms}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  {selectedPlatforms.length === 6 ? 'Desmarcar Todas' : '☑ Seleccionar Todas'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'facebook', name: 'Facebook', desc: 'Página oficial e vídeos em direto' },
                  { id: 'instagram', name: 'Instagram', desc: 'Feed, Reels, Stories e Carrosséis' },
                  { id: 'tiktok', name: 'TikTok', desc: 'Vídeos curtos de entretenimento' },
                  { id: 'youtube', name: 'YouTube', desc: 'Canal, Shorts e Transmissões Ao Vivo' },
                  { id: 'linkedin', name: 'LinkedIn', desc: 'Página Institucional e Artigos' },
                  { id: 'x', name: 'X / Twitter', desc: 'Actualizações em tempo real e notícias' }
                ].map((item) => {
                  const isChecked = selectedPlatforms.includes(item.id as PlatformType);
                  return (
                    <div
                      key={item.id}
                      onClick={() => togglePlatform(item.id as PlatformType)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 3 — INSERÇÃO MANUAL DOS DADOS */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>ETAPA 3 — Inserção Manual de Métricas por Plataforma</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Preencha os dados recolhidos pela coordenação de Redes Sociais através dos relatórios oficiais (Analytics/Insights).
                </p>
              </div>

              {/* Platform Tabs */}
              <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                {selectedPlatforms.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivePlatformTab(p)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg border whitespace-nowrap transition-all ${
                      activePlatformTab === p
                        ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {PLATFORM_NAMES[p]}
                  </button>
                ))}
              </div>

              {/* FACEBOOK FORM */}
              {activePlatformTab === 'facebook' && selectedPlatforms.includes('facebook') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                    Métricas de Facebook
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Início</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.followersStart || ''}
                        onChange={(e) => updateMetricField('facebook', 'followersStart', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Fim</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.followersEnd || ''}
                        onChange={(e) => updateMetricField('facebook', 'followersEnd', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Novos Seguidores</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.newFollowers || ''}
                        onChange={(e) => updateMetricField('facebook', 'newFollowers', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Perdidos</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.lostFollowers || ''}
                        onChange={(e) => updateMetricField('facebook', 'lostFollowers', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Alcance Total</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.totalReach || ''}
                        onChange={(e) => updateMetricField('facebook', 'totalReach', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Alcance Orgânico</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.organicReach || ''}
                        onChange={(e) => updateMetricField('facebook', 'organicReach', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Impressões Totais</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.totalImpressions || ''}
                        onChange={(e) => updateMetricField('facebook', 'totalImpressions', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Reacções</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.reactions || ''}
                        onChange={(e) => updateMetricField('facebook', 'reactions', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Comentários</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.comments || ''}
                        onChange={(e) => updateMetricField('facebook', 'comments', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Partilhas</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.shares || ''}
                        onChange={(e) => updateMetricField('facebook', 'shares', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Cliques</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.clicks || ''}
                        onChange={(e) => updateMetricField('facebook', 'clicks', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Visualizações Vídeo</label>
                      <input
                        type="number"
                        value={metricsData.facebook?.videoViews || ''}
                        onChange={(e) => updateMetricField('facebook', 'videoViews', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INSTAGRAM FORM */}
              {activePlatformTab === 'instagram' && selectedPlatforms.includes('instagram') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                    Métricas de Instagram
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Início</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.followersStart || ''}
                        onChange={(e) => updateMetricField('instagram', 'followersStart', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Fim</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.followersEnd || ''}
                        onChange={(e) => updateMetricField('instagram', 'followersEnd', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Contas Alcançadas</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.reachedAccounts || ''}
                        onChange={(e) => updateMetricField('instagram', 'reachedAccounts', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Alcance Não-Seguidores</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.nonFollowerReach || ''}
                        onChange={(e) => updateMetricField('instagram', 'nonFollowerReach', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Gostos (Likes)</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.likes || ''}
                        onChange={(e) => updateMetricField('instagram', 'likes', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Comentários</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.comments || ''}
                        onChange={(e) => updateMetricField('instagram', 'comments', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Partilhas</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.shares || ''}
                        onChange={(e) => updateMetricField('instagram', 'shares', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Guardados</label>
                      <input
                        type="number"
                        value={metricsData.instagram?.saves || ''}
                        onChange={(e) => updateMetricField('instagram', 'saves', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TIKTOK FORM */}
              {activePlatformTab === 'tiktok' && selectedPlatforms.includes('tiktok') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                    Métricas de TikTok
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Início</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.followersStart || ''}
                        onChange={(e) => updateMetricField('tiktok', 'followersStart', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Fim</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.followersEnd || ''}
                        onChange={(e) => updateMetricField('tiktok', 'followersEnd', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Vídeos Publicados</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.videosPublished || ''}
                        onChange={(e) => updateMetricField('tiktok', 'videosPublished', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Visualizações</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.videoViews || ''}
                        onChange={(e) => updateMetricField('tiktok', 'videoViews', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Gostos</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.likes || ''}
                        onChange={(e) => updateMetricField('tiktok', 'likes', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Comentários</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.comments || ''}
                        onChange={(e) => updateMetricField('tiktok', 'comments', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Partilhas</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.shares || ''}
                        onChange={(e) => updateMetricField('tiktok', 'shares', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Favoritos</label>
                      <input
                        type="number"
                        value={metricsData.tiktok?.favorites || ''}
                        onChange={(e) => updateMetricField('tiktok', 'favorites', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* YOUTUBE FORM */}
              {activePlatformTab === 'youtube' && selectedPlatforms.includes('youtube') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                    Métricas de YouTube
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Inscritos Início</label>
                      <input
                        type="number"
                        value={metricsData.youtube?.subscribersStart || ''}
                        onChange={(e) => updateMetricField('youtube', 'subscribersStart', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Inscritos Fim</label>
                      <input
                        type="number"
                        value={metricsData.youtube?.subscribersEnd || ''}
                        onChange={(e) => updateMetricField('youtube', 'subscribersEnd', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Visualizações</label>
                      <input
                        type="number"
                        value={metricsData.youtube?.views || ''}
                        onChange={(e) => updateMetricField('youtube', 'views', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">CTR Impressões (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={metricsData.youtube?.impressionsCtr || ''}
                        onChange={(e) => updateMetricField('youtube', 'impressionsCtr', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* LINKEDIN FORM */}
              {activePlatformTab === 'linkedin' && selectedPlatforms.includes('linkedin') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                    Métricas de LinkedIn
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Início</label>
                      <input
                        type="number"
                        value={metricsData.linkedin?.followersStart || ''}
                        onChange={(e) => updateMetricField('linkedin', 'followersStart', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Fim</label>
                      <input
                        type="number"
                        value={metricsData.linkedin?.followersEnd || ''}
                        onChange={(e) => updateMetricField('linkedin', 'followersEnd', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Impressões</label>
                      <input
                        type="number"
                        value={metricsData.linkedin?.impressions || ''}
                        onChange={(e) => updateMetricField('linkedin', 'impressions', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Reacções</label>
                      <input
                        type="number"
                        value={metricsData.linkedin?.reactions || ''}
                        onChange={(e) => updateMetricField('linkedin', 'reactions', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* X / TWITTER FORM */}
              {activePlatformTab === 'x' && selectedPlatforms.includes('x') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                    Métricas de X / Twitter
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Início</label>
                      <input
                        type="number"
                        value={metricsData.x?.followersStart || ''}
                        onChange={(e) => updateMetricField('x', 'followersStart', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Seguidores Fim</label>
                      <input
                        type="number"
                        value={metricsData.x?.followersEnd || ''}
                        onChange={(e) => updateMetricField('x', 'followersEnd', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Impressões</label>
                      <input
                        type="number"
                        value={metricsData.x?.impressions || ''}
                        onChange={(e) => updateMetricField('x', 'impressions', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Engagement Count</label>
                      <input
                        type="number"
                        value={metricsData.x?.engagementCount || ''}
                        onChange={(e) => updateMetricField('x', 'engagementCount', Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 4 — OBSERVAÇÕES & EVIDÊNCIAS */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                  <span>ETAPA 4 — Observações da Coordenação & Comprovativos</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Adicione notas qualitativas da coordenação (Ivan Lima / Equipa de Redes Sociais) e faça upload de capturas de ecrã (Analytics/Insights).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nota Geral Executiva (Aparece no Resumo Executivo)
                  </label>
                  <textarea
                    rows={3}
                    value={analystNotes.globalNote || ''}
                    onChange={(e) => setAnalystNotes({ ...analystNotes, globalNote: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                    placeholder="Resumo geral das conquistas e destaques do período..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Comprovativos & Capturas de Ecrã (Evidence Screenshots)
                  </label>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Drag and Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-indigo-300 hover:border-amber-400 rounded-2xl p-6 text-center bg-indigo-50/40 hover:bg-indigo-50/80 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-indigo-700 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center mx-auto transition-colors shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 group-hover:text-indigo-900">
                        Clique aqui para Escolher Ficheiro ou Arraste o Comprovativo
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Formatos aceites: PNG, JPG, WEBP ou PDF (Analytics Meta, YouTube Studio, TikTok, etc.)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-1.5 bg-slate-900 text-amber-400 hover:bg-slate-800 text-[11px] font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>ANEXAR SCREENSHOT</span>
                    </button>
                  </div>

                  {/* Attached Evidences List */}
                  {evidences.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 block">
                        Ficheiros Anexados ({evidences.length}):
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {evidences.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs hover:border-slate-300"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              {ev.url.startsWith('data:image') || ev.url.startsWith('http') ? (
                                <img
                                  src={ev.url}
                                  alt={ev.title}
                                  className="w-10 h-10 rounded-lg object-cover border shrink-0 bg-slate-100"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                                  <File className="w-5 h-5" />
                                </div>
                              )}
                              <div className="truncate">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                                    {ev.platform}
                                  </span>
                                  <span className="font-bold text-slate-800 truncate">{ev.title}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  Anexado a {new Date(ev.uploadedAt).toLocaleDateString('pt-PT')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0">
                              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                Anexado
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveEvidence(ev.id)}
                                title="Remover Ficheiro"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 5 — VALIDAÇÃO E CONCLUSÃO */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>ETAPA 5 — Validação Prévia e Finalização</span>
                </h4>
                <p className="text-xs text-slate-500">
                  O sistema analisa a integridade dos dados introduzidos antes da criação definitiva do relatório.
                </p>
              </div>

              {/* Validation Card */}
              <div
                className={`p-5 rounded-xl border-2 ${
                  validation.status === 'completo'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : validation.status === 'parcial'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-rose-500 bg-rose-50/50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  {validation.status === 'completo' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  )}
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">
                      Estado da Validação: {' '}
                      <span className="uppercase">
                        {validation.status === 'completo'
                          ? '🟢 COMPLETO'
                          : validation.status === 'parcial'
                          ? '🟡 PARCIAL (Atenção)'
                          : '🔴 DADOS EM FALTA'}
                      </span>
                    </h5>
                    <p className="text-xs text-slate-600">
                      {validation.status === 'completo'
                        ? 'Todos os campos obrigatórios e plataformas seleccionadas possuem dados válidos!'
                        : 'Algumas plataformas possuem dados parciais. Pode avançar e complementar mais tarde.'}
                    </p>
                  </div>
                </div>

                {validation.missingFields.length > 0 && (
                  <div className="mt-3 bg-white p-3 rounded-lg border border-rose-200 text-xs text-rose-800">
                    <strong>Campos em Falta:</strong> {validation.missingFields.join(', ')}
                  </div>
                )}
              </div>

              {/* Summary of Report */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 uppercase border-b pb-1">Resumo do Novo Relatório</div>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Título:</strong> {reportTitle}</div>
                  <div><strong>Período:</strong> {startDate} a {endDate} ({periodType})</div>
                  <div><strong>Plataformas ({selectedPlatforms.length}):</strong> {selectedPlatforms.map(p => PLATFORM_NAMES[p]).join(', ')}</div>
                  <div><strong>Responsável:</strong> {CURRENT_RESPONSIBLE.name}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Seguinte</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>CRIAR E GUARDAR RELATÓRIO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
