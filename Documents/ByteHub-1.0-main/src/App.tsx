/**
 * Content Hub — Main Application Entry Point
 */

import React, { useState, useEffect } from 'react';
import { MainNavSection, MetricReport, TaskItem, TaskStatus, TeamMember, SocialPostItem, PostStatus, DayOfWeek } from './types';
import { INITIAL_REPORTS, INITIAL_TASKS, TEAM_MEMBERS, INITIAL_POSTS } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MetricsDashboard } from './components/MetricsModule/MetricsDashboard';
import { NewReportWizard } from './components/MetricsModule/NewReportWizard';
import { ReportPdfGenerator } from './components/MetricsModule/ReportPdfGenerator';
import { ReportComparator } from './components/MetricsModule/ReportComparator';
import { ConsolidatedReport } from './components/MetricsModule/ConsolidatedReport';
import { NewTaskModal } from './components/TaskModule/NewTaskModal';
import { ModuleViews } from './components/OtherModules/ModuleViews';
import { ResetSystemModal } from './components/SystemResetModal';
import { NewTeamMemberModal } from './components/TeamModule/NewTeamMemberModal';
import { NewPostModal } from './components/SocialPlanner/NewPostModal';
import { PostDetailModal } from './components/SocialPlanner/PostDetailModal';
import { LoginPanel } from './components/Auth/LoginPanel';
import { CredentialsManagerModal } from './components/Auth/CredentialsManagerModal';

import { fetchTasksFromSupabase, saveTaskToSupabase, deleteTaskFromSupabase } from './services/supabaseSync';
import { resetSupabaseInstance } from './lib/supabase';

