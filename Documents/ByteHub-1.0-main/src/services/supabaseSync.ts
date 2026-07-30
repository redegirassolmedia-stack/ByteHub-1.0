import { getSupabase, getSupabaseCredentials, validateSupabaseCredentials } from '../lib/supabase';
import { TaskItem, SocialPostItem, TeamMember } from '../types';

export interface SupabaseSyncStatus {
  isConnected: boolean;
  message: string;
}

// Check Supabase connection
export async function testSupabaseConnection(): Promise<SupabaseSyncStatus> {
  const { url, key } = getSupabaseCredentials();

  const validation = validateSupabaseCredentials(url, key);
  if (!validation.valid) {
    return {
      isConnected: false,
      message: validation.message
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      isConnected: false,
      message: 'Não foi possível inicializar o cliente Supabase. Verifique o formato do URL e da chave.'
    };
  }

  try {
    const { data, error } = await supabase.from('tasks').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return {
          isConnected: true,
          message: 'Conectado ao Supabase! (Nota: A tabela "tasks" ainda não existe. Por favor execute o script SQL abaixo).'
        };
      }
      return {
        isConnected: false,
        message: `Conexão falhou: ${error.message}`
      };
    }
    return {
      isConnected: true,
      message: `Conectado ao Supabase com sucesso! (${data !== null ? 'Tabela tasks ativa' : 'OK'})`
    };
  } catch (err: any) {
    return {
      isConnected: false,
      message: `Erro ao testar Supabase: ${err?.message || 'Erro desconhecido'}`
    };
  }
}

// Fetch Tasks from Supabase
export async function fetchTasksFromSupabase(): Promise<TaskItem[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error || !data) {
      console.warn('Erro ao carregar tarefas do Supabase:', error);
      return null;
    }

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      tag: t.tag || 'Geral',
      priority: t.priority || 'Média',
      status: t.status || 'Pendente',
      dueDate: t.due_date || '',
      assignee: t.assignee || 'Equipa Girassol',
      description: t.description || '',
      createdAt: t.created_at || new Date().toISOString()
    }));
  } catch (err) {
    console.warn('Falha ao obter tarefas do Supabase:', err);
    return null;
  }
}

// Save or Update a Task in Supabase
export async function saveTaskToSupabase(task: TaskItem): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const payload = {
      id: task.id,
      title: task.title,
      tag: task.tag,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate,
      assignee: task.assignee,
      description: task.description || '',
      created_at: task.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('tasks').upsert(payload);
    if (error) {
      console.error('Erro ao guardar tarefa no Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao sincronizar tarefa com Supabase:', err);
    return false;
  }
}

// Delete Task from Supabase
export async function deleteTaskFromSupabase(taskId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error('Erro ao eliminar tarefa do Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao eliminar tarefa do Supabase:', err);
    return false;
  }
}

// Save System Setting to Supabase (e.g., custom logo)
export async function saveSettingToSupabase(key: string, value: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('app_settings').upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) {
      console.warn('Erro ao guardar configuração no Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Falha ao guardar configuração no Supabase:', err);
    return false;
  }
}

// Fetch System Setting from Supabase
export async function fetchSettingFromSupabase(key: string): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('app_settings').select('value').eq('key', key).single();
    if (error || !data) return null;
    return data.value;
  } catch (err) {
    return null;
  }
}
