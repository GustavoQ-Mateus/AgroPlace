CREATE DATABASE IF NOT EXISTS agroplace_autenticacao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agroplace_autenticacao;

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
