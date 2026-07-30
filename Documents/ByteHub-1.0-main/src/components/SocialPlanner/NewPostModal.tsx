import React, { useState, useRef } from 'react';
import { SocialPostItem, DayOfWeek, PostStatus, PostFormat, PlatformType, TeamMember } from '../../types';
import { TEAM_MEMBERS } from '../../data/initialData';
import {
  X,
  Send,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  Check,
  Tag,
  FileText,
  Hash,
  Share2,
  Upload,
  Paperclip
} from 'lucide-react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (newPost: SocialPostItem) => void;
  defaultDay?: DayOfWeek;
  teamMembers?: TeamMember[];
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

const PLATFORM_OPTIONS: { id: PlatformType; label: string; bg: string; icon: string }[] = [
  { id: 'instagram', label: 'Instagram', bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white', icon: '📸' },
  { id: 'facebook', label: 'Facebook', bg: 'bg-blue-600 text-white', icon: '📘' },
  { id: 'tiktok', label: 'TikTok', bg: 'bg-slate-950 text-white border border-slate-700', icon: '🎵' },
  { id: 'youtube', label: 'YouTube', bg: 'bg-red-600 text-white', icon: '▶️' },
  { id: 'linkedin', label: 'LinkedIn', bg: 'bg-sky-700 text-white', icon: '💼' },
  { id: 'x', label: 'X (Twitter)', bg: 'bg-slate-900 text-white', icon: '✖️' },
];

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onSavePost,
  defaultDay = 'Segunda-feira',
  teamMembers = TEAM_MEMBERS
}) => {
  const activeMembers = teamMembers.length > 0 ? teamMembers : TEAM_MEMBERS;

  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(defaultDay);
  const [date, setDate] = useState('2026-08-03');
  const [time, setTime] = useState('10:00');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(['instagram', 'facebook']);
  const [format, setFormat] = useState<PostFormat>('Reels');
  const [status, setStatus] = useState<PostStatus>('Agendado');
  const [copy, setCopy] = useState('');
  const [hashtags, setHashtags] = useState('#RedesSociais #Girassol #Angola');
  const [assignee, setAssignee] = useState(activeMembers[0]?.name || 'Ivan Lima');
  const [mediaUrl, setMediaUrl] = useState('');
  const [notes, setNotes] = useState('');

  const postFileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const togglePlatform = (pf: PlatformType) => {
    if (selectedPlatforms.includes(pf)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== pf));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, pf]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPost: SocialPostItem = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      dayOfWeek,
      date,
      time,
      platforms: selectedPlatforms,
      format,
      status,
      copy,
      hashtags,
      assignee,
      author: 'Ivan Lima',
      mediaUrl: mediaUrl.trim() || undefined,
      notes,
      createdAt: new Date().toISOString()
    };

    onSavePost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-xl">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Planear Novo Post de Redes Sociais</h3>
              <p className="text-xs text-slate-300">Agendamento de conteúdo semanal por plataforma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Título / Tema do Post <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Lançamento do Novo Programa ou Resumo Semanal de Notícias..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Target Platforms */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Redes Sociais de Destino (Seleccione uma ou mais)
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((pf) => {
                const isSelected = selectedPlatforms.includes(pf.id);
                return (
                  <button
                    key={pf.id}
                    type="button"
                    onClick={() => togglePlatform(pf.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? `${pf.bg} border-transparent shadow-md ring-2 ring-offset-1 ring-indigo-500`
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{pf.icon}</span>
                    <span>{pf.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dia da Semana</span>
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Data Específica</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Horário de Envio</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Format & Status & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Formato do Conteúdo</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as PostFormat)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
              >
                <option value="Reels">Reels / Vídeo Curto</option>
                <option value="Carrossel">Carrossel de Imagens</option>
                <option value="Imagem Single">Imagem Única</option>
                <option value="Vídeo">Vídeo Completo</option>
                <option value="Story">Story</option>
                <option value="Texto / Artigo">Texto / Artigo</option>
                <option value="Live">Live / Transmissão</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estado Inicial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
              >
                <option value="Ideia">Ideia</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Em Aprovação">Em Aprovação</option>
                <option value="Agendado">Agendado</option>
                <option value="Publicado">Publicado</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Responsável</span>
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
              >
                {activeMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Copywriting & Hashtags */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Legenda do Post (Copywriting)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Escreva a legenda oficial do post..."
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-normal leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hashtags Recomendadas</span>
            </label>
            <input
              type="text"
              placeholder="#RedesSociais #Girassol #Angola"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
            />
          </div>

          {/* Media File or URL */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Arte / Imagem / Vídeo do Post</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">URL ou Ficheiro local</span>
            </label>

            <input
              type="file"
              ref={postFileInputRef}
              accept="image/*,video/*"
              onChange={handleMediaFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/... ou anexar ficheiro"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 p-2.5 border border-slate-300 rounded-xl font-mono text-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={() => postFileInputRef.current?.click()}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Anexar Ficheiro</span>
              </button>
            </div>

            {mediaUrl && (
              <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                  {mediaUrl.startsWith('data:image') || mediaUrl.startsWith('http') ? (
                    <img src={mediaUrl} alt="Preview" className="w-8 h-8 rounded-lg object-cover border shrink-0" />
                  ) : (
                    <Paperclip className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  <span className="text-slate-600 font-mono text-[11px] truncate max-w-xs">{mediaUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="text-rose-600 hover:text-rose-800 font-bold text-[10px] px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  Remover
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl font-black shadow-md flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>GUARDAR POST</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
