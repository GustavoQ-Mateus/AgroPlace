-- AgroPlace — Schema Completo para Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase na ordem apresentada.

-- ─────────────────────────────────────────────────────────────
-- 0. EXTENSÕES
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ─────────────────────────────────────────────────────────────
-- 0.1 TRIGGER updated_at automático
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 1. PERFIS (espelha auth.users do Supabase)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT        NOT NULL CHECK (role IN ('produtor','comprador','transportadora')),
  name          TEXT        NOT NULL,
  phone         TEXT,
  document      TEXT,
  company_name  TEXT,
  avatar_url    TEXT,
  verified      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger: cria perfil automático no cadastro
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'comprador'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. PERFIL PRODUTOR
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfis_produtor (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id          UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_name           TEXT        NOT NULL,
  car                 TEXT,
  rural_doc           TEXT,
  state_registration  TEXT,
  area_hectares       NUMERIC(10,2),
  cep                 TEXT,
  address             TEXT,
  city                TEXT        NOT NULL,
  state               CHAR(2)     NOT NULL,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.perfis_produtor ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_produtor_updated_at BEFORE UPDATE ON public.perfis_produtor
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 3. PERFIL CORPORATIVA
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfis_corporativa (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id          UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  razao_social        TEXT        NOT NULL,
  nome_fantasia       TEXT,
  cnpj                TEXT        NOT NULL,
  state_registration  TEXT,
  segment             TEXT,
  commercial_contact  TEXT,
  commercial_phone    TEXT,
  website             TEXT,
  city                TEXT        NOT NULL,
  state               CHAR(2)     NOT NULL,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.perfis_corporativa ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_corporativa_updated_at BEFORE UPDATE ON public.perfis_corporativa
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 4. PERFIL TRANSPORTADORA
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfis_transportadora (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id          UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  razao_social        TEXT        NOT NULL,
  nome_fantasia       TEXT,
  cnpj                TEXT        NOT NULL,
  rntrc               TEXT,
  vehicle_types       TEXT[],
  max_capacity_kg     NUMERIC(10,2),
  live_transport      BOOLEAN     NOT NULL DEFAULT TRUE,
  city                TEXT        NOT NULL,
  state               CHAR(2)     NOT NULL,
  description         TEXT,
  score               NUMERIC(4,2),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.perfis_transportadora ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_transportadora_updated_at BEFORE UPDATE ON public.perfis_transportadora
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.regioes_atendimento (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  carrier_id UUID    NOT NULL REFERENCES public.perfis_transportadora(id) ON DELETE CASCADE,
  state      CHAR(2) NOT NULL,
  city       TEXT
);
ALTER TABLE public.regioes_atendimento ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 5. ANÚNCIOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.anuncios (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             TEXT        NOT NULL,
  category          TEXT        NOT NULL CHECK (category IN ('bovinos','equinos','suinos','aves','ovinos','caprinos')),
  breed             TEXT,
  quantity          INTEGER     NOT NULL CHECK (quantity > 0),
  weight_min_kg     NUMERIC(8,2),
  weight_max_kg     NUMERIC(8,2),
  sex               TEXT        CHECK (sex IN ('macho_inteiro','macho_castrado','femea','misto')),
  age_months        INTEGER,
  price_total       NUMERIC(14,2) NOT NULL CHECK (price_total > 0),
  price_per_head    NUMERIC(14,2),
  price_per_arroba  NUMERIC(10,2),
  city              TEXT        NOT NULL,
  state             CHAR(2)     NOT NULL,
  farm_name         TEXT,
  description       TEXT,
  freight_mode      TEXT        NOT NULL DEFAULT 'plataforma'
                    CHECK (freight_mode IN ('plataforma','proprio','incluso')),
  status            TEXT        NOT NULL DEFAULT 'ativo'
                    CHECK (status IN ('ativo','pausado','vendido','cancelado')),
  views_count       INTEGER     NOT NULL DEFAULT 0,
  proposals_count   INTEGER     NOT NULL DEFAULT 0,
  traceability_score INTEGER    NOT NULL DEFAULT 0 CHECK (traceability_score BETWEEN 0 AND 100),
  search_vector     TSVECTOR,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.anuncios ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_anuncios_updated_at BEFORE UPDATE ON public.anuncios
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_anuncios_seller   ON public.anuncios(seller_id);
CREATE INDEX IF NOT EXISTS idx_anuncios_category ON public.anuncios(category);
CREATE INDEX IF NOT EXISTS idx_anuncios_state    ON public.anuncios(state);
CREATE INDEX IF NOT EXISTS idx_anuncios_status   ON public.anuncios(status);
CREATE INDEX IF NOT EXISTS idx_anuncios_price    ON public.anuncios(price_total);
CREATE INDEX IF NOT EXISTS idx_anuncios_created  ON public.anuncios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anuncios_search   ON public.anuncios USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_anuncios_title    ON public.anuncios USING GIN(title gin_trgm_ops);

CREATE OR REPLACE FUNCTION update_anuncio_search()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('portuguese', COALESCE(unaccent(NEW.title), '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(unaccent(NEW.breed), '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(unaccent(NEW.city), '')), 'C') ||
    setweight(to_tsvector('portuguese', COALESCE(unaccent(NEW.description), '')), 'D');
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_anuncios_search BEFORE INSERT OR UPDATE ON public.anuncios
  FOR EACH ROW EXECUTE FUNCTION update_anuncio_search();

-- ─────────────────────────────────────────────────────────────
-- 6. FOTOS DE ANÚNCIO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fotos_anuncio (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id   UUID        NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
  storage_path TEXT        NOT NULL,
  url          TEXT        NOT NULL,
  is_cover     BOOLEAN     NOT NULL DEFAULT FALSE,
  order_index  SMALLINT    NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.fotos_anuncio ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_fotos_anuncio ON public.fotos_anuncio(anuncio_id);

-- ─────────────────────────────────────────────────────────────
-- 7. RASTREABILIDADE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rastreabilidade (
  id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id   UUID    NOT NULL UNIQUE REFERENCES public.anuncios(id) ON DELETE CASCADE,
  gta          BOOLEAN NOT NULL DEFAULT FALSE,
  brucela      BOOLEAN NOT NULL DEFAULT FALSE,
  tuberculose  BOOLEAN NOT NULL DEFAULT FALSE,
  aftosa       BOOLEAN NOT NULL DEFAULT FALSE,
  raiva        BOOLEAN NOT NULL DEFAULT FALSE,
  carbunculo   BOOLEAN NOT NULL DEFAULT FALSE,
  dna          BOOLEAN NOT NULL DEFAULT FALSE,
  organico     BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.rastreabilidade ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_rastreabilidade_updated_at BEFORE UPDATE ON public.rastreabilidade
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION recalculate_traceability()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.anuncios
    SET traceability_score = ROUND((
      (NEW.gta::int + NEW.brucela::int + NEW.tuberculose::int + NEW.aftosa::int +
       NEW.raiva::int + NEW.carbunculo::int + NEW.dna::int + NEW.organico::int)::NUMERIC / 8
    ) * 100)
    WHERE id = NEW.anuncio_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_recalc_traceability AFTER INSERT OR UPDATE ON public.rastreabilidade
  FOR EACH ROW EXECUTE FUNCTION recalculate_traceability();

-- ─────────────────────────────────────────────────────────────
-- 8. FAVORITOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favoritos (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  anuncio_id UUID        NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, anuncio_id)
);
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_favoritos_user ON public.favoritos(user_id);

-- ─────────────────────────────────────────────────────────────
-- 9. PROPOSTAS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.propostas (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id       UUID        NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
  buyer_id         UUID        NOT NULL REFERENCES public.profiles(id),
  seller_id        UUID        NOT NULL REFERENCES public.profiles(id),
  price_offered    NUMERIC(14,2) NOT NULL,
  signal_pct       SMALLINT    NOT NULL DEFAULT 10 CHECK (signal_pct BETWEEN 5 AND 50),
  withdrawal_date  DATE,
  freight_mode     TEXT        NOT NULL DEFAULT 'plataforma',
  message          TEXT,
  status           TEXT        NOT NULL DEFAULT 'aguardando'
                   CHECK (status IN ('aguardando','aceita','recusada','cancelada','contratada')),
  seller_note      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_propostas_updated_at BEFORE UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_propostas_anuncio ON public.propostas(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_propostas_buyer   ON public.propostas(buyer_id);
CREATE INDEX IF NOT EXISTS idx_propostas_seller  ON public.propostas(seller_id);
CREATE INDEX IF NOT EXISTS idx_propostas_status  ON public.propostas(status);

CREATE OR REPLACE FUNCTION increment_proposals_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.anuncios SET proposals_count = proposals_count + 1 WHERE id = NEW.anuncio_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_proposals_count AFTER INSERT ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION increment_proposals_count();

-- ─────────────────────────────────────────────────────────────
-- 10. CONTRATOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contratos (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposta_id     UUID        NOT NULL UNIQUE REFERENCES public.propostas(id) ON DELETE CASCADE,
  anuncio_id      UUID        NOT NULL REFERENCES public.anuncios(id),
  buyer_id        UUID        NOT NULL REFERENCES public.profiles(id),
  seller_id       UUID        NOT NULL REFERENCES public.profiles(id),
  price_final     NUMERIC(14,2) NOT NULL,
  signal_value    NUMERIC(14,2) NOT NULL,
  withdrawal_date DATE        NOT NULL,
  doc_path        TEXT,
  buyer_signed    BOOLEAN     NOT NULL DEFAULT FALSE,
  seller_signed   BOOLEAN     NOT NULL DEFAULT FALSE,
  buyer_sign_name TEXT,
  seller_sign_name TEXT,
  buyer_signed_at TIMESTAMPTZ,
  seller_signed_at TIMESTAMPTZ,
  status          TEXT        NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente','assinado','concluido','cancelado')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_contratos_updated_at BEFORE UPDATE ON public.contratos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 11. SOLICITAÇÕES DE FRETE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.solicitacoes_frete (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id       UUID        REFERENCES public.anuncios(id) ON DELETE SET NULL,
  proposta_id      UUID        REFERENCES public.propostas(id) ON DELETE SET NULL,
  requester_id     UUID        NOT NULL REFERENCES public.profiles(id),
  origin_city      TEXT        NOT NULL,
  origin_state     CHAR(2)     NOT NULL,
  dest_city        TEXT        NOT NULL,
  dest_state       CHAR(2)     NOT NULL,
  species          TEXT        NOT NULL,
  quantity         INTEGER     NOT NULL,
  collection_window TEXT,
  notes            TEXT,
  status           TEXT        NOT NULL DEFAULT 'aberta'
                   CHECK (status IN ('aberta','cotando','confirmada','concluida','cancelada')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.solicitacoes_frete ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_frete_updated_at BEFORE UPDATE ON public.solicitacoes_frete
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 12. COTAÇÕES DE FRETE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cotacoes_frete (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitacao_id UUID        NOT NULL REFERENCES public.solicitacoes_frete(id) ON DELETE CASCADE,
  carrier_id     UUID        NOT NULL REFERENCES public.perfis_transportadora(id),
  price          NUMERIC(12,2) NOT NULL,
  deadline_days  SMALLINT,
  notes          TEXT,
  status         TEXT        NOT NULL DEFAULT 'enviada'
                 CHECK (status IN ('enviada','aceita','recusada')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.cotacoes_frete ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_cotacoes_solicitacao ON public.cotacoes_frete(solicitacao_id);
CREATE INDEX IF NOT EXISTS idx_cotacoes_carrier     ON public.cotacoes_frete(carrier_id);

-- ─────────────────────────────────────────────────────────────
-- 13. MENSAGENS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mensagens (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id  UUID        NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES public.profiles(id),
  receiver_id UUID        NOT NULL REFERENCES public.profiles(id),
  content     TEXT        NOT NULL,
  read        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_mensagens_anuncio  ON public.mensagens(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_sender   ON public.mensagens(sender_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_receiver ON public.mensagens(receiver_id);

-- ─────────────────────────────────────────────────────────────
-- 14. NOTIFICAÇÕES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT        NOT NULL,
  title      TEXT        NOT NULL,
  body       TEXT,
  payload    JSONB,
  read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_notificacoes_user ON public.notificacoes(user_id, read, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 15. FUNÇÃO: busca full-text de anúncios (RPC)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION search_anuncios(
  p_query     TEXT    DEFAULT NULL,
  p_category  TEXT    DEFAULT NULL,
  p_state     TEXT    DEFAULT NULL,
  p_price_min NUMERIC DEFAULT NULL,
  p_price_max NUMERIC DEFAULT NULL,
  p_trace_min INTEGER DEFAULT NULL,
  p_limit     INTEGER DEFAULT 50,
  p_offset    INTEGER DEFAULT 0
)
RETURNS TABLE (
  id                UUID,
  title             TEXT,
  category          TEXT,
  breed             TEXT,
  quantity          INTEGER,
  price_total       NUMERIC,
  price_per_head    NUMERIC,
  city              TEXT,
  state             CHAR,
  traceability_score INTEGER,
  views_count       INTEGER,
  proposals_count   INTEGER,
  status            TEXT,
  seller_name       TEXT,
  seller_verified   BOOLEAN,
  cover_url         TEXT,
  created_at        TIMESTAMPTZ,
  rank              REAL
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id, a.title, a.category, a.breed, a.quantity,
    a.price_total, a.price_per_head,
    a.city, a.state, a.traceability_score, a.views_count, a.proposals_count,
    a.status,
    p.name AS seller_name, p.verified AS seller_verified,
    f.url  AS cover_url,
    a.created_at,
    CASE WHEN p_query IS NOT NULL
      THEN ts_rank(a.search_vector, websearch_to_tsquery('portuguese', unaccent(p_query)))
      ELSE 1.0
    END::REAL AS rank
  FROM public.anuncios a
  JOIN public.profiles p ON p.id = a.seller_id
  LEFT JOIN public.fotos_anuncio f ON f.anuncio_id = a.id AND f.is_cover = TRUE
  WHERE
    a.status = 'ativo'
    AND (p_query    IS NULL OR a.search_vector @@ websearch_to_tsquery('portuguese', unaccent(p_query))
         OR a.title ILIKE '%' || p_query || '%'
         OR a.breed ILIKE '%' || p_query || '%'
         OR a.city  ILIKE '%' || p_query || '%')
    AND (p_category IS NULL OR a.category  = p_category)
    AND (p_state    IS NULL OR a.state     = p_state)
    AND (p_price_min IS NULL OR a.price_total >= p_price_min)
    AND (p_price_max IS NULL OR a.price_total <= p_price_max)
    AND (p_trace_min IS NULL OR a.traceability_score >= p_trace_min)
  ORDER BY rank DESC, a.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 16. FUNÇÃO: incrementar visualizações (RPC)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_view(p_anuncio_id UUID)
RETURNS VOID LANGUAGE SQL SECURITY DEFINER AS $$
  UPDATE public.anuncios SET views_count = views_count + 1 WHERE id = p_anuncio_id;
$$;

-- ─────────────────────────────────────────────────────────────
-- 17. NOTIFICAÇÕES AUTOMÁTICAS (triggers)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION notify_on_proposal_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.status = 'aguardando' AND NEW.status = 'aceita' THEN
    INSERT INTO public.notificacoes(user_id, type, title, body, payload)
    VALUES (NEW.buyer_id, 'proposta_aceita', 'Sua proposta foi aceita!',
      'O vendedor aceitou. Acesse para assinar o contrato.',
      jsonb_build_object('proposta_id', NEW.id, 'anuncio_id', NEW.anuncio_id));
  END IF;
  IF OLD.status = 'aguardando' AND NEW.status = 'recusada' THEN
    INSERT INTO public.notificacoes(user_id, type, title, body, payload)
    VALUES (NEW.buyer_id, 'proposta_recusada', 'Proposta não aceita',
      'O vendedor não aceitou sua proposta.',
      jsonb_build_object('proposta_id', NEW.id, 'anuncio_id', NEW.anuncio_id));
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_notify_proposal AFTER UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION notify_on_proposal_status();

CREATE OR REPLACE FUNCTION notify_seller_new_proposal()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.notificacoes(user_id, type, title, body, payload)
  VALUES (NEW.seller_id, 'nova_proposta', 'Nova proposta recebida!',
    'Você recebeu uma proposta para um dos seus lotes.',
    jsonb_build_object('proposta_id', NEW.id, 'anuncio_id', NEW.anuncio_id));
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_notify_seller AFTER INSERT ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION notify_seller_new_proposal();

-- ─────────────────────────────────────────────────────────────
-- 18. ROW LEVEL SECURITY — POLICIES
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "profiles: leitura pública"     ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles: owner update"        ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "produtor: leitura pública"     ON public.perfis_produtor FOR SELECT USING (true);
CREATE POLICY "produtor: owner all"           ON public.perfis_produtor FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "corporativa: leitura pública"  ON public.perfis_corporativa FOR SELECT USING (true);
CREATE POLICY "corporativa: owner all"        ON public.perfis_corporativa FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "transportadora: leitura"       ON public.perfis_transportadora FOR SELECT USING (true);
CREATE POLICY "transportadora: owner all"     ON public.perfis_transportadora FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "regioes: leitura pública"      ON public.regioes_atendimento FOR SELECT USING (true);
CREATE POLICY "regioes: carrier owner"        ON public.regioes_atendimento FOR ALL USING (
  auth.uid() = (SELECT profile_id FROM public.perfis_transportadora WHERE id = carrier_id)
);
CREATE POLICY "anuncios: leitura pública"     ON public.anuncios FOR SELECT USING (status = 'ativo' OR seller_id = auth.uid());
CREATE POLICY "anuncios: seller insert"       ON public.anuncios FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "anuncios: seller update"       ON public.anuncios FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "anuncios: seller delete"       ON public.anuncios FOR DELETE USING (auth.uid() = seller_id);
CREATE POLICY "fotos: leitura pública"        ON public.fotos_anuncio FOR SELECT USING (true);
CREATE POLICY "fotos: seller all"             ON public.fotos_anuncio FOR ALL USING (
  auth.uid() = (SELECT seller_id FROM public.anuncios WHERE id = anuncio_id)
);
CREATE POLICY "rastreabilidade: leitura"      ON public.rastreabilidade FOR SELECT USING (true);
CREATE POLICY "rastreabilidade: seller all"   ON public.rastreabilidade FOR ALL USING (
  auth.uid() = (SELECT seller_id FROM public.anuncios WHERE id = anuncio_id)
);
CREATE POLICY "favoritos: owner only"         ON public.favoritos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "propostas: partes"             ON public.propostas FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "propostas: comprador insere"   ON public.propostas FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "propostas: atualização"        ON public.propostas FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);
CREATE POLICY "contratos: partes"             ON public.contratos FOR ALL USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "frete: requester ve suas"      ON public.solicitacoes_frete FOR SELECT USING (auth.uid() = requester_id);
CREATE POLICY "frete: transportadora ve abertas" ON public.solicitacoes_frete FOR SELECT USING (status = 'aberta');
CREATE POLICY "frete: requester insere"       ON public.solicitacoes_frete FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "frete: requester atualiza"     ON public.solicitacoes_frete FOR UPDATE USING (auth.uid() = requester_id);
CREATE POLICY "cotacoes: carrier ve suas"     ON public.cotacoes_frete FOR SELECT USING (
  auth.uid() = (SELECT profile_id FROM public.perfis_transportadora WHERE id = carrier_id)
);
CREATE POLICY "cotacoes: requester ve"        ON public.cotacoes_frete FOR SELECT USING (
  auth.uid() = (SELECT requester_id FROM public.solicitacoes_frete WHERE id = solicitacao_id)
);
CREATE POLICY "cotacoes: carrier insere"      ON public.cotacoes_frete FOR INSERT WITH CHECK (
  auth.uid() = (SELECT profile_id FROM public.perfis_transportadora WHERE id = carrier_id)
);
CREATE POLICY "mensagens: participantes"      ON public.mensagens FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "notificacoes: owner only"      ON public.notificacoes FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 19. REALTIME
-- ─────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.notificacoes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mensagens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.propostas;
