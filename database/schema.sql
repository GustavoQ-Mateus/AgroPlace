CREATE DATABASE IF NOT EXISTS agroplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agroplace;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS saved_searches;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS logistics_quotes;
DROP TABLE IF EXISTS carriers;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS proposals;
DROP TABLE IF EXISTS listing_documents;
DROP TABLE IF EXISTS traceability_nutrition;
DROP TABLE IF EXISTS traceability_health;
DROP TABLE IF EXISTS traceability_genetics;
DROP TABLE IF EXISTS animal_images;
DROP TABLE IF EXISTS animal_listings;
DROP TABLE IF EXISTS breeds;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(32),
  document VARCHAR(32),
  password_hash VARCHAR(255) NOT NULL,
  profile_type ENUM('PRODUCER','BUYER','CARRIER','ADMIN') NOT NULL,
  verification_status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_document (document)
) ENGINE=InnoDB;

CREATE TABLE roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE addresses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(80) NOT NULL,
  postal_code VARCHAR(16),
  street VARCHAR(180),
  number VARCHAR(32),
  complement VARCHAR(120),
  neighborhood VARCHAR(120),
  city VARCHAR(120) NOT NULL,
  state CHAR(2) NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_addresses_user (user_id),
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uk_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE breeds (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uk_breeds_category_name (category_id, name),
  CONSTRAINT fk_breeds_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE animal_listings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seller_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  breed_id BIGINT UNSIGNED,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  quantity INT NOT NULL,
  average_weight DECIMAL(10,2),
  price_total DECIMAL(14,2) NOT NULL,
  price_per_head DECIMAL(14,2),
  price_per_arroba DECIMAL(14,2),
  city VARCHAR(120) NOT NULL,
  state CHAR(2) NOT NULL,
  status ENUM('DRAFT','ACTIVE','RESERVED','SOLD','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  traceability_score INT NOT NULL DEFAULT 0,
  listed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listings_seller (seller_id),
  KEY idx_listings_category (category_id),
  KEY idx_listings_breed (breed_id),
  KEY idx_listings_status_state (status, state),
  CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users(id),
  CONSTRAINT fk_listings_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_listings_breed FOREIGN KEY (breed_id) REFERENCES breeds(id)
) ENGINE=InnoDB;

CREATE TABLE animal_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id BIGINT UNSIGNED NOT NULL,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(180),
  sort_order INT NOT NULL DEFAULT 0,
  primary_image BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_animal_images_listing (listing_id),
  CONSTRAINT fk_animal_images_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE traceability_genetics (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id BIGINT UNSIGNED NOT NULL,
  origin VARCHAR(180),
  pedigree VARCHAR(180),
  registry_code VARCHAR(120),
  genetic_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_trace_genetics_listing (listing_id),
  CONSTRAINT fk_trace_genetics_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE traceability_health (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id BIGINT UNSIGNED NOT NULL,
  vaccination_status VARCHAR(180),
  last_vaccination_date DATE,
  gta_status VARCHAR(120),
  sanitary_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_trace_health_listing (listing_id),
  CONSTRAINT fk_trace_health_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE traceability_nutrition (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id BIGINT UNSIGNED NOT NULL,
  feed_program VARCHAR(180),
  supplementation VARCHAR(180),
  last_protocol_date DATE,
  nutrition_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_trace_nutrition_listing (listing_id),
  CONSTRAINT fk_trace_nutrition_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE listing_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id BIGINT UNSIGNED NOT NULL,
  document_type ENUM('GTA','INVOICE','VACCINE','PEDIGREE','SANITARY','CONTRACT','OTHER') NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_documents_listing (listing_id),
  CONSTRAINT fk_documents_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE proposals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id BIGINT UNSIGNED NOT NULL,
  buyer_id BIGINT UNSIGNED NOT NULL,
  seller_id BIGINT UNSIGNED NOT NULL,
  offered_amount DECIMAL(14,2) NOT NULL,
  deposit_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  message TEXT,
  status ENUM('SENT','COUNTERED','ACCEPTED','REJECTED','CANCELLED') NOT NULL DEFAULT 'SENT',
  expires_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_proposals_listing (listing_id),
  KEY idx_proposals_buyer (buyer_id),
  KEY idx_proposals_seller (seller_id),
  CONSTRAINT fk_proposals_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id),
  CONSTRAINT fk_proposals_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
  CONSTRAINT fk_proposals_seller FOREIGN KEY (seller_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE contracts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  proposal_id BIGINT UNSIGNED NOT NULL,
  contract_number VARCHAR(80) NOT NULL,
  status ENUM('DRAFT','SENT','SIGNED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  file_url VARCHAR(255),
  signed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_contracts_number (contract_number),
  UNIQUE KEY uk_contracts_proposal (proposal_id),
  CONSTRAINT fk_contracts_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id)
) ENGINE=InnoDB;

CREATE TABLE carts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  buyer_id BIGINT UNSIGNED NOT NULL,
  status ENUM('OPEN','CONVERTED','ABANDONED') NOT NULL DEFAULT 'OPEN',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_carts_buyer (buyer_id),
  CONSTRAINT fk_carts_buyer FOREIGN KEY (buyer_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  buyer_id BIGINT UNSIGNED NOT NULL,
  seller_id BIGINT UNSIGNED NOT NULL,
  proposal_id BIGINT UNSIGNED,
  code VARCHAR(40) NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL,
  status ENUM('CREATED','CONTRACT','PAYMENT','LOGISTICS','DELIVERED','CANCELLED') NOT NULL DEFAULT 'CREATED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_orders_code (code),
  KEY idx_orders_buyer (buyer_id),
  KEY idx_orders_seller (seller_id),
  CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
  CONSTRAINT fk_orders_seller FOREIGN KEY (seller_id) REFERENCES users(id),
  CONSTRAINT fk_orders_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  listing_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(14,2) NOT NULL,
  total_price DECIMAL(14,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_listing (listing_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  method ENUM('PIX','BOLETO','CARD','TRANSFER','ESCROW') NOT NULL,
  status ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  transaction_code VARCHAR(120),
  paid_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payments_order (order_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE carriers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  company_name VARCHAR(160) NOT NULL,
  license_number VARCHAR(80),
  service_states VARCHAR(120),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_carriers_user (user_id),
  CONSTRAINT fk_carriers_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE logistics_quotes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED,
  listing_id BIGINT UNSIGNED NOT NULL,
  carrier_id BIGINT UNSIGNED,
  origin_city VARCHAR(120) NOT NULL,
  origin_state CHAR(2) NOT NULL,
  destination_city VARCHAR(120) NOT NULL,
  destination_state CHAR(2) NOT NULL,
  distance_km DECIMAL(10,2),
  price DECIMAL(14,2) NOT NULL,
  estimated_days INT NOT NULL,
  status ENUM('REQUESTED','SENT','ACCEPTED','REJECTED','EXPIRED') NOT NULL DEFAULT 'REQUESTED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quotes_order (order_id),
  KEY idx_quotes_listing (listing_id),
  KEY idx_quotes_carrier (carrier_id),
  CONSTRAINT fk_quotes_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_quotes_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id),
  CONSTRAINT fk_quotes_carrier FOREIGN KEY (carrier_id) REFERENCES carriers(id)
) ENGINE=InnoDB;

CREATE TABLE shipments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  quote_id BIGINT UNSIGNED,
  status ENUM('SCHEDULED','PICKED_UP','IN_TRANSIT','DELIVERED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  pickup_at DATETIME,
  delivered_at DATETIME,
  tracking_code VARCHAR(120),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_shipments_order (order_id),
  CONSTRAINT fk_shipments_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_shipments_quote FOREIGN KEY (quote_id) REFERENCES logistics_quotes(id)
) ENGINE=InnoDB;

CREATE TABLE messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  proposal_id BIGINT UNSIGNED,
  sender_id BIGINT UNSIGNED NOT NULL,
  receiver_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  read_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_messages_proposal (proposal_id),
  KEY idx_messages_receiver (receiver_id),
  CONSTRAINT fk_messages_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id),
  CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE saved_searches (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  filters_json JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_saved_searches_user (user_id),
  CONSTRAINT fk_saved_searches_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE favorites (
  user_id BIGINT UNSIGNED NOT NULL,
  listing_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, listing_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_favorites_listing FOREIGN KEY (listing_id) REFERENCES animal_listings(id)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  reviewer_id BIGINT UNSIGNED NOT NULL,
  reviewed_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_order (order_id),
  CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
  CONSTRAINT fk_reviews_reviewed FOREIGN KEY (reviewed_id) REFERENCES users(id),
  CONSTRAINT ck_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  body VARCHAR(255) NOT NULL,
  read_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user (user_id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

INSERT INTO roles (name) VALUES ('ADMIN'), ('PRODUCER'), ('BUYER'), ('CARRIER');

INSERT INTO categories (slug, name, description) VALUES
('bovinos', 'Bovinos', 'Gado de corte e leite'),
('equinos', 'Equinos', 'Cavalos e éguas'),
('aves', 'Aves', 'Frangos, galinhas e poedeiras'),
('suinos', 'Suínos', 'Leitões, matrizes e terminados'),
('ovinos', 'Ovinos', 'Ovelhas, borregos e matrizes'),
('caprinos', 'Caprinos', 'Cabras, bodes e reprodutores');

INSERT INTO breeds (category_id, name)
SELECT c.id, b.name
FROM categories c
JOIN (
  SELECT 'bovinos' slug, 'Nelore' name UNION ALL
  SELECT 'bovinos', 'Angus x Nelore' UNION ALL
  SELECT 'equinos', 'Mangalarga Marchador' UNION ALL
  SELECT 'equinos', 'Quarto de Milha' UNION ALL
  SELECT 'aves', 'Cobb 500' UNION ALL
  SELECT 'aves', 'Ross 308' UNION ALL
  SELECT 'suinos', 'Landrace x Large White' UNION ALL
  SELECT 'suinos', 'Duroc' UNION ALL
  SELECT 'ovinos', 'Santa Inês' UNION ALL
  SELECT 'caprinos', 'Boer'
) b ON b.slug = c.slug;
