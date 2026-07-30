import React, { useState, useRef, useEffect } from 'react';
import { TeamMember } from '../../types';
import {
  X,
  ShieldCheck,
  KeyRound,
  UserCheck,
  Save,
  Check,
  Lock,
  Plus,
  Trash2,
  Mail,
  User,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface CredentialsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  onUpdateMemberCredentials: (updatedMember: TeamMember) => void;
}

export const CredentialsManagerModal: React.FC<CredentialsManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  teamMembers,
  onUpdateMemberCredentials
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser.id);
  const [newName, setNewName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newAvatar, setNewAvatar] = useState<string>('');
  const [isAdminRole, setIsAdminRole] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const selectedMember = teamMembers.find((m) => m.id === selectedMemberId) || currentUser;

  // Sync state whenever selected member or modal opens
  useEffect(() => {
    if (isOpen) {
      const target = teamMembers.find((m) => m.id === selectedMemberId) || currentUser;
      setNewName(target.name);
      setNewEmail(target.email);
      setNewPassword(target.password || 'user123');
      setNewAvatar(target.avatar || '');
      setIsAdminRole(!!target.isAdmin);
      setSuccessMessage('');
    }
  }, [isOpen, selectedMemberId, teamMembers, currentUser]);

  if (!isOpen) return null;

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMemberId(member.id);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    const updated: TeamMember = {
      ...selectedMember,
      name: newName.trim() || selectedMember.name,
      email: newEmail.trim() || selectedMember.email,
      password: newPassword.trim(),
      avatar: newAvatar || selectedMember.avatar,
      isAdmin: isAdminRole
    };

    onUpdateMemberCredentials(updated);
    setSuccessMessage(`Foto de perfil e definições guardadas para ${updated.name}!`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Painel de Gestão de Credenciais & Acessos</h3>
              <p className="text-xs text-slate-300">
                Administrador: <span className="text-amber-400 font-bold">{currentUser.name}</span>
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

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          {/* Member Selection List */}
          <div className="md:col-span-5 space-y-3 border-r border-slate-200 pr-0 md:pr-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Seleccione o Utilizador</span>
            </h4>
            <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
                    selectedMemberId === member.id
                      ? 'bg-indigo-50 border-indigo-500 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border"
                  />
                  <div className="truncate">
                    <span className="font-bold block text-slate-900 truncate">
                      {member.name} {member.isAdmin && '⭐'}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{member.email}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-7 space-y-4">
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Avatar & User Header */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="relative group">
                    <img
                      src={newAvatar || selectedMember.avatar}
                      alt={selectedMember.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                      title="Alterar Imagem de Perfil"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{selectedMember.name}</h4>
                    <p className="text-slate-500 text-[11px]">{selectedMember.role}</p>
                    <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                      Clique na imagem para alterar a foto
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Carregar Foto</span>
                </button>
              </div>

              {/* Avatar URL Input field as alternative */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Ou cole o link (URL) da Imagem de Perfil
                </label>
                <div className="relative">
                  <ImageIcon className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newAvatar || selectedMember.avatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-slate-300 rounded-lg font-mono text-slate-700 bg-white"
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo do Utilizador</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Palavra-passe de Acesso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Defina uma palavra-passe que o utilizador usará para iniciar sessão no painel.
                </span>
              </div>

              {currentUser.isAdmin && (
                <div className="pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <input
                      type="checkbox"
                      checked={isAdminRole}
                      onChange={(e) => setIsAdminRole(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Conceder Privilégios de Administrador</span>
                      <span className="text-[10px] text-slate-600 block">
                        Permite a este utilizador gerir outros acessos e definições executivas.
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl font-black shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR CREDENCIAIS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
