import React from 'react';
import { SocialPostItem, PostStatus, PlatformType } from '../../types';
import {
  X,
  Clock,
  Calendar,
  User,
  Share2,
  CheckCircle2,
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreHorizontal
} from 'lucide-react';

interface PostDetailModalProps {
  post: SocialPostItem | null;
  onClose: () => void;
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
  onDeletePost: (postId: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onUpdatePostStatus,
  onDeletePost
}) => {
  if (!post) return null;

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'facebook':
        return { label: 'Facebook', bg: 'bg-blue-600 text-white' };
      case 'instagram':
        return { label: 'Instagram', bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white' };
      case 'tiktok':
        return { label: 'TikTok', bg: 'bg-slate-950 text-white border border-slate-700' };
      case 'youtube':
        return { label: 'YouTube', bg: 'bg-red-600 text-white' };
      case 'linkedin':
        return { label: 'LinkedIn', bg: 'bg-sky-700 text-white' };
      case 'x':
        return { label: 'X (Twitter)', bg: 'bg-slate-900 text-white' };
      default:
        return { label: platform, bg: 'bg-slate-700 text-white' };
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'Publicado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Agendado':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Em Aprovação':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Rascunho':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Ideia':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getStatusBadge(post.status)}`}>
              {post.status}
            </span>
            <span className="text-xs font-bold text-slate-300">
              {post.dayOfWeek} — {post.date} às {post.time}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Post Title & Formats */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded uppercase border border-amber-200">
                {post.format}
              </span>
              {post.platforms.map((pf) => {
                const badge = getPlatformBadge(pf);
                return (
                  <span key={pf} className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs ${badge.bg}`}>
                    {badge.label}
                  </span>
                );
              })}
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-snug">{post.title}</h3>
          </div>

          {/* Social Feed Mobile Mockup Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto shadow-sm">
            {/* Header of social card */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-0.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    alt="Ivan Lima"
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">Redes Sociais — Official</div>
                  <div className="text-[10px] text-slate-500">Publicação Oficial • {post.time}</div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Media */}
            {post.mediaUrl ? (
              <div className="my-3 rounded-xl overflow-hidden bg-slate-900 max-h-72">
                <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="my-3 p-6 bg-slate-200/60 rounded-xl text-center text-slate-500 text-xs italic">
                [Sem imagem anexa]
              </div>
            )}

            {/* Simulated Feed Actions */}
            <div className="flex items-center justify-between py-2 text-slate-700">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer" />
                <MessageCircle className="w-5 h-5 hover:text-indigo-600 cursor-pointer" />
                <Send className="w-5 h-5 hover:text-amber-500 cursor-pointer" />
              </div>
              <Bookmark className="w-5 h-5 hover:text-amber-500 cursor-pointer" />
            </div>

            {/* Copy & Hashtags */}
            <div className="space-y-1 pt-1 text-xs text-slate-800">
              <p className="whitespace-pre-line leading-relaxed font-normal">{post.copy}</p>
              {post.hashtags && (
                <p className="text-indigo-600 font-medium text-[11px] pt-1">{post.hashtags}</p>
              )}
            </div>
          </div>

          {/* Details Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-100 p-4 rounded-xl">
            <div>
              <span className="text-slate-500 block text-[11px] font-semibold">Responsável:</span>
              <span className="font-bold text-slate-900">{post.assignee}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-semibold">Criado por:</span>
              <span className="font-bold text-slate-900">{post.author}</span>
            </div>
            {post.notes && (
              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-500 block text-[11px] font-semibold">Notas Internas:</span>
                <span className="text-slate-700 italic">{post.notes}</span>
              </div>
            )}
          </div>

          {/* Actions & Status Change */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Mudar Estado:</span>
              <select
                value={post.status}
                onChange={(e) => onUpdatePostStatus(post.id, e.target.value as PostStatus)}
                className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${getStatusBadge(post.status)}`}
              >
                <option value="Ideia">Ideia</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Em Aprovação">Em Aprovação</option>
                <option value="Agendado">Agendado</option>
                <option value="Publicado">Publicado</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  onDeletePost(post.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
