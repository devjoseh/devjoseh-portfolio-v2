-- ============================================================
-- Tabelas "skill_categories" e update de "skills"
-- Execute este script no DBeaver para gerenciar Linguagens e Ferramentas
-- ============================================================

-- 1. Criação da tabela de categorias de Skills
CREATE TABLE public.skill_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name varchar(100) NOT NULL,
    order_index int4 DEFAULT 0 NULL,
    created_at timestamptz DEFAULT now() NULL,
    updated_at timestamptz DEFAULT now() NULL,
    CONSTRAINT skill_categories_pkey PRIMARY KEY (id)
);

-- Index e Triggers da nova tabela
CREATE INDEX idx_skill_categories_order_index ON public.skill_categories USING btree (order_index);

CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON public.skill_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS nas Categorias
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skill categories" ON public.skill_categories
    AS PERMISSIVE FOR SELECT USING (true);

CREATE POLICY "Admin can completely manage skill categories" ON public.skill_categories
    AS PERMISSIVE FOR ALL 
    USING (auth.role() = 'authenticated'::text) 
    WITH CHECK (auth.role() = 'authenticated'::text);


-- 2. Atualização da tabela "skills" existente
-- Adicionar nova coluna com foreign key
ALTER TABLE public.skills 
ADD COLUMN category_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL;

-- PS: A coluna "category" antiga em varchar não será dropada imediatamente para não quebrar 
-- o app em produção em caso de rollback, mas será depreciada em função de "category_id"
-- Removemos a obrigatoriedade da coluna antiga para não gerar erros no novo insert.
ALTER TABLE public.skills ALTER COLUMN category DROP NOT NULL;

-- Se for necessário reordenar skills separadas também poderemos inserir:
ALTER TABLE public.skills
ADD COLUMN order_index int4 DEFAULT 0 NULL;

-- Habilita nova RLS para os campos adicionados se necessário, mas as policies da "skills" 
-- já permitem "Admin ALL" e "Public Select", então herdará na nova relacionalidade.
