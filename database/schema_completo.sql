-- =============================================================
--  AgroPlace — Schema Completo
--  Banco: MySQL 8+
-- =============================================================

CREATE DATABASE IF NOT EXISTS agroplace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agroplace;

-- -------------------------------------------------------------
-- 1. AUTENTICAÇÃO
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contas_usuario (
  id              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  nome            VARCHAR(160)      NOT NULL,
  email           VARCHAR(180)      NOT NULL,
  telefone        VARCHAR(32)       NOT NULL,
  documento       VARCHAR(32)       NOT NULL,
  nome_empresa    VARCHAR(180),
  senha_hash      VARCHAR(255)      NOT NULL,
  tipo_conta      ENUM('PRODUTOR','CORPORATIVA','TRANSPORTADORA') NOT NULL,
  ativo           BOOLEAN           NOT NULL DEFAULT TRUE,
  criado_em       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_contas_email      (email),
  UNIQUE KEY uk_contas_documento  (documento),
  KEY idx_contas_tipo             (tipo_conta),
  KEY idx_contas_ativo            (ativo)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 2. PERFIS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS perfis_produtor (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id    BIGINT UNSIGNED NOT NULL,
  nome_propriedade    VARCHAR(180)    NOT NULL,
  documento_rural     VARCHAR(60),
  inscricao_estadual  VARCHAR(60),
  car                 VARCHAR(80),
  area_hectares       DECIMAL(10,2),
  cep                 VARCHAR(12),
  endereco            VARCHAR(220),
  cidade              VARCHAR(120)    NOT NULL,
  estado              CHAR(2)         NOT NULL,
  descricao           TEXT,
  criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfil_produtor_conta (conta_usuario_id),
  CONSTRAINT fk_perfil_produtor_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS perfis_corporativa (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id      BIGINT UNSIGNED NOT NULL,
  razao_social          VARCHAR(180)    NOT NULL,
  nome_fantasia         VARCHAR(180),
  cnpj                  VARCHAR(20)     NOT NULL,
  inscricao_estadual    VARCHAR(60),
  segmento              VARCHAR(120),
  responsavel_comercial VARCHAR(160),
  telefone_comercial    VARCHAR(32),
  site                  VARCHAR(180),
  cep                   VARCHAR(12),
  endereco              VARCHAR(220),
  cidade                VARCHAR(120)    NOT NULL,
  estado                CHAR(2)         NOT NULL,
  descricao             TEXT,
  criado_em             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfil_corporativa_conta (conta_usuario_id),
  UNIQUE KEY uk_perfil_corporativa_cnpj  (cnpj),
  CONSTRAINT fk_perfil_corporativa_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS perfis_transportadora (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id        BIGINT UNSIGNED NOT NULL,
  razao_social            VARCHAR(180)    NOT NULL,
  nome_fantasia           VARCHAR(180),
  cnpj                    VARCHAR(20)     NOT NULL,
  rntrc                   VARCHAR(40),
  inscricao_estadual      VARCHAR(60),
  responsavel_operacional VARCHAR(160),
  telefone_operacional    VARCHAR(32),
  tipos_veiculo           VARCHAR(255),
  capacidade_carga_kg     DECIMAL(10,2),
  possui_transporte_vivo  BOOLEAN         NOT NULL DEFAULT TRUE,
  cep                     VARCHAR(12),
  endereco                VARCHAR(220),
  cidade                  VARCHAR(120)    NOT NULL,
  estado                  CHAR(2)         NOT NULL,
  descricao               TEXT,
  criado_em               DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfil_transp_conta (conta_usuario_id),
  UNIQUE KEY uk_perfil_transp_cnpj  (cnpj),
  CONSTRAINT fk_perfil_transp_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS regioes_atendimento_transportadora (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  perfil_transportadora_id BIGINT UNSIGNED NOT NULL,
  estado                   CHAR(2)         NOT NULL,
  cidade                   VARCHAR(120),
  criado_em                DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_regioes_estado (estado),
  CONSTRAINT fk_regioes_transp_perfil
    FOREIGN KEY (perfil_transportadora_id) REFERENCES perfis_transportadora(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 3. ANÚNCIOS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS anuncios (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id BIGINT UNSIGNED NOT NULL,
  titulo           VARCHAR(200)    NOT NULL,
  especie          VARCHAR(60)     NOT NULL,  -- BOVINO, EQUINO, SUINO, AVE, OVINO, CAPRINO
  raca             VARCHAR(120),
  quantidade       INT             NOT NULL,
  peso_medio_kg    DECIMAL(8,2),
  idade_media_meses INT,
  sexo             ENUM('MACHO','FEMEA','MISTO') NOT NULL,
  preco_unitario   DECIMAL(12,2)   NOT NULL,
  cidade           VARCHAR(120)    NOT NULL,
  estado           CHAR(2)         NOT NULL,
  descricao        TEXT,
  status           ENUM('ATIVO','PAUSADO','VENDIDO','CANCELADO') NOT NULL DEFAULT 'ATIVO',
  criado_em        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_anuncios_status  (status),
  KEY idx_anuncios_especie (especie),
  KEY idx_anuncios_estado  (estado),
  KEY idx_anuncios_conta   (conta_usuario_id),
  CONSTRAINT fk_anuncios_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fotos_anuncio (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  anuncio_id BIGINT UNSIGNED NOT NULL,
  url        VARCHAR(500)    NOT NULL,
  principal  BOOLEAN         NOT NULL DEFAULT FALSE,
  criado_em  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fotos_anuncio (anuncio_id),
  CONSTRAINT fk_fotos_anuncio
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 4. PROPOSTAS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS propostas (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  anuncio_id       BIGINT UNSIGNED NOT NULL,
  conta_usuario_id BIGINT UNSIGNED NOT NULL,  -- comprador
  valor_proposto   DECIMAL(12,2)   NOT NULL,
  mensagem         TEXT,
  status           ENUM('AGUARDANDO','ACEITA','RECUSADA','CANCELADA') NOT NULL DEFAULT 'AGUARDANDO',
  criado_em        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_propostas_anuncio (anuncio_id),
  KEY idx_propostas_status  (status),
  CONSTRAINT fk_propostas_anuncio
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  CONSTRAINT fk_propostas_comprador
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 5. LOGÍSTICA / FRETES
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS solicitacoes_frete (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  anuncio_id               BIGINT UNSIGNED NOT NULL,
  conta_usuario_id         BIGINT UNSIGNED NOT NULL,  -- solicitante
  perfil_transportadora_id BIGINT UNSIGNED,           -- transportadora escolhida
  origem_cidade            VARCHAR(120)    NOT NULL,
  origem_estado            CHAR(2)         NOT NULL,
  destino_cidade           VARCHAR(120)    NOT NULL,
  destino_estado           CHAR(2)         NOT NULL,
  quantidade_cabecas       INT             NOT NULL,
  data_retirada            DATE,
  observacoes              TEXT,
  status                   ENUM('ABERTA','COTANDO','CONFIRMADA','CONCLUIDA','CANCELADA') NOT NULL DEFAULT 'ABERTA',
  criado_em                DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_frete_status (status),
  CONSTRAINT fk_frete_anuncio
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  CONSTRAINT fk_frete_solicitante
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id),
  CONSTRAINT fk_frete_transportadora
    FOREIGN KEY (perfil_transportadora_id) REFERENCES perfis_transportadora(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cotacoes_frete (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  solicitacao_frete_id     BIGINT UNSIGNED NOT NULL,
  perfil_transportadora_id BIGINT UNSIGNED NOT NULL,
  valor                    DECIMAL(12,2)   NOT NULL,
  prazo_dias               INT,
  observacoes              TEXT,
  status                   ENUM('ENVIADA','ACEITA','RECUSADA') NOT NULL DEFAULT 'ENVIADA',
  criado_em                DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_cotacao_solicitacao
    FOREIGN KEY (solicitacao_frete_id) REFERENCES solicitacoes_frete(id) ON DELETE CASCADE,
  CONSTRAINT fk_cotacao_transportadora
    FOREIGN KEY (perfil_transportadora_id) REFERENCES perfis_transportadora(id)
) ENGINE=InnoDB;
