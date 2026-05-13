CREATE DATABASE IF NOT EXISTS agroplace_autenticacao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agroplace_autenticacao;

DROP TABLE IF EXISTS regioes_atendimento_transportadora;
DROP TABLE IF EXISTS perfis_transportadora;
DROP TABLE IF EXISTS perfis_corporativa;
DROP TABLE IF EXISTS perfis_produtor;
DROP TABLE IF EXISTS contas_usuario;

CREATE TABLE contas_usuario (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL,
  telefone VARCHAR(32) NOT NULL,
  documento VARCHAR(32) NOT NULL,
  nome_empresa VARCHAR(180),
  senha_hash VARCHAR(255) NOT NULL,
  tipo_conta ENUM('PRODUTOR','CORPORATIVA','TRANSPORTADORA') NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_contas_usuario_email (email),
  UNIQUE KEY uk_contas_usuario_documento (documento),
  KEY idx_contas_usuario_tipo_conta (tipo_conta),
  KEY idx_contas_usuario_ativo (ativo)
) ENGINE=InnoDB;

CREATE TABLE perfis_produtor (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id BIGINT UNSIGNED NOT NULL,
  nome_propriedade VARCHAR(180) NOT NULL,
  documento_rural VARCHAR(60),
  inscricao_estadual VARCHAR(60),
  car VARCHAR(80),
  area_hectares DECIMAL(10,2),
  cep VARCHAR(12),
  endereco VARCHAR(220),
  cidade VARCHAR(120) NOT NULL,
  estado CHAR(2) NOT NULL,
  descricao TEXT,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfis_produtor_conta (conta_usuario_id),
  CONSTRAINT fk_perfis_produtor_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE perfis_corporativa (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id BIGINT UNSIGNED NOT NULL,
  razao_social VARCHAR(180) NOT NULL,
  nome_fantasia VARCHAR(180),
  cnpj VARCHAR(20) NOT NULL,
  inscricao_estadual VARCHAR(60),
  segmento VARCHAR(120),
  responsavel_comercial VARCHAR(160),
  telefone_comercial VARCHAR(32),
  site VARCHAR(180),
  cep VARCHAR(12),
  endereco VARCHAR(220),
  cidade VARCHAR(120) NOT NULL,
  estado CHAR(2) NOT NULL,
  descricao TEXT,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfis_corporativa_conta (conta_usuario_id),
  UNIQUE KEY uk_perfis_corporativa_cnpj (cnpj),
  CONSTRAINT fk_perfis_corporativa_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE perfis_transportadora (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conta_usuario_id BIGINT UNSIGNED NOT NULL,
  razao_social VARCHAR(180) NOT NULL,
  nome_fantasia VARCHAR(180),
  cnpj VARCHAR(20) NOT NULL,
  rntrc VARCHAR(40),
  inscricao_estadual VARCHAR(60),
  responsavel_operacional VARCHAR(160),
  telefone_operacional VARCHAR(32),
  tipos_veiculo VARCHAR(255),
  capacidade_carga_kg DECIMAL(10,2),
  possui_transporte_vivo BOOLEAN NOT NULL DEFAULT TRUE,
  cep VARCHAR(12),
  endereco VARCHAR(220),
  cidade VARCHAR(120) NOT NULL,
  estado CHAR(2) NOT NULL,
  descricao TEXT,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_perfis_transportadora_conta (conta_usuario_id),
  UNIQUE KEY uk_perfis_transportadora_cnpj (cnpj),
  CONSTRAINT fk_perfis_transportadora_conta
    FOREIGN KEY (conta_usuario_id) REFERENCES contas_usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE regioes_atendimento_transportadora (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  perfil_transportadora_id BIGINT UNSIGNED NOT NULL,
  estado CHAR(2) NOT NULL,
  cidade VARCHAR(120),
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_regioes_transportadora_estado (estado),
  CONSTRAINT fk_regioes_transportadora_perfil
    FOREIGN KEY (perfil_transportadora_id) REFERENCES perfis_transportadora(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
