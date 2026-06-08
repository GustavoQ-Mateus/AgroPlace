CREATE DATABASE IF NOT EXISTS agroplace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agroplace;

-- 1. USUARIOS

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  role ENUM('produtor', 'comprador', 'transportadora') NOT NULL DEFAULT 'comprador',
  verified BOOLEAN DEFAULT FALSE,
  avatar VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
);

-- 2. ANUNCIOS

CREATE TABLE IF NOT EXISTS anuncios (
  id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  breed VARCHAR(100),
  quantity INT,
  weight DECIMAL(8,2),
  price_total DECIMAL(12,2),
  price_per_head DECIMAL(10,2),
  price_per_arroba DECIMAL(10,2),
  city VARCHAR(100),
  state VARCHAR(2),
  description TEXT,
  traceability_score INT DEFAULT 0,
  status ENUM('ativo', 'pausado', 'vendido', 'cancelado') DEFAULT 'ativo',
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fotos_anuncio (
  id VARCHAR(36) NOT NULL,
  anuncio_id VARCHAR(36) NOT NULL,
  url VARCHAR(500),
  is_cover BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoritos (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  anuncio_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_favorito (user_id, anuncio_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

-- 3. NEGOCIACAO

CREATE TABLE IF NOT EXISTS propostas (
  id VARCHAR(36) NOT NULL,
  anuncio_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  price_offered DECIMAL(12,2),
  signal_pct INT DEFAULT 10,
  withdrawal_date DATE,
  freight_mode VARCHAR(50),
  message TEXT,
  status ENUM('aguardando', 'aceita', 'recusada', 'cancelada') DEFAULT 'aguardando',
  seller_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE RESTRICT,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contratos (
  id VARCHAR(36) NOT NULL,
  proposta_id VARCHAR(36),
  anuncio_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  price_final DECIMAL(12,2),
  signal_value DECIMAL(12,2),
  withdrawal_date DATE,
  status ENUM('pendente', 'assinado', 'concluido', 'cancelado') DEFAULT 'pendente',
  buyer_sign_name VARCHAR(255),
  seller_sign_name VARCHAR(255),
  buyer_signed_at TIMESTAMP NULL,
  seller_signed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (proposta_id) REFERENCES propostas(id),
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS mensagens (
  id VARCHAR(36) NOT NULL,
  anuncio_id VARCHAR(36) NOT NULL,
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255),
  body TEXT,
  type VARCHAR(50) DEFAULT 'info',
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. LOGISTICA

CREATE TABLE IF NOT EXISTS transportadoras (
  id VARCHAR(36) NOT NULL,
  nome_empresa VARCHAR(255) NOT NULL,
  veiculo VARCHAR(100),
  capacidade INT,
  nota_media DECIMAL(3,1) DEFAULT 5.0,
  taxa_km DECIMAL(6,2) DEFAULT 5.00,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS solicitacoes_frete (
  id VARCHAR(36) NOT NULL,
  anuncio_id VARCHAR(36),
  comprador_id VARCHAR(36),
  transportadora_id VARCHAR(36),
  origem VARCHAR(255),
  destino VARCHAR(255),
  data_coleta DATE,
  status VARCHAR(50) DEFAULT 'AGUARDANDO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
  FOREIGN KEY (comprador_id) REFERENCES users(id),
  FOREIGN KEY (transportadora_id) REFERENCES transportadoras(id)
);

-- 5. VIEWS

CREATE OR REPLACE VIEW vw_users_publico AS
SELECT id, name, role, verified, created_at
FROM users;

CREATE OR REPLACE VIEW vw_dashboard_vendas AS
SELECT
  a.id AS anuncio_id,
  a.title,
  a.price_total,
  a.status AS status_anuncio,
  u.name AS vendedor,
  u.state AS uf,
  COUNT(p.id) AS total_propostas,
  MAX(p.price_offered) AS melhor_oferta,
  SUM(CASE WHEN p.status = 'aceita' THEN p.price_offered ELSE 0 END) AS total_fechado
FROM anuncios a
INNER JOIN users u ON u.id = a.seller_id
LEFT JOIN propostas p ON p.anuncio_id = a.id
GROUP BY a.id, a.title, a.price_total, a.status, u.name, u.state;

-- 6. TRIGGERS

DELIMITER $$

CREATE TRIGGER trg_proposta_aceita
AFTER UPDATE ON propostas
FOR EACH ROW
BEGIN
  IF NEW.status = 'aceita' AND OLD.status <> 'aceita' THEN
    UPDATE anuncios SET status = 'vendido', updated_at = NOW() WHERE id = NEW.anuncio_id;
    UPDATE propostas SET status = 'cancelada', updated_at = NOW()
    WHERE anuncio_id = NEW.anuncio_id AND id <> NEW.id AND status = 'aguardando';
  END IF;
END$$

CREATE TRIGGER trg_notifica_proposta
AFTER INSERT ON propostas
FOR EACH ROW
BEGIN
  INSERT INTO notificacoes (id, user_id, title, body, type)
  VALUES (UUID(), NEW.seller_id, 'Nova proposta recebida',
    CONCAT('Voce recebeu uma proposta de R$ ', FORMAT(NEW.price_offered, 2), ' para o seu anuncio.'),
    'proposta');
END$$

CREATE TRIGGER trg_notifica_mensagem
AFTER INSERT ON mensagens
FOR EACH ROW
BEGIN
  INSERT INTO notificacoes (id, user_id, title, body, type)
  VALUES (UUID(), NEW.receiver_id, 'Nova mensagem', SUBSTRING(NEW.content, 1, 120), 'mensagem');
END$$

DELIMITER ;

-- 7. CONSULTAS

SELECT a.title, a.price_total, a.quantity, a.city, a.state, u.name AS vendedor, u.verified
FROM anuncios a
INNER JOIN users u ON u.id = a.seller_id
WHERE a.status = 'ativo'
ORDER BY a.price_total ASC;

SELECT a.title, a.price_total, u.name AS vendedor, f.url AS foto_capa
FROM anuncios a
INNER JOIN users u ON u.id = a.seller_id
LEFT JOIN fotos_anuncio f ON f.anuncio_id = a.id AND f.is_cover = TRUE
WHERE a.status = 'ativo';

SELECT u.name, COUNT(p.id) AS total_propostas, COALESCE(SUM(p.price_offered), 0) AS valor_total
FROM users u
LEFT JOIN propostas p ON p.buyer_id = u.id
WHERE u.role = 'comprador'
GROUP BY u.id, u.name;

SELECT a.title, a.status, f.url AS foto
FROM fotos_anuncio f
RIGHT JOIN anuncios a ON a.id = f.anuncio_id;

SELECT u.name, u.email, 'Vendedor' AS papel
FROM users u WHERE u.role = 'produtor'
  AND EXISTS (SELECT 1 FROM anuncios WHERE seller_id = u.id)
UNION
SELECT u.name, u.email, 'Comprador' AS papel
FROM users u WHERE u.role = 'comprador'
  AND EXISTS (SELECT 1 FROM propostas WHERE buyer_id = u.id)
ORDER BY papel, name;

SELECT a.title, a.price_total, a.city
FROM anuncios a
WHERE a.status = 'ativo'
  AND EXISTS (SELECT 1 FROM propostas p WHERE p.anuncio_id = a.id AND p.status = 'aguardando');

SELECT id, title FROM anuncios
WHERE id NOT IN (SELECT DISTINCT anuncio_id FROM fotos_anuncio);

SELECT uf, SUM(total_fechado) AS receita_uf
FROM vw_dashboard_vendas
GROUP BY uf ORDER BY receita_uf DESC;

-- 8. EVOLUCAO DE ESQUEMA

ALTER TABLE users ADD COLUMN document VARCHAR(20) NULL AFTER phone;
ALTER TABLE anuncios ADD INDEX idx_city_state (city, state);
ALTER TABLE propostas ADD INDEX idx_buyer_status (buyer_id, status);
