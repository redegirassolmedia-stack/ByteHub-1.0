-- MERCADO PAYPAY INITIAL SCHEMA
-- Execute this in your Supabase SQL Editor

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    icon text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    display_name text,
    avatar_url text,
    phone text,
    city text,
    state text,
    country text DEFAULT 'Angola',
    subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    is_admin boolean DEFAULT false,
    require_password_change boolean DEFAULT false,
    trial_expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- LISTINGS
CREATE TABLE IF NOT EXISTS public.listings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.categories(id),
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    images text[] DEFAULT '{}',
    city text,
    state text,
    country text DEFAULT 'Angola',
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    search_vector tsvector
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, listing_id)
);

-- 3. SEARCH SETUP
CREATE INDEX IF NOT EXISTS listings_search_idx ON public.listings USING gin(search_vector);

CREATE OR REPLACE FUNCTION public.listings_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('portuguese', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.description, '')), 'B');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_listings_search BEFORE INSERT OR UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.listings_search_trigger();

-- 4. PROFILE AUTOMATION
-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, country, trial_expires_at)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'display_name',
    COALESCE(new.raw_user_meta_data->>'country', 'Angola'),
    now() + interval '3 months'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. INITIAL DATA (CATEGORIES)
INSERT INTO public.categories (name, slug, icon) VALUES
('Autos e peças', 'autos', 'car'),
('Imóveis', 'imoveis', 'home'),
('Eletrônicos', 'eletronicos', 'laptop'),
('Moda', 'moda', 'shirt'),
('Casa e Jardim', 'casa', 'armchair'),
('Esportes', 'esportes', 'trophy'),
('Serviços', 'servicos', 'briefcase'),
('Empregos', 'empregos', 'user-plus')
ON CONFLICT (slug) DO NOTHING;

-- 6. STORAGE SETUP (Buckets)
-- This needs to be done via UI: Create a bucket named 'listings' and set it to public.
