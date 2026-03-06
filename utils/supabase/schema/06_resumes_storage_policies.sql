-- ============================================================
-- Políticas de Storage para o bucket 'resumes'
-- Execute este script no DBeaver conectado ao Supabase
-- ============================================================

-- Permite que qualquer pessoa leia/baixe arquivos do bucket
CREATE POLICY "Public can read resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

-- Permite que usuários autenticados (admin) façam upload
CREATE POLICY "Admin can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Permite que usuários autenticados atualizem arquivos
CREATE POLICY "Admin can update resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

-- Permite que usuários autenticados deletem arquivos
CREATE POLICY "Admin can delete resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');
