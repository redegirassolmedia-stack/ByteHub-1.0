/**
 * Content Hub - Core Types & Metric Interfaces
 */

export type TaskStatus = 'Pendente' | 'Em Progresso' | 'Pendente Aprovação' | 'Concluído';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tag: string;
  description?: string;
  section?: MainNavSection;
  createdAt: string;
}

export type PlatformType = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'x';

export type ReportPeriodType = 'semanal' | 'quinzenal' | 'mensal' | 'trimestral' | 'personalizado';

export type ReportStatus = 'completo' | 'parcial' | 'dados_em_falta' | 'rascunho' | 'arquivado';

// Facebook Specific Metrics
export interface FacebookMetrics {
  followersStart: number;
  followersEnd: number;
  newFollowers: number;
  lostFollowers: number;
  totalReach: number;
  organicReach: number;
  paidReach: number;
  totalImpressions: number;
  reactions: number;
  comments: number;
  shares: number;
  clicks: number;
  saves?: number;
  videoViews: number;
  videoViews3s: number;
  videoViews1m?: number;
  watchTimeMinutes: number;
  postsCount: number;
  photosCount: number;
  videosCount: number;
  reelsCount: number;
  storiesCount: number;
  livesCount: number;
}

// Instagram Specific Metrics
export interface InstagramMetrics {
  followersStart: number;
  followersEnd: number;
  newFollowers: number;
  lostFollowers: number;
  reachedAccounts: number;
  followerReach: number;
  nonFollowerReach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  replies: number;
  postsCount: number;
  carouselsCount: number;
  reelsCount: number;
  storiesCount: number;
  livesCount: number;
  videoViews: number;
  watchTimeMinutes: number;
  retentionRate?: number; // %
}

// TikTok Specific Metrics
export interface TikTokMetrics {
  followersStart: number;
  followersEnd: number;
  newFollowers: number;
  videosPublished: number;
  videoViews: number;
  likes: number;
  comments: number;
  shares: number;
  favorites: number;
  totalWatchTimeMinutes: number;
  avgWatchTimeSeconds: number;
  completionRate?: number; // %
}

// YouTube Specific Metrics
export interface YouTubeMetrics {
  subscribersStart: number;
  subscribersEnd: number;
  newSubscribers: number;
  lostSubscribers: number;
  views: number;
  impressions: number;
  impressionsCtr: number; // %
  likes: number;
  comments: number;
  shares: number;
  totalWatchTimeHours: number;
  avgDurationSeconds: number;
  avgRetentionRate: number; // %
  videosPublished: number;
  shortsPublished: number;
  livesCount: number;
}

// LinkedIn Specific Metrics
export interface LinkedInMetrics {
  followersStart: number;
  followersEnd: number;
  newFollowers: number;
  postsCount: number;
  articlesCount: number;
  videosCount: number;
  impressions: number;
  reach?: number;
  reactions: number;
  comments: number;
  shares: number;
  clicks: number;
}

// X / Twitter Specific Metrics
export interface XMetrics {
  followersStart: number;
  followersEnd: number;
  newFollowers: number;
  postsCount: number;
  impressions: number;
  engagementCount: number;
  likes: number;
  replies: number;
  reposts: number;
  bookmarks: number;
  clicks: number;
}

export interface PlatformMetricData {
  facebook?: FacebookMetrics;
  instagram?: InstagramMetrics;
  tiktok?: TikTokMetrics;
  youtube?: YouTubeMetrics;
  linkedin?: LinkedInMetrics;
  x?: XMetrics;
}

export interface EvidenceAttachment {
  id: string;
  platform: PlatformType;
  title: string;
  url: string;
  uploadedAt: string;
}

export interface MetricReport {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  periodType: ReportPeriodType;
  platforms: PlatformType[];
  metrics: PlatformMetricData;
  analystObservations: Partial<Record<PlatformType, string>> & { globalNote?: string };
  evidenceAttachments: EvidenceAttachment[];
  responsible: {
    name: string;
    role: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  validationDetails?: {
    isComplete: boolean;
    missingFields: string[];
    warnings: string[];
  };
}

export interface ComparisonDelta {
  metricKey: string;
  label: string;
  currentValue: number;
  previousValue: number;
  diffAbsolute: number;
  diffPercentage: number;
  status: 'growth' | 'reduction' | 'slight' | 'no_change';
  symbol: string;
  iconColor: string;
}

export interface PlatformSummaryRow {
  platform: PlatformType;
  platformName: string;
  followers: number;
  followersGrowth: number;
  followersGrowthPct: number;
  reach: number;
  reachGrowthPct: number;
  engagement: number;
  engagementGrowthPct: number;
  publications: number;
  performanceBadge: 'excelente' | 'positivo' | 'estavel' | 'atencao';
}

export interface InternalProductionStats {
  completedTasks: number;
  producedContent: number;
  plannedPosts: number;
  publishedPosts: number;
  editedVideos: number;
  photoSessions: number;
  designsCreated: number;
  portalArticles: number;
  tvBroadcastHours: number;
  radioBroadcastHours: number;
}

export type MainNavSection = 
  | 'dashboard'
  | 'planeamento'
  | 'calendario'
  | 'redes_sociais'
  | 'tarefas'
  | 'banco_conteudos'
  | 'metricas'
  | 'equipa'
  | 'definicoes';

export type PostStatus = 'Ideia' | 'Rascunho' | 'Em Aprovação' | 'Agendado' | 'Publicado';
export type PostFormat = 'Reels' | 'Carrossel' | 'Imagem Single' | 'Vídeo' | 'Story' | 'Texto / Artigo' | 'Live';
export type DayOfWeek = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

export interface SocialPostItem {
  id: string;
  title: string;
  dayOfWeek: DayOfWeek;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  platforms: PlatformType[];
  format: PostFormat;
  status: PostStatus;
  copy: string;
  hashtags?: string;
  assignee: string;
  author: string;
  mediaUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
  activeTasks: number;
  password?: string;
  isAdmin?: boolean;
}

export interface UserCredential {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isAdmin: boolean;
  avatar: string;
}

export interface ContentProgram {
  id: string;
  name: string;
  channel: 'TV' | 'Rádio' | 'Digital' | 'Podcast';
  host: string;
  schedule: string;
  episodesCount: number;
  status: 'No Ar' | 'Em Produção' | 'Pausa';
}
