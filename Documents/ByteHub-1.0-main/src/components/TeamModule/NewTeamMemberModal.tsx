import React, { useState, useRef } from 'react';
import { TeamMember } from '../../types';
import { X, UserPlus, Mail, Shield, Briefcase, Image as ImageIcon, Upload, Paperclip } from 'lucide-react';

interface NewTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeamMember: (member: TeamMember) => void;
}

export const NewTeamMemberModal: React.FC<NewTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onAddTeamMember,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Editorial & Notícias');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    ];

    const finalAvatar = avatar.trim() || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Colaborador Digital',
      department,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@girassol.ao`,
      avatar: finalAvatar,
      activeTasks: 0
    };

    onAddTeamMember(newMember);
    onClose();

    // Reset form
    setName('');
    setRole('');
    setEmail('');
    setAvatar('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-400 text-slate-950 font-black rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ADICIONAR UTILIZADOR / MEMBRO</h3>
              <p className="text-xs text-amber-400">Registo de Novo Integrante na Equipa</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: João Baptista"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Função / Cargo
            </label>
            <input
              type="text"
              placeholder="Ex: Jornalista Senior / Editor de Vídeo"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Departamento
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50"
            >
              <option value="Editorial & Notícias">Editorial & Notícias</option>
              <option value="Produção Audiovisual">Produção Audiovisual & Edição</option>
              <option value="Design & Identidade">Design Gráfico & Artes</option>
              <option value="Métricas & Redes Sociais">Métricas & Redes Sociais</option>
              <option value="Emissão TV & Rádio">Emissão TV & Rádio</option>
              <option value="Tecnologia & Sistemas">Tecnologia & Sistemas</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Endereço de E-mail
            </label>
            <input
              type="email"
              placeholder="joao.baptista@girassol.ao"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Fotografia / Avatar de Perfil
            </label>

            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="https://... ou escolha ficheiro"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="flex-1 p-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50 font-mono"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Anexar Foto</span>
              </button>
            </div>

            {avatar && (
              <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
                <img
                  src={avatar}
                  alt="Pré-visualização"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shrink-0"
                />
                <span className="text-[11px] text-slate-600 font-medium truncate">Foto Seleccionada</span>
              </div>
            )}
          </div>

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
              <UserPlus className="w-4 h-4" />
              <span>SALVAR MEMBRO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