export default function App() {
  // ─── MIGRAÇÃO DE DADOS ──────────────────────────────────────────────────────
  // Limpa dados de exemplo de versões anteriores do sistema.
  // A versão '2.0' indica instalação limpa e profissional.
  React.useEffect(() => {
    const dataVersion = localStorage.getItem('girassol_data_version');
    if (dataVersion !== '2.0') {
      const existingTasks = localStorage.getItem('girassol_tasks');
      const existingPosts = localStorage.getItem('girassol_posts');
      const existingReports = localStorage.getItem('girassol_reports');

      if (existingTasks) {
        try {
          const parsed = JSON.parse(existingTasks);
          if (Array.isArray(parsed) && parsed.some((t: any) => t.id?.startsWith('task-'))) {
            localStorage.removeItem('girassol_tasks');
          }
        } catch {}
      }
      if (existingPosts) {
        try {
          const parsed = JSON.parse(existingPosts);
          if (Array.isArray(parsed) && parsed.some((p: any) => p.id?.startsWith('post-'))) {
            localStorage.removeItem('girassol_posts');
          }
        } catch {}
      }
      if (existingReports) {
        try {
          const parsed = JSON.parse(existingReports);
          if (Array.isArray(parsed) && parsed.some((r: any) => r.id?.startsWith('rep-'))) {
            localStorage.removeItem('girassol_reports');
          }
        } catch {}
      }
      localStorage.setItem('girassol_data_version', '2.0');
    }
  }, []);

  const [currentSection, setCurrentSection] = useState<MainNavSection>('dashboard');
  const [reports, setReports] = useState<MetricReport[]>(() => {
    try {
      const saved = localStorage.getItem('girassol_reports');
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch { return INITIAL_REPORTS; }
  });
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('girassol_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch { return INITIAL_TASKS; }
  });
  const [posts, setPosts] = useState<SocialPostItem[]>(() => {
    try {
      const saved = localStorage.getItem('girassol_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch { return INITIAL_POSTS; }
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('girassol_team_members');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : TEAM_MEMBERS;
    } catch { return TEAM_MEMBERS; }
  });

  // Load tasks from Supabase on startup if configured (only replace if Supabase returns items)
  useEffect(() => {
    fetchTasksFromSupabase().then((supaTasks) => {
      if (supaTasks !== null && supaTasks.length > 0) {
        setTasks(supaTasks);
      }
    });

    // Real-time synchronization across tabs / sessions via BroadcastChannel & Storage events
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('girassol_data_sync');
      broadcastChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_TASKS' && payload) setTasks(payload);
        if (type === 'SYNC_POSTS' && payload) setPosts(payload);
        if (type === 'SYNC_TEAM' && payload) setTeamMembers(payload);
      };
    } catch {}

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'girassol_tasks' && e.newValue) {
        try { setTasks(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'girassol_posts' && e.newValue) {
        try { setPosts(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'girassol_team_members' && e.newValue) {
        try { setTeamMembers(JSON.parse(e.newValue)); } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannel) broadcastChannel.close();
    };
  }, []);

  // Auth state
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(() => {
    try {
      const savedUser = localStorage.getItem('girassol_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  // UI Modals
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);
  const [isOpenNewReportWizard, setIsOpenNewReportWizard] = useState<boolean>(false);
  const [selectedPdfReport, setSelectedPdfReport] = useState<MetricReport | null>(null);
  const [isOpenComparator, setIsOpenComparator] = useState<boolean>(false);
  const [selectedConsolidatedReport, setSelectedConsolidatedReport] = useState<MetricReport | null>(null);

  // Task, Post & User Modals
  const [isOpenNewTaskModal, setIsOpenNewTaskModal] = useState<boolean>(false);
  const [taskDefaultSection, setTaskDefaultSection] = useState<MainNavSection>('tarefas');
  const [isOpenResetModal, setIsOpenResetModal] = useState<boolean>(false);
  const [isOpenNewMemberModal, setIsOpenNewMemberModal] = useState<boolean>(false);
  const [isOpenCredentialsModal, setIsOpenCredentialsModal] = useState<boolean>(false);

  // Social Post Planner Modals
  const [isOpenNewPostModal, setIsOpenNewPostModal] = useState<boolean>(false);
  const [postDefaultDay, setPostDefaultDay] = useState<DayOfWeek>('Segunda-feira');
  const [selectedPostPreview, setSelectedPostPreview] = useState<SocialPostItem | null>(null);

  // Persist all data to localStorage so it survives page refresh
  useEffect(() => {
    try {
      localStorage.setItem('girassol_team_members', JSON.stringify(teamMembers));
      const bc = new BroadcastChannel('girassol_data_sync');
      bc.postMessage({ type: 'SYNC_TEAM', payload: teamMembers });
      bc.close();
    } catch (e) {
      console.warn('Erro ao guardar membros da equipa no localStorage:', e);
    }
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('girassol_tasks', JSON.stringify(tasks));
      const bc = new BroadcastChannel('girassol_data_sync');
      bc.postMessage({ type: 'SYNC_TASKS', payload: tasks });
      bc.close();
    } catch (e) {
      console.warn('Erro ao guardar tarefas no localStorage:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('girassol_posts', JSON.stringify(posts));
      const bc = new BroadcastChannel('girassol_data_sync');
      bc.postMessage({ type: 'SYNC_POSTS', payload: posts });
      bc.close();
    } catch (e) {
      console.warn('Erro ao guardar posts no localStorage:', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('girassol_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('Erro ao guardar relatórios no localStorage:', e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('girassol_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('girassol_current_user');
      }
    } catch (e) {
      console.warn('Erro ao guardar utilizador atual no localStorage:', e);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user: TeamMember) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateMemberCredentials = (updatedMember: TeamMember) => {
    setTeamMembers(teamMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    if (currentUser && currentUser.id === updatedMember.id) {
      setCurrentUser(updatedMember);
    }
    // Reset Supabase instance so new credentials take effect immediately
    resetSupabaseInstance();
  };

  // Handlers for Data Reset
  const handleResetAll = () => {
    setReports([...INITIAL_REPORTS]);
    setTasks([...INITIAL_TASKS]);
    setPosts([...INITIAL_POSTS]);
    setTeamMembers([...TEAM_MEMBERS]);
    localStorage.removeItem('girassol_reports');
    localStorage.removeItem('girassol_tasks');
    localStorage.removeItem('girassol_posts');
    localStorage.removeItem('girassol_team_members');
  };

  const handleResetUsers = () => {
    setTeamMembers([...TEAM_MEMBERS]);
  };

  const handleResetTasks = () => {
    setTasks([...INITIAL_TASKS]);
  };

  const handleResetReports = () => {
    setReports([...INITIAL_REPORTS]);
  };

  // Social Posts Handlers
  const handleSavePost = (newPost: SocialPostItem) => {
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePostStatus = (postId: string, newStatus: PostStatus) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, status: newStatus } : p)));
    if (selectedPostPreview && selectedPostPreview.id === postId) {
      setSelectedPostPreview({ ...selectedPostPreview, status: newStatus });
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
    if (selectedPostPreview && selectedPostPreview.id === postId) {
      setSelectedPostPreview(null);
    }
  };

  const handleOpenNewPostModal = (defaultDay: DayOfWeek = 'Segunda-feira') => {
    setPostDefaultDay(defaultDay);
    setIsOpenNewPostModal(true);
  };

  // Handlers for Reports & Tasks
  const handleSaveNewReport = (newReport: MetricReport) => {
    setReports([newReport, ...reports]);
  };

  const handleSaveTask = (newTask: TaskItem) => {
    setTasks([newTask, ...tasks]);
    saveTaskToSupabase(newTask);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updatedTasks);
    const updated = updatedTasks.find((t) => t.id === taskId);
    if (updated) {
      saveTaskToSupabase(updated);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    deleteTaskFromSupabase(taskId);
  };

  const handleOpenNewTaskModal = (defaultSec: MainNavSection = 'tarefas') => {
    setTaskDefaultSection(defaultSec);
    setIsOpenNewTaskModal(true);
  };

  // Handlers for Team Members
  const handleAddTeamMember = (newMember: TeamMember) => {
    setTeamMembers([newMember, ...teamMembers]);
  };

  const handleDeleteTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
  };

  if (!currentUser) {
    return (
      <LoginPanel
        teamMembers={teamMembers}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col lg:flex-row antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        currentUser={currentUser}
        onSelectSection={setCurrentSection}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentSection={currentSection}
          currentUser={currentUser}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          onOpenNewReport={() => setIsOpenNewReportWizard(true)}
          onOpenConsolidated={() => setSelectedConsolidatedReport(reports[0])}
          onOpenNewTask={() => handleOpenNewTaskModal(currentSection)}
          onOpenResetModal={() => setIsOpenResetModal(true)}
          onOpenCredentialsModal={() => setIsOpenCredentialsModal(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <Dashboard
              reports={reports}
              tasks={tasks}
              posts={posts}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onNavigateSection={setCurrentSection}
              onOpenPdfView={(r) => setSelectedPdfReport(r)}
            />
          )}

          {currentSection === 'metricas' && (
            <MetricsDashboard
              reports={reports}
              onOpenNewReport={() => setIsOpenNewReportWizard(true)}
              onOpenPdfView={(r) => setSelectedPdfReport(r)}
              onOpenComparator={() => setIsOpenComparator(true)}
              onOpenConsolidated={(r) => setSelectedConsolidatedReport(r)}
            />
          )}

          {currentSection !== 'dashboard' && currentSection !== 'metricas' && (
            <ModuleViews
              section={currentSection}
              tasks={tasks}
              posts={posts}
              teamMembers={teamMembers}
              currentUser={currentUser}
              onOpenNewTaskModal={handleOpenNewTaskModal}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              onOpenNewMemberModal={() => setIsOpenNewMemberModal(true)}
              onDeleteTeamMember={handleDeleteTeamMember}
              onOpenResetModal={() => setIsOpenResetModal(true)}
              onOpenNewPostModal={handleOpenNewPostModal}
              onUpdatePostStatus={handleUpdatePostStatus}
              onDeletePost={handleDeletePost}
              onSelectPostForPreview={(p) => setSelectedPostPreview(p)}
              onOpenCredentialsModal={() => setIsOpenCredentialsModal(true)}
            />
          )}
        </main>
      </div>

      {/* MODAL 1: NEW TASK MODAL (+ CRIAR TAREFA) */}
      <NewTaskModal
        isOpen={isOpenNewTaskModal}
        onClose={() => setIsOpenNewTaskModal(false)}
        onSaveTask={handleSaveTask}
        defaultSection={taskDefaultSection}
        teamMembers={teamMembers}
      />

      {/* MODAL 2: NEW SOCIAL POST MODAL (+ PLANEAR NOVO POST) */}
      <NewPostModal
        isOpen={isOpenNewPostModal}
        onClose={() => setIsOpenNewPostModal(false)}
        onSavePost={handleSavePost}
        defaultDay={postDefaultDay}
        teamMembers={teamMembers}
      />

      {/* MODAL 3: POST DETAIL & PREVIEW MODAL */}
      {selectedPostPreview && (
        <PostDetailModal
          post={selectedPostPreview}
          onClose={() => setSelectedPostPreview(null)}
          onUpdatePostStatus={handleUpdatePostStatus}
          onDeletePost={handleDeletePost}
        />
      )}

      {/* MODAL 4: NEW REPORT WIZARD (+ NOVO RELATÓRIO) */}
      <NewReportWizard
        isOpen={isOpenNewReportWizard}
        onClose={() => setIsOpenNewReportWizard(false)}
        onSaveReport={handleSaveNewReport}
      />

      {/* MODAL 5: 13-PAGE EXECUTIVE PDF GENERATOR */}
      {selectedPdfReport && (
        <ReportPdfGenerator
          report={selectedPdfReport}
          previousReport={reports.find((r) => r.id !== selectedPdfReport.id)}
          onClose={() => setSelectedPdfReport(null)}
        />
      )}

      {/* MODAL 6: REPORT COMPARATOR */}
      {isOpenComparator && (
        <ReportComparator
          reports={reports}
          initialReportA={reports[0]}
          initialReportB={reports[1]}
          onClose={() => setIsOpenComparator(false)}
        />
      )}

      {/* MODAL 7: CONSOLIDATED REPORT VIEW */}
      {selectedConsolidatedReport && (
        <ConsolidatedReport
          report={selectedConsolidatedReport}
          previousReport={reports.find((r) => r.id !== selectedConsolidatedReport.id)}
          onClose={() => setSelectedConsolidatedReport(null)}
        />
      )}

      {/* MODAL 8: RESET DATA MODAL (RESET DE DADOS E UTILIZADORES) */}
      <ResetSystemModal
        isOpen={isOpenResetModal}
        onClose={() => setIsOpenResetModal(false)}
        onResetAll={handleResetAll}
        onResetUsers={handleResetUsers}
        onResetTasks={handleResetTasks}
        onResetReports={handleResetReports}
      />

      {/* MODAL 9: ADICIONAR NOVO UTILIZADOR / MEMBRO */}
      <NewTeamMemberModal
        isOpen={isOpenNewMemberModal}
        onClose={() => setIsOpenNewMemberModal(false)}
        onAddTeamMember={handleAddTeamMember}
      />

      {/* MODAL 10: GERIR CREDENCIAIS E PALAVRAS-PASSE DA EQUIPA */}
      <CredentialsManagerModal
        isOpen={isOpenCredentialsModal}
        onClose={() => setIsOpenCredentialsModal(false)}
        currentUser={currentUser}
        teamMembers={teamMembers}
        onUpdateMemberCredentials={handleUpdateMemberCredentials}
      />
    </div>
  );
}
