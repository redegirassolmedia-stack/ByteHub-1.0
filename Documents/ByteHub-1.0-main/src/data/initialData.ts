import { MetricReport, TeamMember, ContentProgram, InternalProductionStats, TaskItem } from '../types';

// Responsável padrão para novos relatórios
export const CURRENT_RESPONSIBLE = {
  name: 'Ivan Lima',
  role: 'Coordenador de Redes Sociais',
  email: 'ivan.lima@girassol.ao',
  avatar: 'https://ui-avatars.com/api/?name=Ivan+Lima&background=f59e0b&color=0f172a&size=128&bold=true',
};

// ─── DADOS INICIAIS DO SISTEMA ────────────────────────────────────────────────
// Estes são os valores padrão do sistema numa instalação limpa.
// Os dados reais são introduzidos pelos utilizadores através da interface.

export const INITIAL_REPORTS: MetricReport[] = [];

export const INTERNAL_PRODUCTION_STATS: InternalProductionStats = {
  completedTasks: 0,
  producedContent: 0,
  plannedPosts: 0,
  publishedPosts: 0,
  editedVideos: 0,
  photoSessions: 0,
  designsCreated: 0,
  portalArticles: 0,
  tvBroadcastHours: 0,
  radioBroadcastHours: 0,
};

export const CONTENT_PROGRAMS: ContentProgram[] = [];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'admin-001',
    name: 'Ivan Lima',
    role: 'Coordenador de Redes Sociais',
    department: 'Redes Sociais',
    email: 'ivan.lima@girassol.ao',
    avatar: 'https://ui-avatars.com/api/?name=Ivan+Lima&background=f59e0b&color=0f172a&size=128&bold=true',
    activeTasks: 0,
    password: 'admin',
    isAdmin: true,
  },
];

export const INITIAL_TASKS: TaskItem[] = [];

export const INITIAL_POSTS: import('../types').SocialPostItem[] = [];
