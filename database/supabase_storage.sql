-- =============================================================
--  AgroPlace — Storage Buckets e Políticas
--  Execute APÓS o supabase_schema.sql
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. BUCKETS
-- ─────────────────────────────────────────────────────────────

-- Fotos de anúncios (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'anuncio-fotos',
  'anuncio-fotos',
  true,
  20971520,  -- 20 MB
  ARRAY['image/jpeg','image/png','image/webp','image/avif']
) ON CONFLICT (id) DO NOTHING;

-- Documentos de contrato (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contratos',
  'contratos',
  false,
  10485760,  -- 10 MB
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Documentos de rastreabilidade (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rastreabilidade-docs',
  'rastreabilidade-docs',
  false,
  10485760,
  ARRAY['application/pdf','image/jpeg','image/png']
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 2. STORAGE POLICIES — anuncio-fotos (público)
-- ─────────────────────────────────────────────────────────────

-- Qualquer pessoa pode visualizar fotos de anúncios
CREATE POLICY "fotos anuncio: leitura publica"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'anuncio-fotos');

-- Usuário autenticado sobe foto na pasta de seu anuncio
-- Estrutura do path: {seller_id}/{anuncio_id}/{filename}
CREATE POLICY "fotos anuncio: upload autenticado"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'anuncio-fotos'
    AND auth.uid()::TEXT = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "fotos anuncio: update do dono"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'anuncio-fotos'
    AND auth.uid()::TEXT = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "fotos anuncio: delete do dono"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'anuncio-fotos'
    AND auth.uid()::TEXT = (string_to_array(name, '/'))[1]
  );

-- ─────────────────────────────────────────────────────────────
-- 3. STORAGE POLICIES — contratos (privado)
-- ─────────────────────────────────────────────────────────────

-- Somente partes do contrato podem ver
-- Path: {contrato_id}/{filename}
CREATE POLICY "contratos: apenas partes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contratos'
    AND auth.uid() IN (
      SELECT buyer_id  FROM public.contratos WHERE id::TEXT = (string_to_array(name, '/'))[1]
      UNION
      SELECT seller_id FROM public.contratos WHERE id::TEXT = (string_to_array(name, '/'))[1]
    )
  );

CREATE POLICY "contratos: upload por parte"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contratos'
    AND auth.uid() IN (
      SELECT buyer_id  FROM public.contratos WHERE id::TEXT = (string_to_array(name, '/'))[1]
      UNION
      SELECT seller_id FROM public.contratos WHERE id::TEXT = (string_to_array(name, '/'))[1]
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 4. STORAGE POLICIES — rastreabilidade-docs (privado)
-- ─────────────────────────────────────────────────────────────

-- Path: {seller_id}/{anuncio_id}/{filename}
CREATE POLICY "rastreat docs: apenas dono"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'rastreabilidade-docs'
    AND auth.uid()::TEXT = (string_to_array(name, '/'))[1]
  );
