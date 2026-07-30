import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseCredentials(): { url: string; key: string } {
  const metaEnv = (import.meta as any).env || {};
  const url =
    (typeof window !== 'undefined' && localStorage.getItem('girassol_supabase_url')) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
    metaEnv.VITE_SUPABASE_URL ||
    'https://yznumczxufmuctanxzjv.supabase.co';

  const key =
    (typeof window !== 'undefined' && localStorage.getItem('girassol_supabase_anon_key')) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    '';

  return { url: url.trim(), key: key.trim() };
}

export function validateSupabaseCredentials(url: string, key: string): { valid: boolean; message: string } {
  if (!url || !key) {
    return {
      valid: false,
      message: 'Por favor preencha tanto o URL do Projeto como a Chave Anon/Pública do Supabase.'
    };
  }

  // Check if user accidentally swapped URL and Key
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return {
      valid: false,
      message: 'Os campos parecem trocados! O campo "SUPABASE PROJECT URL" deve conter o endereço https://... e o campo "SUPABASE ANON KEY" a chave.'
    };
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.startsWith('sb_') || url.startsWith('eyJ')) {
      return {
        valid: false,
        message: `O campo "SUPABASE PROJECT URL" recebeu uma chave API (${url.substring(0, 18)}...) em vez do URL do projeto. O URL do Supabase tem o formato: https://SEU_PROJETO.supabase.co`
      };
    }
    return {
      valid: false,
      message: 'O URL do projeto Supabase deve ser um endereço válido iniciando por https:// (exemplo: https://xyz.supabase.co)'
    };
  }

  return { valid: true, message: 'Credenciais com formato válido.' };
}

export function getSupabase(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  const validation = validateSupabaseCredentials(url, key);
  if (!validation.valid) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (err) {
      console.error('Erro ao inicializar cliente Supabase:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function resetSupabaseInstance() {
  supabaseInstance = null;
}

// SQL DDL Schema string to display in UI for quick copy-paste setup in Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- BANCO DE DADOS REDE GIRASSOL (SUPABASE SQL SCHEMA)
-- Execute este script no SQL Editor do seu projeto Supabase para criar as tabelas necessárias.

-- 1. Tabela de Tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Geral',
  priority TEXT NOT NULL DEFAULT 'Média',
  status TEXT NOT NULL DEFAULT 'Pendente',
  due_date TEXT,
  assignee TEXT,
  assignee_role TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Planeamento de Redes Sociais / Postagens
CREATE TABLE IF NOT EXISTS public.social_posts (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  time TEXT,
  status TEXT NOT NULL DEFAULT 'Rascunho',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Membros da Equipa
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Configurações do Sistema (Ex: Logótipo da Empresa)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Políticas de Acesso Público para Leitura/Escrita (Desenvolvimento)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso Total Tarefas" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Postagens" ON public.social_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Equipa" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Configurações" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
`;
