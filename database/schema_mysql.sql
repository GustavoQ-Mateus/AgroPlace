CREATE DATABASE IF NOT EXISTS agroplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agroplace;

CREATE TABLE IF NOT EXISTS users (
  id           VARCHAR(36)  PRIMARY KEY,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name         VARCHAR(255),
  phone        VARCHAR(20),
  role         ENUM('produtor','comprador','transportadora') NOT NULL DEFAULT 'comprador',
  verified     BOOLEAN      DEFAULT FALSE,
  avatar       VARCHAR(10),
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anuncios (
  id                VARCHAR(36)    PRIMARY KEY,
  seller_id         VARCHAR(36)    NOT NULL,
  title             VARCHAR(255)   NOT NULL,
  category          VARCHAR(100),
  breed             VARCHAR(100),
  quantity          INT,
  weight            DECIMAL(8,2),
  price_total       DECIMAL(12,2),
  price_per_head    DECIMAL(10,2),
  price_per_arroba  DECIMAL(10,2),
  city              VARCHAR(100),
  state             VARCHAR(2),
  description       TEXT,
  traceability_score INT           DEFAULT 0,
  status            ENUM('ativo','pausado','vendido','cancelado') DEFAULT 'ativo',
  view_count        INT            DEFAULT 0,
  created_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fotos_anuncio (
  id          VARCHAR(36) PRIMARY KEY,
  anuncio_id  VARCHAR(36) NOT NULL,
  url         VARCHAR(500),
  is_cover    BOOLEAN     DEFAULT FALSE,
  order_index INT         DEFAULT 0,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoritos (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  anuncio_id  VARCHAR(36) NOT NULL,
  created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_anuncio (user_id, anuncio_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS propostas (
  id              VARCHAR(36)  PRIMARY KEY,
  anuncio_id      VARCHAR(36)  NOT NULL,
  buyer_id        VARCHAR(36)  NOT NULL,
  seller_id       VARCHAR(36)  NOT NULL,
  price_offered   DECIMAL(12,2),
  signal_pct      INT          DEFAULT 10,
  withdrawal_date DATE,
  freight_mode    VARCHAR(50),
  message         TEXT,
  status          ENUM('aguardando','aceita','recusada','cancelada') DEFAULT 'aguardando',
  seller_note     TEXT,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  FOREIGN KEY (buyer_id)   REFERENCES users(id),
  FOREIGN KEY (seller_id)  REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contratos (
  id              VARCHAR(36)  PRIMARY KEY,
  proposta_id     VARCHAR(36),
  anuncio_id      VARCHAR(36)  NOT NULL,
  buyer_id        VARCHAR(36)  NOT NULL,
  seller_id       VARCHAR(36)  NOT NULL,
  price_final     DECIMAL(12,2),
  signal_value    DECIMAL(12,2),
  withdrawal_date DATE,
  status          ENUM('pendente','assinado','concluido','cancelado') DEFAULT 'pendente',
  buyer_sign_name  VARCHAR(255),
  seller_sign_name VARCHAR(255),
  buyer_signed_at  TIMESTAMP NULL,
  seller_signed_at TIMESTAMP NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  FOREIGN KEY (buyer_id)   REFERENCES users(id),
  FOREIGN KEY (seller_id)  REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS mensagens (
  id          VARCHAR(36)  PRIMARY KEY,
  anuncio_id  VARCHAR(36)  NOT NULL,
  sender_id   VARCHAR(36)  NOT NULL,
  receiver_id VARCHAR(36)  NOT NULL,
  content     TEXT         NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anuncio_id)  REFERENCES anuncios(id),
  FOREIGN KEY (sender_id)   REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id         VARCHAR(36)  PRIMARY KEY,
  user_id    VARCHAR(36)  NOT NULL,
  title      VARCHAR(255),
  body       TEXT,
  type       VARCHAR(50)  DEFAULT 'info',
  read_at    TIMESTAMP    NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitacoes_frete (
  id                VARCHAR(36)  PRIMARY KEY,
  anuncio_id        VARCHAR(36),
  comprador_id      VARCHAR(36),
  transportadora_id VARCHAR(36),
  origem            VARCHAR(255),
  destino           VARCHAR(255),
  data_coleta       DATE,
  status            VARCHAR(50)  DEFAULT 'AGUARDANDO',
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
