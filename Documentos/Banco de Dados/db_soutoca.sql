-- ============================================================
-- BASE
-- ============================================================
CREATE DATABASE IF NOT EXISTS db_soutoca
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE db_soutoca;

-- ============================================================
-- USUÁRIOS E CONTROLE DE ACESSO
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: roles  |  Perfis de acesso do sistema
-- ------------------------------------------------------------
CREATE TABLE roles (
  role_id   TINYINT UNSIGNED PRIMARY KEY,
  name      VARCHAR(32) NOT NULL UNIQUE
);

INSERT INTO roles (role_id, name) VALUES
  (1,'discente'), (2,'docente'), (3,'docente_edf'), (4,'admin');

-- ------------------------------------------------------------
-- Tabela: users  |  Cadastro de usuários
-- ------------------------------------------------------------
CREATE TABLE users (
  usr_id        BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  role_id       TINYINT UNSIGNED NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    VARCHAR(255) NULL,
  about         TEXT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- ============================================================
-- LOCAIS (CRIAR ANTES DE QUALQUER FK QUE OS REFERENCIE)
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: locals  |  Espaços físicos (quadras/salas/áreas)
-- ------------------------------------------------------------
CREATE TABLE locals (
  local_id   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(120) NOT NULL,
  location   VARCHAR(160) NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_local_name (name)
);

-- ============================================================
-- EVENTOS ESPORTIVOS
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: events  |  Eventos esportivos criados por docentes/docentes_edf/admin
-- ------------------------------------------------------------
CREATE TABLE events (
  event_id     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  created_by   BIGINT UNSIGNED NOT NULL,
  title        VARCHAR(140) NOT NULL,
  description  TEXT NULL,
  sport        VARCHAR(80) NULL,
  start_time   DATETIME NOT NULL,
  end_time     DATETIME NOT NULL,
  location     VARCHAR(160) NULL,
  capacity     INT UNSIGNED NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_user FOREIGN KEY (created_by) REFERENCES users(usr_id),
  CONSTRAINT ck_events_time CHECK (end_time > start_time)
);

CREATE INDEX idx_events_time      ON events(start_time, end_time);
CREATE INDEX idx_events_published ON events(is_published);

-- ------------------------------------------------------------
-- Tabela: event_registrations  |  Inscrições de usuários em eventos
-- ------------------------------------------------------------
CREATE TABLE event_registrations (
  reg_id     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  event_id   BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  local_id 	 BIGINT UNSIGNED NULL,
  status     ENUM('inscrito','confirmado','cancelado') NOT NULL DEFAULT 'inscrito',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_event_user (event_id, usr_id),
  CONSTRAINT fk_is_local FOREIGN KEY (local_id) REFERENCES locals(local_id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_user  FOREIGN KEY (usr_id)  REFERENCES users(usr_id)  ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela: event_comments  |  Comentários em eventos
-- ------------------------------------------------------------
CREATE TABLE event_comments (
  comment_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  event_id   BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  content    TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_evcom_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  CONSTRAINT fk_evcom_user  FOREIGN KEY (usr_id)  REFERENCES users(usr_id)  ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela: event_ratings  |  Avaliações (1–5) de eventos
-- ------------------------------------------------------------
CREATE TABLE event_ratings (
  rating_id  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  event_id   BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_event_rating (event_id, usr_id),
  CONSTRAINT ck_event_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_evr_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  CONSTRAINT fk_evr_user  FOREIGN KEY (usr_id)  REFERENCES users(usr_id)  ON DELETE CASCADE
);

-- ============================================================
-- INICIAÇÕES ESPORTIVAS
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: initiatives  |  Programas de iniciação esportiva
-- ------------------------------------------------------------
CREATE TABLE initiatives (
  init_id     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  created_by  BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(140) NOT NULL,
  description TEXT NULL,
  sport       VARCHAR(80) NULL,
  min_age     TINYINT UNSIGNED NULL,
  max_age     TINYINT UNSIGNED NULL,
  slots       INT UNSIGNED NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_init_user FOREIGN KEY (created_by) REFERENCES users(usr_id)
);

CREATE INDEX idx_initiatives_active ON initiatives(is_active);
CREATE INDEX idx_initiatives_title  ON initiatives(title);

-- ------------------------------------------------------------
-- Tabela: initiative_schedules  |  Agenda (dia/local/horário) das iniciativas
-- (depende de initiatives e locals, por isso vem DEPOIS das duas)
-- ------------------------------------------------------------
CREATE TABLE initiative_schedules (
  sched_id    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  init_id     BIGINT UNSIGNED NOT NULL,
  local_id    BIGINT UNSIGNED NOT NULL,
  weekday     ENUM('seg','ter','qua','qui','sex','sáb','dom') NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_init_local_slot (init_id, local_id, weekday, start_time, end_time),
  CONSTRAINT fk_isched_init  FOREIGN KEY (init_id)  REFERENCES initiatives(init_id) ON DELETE CASCADE,
  CONSTRAINT fk_isched_local FOREIGN KEY (local_id) REFERENCES locals(local_id)     ON DELETE CASCADE,
  CONSTRAINT ck_is_time CHECK (end_time > start_time)
);

CREATE INDEX idx_is_local_weekday_time ON initiative_schedules(local_id, weekday, start_time, end_time);
CREATE INDEX idx_is_init               ON initiative_schedules(init_id);

-- ------------------------------------------------------------
-- Tabela: initiative_enrollments  |  Inscrições de usuários nas iniciativas
-- ------------------------------------------------------------
CREATE TABLE initiative_enrollments (
  enroll_id  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  init_id    BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  status     ENUM('inscrito','confirmado','cancelado') NOT NULL DEFAULT 'inscrito',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_init_user (init_id, usr_id),
  CONSTRAINT fk_inen_init FOREIGN KEY (init_id) REFERENCES initiatives(init_id) ON DELETE CASCADE,
  CONSTRAINT fk_inen_user FOREIGN KEY (usr_id)  REFERENCES users(usr_id)      ON DELETE CASCADE
);

CREATE INDEX idx_inen_status ON initiative_enrollments(status);

-- ------------------------------------------------------------
-- Tabela: initiative_comments  |  Comentários em iniciativas
-- ------------------------------------------------------------
CREATE TABLE initiative_comments (
  comment_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  init_id    BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  content    TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ic_init FOREIGN KEY (init_id) REFERENCES initiatives(init_id) ON DELETE CASCADE,
  CONSTRAINT fk_ic_user FOREIGN KEY (usr_id)  REFERENCES users(usr_id)      ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela: initiative_ratings  |  Avaliações (1–5) de iniciativas
-- ------------------------------------------------------------
CREATE TABLE initiative_ratings (
  rating_id  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  init_id    BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_init_rating (init_id, usr_id),
  CONSTRAINT ck_init_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_ir_init FOREIGN KEY (init_id) REFERENCES initiatives(init_id) ON DELETE CASCADE,
  CONSTRAINT fk_ir_user FOREIGN KEY (usr_id)  REFERENCES users(usr_id)      ON DELETE CASCADE
);

CREATE INDEX idx_ir_rating ON initiative_ratings(rating);

-- ============================================================
-- RESERVAS PONTUAIS DE LOCAIS
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: local_reservations  |  Reservas pontuais de locais
-- ------------------------------------------------------------
CREATE TABLE local_reservations (
  resv_id    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  local_id   BIGINT UNSIGNED NOT NULL,
  usr_id     BIGINT UNSIGNED NOT NULL,
  purpose    ENUM('treino','jogo','evento','aula','outro') NOT NULL DEFAULT 'treino',
  start_time DATETIME NOT NULL,
  end_time   DATETIME NOT NULL,
  status     ENUM('pendente','confirmada','cancelada') NOT NULL DEFAULT 'pendente',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resv_local FOREIGN KEY (local_id) REFERENCES locals(local_id),
  CONSTRAINT fk_resv_user  FOREIGN KEY (usr_id)  REFERENCES users(usr_id),
  CONSTRAINT ck_resv_time CHECK (end_time > start_time)
);

CREATE INDEX idx_resv_local_time ON local_reservations(local_id, start_time, end_time);
CREATE INDEX idx_resv_status     ON local_reservations(status);

-- ============================================================
-- CONTEÚDO (ARTIGOS/NOTÍCIAS)
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: articles  |  Publicações e notícias
-- ------------------------------------------------------------
CREATE TABLE articles (
  article_id   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  created_by   BIGINT UNSIGNED NOT NULL,
  title        VARCHAR(160) NOT NULL,
  summary      VARCHAR(255) NULL,
  body         MEDIUMTEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_art_user FOREIGN KEY (created_by) REFERENCES users(usr_id)
);

CREATE INDEX idx_articles_pub ON articles(is_published, published_at);

-- ============================================================
-- FÓRUNS / DISCUSSÕES
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: forum_categories  |  Categorias do fórum
-- ------------------------------------------------------------
CREATE TABLE forum_categories (
  cat_id      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(255) NULL
);

-- ------------------------------------------------------------
-- Tabela: forum_threads  |  Tópicos do fórum
-- ------------------------------------------------------------
CREATE TABLE forum_threads (
  thread_id  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  cat_id     BIGINT UNSIGNED NOT NULL,
  author_id  BIGINT UNSIGNED NOT NULL,
  title      VARCHAR(160) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_thr_cat    FOREIGN KEY (cat_id)    REFERENCES forum_categories(cat_id),
  CONSTRAINT fk_thr_author FOREIGN KEY (author_id) REFERENCES users(usr_id)
);

-- ------------------------------------------------------------
-- Tabela: forum_posts  |  Posts dentro dos tópicos
-- ------------------------------------------------------------
CREATE TABLE forum_posts (
  post_id    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  thread_id  BIGINT UNSIGNED NOT NULL,
  author_id  BIGINT UNSIGNED NOT NULL,
  content    MEDIUMTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_thread FOREIGN KEY (thread_id) REFERENCES forum_threads(thread_id) ON DELETE CASCADE,
  CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users(usr_id)
);

-- ============================================================
-- NOTIFICAÇÕES
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: notifications  |  Avisos internos do sistema
-- ------------------------------------------------------------
CREATE TABLE notifications (
  notif_id   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usr_id     BIGINT UNSIGNED NOT NULL,
  type       ENUM(
                'evento_lembrete','evento_confirmado','evento_alterado',
                'inscricao_confirmada','inscricao_cancelada',
                'reserva_confirmada','reserva_cancelada','reserva_lembrete',
                'mensagem_forum'
              ) NOT NULL,
  ref_table  VARCHAR(40)  NULL,  -- ex.: 'events', 'local_reservations'
  ref_id     BIGINT UNSIGNED NULL,
  title      VARCHAR(160) NOT NULL,
  body       VARCHAR(255) NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (usr_id) REFERENCES users(usr_id)
);

CREATE INDEX idx_notifications_user ON notifications(usr_id, is_read, created_at);

-- ============================================================
-- AUDITORIA
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: audit_log  |  Registro simples de ações
-- ------------------------------------------------------------
CREATE TABLE audit_log (
  log_id    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usr_id    BIGINT UNSIGNED NULL,
  action    VARCHAR(60) NOT NULL,  -- ex.: 'LOGIN','CREATE_EVENT','UPDATE_RESERVATION'
  entity    VARCHAR(40) NULL,
  entity_id BIGINT UNSIGNED NULL,
  ip        VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (usr_id) REFERENCES users(usr_id)
);

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- ------------------------------------------------------------
-- View: vw_upcoming_events  |  Próximos eventos publicados com contagem de inscritos
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vw_upcoming_events AS
SELECT
  e.event_id, e.title, e.sport, e.start_time, e.end_time, e.location,
  e.capacity,
  (SELECT COUNT(*)
   FROM event_registrations r
   WHERE r.event_id = e.event_id AND r.status IN ('inscrito','confirmado')) AS inscritos
FROM events e
WHERE e.is_published = TRUE
  AND e.start_time >= NOW()
ORDER BY e.start_time ASC;

-- ------------------------------------------------------------
-- View: vw_local_bookings  |  Reservas futuras (pendentes/confirmadas) por local
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vw_local_bookings AS
SELECT
  c.local_id,
  c.name AS local_name,
  r.resv_id,
  r.start_time,
  r.end_time,
  r.status
FROM locals c
LEFT JOIN local_reservations r
  ON r.local_id = c.local_id
 AND r.status IN ('pendente','confirmada')
 AND r.end_time >= NOW();

-- ============================================================
-- SEED OPCIONAL
-- ============================================================
-- INSERT INTO users (role_id, full_name, email, password_hash)
-- VALUES (4, 'Admin', 'admin@soutoca.edu', '$argon2id$v=19$...');
