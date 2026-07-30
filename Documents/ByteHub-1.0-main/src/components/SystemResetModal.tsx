import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Users, FileBarChart, CheckSquare, ShieldAlert, X, Check } from 'lucide-react';

interface ResetSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAll: () => void;
  onResetUsers: () => void;
  onResetTasks: () => void;
  onResetReports: () => void;
}

export const ResetSystemModal: React.FC<ResetSystemModalProps> = ({
  isOpen,
  onClose,
  onResetAll,
  onResetUsers,
  onResetTasks,
  onResetReports,
}) => {
  const [resetType, setResetType] = useState<'all' | 'users' | 'tasks' | 'reports'>('all');
  const [confirmed, setConfirmed] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    if (resetType === 'all') {
      onResetAll();
      setSuccessMessage('Todos os dados do sistema, utilizadores, relatórios e tarefas foram restaurados para o estado inicial de fábrica.');
    } else if (resetType === 'users') {
      onResetUsers();
      setSuccessMessage('A lista de utilizadores/equipa foi restaurada para a configuração padrão.');
    } else if (resetType === 'tasks') {
      onResetTasks();
      setSuccessMessage('As tarefas do sistema foram restauradas para as tarefas padrão.');
    } else if (resetType === 'reports') {
      onResetReports();
      setSuccessMessage('Os relatórios de métricas foram restaurados para o estado inicial.');
    }

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setSuccessMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">RESETAÇÃO DE DADOS DO SISTEMA</h3>
              <p className="text-xs text-amber-400">Restauração de Dados, Utilizadores e Configurações</p>
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
        <div className="p-6 space-y-5 text-xs flex-1 overflow-y-auto">
          {successMessage ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl space-y-2 text-center my-4">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-emerald-950">Reset Concluído com Sucesso!</h4>
              <p className="text-xs text-emerald-800">{successMessage}</p>
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-950">Aviso de Segurança</div>
                  <div className="text-[11px] text-amber-800 leading-relaxed">
                    Esta acção irá restaurar os registos e a lista de utilizadores. Utilize esta opção se desejar reiniciar os testes ou recuperar a estrutura padrão inicial do Content Hub.
                  </div>
                </div>
              </div>

              {/* Reset Type Selector */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Seleccione o Escopo do Reset:
                </label>

                <div className="space-y-2">
                  <label
                    onClick={() => setResetType('all')}
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                      resetType === 'all'
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resetScope"
                      checked={resetType === 'all'}
                      onChange={() => setResetType('all')}
                      className="mt-1 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="ml-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-rose-600" />
                        <span>Restaurar Todos os Dados do Sistema (Reset Total)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Restaura Relatórios, Tarefas e a lista completa de Utilizadores/Equipa para o estado inicial de fábrica.
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setResetType('users')}
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                      resetType === 'users'
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resetScope"
                      checked={resetType === 'users'}
                      onChange={() => setResetType('users')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span>Resetar Utilizadores / Equipa</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Restaura a lista de membros e responsáveis originais da equipa (remover membros adicionados manualmente).
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setResetType('tasks')}
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                      resetType === 'tasks'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resetScope"
                      checked={resetType === 'tasks'}
                      onChange={() => setResetType('tasks')}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="ml-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-amber-600" />
                        <span>Resetar Tarefas de Produção</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Restaura as tarefas padrão de editorial, audiovisual, design e métricas.
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setResetType('reports')}
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                      resetType === 'reports'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resetScope"
                      checked={resetType === 'reports'}
                      onChange={() => setResetType('reports')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="ml-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <FileBarChart className="w-4 h-4 text-emerald-600" />
                        <span>Resetar Relatórios de Métricas</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Restaura os relatórios executivos das redes sociais e históricos de performance.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          {!successMessage && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-5 py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>CONFIRMAR RESET DE DADOS</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
