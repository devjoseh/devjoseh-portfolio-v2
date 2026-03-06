-- ============================================================
-- Tabela "about_settings" para a seção "Quem Sou Eu"
-- Execute este script no DBeaver
-- ============================================================

CREATE TABLE public.about_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bio text NOT NULL DEFAULT '',
    profile_image_url varchar(500) NULL,
    social_links jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NULL,
    updated_at timestamptz DEFAULT now() NULL,
    CONSTRAINT about_settings_pkey PRIMARY KEY (id)
);

-- Table Triggers
CREATE TRIGGER update_about_settings_updated_at BEFORE UPDATE ON public.about_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.about_settings ENABLE ROW LEVEL SECURITY;

-- Políticas da tabela
CREATE POLICY "Public can view about settings" ON public.about_settings
    AS PERMISSIVE FOR SELECT USING (true);

CREATE POLICY "Admin can completely manage about settings" ON public.about_settings
    AS PERMISSIVE FOR ALL 
    USING (auth.role() = 'authenticated'::text) 
    WITH CHECK (auth.role() = 'authenticated'::text);


-- ============================================================
-- Políticas de Storage para o novo bucket 'portfolio_assets'
-- PS: Certifique-se de criar o bucket "portfolio_assets" no painel do Supabase antes
-- (Public Bucket: true) e depois rodar essas policies de security.
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio_assets', 'portfolio_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Permite leitura pública
CREATE POLICY "Public can read portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio_assets');

-- Permite upload (insert/update) por admin
CREATE POLICY "Admin can upload portfolio assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio_assets');

CREATE POLICY "Admin can update portfolio assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio_assets');

CREATE POLICY "Admin can delete portfolio assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio_assets');
