-- =============================================================
-- RD Station CRM — Tabelas + RPC para Painel Estratégico MdO
-- Execute no Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =============================================================

-- ─── 1. TABELAS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rdstation_deals (
  id         BIGSERIAL PRIMARY KEY,
  rdstation_id TEXT NOT NULL UNIQUE,
  name       TEXT,
  amount     NUMERIC(12,2) DEFAULT 0,
  stage_id   TEXT,
  stage_name TEXT,
  win        BOOLEAN DEFAULT FALSE,
  closed     BOOLEAN DEFAULT FALSE,
  user_name  TEXT,
  deal_source TEXT,
  contact_name TEXT,
  contact_email TEXT,
  loss_reason TEXT,
  created_at TIMESTAMPTZ,
  closed_at  TIMESTAMPTZ,
  synced_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rdstation_contacts (
  id         BIGSERIAL PRIMARY KEY,
  rdstation_id TEXT NOT NULL UNIQUE,
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  tags       TEXT[] DEFAULT '{}',
  synced_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rdstation_stages (
  id         BIGSERIAL PRIMARY KEY,
  rdstation_id TEXT NOT NULL UNIQUE,
  name       TEXT,
  stage_order INT DEFAULT 0,
  deals_count INT DEFAULT 0,
  synced_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rdstation_tasks (
  id         BIGSERIAL PRIMARY KEY,
  rdstation_id TEXT NOT NULL UNIQUE,
  subject    TEXT,
  deal_id    TEXT,
  due_date   TIMESTAMPTZ,
  done       BOOLEAN DEFAULT FALSE,
  synced_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. ÍNDICES ──────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_deals_created   ON rdstation_deals (created_at);
CREATE INDEX IF NOT EXISTS idx_deals_closed    ON rdstation_deals (closed_at);
CREATE INDEX IF NOT EXISTS idx_deals_win       ON rdstation_deals (win);
CREATE INDEX IF NOT EXISTS idx_deals_stage     ON rdstation_deals (stage_name);
CREATE INDEX IF NOT EXISTS idx_contacts_email  ON rdstation_contacts (email);
CREATE INDEX IF NOT EXISTS idx_tasks_due       ON rdstation_tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_done      ON rdstation_tasks (done);

-- ─── 3. RLS (SELECT público para leitura anônima) ────────────

ALTER TABLE rdstation_deals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdstation_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdstation_stages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdstation_tasks    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rdstation_deals_select"    ON rdstation_deals    FOR SELECT USING (true);
CREATE POLICY "rdstation_contacts_select" ON rdstation_contacts FOR SELECT USING (true);
CREATE POLICY "rdstation_stages_select"   ON rdstation_stages   FOR SELECT USING (true);
CREATE POLICY "rdstation_tasks_select"    ON rdstation_tasks    FOR SELECT USING (true);

-- Permitir INSERT/UPDATE/DELETE apenas via service_role (edge functions)
CREATE POLICY "rdstation_deals_service"    ON rdstation_deals    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "rdstation_contacts_service" ON rdstation_contacts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "rdstation_stages_service"   ON rdstation_stages   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "rdstation_tasks_service"    ON rdstation_tasks    FOR ALL USING (auth.role() = 'service_role');

-- ─── 4. RPC: rdstation_dashboard_periodo ─────────────────────

CREATE OR REPLACE FUNCTION rdstation_dashboard_periodo(
  data_ini TIMESTAMPTZ DEFAULT now() - INTERVAL '12 months',
  data_fim TIMESTAMPTZ DEFAULT now()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resultado JSONB;
BEGIN
  SELECT jsonb_build_object(
    -- KPIs
    'total_criadas',  (SELECT count(*) FROM rdstation_deals WHERE created_at BETWEEN data_ini AND data_fim),
    'total_vendidas', (SELECT count(*) FROM rdstation_deals WHERE win = true AND closed_at BETWEEN data_ini AND data_fim),
    'total_perdidas', (SELECT count(*) FROM rdstation_deals WHERE closed = true AND win = false AND closed_at BETWEEN data_ini AND data_fim),
    'valor_vendido',  COALESCE((SELECT sum(amount) FROM rdstation_deals WHERE win = true AND closed_at BETWEEN data_ini AND data_fim), 0),
    'valor_perdido',  COALESCE((SELECT sum(amount) FROM rdstation_deals WHERE closed = true AND win = false AND closed_at BETWEEN data_ini AND data_fim), 0),
    'valor_pipeline', COALESCE((SELECT sum(amount) FROM rdstation_deals WHERE closed = false), 0),
    'ticket_medio',   COALESCE((SELECT avg(amount) FROM rdstation_deals WHERE win = true AND closed_at BETWEEN data_ini AND data_fim), 0),
    'ciclo_medio_dias', COALESCE((
      SELECT avg(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400)
      FROM rdstation_deals
      WHERE win = true AND closed_at BETWEEN data_ini AND data_fim AND created_at IS NOT NULL
    ), 0),
    'win_rate', CASE
      WHEN (SELECT count(*) FROM rdstation_deals WHERE closed = true AND closed_at BETWEEN data_ini AND data_fim) > 0
      THEN round(
        (SELECT count(*)::numeric FROM rdstation_deals WHERE win = true AND closed_at BETWEEN data_ini AND data_fim)
        / (SELECT count(*)::numeric FROM rdstation_deals WHERE closed = true AND closed_at BETWEEN data_ini AND data_fim) * 100
      , 1)
      ELSE 0
    END,

    -- Funil por stage
    'funil_stages', COALESCE((
      SELECT jsonb_agg(row_to_json(sub)::jsonb ORDER BY sub.stage_order)
      FROM (
        SELECT
          s.name AS stage_name,
          s.stage_order,
          count(d.id) AS deals_count,
          COALESCE(sum(d.amount), 0) AS valor
        FROM rdstation_stages s
        LEFT JOIN rdstation_deals d ON d.stage_name = s.name AND d.closed = false
        GROUP BY s.name, s.stage_order
      ) sub
    ), '[]'::jsonb),

    -- Perdas por motivo
    'perdas_por_motivo', COALESCE((
      SELECT jsonb_agg(row_to_json(sub)::jsonb ORDER BY sub.qtd DESC)
      FROM (
        SELECT
          COALESCE(loss_reason, 'Sem motivo') AS motivo,
          count(*) AS qtd,
          COALESCE(sum(amount), 0) AS valor
        FROM rdstation_deals
        WHERE closed = true AND win = false AND closed_at BETWEEN data_ini AND data_fim
        GROUP BY loss_reason
        LIMIT 10
      ) sub
    ), '[]'::jsonb),

    -- Top deals perdidos
    'top_perdidos', COALESCE((
      SELECT jsonb_agg(row_to_json(sub)::jsonb ORDER BY sub.amount DESC)
      FROM (
        SELECT name, amount, contact_name AS contact, loss_reason AS reason
        FROM rdstation_deals
        WHERE closed = true AND win = false AND closed_at BETWEEN data_ini AND data_fim
        ORDER BY amount DESC
        LIMIT 10
      ) sub
    ), '[]'::jsonb),

    -- Performance por vendedor
    'por_vendedor', COALESCE((
      SELECT jsonb_agg(row_to_json(sub)::jsonb ORDER BY sub.receita DESC)
      FROM (
        SELECT
          user_name,
          count(*) AS total,
          count(*) FILTER (WHERE win = true) AS vendidas,
          count(*) FILTER (WHERE closed = true AND win = false) AS perdidas,
          CASE WHEN count(*) FILTER (WHERE closed = true) > 0
            THEN round(count(*) FILTER (WHERE win = true)::numeric / count(*) FILTER (WHERE closed = true)::numeric * 100, 1)
            ELSE 0
          END AS win_rate,
          COALESCE(sum(amount) FILTER (WHERE win = true), 0) AS receita,
          COALESCE(avg(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400) FILTER (WHERE win = true AND created_at IS NOT NULL), 0) AS ciclo
        FROM rdstation_deals
        WHERE created_at BETWEEN data_ini AND data_fim
        GROUP BY user_name
      ) sub
    ), '[]'::jsonb),

    -- Evolução mensal
    'evolucao_mensal', COALESCE((
      SELECT jsonb_agg(row_to_json(sub)::jsonb ORDER BY sub.mes)
      FROM (
        SELECT
          to_char(created_at, 'YYYY-MM') AS mes,
          count(*) AS criadas,
          count(*) FILTER (WHERE win = true) AS vendidas,
          COALESCE(sum(amount) FILTER (WHERE win = true), 0) AS receita
        FROM rdstation_deals
        WHERE created_at BETWEEN data_ini AND data_fim
        GROUP BY to_char(created_at, 'YYYY-MM')
      ) sub
    ), '[]'::jsonb),

    -- Contatos
    'total_contatos', (SELECT count(*) FROM rdstation_contacts),
    'contatos_com_deal', (
      SELECT count(DISTINCT contact_email)
      FROM rdstation_deals
      WHERE contact_email IS NOT NULL
    ),

    -- Tarefas
    'tarefas_total',     (SELECT count(*) FROM rdstation_tasks),
    'tarefas_abertas',   (SELECT count(*) FROM rdstation_tasks WHERE done = false),
    'tarefas_atrasadas', (SELECT count(*) FROM rdstation_tasks WHERE done = false AND due_date < now()),
    'tarefas_taxa_conclusao', CASE
      WHEN (SELECT count(*) FROM rdstation_tasks) > 0
      THEN round((SELECT count(*)::numeric FROM rdstation_tasks WHERE done = true) / (SELECT count(*)::numeric FROM rdstation_tasks) * 100, 1)
      ELSE 0
    END
  ) INTO resultado;

  RETURN resultado;
END;
$$;
