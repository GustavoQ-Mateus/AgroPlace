-- =============================================================
--  TRABALHO FINAL — AMBIENTE DE DADOS — UNIFOR 2026.1
--  Disciplina : Ambiente de Dados
--  Professor  : Pedro Hericson Machado Araújo
--  Projeto    : AgroPlace — Marketplace B2B/B2C de Animais
--  Banco      : PostgreSQL 15+
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 0 — LIMPEZA E EXTENSÕES
-- ─────────────────────────────────────────────────────────────
DROP SCHEMA IF EXISTS agroplace CASCADE;
CREATE SCHEMA agroplace;
SET search_path TO agroplace;

-- Suporte a UUIDs e busca textual
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 1 — DDL: CRIAÇÃO DE TABELAS COM CONSTRAINTS
-- ─────────────────────────────────────────────────────────────

-- 1.1 USUÁRIOS
-- Entidade central do sistema. Armazena qualquer participante
-- (produtor, comprador, transportadora).
CREATE TABLE usuarios (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome         VARCHAR(160) NOT NULL,
    email        VARCHAR(180) NOT NULL UNIQUE,
    telefone     VARCHAR(20)  NOT NULL,
    documento    VARCHAR(18)  NOT NULL UNIQUE,    -- CPF ou CNPJ
    perfil       VARCHAR(20)  NOT NULL DEFAULT 'comprador'
                 CHECK (perfil IN ('produtor','comprador','transportadora')),
    verificado   BOOLEAN      NOT NULL DEFAULT FALSE,
    ativo        BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 PRODUTORES
-- Informações específicas do perfil de produtor rural.
-- Atributo derivado: score_rastreabilidade (calculado via trigger)
CREATE TABLE produtores (
    id               UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id       UUID         NOT NULL UNIQUE
                     REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_fazenda     VARCHAR(180) NOT NULL,
    car              VARCHAR(80)  UNIQUE,          -- Cadastro Ambiental Rural
    inscricao_rural  VARCHAR(60),
    area_hectares    NUMERIC(10,2) CHECK (area_hectares > 0),
    municipio        VARCHAR(120) NOT NULL,
    estado           CHAR(2)      NOT NULL,
    descricao        TEXT,
    criado_em        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 1.3 COMPRADORES CORPORATIVOS
CREATE TABLE compradores (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id        UUID         NOT NULL UNIQUE
                      REFERENCES usuarios(id) ON DELETE CASCADE,
    razao_social      VARCHAR(180) NOT NULL,
    cnpj              VARCHAR(18)  NOT NULL UNIQUE,
    segmento          VARCHAR(120),
    municipio         VARCHAR(120) NOT NULL,
    estado            CHAR(2)      NOT NULL,
    criado_em         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 1.4 TRANSPORTADORAS
CREATE TABLE transportadoras (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id        UUID         NOT NULL UNIQUE
                      REFERENCES usuarios(id) ON DELETE CASCADE,
    razao_social      VARCHAR(180) NOT NULL,
    cnpj              VARCHAR(18)  NOT NULL UNIQUE,
    rntrc             VARCHAR(40),                 -- Registro ANTT
    capacidade_kg     NUMERIC(10,2) CHECK (capacidade_kg > 0),
    municipio         VARCHAR(120) NOT NULL,
    estado            CHAR(2)      NOT NULL,
    score             NUMERIC(5,2) DEFAULT 0.00
                      CHECK (score BETWEEN 0 AND 100),
    criado_em         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 1.5 ANÚNCIOS (entidade principal)
-- Atributo derivado: score_rastreabilidade (calculado por trigger)
-- Atributo derivado: preco_por_cabeca = preco_total / quantidade
CREATE TABLE anuncios (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    produtor_id         UUID         NOT NULL
                        REFERENCES usuarios(id),
    titulo              VARCHAR(200) NOT NULL,
    especie             VARCHAR(30)  NOT NULL
                        CHECK (especie IN ('bovinos','equinos','suinos','aves','ovinos','caprinos')),
    raca                VARCHAR(120),
    quantidade          INTEGER      NOT NULL CHECK (quantidade > 0),
    peso_medio_kg       NUMERIC(8,2) CHECK (peso_medio_kg > 0),
    sexo                VARCHAR(20)  NOT NULL
                        CHECK (sexo IN ('macho_inteiro','macho_castrado','femea','misto')),
    preco_total         NUMERIC(14,2) NOT NULL CHECK (preco_total > 0),
    -- ATRIBUTO DERIVADO: calculado automaticamente
    preco_por_cabeca    NUMERIC(14,2) GENERATED ALWAYS AS (preco_total / quantidade) STORED,
    preco_por_arroba    NUMERIC(10,2),
    municipio           VARCHAR(120) NOT NULL,
    estado              CHAR(2)      NOT NULL,
    nome_fazenda        VARCHAR(180),
    descricao           TEXT,
    modalidade_frete    VARCHAR(20)  NOT NULL DEFAULT 'plataforma'
                        CHECK (modalidade_frete IN ('plataforma','proprio','incluso')),
    status              VARCHAR(20)  NOT NULL DEFAULT 'ativo'
                        CHECK (status IN ('ativo','pausado','vendido','cancelado')),
    visualizacoes       INTEGER      NOT NULL DEFAULT 0,
    -- ATRIBUTO DERIVADO: atualizado por trigger
    score_rastreabilidade INTEGER    NOT NULL DEFAULT 0
                          CHECK (score_rastreabilidade BETWEEN 0 AND 100),
    criado_em           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 1.6 FOTOS DOS ANÚNCIOS
CREATE TABLE fotos_anuncio (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id  UUID        NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    url         TEXT        NOT NULL,
    capa        BOOLEAN     NOT NULL DEFAULT FALSE,
    ordem       SMALLINT    NOT NULL DEFAULT 0,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.7 RASTREABILIDADE
-- Documentação sanitária de cada anúncio
CREATE TABLE rastreabilidade (
    id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id   UUID    NOT NULL UNIQUE REFERENCES anuncios(id) ON DELETE CASCADE,
    gta          BOOLEAN NOT NULL DEFAULT FALSE,  -- Guia de Trânsito Animal
    brucela      BOOLEAN NOT NULL DEFAULT FALSE,
    tuberculose  BOOLEAN NOT NULL DEFAULT FALSE,
    aftosa       BOOLEAN NOT NULL DEFAULT FALSE,
    raiva        BOOLEAN NOT NULL DEFAULT FALSE,
    carbunculo   BOOLEAN NOT NULL DEFAULT FALSE,
    dna          BOOLEAN NOT NULL DEFAULT FALSE,
    organico     BOOLEAN NOT NULL DEFAULT FALSE,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 1.8 FAVORITOS — ENTIDADE ASSOCIATIVA (N:M)
-- Um usuário pode salvar MUITOS anúncios
-- Um anúncio pode ser salvo por MUITOS usuários
-- → Resolução da cardinalidade N:M via tabela associativa
-- ─────────────────────────────────────────────────────────────
CREATE TABLE favoritos (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id  UUID        NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
    anuncio_id  UUID        NOT NULL REFERENCES anuncios(id)  ON DELETE CASCADE,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (usuario_id, anuncio_id)           -- PK composta lógica
);

-- 1.9 PROPOSTAS
CREATE TABLE propostas (
    id               UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id       UUID         NOT NULL REFERENCES anuncios(id),
    comprador_id     UUID         NOT NULL REFERENCES usuarios(id),
    vendedor_id      UUID         NOT NULL REFERENCES usuarios(id),
    valor_proposto   NUMERIC(14,2) NOT NULL CHECK (valor_proposto > 0),
    percentual_sinal SMALLINT     NOT NULL DEFAULT 10
                     CHECK (percentual_sinal BETWEEN 5 AND 50),
    data_retirada    DATE,
    modalidade_frete VARCHAR(80),
    mensagem         TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'aguardando'
                     CHECK (status IN ('aguardando','aceita','recusada','cancelada','contratada')),
    nota_vendedor    TEXT,
    criado_em        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 1.10 CONTRATOS
CREATE TABLE contratos (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposta_id     UUID         NOT NULL UNIQUE REFERENCES propostas(id),
    anuncio_id      UUID         NOT NULL REFERENCES anuncios(id),
    comprador_id    UUID         NOT NULL REFERENCES usuarios(id),
    vendedor_id     UUID         NOT NULL REFERENCES usuarios(id),
    valor_final     NUMERIC(14,2) NOT NULL,
    valor_sinal     NUMERIC(14,2) NOT NULL,
    data_retirada   DATE         NOT NULL,
    assinado_comprador BOOLEAN   NOT NULL DEFAULT FALSE,
    assinado_vendedor  BOOLEAN   NOT NULL DEFAULT FALSE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente','assinado','concluido','cancelado')),
    criado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 1.11 SOLICITAÇÕES DE FRETE + COTAÇÕES — N:M
-- Uma transportadora pode cotar MUITAS solicitações
-- Uma solicitação pode ter cotações de MUITAS transportadoras
-- ─────────────────────────────────────────────────────────────
CREATE TABLE solicitacoes_frete (
    id               UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id       UUID         REFERENCES anuncios(id),
    solicitante_id   UUID         NOT NULL REFERENCES usuarios(id),
    origem_municipio VARCHAR(120) NOT NULL,
    origem_estado    CHAR(2)      NOT NULL,
    destino_municipio VARCHAR(120) NOT NULL,
    destino_estado   CHAR(2)      NOT NULL,
    especie          VARCHAR(30)  NOT NULL,
    quantidade       INTEGER      NOT NULL CHECK (quantidade > 0),
    janela_coleta    TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'aberta'
                     CHECK (status IN ('aberta','cotando','confirmada','concluida','cancelada')),
    criado_em        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ENTIDADE ASSOCIATIVA N:M
CREATE TABLE cotacoes_frete (
    id                 UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitacao_id     UUID         NOT NULL REFERENCES solicitacoes_frete(id) ON DELETE CASCADE,
    transportadora_id  UUID         NOT NULL REFERENCES transportadoras(id),
    valor              NUMERIC(12,2) NOT NULL CHECK (valor > 0),
    prazo_dias         SMALLINT     CHECK (prazo_dias > 0),
    observacoes        TEXT,
    status             VARCHAR(20)  NOT NULL DEFAULT 'enviada'
                       CHECK (status IN ('enviada','aceita','recusada')),
    criado_em          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (solicitacao_id, transportadora_id)
);

-- 1.12 MENSAGENS
CREATE TABLE mensagens (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id   UUID        NOT NULL REFERENCES anuncios(id),
    remetente_id UUID        NOT NULL REFERENCES usuarios(id),
    destinatario_id UUID     NOT NULL REFERENCES usuarios(id),
    conteudo     TEXT        NOT NULL,
    lida         BOOLEAN     NOT NULL DEFAULT FALSE,
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_diferentes CHECK (remetente_id <> destinatario_id)
);

-- 1.13 TABELA DE AUDITORIA (usada pelo AFTER trigger)
CREATE TABLE log_auditoria (
    id            BIGSERIAL    PRIMARY KEY,
    tabela        VARCHAR(60)  NOT NULL,
    operacao      VARCHAR(10)  NOT NULL,   -- UPDATE / INSERT / DELETE
    registro_id   UUID         NOT NULL,
    campo         VARCHAR(80)  NOT NULL,
    valor_antigo  TEXT,
    valor_novo    TEXT,
    usuario_db    TEXT         NOT NULL DEFAULT current_user,
    registrado_em TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- ÍNDICES DE PERFORMANCE
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_anuncios_especie   ON anuncios(especie);
CREATE INDEX idx_anuncios_estado    ON anuncios(estado);
CREATE INDEX idx_anuncios_status    ON anuncios(status);
CREATE INDEX idx_anuncios_preco     ON anuncios(preco_total);
CREATE INDEX idx_anuncios_produtor  ON anuncios(produtor_id);
CREATE INDEX idx_propostas_anuncio  ON propostas(anuncio_id);
CREATE INDEX idx_propostas_status   ON propostas(status);
CREATE INDEX idx_favoritos_usuario  ON favoritos(usuario_id);
CREATE INDEX idx_cotacoes_solic     ON cotacoes_frete(solicitacao_id);

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 2 — EVOLUÇÃO DO ESQUEMA (ALTER TABLE / RENAME)
-- ─────────────────────────────────────────────────────────────

-- 2.1 Adiciona campo de avatar ao usuário (evolução pós-MVP)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2.2 Adiciona campo de video ao anúncio
ALTER TABLE anuncios ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2.3 Renomeia coluna para maior clareza semântica
ALTER TABLE transportadoras RENAME COLUMN capacidade_kg TO capacidade_max_kg;

-- 2.4 Adiciona constraint de e-mail mínimo após carga inicial
ALTER TABLE usuarios ADD CONSTRAINT chk_email_formato
    CHECK (email LIKE '%@%.%');

-- 2.5 Adiciona coluna de data_nascimento ao comprador
ALTER TABLE compradores ADD COLUMN IF NOT EXISTS data_fundacao DATE;

-- 2.6 Cria índice parcial para busca eficiente de anúncios ativos
CREATE INDEX IF NOT EXISTS idx_anuncios_ativos
    ON anuncios(criado_em DESC)
    WHERE status = 'ativo';

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 3 — FUNÇÕES AUXILIARES
-- ─────────────────────────────────────────────────────────────

-- Função utilitária: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION fn_set_atualizado_em()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$;

-- Aplica em todas as tabelas que têm atualizado_em
CREATE TRIGGER trg_usuarios_updated
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_set_atualizado_em();

CREATE TRIGGER trg_anuncios_updated
    BEFORE UPDATE ON anuncios
    FOR EACH ROW EXECUTE FUNCTION fn_set_atualizado_em();

CREATE TRIGGER trg_propostas_updated
    BEFORE UPDATE ON propostas
    FOR EACH ROW EXECUTE FUNCTION fn_set_atualizado_em();

CREATE TRIGGER trg_contratos_updated
    BEFORE UPDATE ON contratos
    FOR EACH ROW EXECUTE FUNCTION fn_set_atualizado_em();

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 4 — TRIGGERS OBRIGATÓRIOS
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- 4.1 TRIGGER BEFORE — VALIDAÇÃO
-- Impede que um comprador envie proposta duplicada (aguardando)
-- para o mesmo anúncio. Também bloqueia proposta em anúncio
-- que não está ativo (vendido/cancelado/pausado).
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_validar_proposta()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_status_anuncio  VARCHAR(20);
    v_proposta_existe BOOLEAN;
BEGIN
    -- Verifica se o anúncio está ativo
    SELECT status INTO v_status_anuncio
    FROM anuncios WHERE id = NEW.anuncio_id;

    IF v_status_anuncio <> 'ativo' THEN
        RAISE EXCEPTION
            'ERRO: Não é possível enviar proposta para anúncio com status "%". '
            'Somente anúncios ativos aceitam propostas.', v_status_anuncio;
    END IF;

    -- Verifica se o comprador já tem proposta aguardando para este anúncio
    SELECT EXISTS (
        SELECT 1 FROM propostas
        WHERE anuncio_id   = NEW.anuncio_id
          AND comprador_id = NEW.comprador_id
          AND status       = 'aguardando'
    ) INTO v_proposta_existe;

    IF v_proposta_existe THEN
        RAISE EXCEPTION
            'ERRO: Você já possui uma proposta aguardando para este anúncio. '
            'Aguarde a resposta do vendedor ou cancele a proposta anterior.';
    END IF;

    -- Impede que o próprio produtor envie proposta em seu anúncio
    IF NEW.comprador_id = NEW.vendedor_id THEN
        RAISE EXCEPTION 'ERRO: O produtor não pode enviar proposta no próprio anúncio.';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_proposta
    BEFORE INSERT ON propostas
    FOR EACH ROW EXECUTE FUNCTION fn_validar_proposta();

-- ─────────────────────────────────────────────────────────────
-- 4.2 TRIGGER AFTER — AUDITORIA
-- Registra log toda vez que o status de um anúncio ou proposta
-- é alterado. Rastreia: qual registro, de qual valor, para qual
-- valor, e quando ocorreu.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_auditar_status_anuncio()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO log_auditoria (tabela, operacao, registro_id, campo, valor_antigo, valor_novo)
        VALUES ('anuncios', 'UPDATE', NEW.id, 'status', OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_anuncio_status
    AFTER UPDATE ON anuncios
    FOR EACH ROW EXECUTE FUNCTION fn_auditar_status_anuncio();

-- Auditoria de propostas
CREATE OR REPLACE FUNCTION fn_auditar_status_proposta()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO log_auditoria (tabela, operacao, registro_id, campo, valor_antigo, valor_novo)
        VALUES ('propostas', 'UPDATE', NEW.id, 'status', OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_proposta_status
    AFTER UPDATE ON propostas
    FOR EACH ROW EXECUTE FUNCTION fn_auditar_status_proposta();

-- ─────────────────────────────────────────────────────────────
-- 4.3 TRIGGER AFTER — RECALCULO DO SCORE DE RASTREABILIDADE
-- Recalcula automaticamente score_rastreabilidade no anúncio
-- sempre que os documentos sanitários são atualizados.
-- Demonstra atributo DERIVADO mantido por trigger.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_recalcular_rastreabilidade()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_total   INTEGER := 8;
    v_marcados INTEGER;
    v_score   INTEGER;
BEGIN
    SELECT (
        NEW.gta::int + NEW.brucela::int + NEW.tuberculose::int +
        NEW.aftosa::int + NEW.raiva::int + NEW.carbunculo::int +
        NEW.dna::int   + NEW.organico::int
    ) INTO v_marcados;

    v_score := ROUND((v_marcados::NUMERIC / v_total) * 100);

    UPDATE anuncios
        SET score_rastreabilidade = v_score
        WHERE id = NEW.anuncio_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_score_rastreabilidade
    AFTER INSERT OR UPDATE ON rastreabilidade
    FOR EACH ROW EXECUTE FUNCTION fn_recalcular_rastreabilidade();

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 5 — VIEWS OBRIGATÓRIAS
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- 5.1 VIEW DE SEGURANÇA
-- Oculta dados sensíveis: documento, telefone, endereço exato
-- da fazenda e preço exato. Expõe apenas o necessário para
-- navegação pública no catálogo.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_catalogo_publico AS
SELECT
    a.id,
    a.titulo,
    a.especie,
    a.raca,
    a.quantidade,
    a.peso_medio_kg,
    a.sexo,
    -- Oculta preço exato: expõe apenas faixa
    CASE
        WHEN a.preco_total < 50000  THEN 'Até R$ 50 mil'
        WHEN a.preco_total < 150000 THEN 'R$ 50 mil – R$ 150 mil'
        WHEN a.preco_total < 300000 THEN 'R$ 150 mil – R$ 300 mil'
        ELSE 'Acima de R$ 300 mil'
    END AS faixa_preco,
    a.preco_por_cabeca,           -- atributo derivado exposto
    a.municipio,
    a.estado,
    a.score_rastreabilidade,      -- derivado, sem expor documentos
    a.status,
    a.visualizacoes,
    a.criado_em,
    -- Do produtor: apenas nome público, sem documento ou endereço
    u.nome   AS nome_vendedor,
    u.verificado AS vendedor_verificado
    -- OCULTO: u.documento, u.telefone, p.car, p.inscricao_rural
FROM anuncios a
JOIN usuarios u ON u.id = a.produtor_id
WHERE a.status = 'ativo';

COMMENT ON VIEW vw_catalogo_publico IS
  'View de segurança: exibe anúncios ativos sem dados sensíveis do produtor.';

-- ─────────────────────────────────────────────────────────────
-- 5.2 VIEW DE RELATÓRIO
-- Consolida informações de negociação: anúncio, proposta,
-- contrato, valores e status para relatório gerencial.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_relatorio_negociacoes AS
SELECT
    -- Anúncio
    a.id                AS anuncio_id,
    a.titulo            AS anuncio_titulo,
    a.especie,
    a.quantidade,
    a.preco_total       AS valor_anunciado,
    a.municipio || '/' || a.estado AS localizacao,
    -- Vendedor
    uv.nome             AS nome_vendedor,
    uv.email            AS email_vendedor,
    -- Proposta
    p.id                AS proposta_id,
    p.valor_proposto,
    ROUND((p.valor_proposto / a.preco_total) * 100, 1) AS percentual_oferta,
    p.status            AS status_proposta,
    p.criado_em         AS data_proposta,
    -- Comprador
    uc.nome             AS nome_comprador,
    uc.email            AS email_comprador,
    -- Contrato (pode ser NULL se proposta ainda não aceita)
    c.id                AS contrato_id,
    c.valor_final,
    c.valor_sinal,
    c.data_retirada,
    c.status            AS status_contrato,
    -- Diferença entre valor anunciado e contratado
    (c.valor_final - a.preco_total) AS variacao_preco
FROM propostas p
JOIN anuncios  a  ON a.id = p.anuncio_id
JOIN usuarios  uv ON uv.id = p.vendedor_id
JOIN usuarios  uc ON uc.id = p.comprador_id
LEFT JOIN contratos c ON c.proposta_id = p.id
ORDER BY p.criado_em DESC;

COMMENT ON VIEW vw_relatorio_negociacoes IS
  'View de relatório: consolida anúncios, propostas e contratos com vendedor e comprador.';

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 6 — DML: INSERÇÃO DE DADOS CONSISTENTES
-- ─────────────────────────────────────────────────────────────

-- 6.1 Usuários
INSERT INTO usuarios (id, nome, email, telefone, documento, perfil, verificado) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001','Fazenda Santa Cruz',   'fazenda@santacruz.com.br','(34)99901-0001','111.111.111-11','produtor',        true),
  ('aaaaaaaa-0001-0001-0001-000000000002','Abatedouro Planalto',  'compras@planalto.com.br', '(19)99902-0002','22.222.222/0001-22','comprador',    true),
  ('aaaaaaaa-0001-0001-0001-000000000003','TranSul Logística',    'ops@transul.com.br',      '(51)99903-0003','33.333.333/0001-33','transportadora',true),
  ('aaaaaaaa-0001-0001-0001-000000000004','Granja Boa Vista',     'contato@boavista.com.br', '(88)99904-0004','444.444.444-44','produtor',        true),
  ('aaaaaaaa-0001-0001-0001-000000000005','Frigorífico Central',  'compras@frigocentral.br', '(11)99905-0005','55.555.555/0001-55','comprador',    false),
  ('aaaaaaaa-0001-0001-0001-000000000006','RotaVerde Transportes','frete@rotaverde.com.br',  '(41)99906-0006','66.666.666/0001-66','transportadora',true);

-- 6.2 Produtores
INSERT INTO produtores (usuario_id, nome_fazenda, car, area_hectares, municipio, estado) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001','Fazenda Santa Cruz','MG-1234567',450.00,'Uberaba','MG'),
  ('aaaaaaaa-0001-0001-0001-000000000004','Granja Boa Vista',  'CE-9876543',120.00,'Sobral','CE');

-- 6.3 Compradores
INSERT INTO compradores (usuario_id, razao_social, cnpj, segmento, municipio, estado) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000002','Abatedouro Planalto Ltda',   '22.222.222/0001-22','Abate','Campinas','SP'),
  ('aaaaaaaa-0001-0001-0001-000000000005','Frigorífico Central S.A.',   '55.555.555/0001-55','Frigorífico','São Paulo','SP');

-- 6.4 Transportadoras
INSERT INTO transportadoras (id, usuario_id, razao_social, cnpj, rntrc, capacidade_max_kg, municipio, estado, score) VALUES
  (uuid_generate_v4(),'aaaaaaaa-0001-0001-0001-000000000003','TranSul Logística S.A.',  '33.333.333/0001-33','RNTRC-001',42000,'Porto Alegre','RS',98.0),
  (uuid_generate_v4(),'aaaaaaaa-0001-0001-0001-000000000006','RotaVerde Transportes',   '66.666.666/0001-66','RNTRC-002',35000,'Curitiba','PR',94.0);

-- 6.5 Anúncios
INSERT INTO anuncios (id, produtor_id, titulo, especie, raca, quantidade, peso_medio_kg,
    sexo, preco_total, municipio, estado, nome_fazenda, status) VALUES
  ('bbbbbbbb-0001-0001-0001-000000000001',
   'aaaaaaaa-0001-0001-0001-000000000001',
   'Nelore Boi Gordo — 85 cab.','bovinos','Nelore',85,510,'macho_castrado',
   204000,'Uberaba','MG','Fazenda Santa Cruz','ativo'),

  ('bbbbbbbb-0001-0001-0001-000000000002',
   'aaaaaaaa-0001-0001-0001-000000000001',
   'Novilhas Girolando — 40 cab.','bovinos','Girolando',40,380,'femea',
   140000,'Patos de Minas','MG','Fazenda Santa Cruz','ativo'),

  ('bbbbbbbb-0001-0001-0001-000000000003',
   'aaaaaaaa-0001-0001-0001-000000000004',
   'Santa Inês Matrizes — 120 cab.','ovinos','Santa Inês',120,55,'femea',
   72000,'Sobral','CE','Granja Boa Vista','ativo'),

  ('bbbbbbbb-0001-0001-0001-000000000004',
   'aaaaaaaa-0001-0001-0001-000000000004',
   'Frango Cobb 500 — 5.000 un.','aves','Cobb 500',5000,3,'misto',
   35000,'Sobral','CE','Granja Boa Vista','ativo'),

  ('bbbbbbbb-0001-0001-0001-000000000005',
   'aaaaaaaa-0001-0001-0001-000000000001',
   'Angus Terminado — 30 cab.','bovinos','Angus',30,560,'macho_castrado',
   180000,'Uberlândia','MG','Fazenda Santa Cruz','vendido');

-- 6.6 Rastreabilidade
INSERT INTO rastreabilidade (anuncio_id, gta, brucela, tuberculose, aftosa, raiva, carbunculo, dna, organico) VALUES
  ('bbbbbbbb-0001-0001-0001-000000000001', true, true, true,  true, true,  true,  false, false),
  ('bbbbbbbb-0001-0001-0001-000000000002', true, true, false, true, false, false, false, false),
  ('bbbbbbbb-0001-0001-0001-000000000003', true, true, false, true, false, false, false, false),
  ('bbbbbbbb-0001-0001-0001-000000000004', true, true, true,  true, true,  true,  true,  true),
  ('bbbbbbbb-0001-0001-0001-000000000005', true, true, true,  true, true,  false, true,  false);

-- 6.7 Favoritos (relação N:M)
INSERT INTO favoritos (usuario_id, anuncio_id) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000002', 'bbbbbbbb-0001-0001-0001-000000000001'),
  ('aaaaaaaa-0001-0001-0001-000000000002', 'bbbbbbbb-0001-0001-0001-000000000003'),
  ('aaaaaaaa-0001-0001-0001-000000000005', 'bbbbbbbb-0001-0001-0001-000000000001'),
  ('aaaaaaaa-0001-0001-0001-000000000005', 'bbbbbbbb-0001-0001-0001-000000000002');

-- 6.8 Propostas
INSERT INTO propostas (id, anuncio_id, comprador_id, vendedor_id, valor_proposto,
    percentual_sinal, data_retirada, modalidade_frete, mensagem, status) VALUES
  ('cccccccc-0001-0001-0001-000000000001',
   'bbbbbbbb-0001-0001-0001-000000000001',
   'aaaaaaaa-0001-0001-0001-000000000002',
   'aaaaaaaa-0001-0001-0001-000000000001',
   190000,10,'2026-06-15','plataforma',
   'Interesse no lote completo. Confirmar protocolo sanitário.','aceita'),

  ('cccccccc-0001-0001-0001-000000000002',
   'bbbbbbbb-0001-0001-0001-000000000002',
   'aaaaaaaa-0001-0001-0001-000000000005',
   'aaaaaaaa-0001-0001-0001-000000000001',
   130000,10,'2026-07-01','proprio',
   'Interesse nas novilhas para reposição de rebanho leiteiro.','aguardando'),

  ('cccccccc-0001-0001-0001-000000000003',
   'bbbbbbbb-0001-0001-0001-000000000003',
   'aaaaaaaa-0001-0001-0001-000000000002',
   'aaaaaaaa-0001-0001-0001-000000000004',
   68000,15,'2026-06-20','plataforma',
   'Interesse em 80 cabeças do lote.','recusada');

-- 6.9 Contratos (somente da proposta aceita)
INSERT INTO contratos (proposta_id, anuncio_id, comprador_id, vendedor_id,
    valor_final, valor_sinal, data_retirada, assinado_comprador, assinado_vendedor, status)
VALUES (
    'cccccccc-0001-0001-0001-000000000001',
    'bbbbbbbb-0001-0001-0001-000000000001',
    'aaaaaaaa-0001-0001-0001-000000000002',
    'aaaaaaaa-0001-0001-0001-000000000001',
    190000, 19000, '2026-06-15', true, true, 'assinado'
);

-- 6.10 Solicitações de frete + Cotações (N:M)
INSERT INTO solicitacoes_frete (id, anuncio_id, solicitante_id,
    origem_municipio, origem_estado, destino_municipio, destino_estado,
    especie, quantidade, janela_coleta, status)
VALUES (
    'dddddddd-0001-0001-0001-000000000001',
    'bbbbbbbb-0001-0001-0001-000000000001',
    'aaaaaaaa-0001-0001-0001-000000000002',
    'Uberaba','MG','Campinas','SP','bovinos',85,'10 a 15 de junho','cotando'
);

INSERT INTO cotacoes_frete (solicitacao_id, transportadora_id, valor, prazo_dias, status)
SELECT
    'dddddddd-0001-0001-0001-000000000001',
    t.id, 8400, 2, 'aceita'
FROM transportadoras t
JOIN usuarios u ON u.id = t.usuario_id
WHERE u.email = 'ops@transul.com.br';

INSERT INTO cotacoes_frete (solicitacao_id, transportadora_id, valor, prazo_dias, status)
SELECT
    'dddddddd-0001-0001-0001-000000000001',
    t.id, 9150, 3, 'enviada'
FROM transportadoras t
JOIN usuarios u ON u.id = t.usuario_id
WHERE u.email = 'frete@rotaverde.com.br';

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 7 — CONSULTAS COMPLEXAS
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- 7.1 INNER JOIN — Faturamento: anúncios com contratos assinados
-- ─────────────────────────────────────────────────────────────
SELECT
    a.titulo              AS lote,
    a.especie,
    a.quantidade,
    uv.nome               AS vendedor,
    uc.nome               AS comprador,
    p.valor_proposto      AS valor_proposta,
    c.valor_final         AS valor_contratado,
    c.valor_sinal         AS sinal_pago,
    (c.valor_final - a.preco_total) AS desconto_negociado,
    c.data_retirada,
    c.status              AS situacao_contrato
FROM contratos c
INNER JOIN propostas  p  ON p.id         = c.proposta_id
INNER JOIN anuncios   a  ON a.id         = c.anuncio_id
INNER JOIN usuarios   uv ON uv.id        = c.vendedor_id
INNER JOIN usuarios   uc ON uc.id        = c.comprador_id
ORDER BY c.criado_em DESC;

-- ─────────────────────────────────────────────────────────────
-- 7.2 LEFT JOIN — Todos os anúncios, com ou sem proposta
-- ─────────────────────────────────────────────────────────────
SELECT
    a.titulo,
    a.especie,
    a.status        AS status_anuncio,
    a.preco_total   AS valor_anunciado,
    COUNT(p.id)     AS total_propostas,
    MAX(p.valor_proposto) AS maior_oferta,
    MIN(p.valor_proposto) AS menor_oferta
FROM anuncios a
LEFT JOIN propostas p ON p.anuncio_id = a.id
GROUP BY a.id, a.titulo, a.especie, a.status, a.preco_total
ORDER BY total_propostas DESC;

-- ─────────────────────────────────────────────────────────────
-- 7.3 RIGHT JOIN — Todas as transportadoras, com ou sem cotação
-- ─────────────────────────────────────────────────────────────
SELECT
    u.nome                AS transportadora,
    t.score,
    t.municipio || '/' || t.estado AS sede,
    COUNT(cf.id)          AS cotacoes_enviadas,
    COUNT(CASE WHEN cf.status = 'aceita' THEN 1 END) AS cotacoes_aceitas,
    COALESCE(SUM(CASE WHEN cf.status = 'aceita' THEN cf.valor END), 0) AS receita_total
FROM cotacoes_frete cf
RIGHT JOIN transportadoras t  ON t.id   = cf.transportadora_id
RIGHT JOIN usuarios        u  ON u.id   = t.usuario_id
GROUP BY u.nome, t.score, t.municipio, t.estado
ORDER BY receita_total DESC;

-- ─────────────────────────────────────────────────────────────
-- 7.4 UNION — Lista unificada de vendedores e compradores
-- (relatório de todos os participantes ativos da plataforma)
-- ─────────────────────────────────────────────────────────────
SELECT
    u.nome,
    u.email,
    u.telefone,
    'Produtor'     AS papel,
    p.nome_fazenda AS identificacao
FROM usuarios u
JOIN produtores p ON p.usuario_id = u.id
WHERE u.ativo = TRUE

UNION

SELECT
    u.nome,
    u.email,
    u.telefone,
    'Comprador'      AS papel,
    c.razao_social   AS identificacao
FROM usuarios u
JOIN compradores c ON c.usuario_id = u.id
WHERE u.ativo = TRUE

UNION

SELECT
    u.nome,
    u.email,
    u.telefone,
    'Transportadora' AS papel,
    t.razao_social   AS identificacao
FROM usuarios u
JOIN transportadoras t ON t.usuario_id = u.id
WHERE u.ativo = TRUE

ORDER BY papel, nome;

-- ─────────────────────────────────────────────────────────────
-- 7.5 SUBQUERY COM EXISTS — Anúncios que já receberam proposta
-- ─────────────────────────────────────────────────────────────
SELECT
    a.titulo,
    a.especie,
    a.preco_total,
    a.municipio || '/' || a.estado AS localizacao,
    a.score_rastreabilidade
FROM anuncios a
WHERE EXISTS (
    SELECT 1 FROM propostas p
    WHERE p.anuncio_id = a.id
      AND p.status = 'aceita'
)
ORDER BY a.score_rastreabilidade DESC;

-- ─────────────────────────────────────────────────────────────
-- 7.6 SUBQUERY COM IN — Produtores que NÃO têm nenhum anúncio ativo
-- ─────────────────────────────────────────────────────────────
SELECT
    u.nome,
    u.email,
    p.nome_fazenda,
    p.municipio || '/' || p.estado AS localizacao
FROM usuarios u
JOIN produtores p ON p.usuario_id = u.id
WHERE u.id NOT IN (
    SELECT DISTINCT produtor_id
    FROM anuncios
    WHERE status = 'ativo'
)
ORDER BY u.nome;

-- ─────────────────────────────────────────────────────────────
-- 7.7 CONSULTA EXTRA — Ranqueamento de compradores por volume
-- ─────────────────────────────────────────────────────────────
SELECT
    uc.nome                          AS comprador,
    COUNT(DISTINCT p.id)             AS total_propostas,
    COUNT(DISTINCT c.id)             AS contratos_firmados,
    COALESCE(SUM(c.valor_final), 0)  AS volume_contratado,
    ROUND(
      COUNT(DISTINCT c.id)::NUMERIC /
      NULLIF(COUNT(DISTINCT p.id), 0) * 100, 1
    )                                AS taxa_conversao_pct
FROM usuarios uc
JOIN propostas p ON p.comprador_id = uc.id
LEFT JOIN contratos c ON c.comprador_id = uc.id
GROUP BY uc.id, uc.nome
ORDER BY volume_contratado DESC;

-- ─────────────────────────────────────────────────────────────
-- SEÇÃO 8 — VERIFICAÇÕES / LOGS
-- ─────────────────────────────────────────────────────────────

-- Teste do AFTER trigger: veja os registros gravados na auditoria
-- (serão populados quando você fizer UPDATE de status)
SELECT * FROM log_auditoria ORDER BY registrado_em DESC LIMIT 20;

-- Consulta a view de segurança
SELECT * FROM vw_catalogo_publico LIMIT 5;

-- Consulta a view de relatório
SELECT * FROM vw_relatorio_negociacoes;

-- =============================================================
-- FIM DO SCRIPT — TRABALHO FINAL AGROPLACE
-- =============================================================
