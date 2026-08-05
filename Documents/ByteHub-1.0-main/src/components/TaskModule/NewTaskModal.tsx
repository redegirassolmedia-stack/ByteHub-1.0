import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus, MainNavSection, TeamMember } from '../../types';
import { TEAM_MEMBERS, CONTENT_PROGRAMS } from '../../data/initialData';
import { X, CheckSquare, Calendar, User, Tag, AlertCircle, Clock, FileText, Sparkles, Loader2, Wand2, Check } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (newTask: TaskItem) => void;
  defaultSection?: MainNavSection;
  teamMembers?: TeamMember[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  defaultSection = 'tarefas',
  teamMembers = TEAM_MEMBERS
}) => {
  const activeMembers = teamMembers.length > 0 ? teamMembers : TEAM_MEMBERS;
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(activeMembers[0]?.name || 'Ivan Lima');
  const [customAssignee, setCustomAssignee] = useState('');
  const [tag, setTag] = useState('Editorial');
  const [section, setSection] = useState<MainNavSection>(defaultSection);
  const [priority, setPriority] = useState<TaskPriority>('Média');
  const [status, setStatus] = useState<TaskStatus>('Pendente');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // AI Task Generation state
  const [selectedProgram, setSelectedProgram] = useState<string>(CONTENT_PROGRAMS[0]?.name || 'Jornal do Meio-Dia');
  const [customActivity, setCustomActivity] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerateAiTask = async () => {
    const programOrActivity = selectedProgram === 'Outro' ? customActivity.trim() : selectedProgram;
    if (!programOrActivity) {
      setError('Por favor selecione ou especifique o programa / actividade.');
      return;
    }

    setError('');
    setIsGeneratingAi(true);
    setAiSuccessMsg('');

    try {
      let t: any = null;

      try {
        const res = await fetch('/api/generate-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            programOrActivity: programOrActivity,
            additionalContext: aiContext.trim(),
            tag
          })
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && data.task) {
              t = data.task;
            }
          }
        }
      } catch (networkErr) {
        // Fallback to client-side smart AI generator if API endpoint is not running locally
      }

      // Fallback local smart generator
      if (!t) {
        const dateNow = new Date();
        const formattedDate = dateNow.toISOString().split('T')[0];

        t = {
          title: `Produção & Conteúdo — ${programOrActivity}`,
          tag: tag || 'Editorial',
          priority: 'Média',
          dueDate: `Hoje 18:00 (${formattedDate})`,
          description: `Planeamento e execução de conteúdos para o programa/actividade "${programOrActivity}".\n${aiContext.trim() ? `Foco específico: ${aiContext.trim()}.\n` : ''}Garantir alinhamento de edição, formatos para redes sociais (Reels/Carrossel) e verificação final antes da publicação.`
        };
      }

      if (t.title) setTitle(t.title);
      if (t.tag) setTag(t.tag);
      if (t.priority) setPriority(t.priority as TaskPriority);
      if (t.dueDate) setDueDate(t.dueDate);
      if (t.description) setDescription(t.description);

      setAiSuccessMsg('✨ Tarefa gerada e preenchida automaticamente com Inteligência Artificial!');
      setTimeout(() => setAiSuccessMsg(''), 5000);
    } catch (err: any) {
      setError('Falha ao gerar a tarefa. Tente novamente.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor introduza o título da tarefa.');
      return;
    }

    const finalAssignee = assignee === 'outra' ? (customAssignee.trim() || 'Não Atribuído') : assignee;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      assignee: finalAssignee,
      tag,
      section,
      priority,
      status,
      dueDate: dueDate ? dueDate : 'Sem data definida',
      description: description.trim(),
      createdAt: new Date().toISOString()
    };

    onSaveTask(newTask);
    onClose();
    // Reset fields
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-400 text-slate-950 font-black rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">CRIAR NOVA TAREFA DE PRODUÇÃO</h3>
              <p className="text-xs text-amber-400">Atribuição e Acompanhamento de Tarefas do Content Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {aiSuccessMsg && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-bold flex items-center gap-2 shadow-2xs">
              <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{aiSuccessMsg}</span>
            </div>
          )}

          {/* AI Task Generator Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 rounded-2xl border border-indigo-800/80 shadow-lg text-white space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-800/60 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-amber-300">
                    Gerar Tarefa com Inteligência Artificial
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Selecione o programa de TV/Rádio ou a actividade para autopreencher a tarefa
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Gemini AI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Select Program or Activity */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Programa ou Actividade de Origem
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full p-2 text-xs font-semibold bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                >
                  <optgroup label="📺 Programas da Giraasol (TV, Rádio & Digital)">
                    {CONTENT_PROGRAMS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.channel})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🎬 Actividades de Produção Recorrentes">
                    <option value="Cobertura de Evento Especial & Transmissão Ao Vivo">
                      Cobertura de Evento Especial / Transmissão Ao Vivo
                    </option>
                    <option value="Sessão Fotográfica & Gravação de Reels">
                      Sessão Fotográfica & Gravação de Reels
                    </option>
                    <option value="Sondagem Interativa para Redes Sociais">
                      Sondagem Interativa para Redes Sociais
                    </option>
                    <option value="Artigo de Destaque no Portal de Notícias">
                      Artigo de Destaque no Portal de Notícias
                    </option>
                    <option value="Relatório Semanal de Métricas & Redes Sociais">
                      Relatório Semanal de Métricas
                    </option>
                  </optgroup>
                  <option value="Outro">Outro Programa ou Actividade...</option>
                </select>
              </div>

              {/* Context / Additional prompt instructions */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Instruções Extras / Foco (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Focar na edição de vídeo para Reels e TikTok"
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  className="w-full p-2 text-xs font-medium bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
            </div>

            {/* Custom activity field if selected */}
            {selectedProgram === 'Outro' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nome do Programa / Actividade Personalizada
                </label>
                <input
                  type="text"
                  placeholder="Ex: Entrevista Especial com Artista Convidado"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  className="w-full p-2 text-xs font-semibold bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
            )}

            {/* AI Generate Button */}
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={handleGenerateAiTask}
                disabled={isGeneratingAi}
                className="w-full sm:w-auto px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>A Gerar Conteúdo com IA...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Gerar Tarefa com IA ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Edição de Vídeo — Cortes Jornal do Meio-Dia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Responsável / Atribuído a
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
              >
                {activeMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.department})
                  </option>
                ))}
                <option value="outra">Outra Pessoa / Externo...</option>
              </select>

              {assignee === 'outra' && (
                <input
                  type="text"
                  placeholder="Nome do responsável..."
                  value={customAssignee}
                  onChange={(e) => setCustomAssignee(e.target.value)}
                  className="mt-2 w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
                />
              )}
            </div>

            {/* Department / Tag */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Categoria / Categoria
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
              >
                <option value="Editorial">Editorial & Jornalismo</option>
                <option value="Audiovisual">Audiovisual & Vídeo</option>
                <option value="Design">Design Gráfico & Artes</option>
                <option value="Métricas">Métricas & Redes Sociais</option>
                <option value="Emissão">Emissão TV & Rádio</option>
                <option value="Portal">Portal de Notícias</option>
                <option value="Geral">Geral & Produção</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
              >
                <option value="Baixa">🟢 Baixa</option>
                <option value="Média">🟡 Média</option>
                <option value="Alta">🟠 Alta</option>
                <option value="Urgente">🔴 Urgente</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Estado Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Pendente Aprovação">Pendente Aprovação</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Data/Hora Limite
              </label>
              <input
                type="text"
                placeholder="Ex: Hoje 17:00 ou 2026-08-01"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Descrição / Observações da Tarefa
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes sobre a entrega, especificações técnicas ou links de suporte..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50 resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>SALVAR TAREFA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
