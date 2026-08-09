-- curated_source_registry — SINGLE SOURCE OF TRUTH for AITrends' CLOSED,
-- human-curated source network.
--
-- SUPERSEDES: add-source-registry.sql (Session #43 source_tier_cache with its
-- unknown→GENERAL upgrade path). That upgrade path is DELETED by design.
--
-- Governing principle (Felix, locked 9 Aug 2026):
--   AITrends operates a closed, human-curated source network. The system may
--   discover information from outside sources, but it must never autonomously
--   promote, classify, admit, or elevate a source into our trusted network.
--   Only Felix's curated registry determines what is an authorised
--   monitoring/evidence source.
--
--   Discover ≠ Evidence ≠ Authority.
--
-- DESIGN ARTIFACT — Stage 0. NOT applied to the live database until Felix
-- approves. Idempotent. Run via SQL editor, then:
--   NOTIFY pgrst, 'reload schema';

CREATE TABLE IF NOT EXISTS curated_source_registry (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_name      text NOT NULL UNIQUE,
  domain           text NOT NULL,
  monitoring_url   text NOT NULL UNIQUE,          -- the EXACT editorial section
  feed_url         text,                          -- exact feed; NULL when none exists
  tier             text NOT NULL CHECK (tier IN ('core','specialist','regional','general','discovery')),
  role             text NOT NULL CHECK (role IN ('evidence','discovery')),
  category         text NOT NULL CHECK (category IN ('industry','ai-models','anthropic','tools')),
  designation      text NOT NULL CHECK (designation IN ('evidence','discovery','first-party')),
  feed_type        text NOT NULL DEFAULT 'rss' CHECK (feed_type IN ('rss','atom','json','none','full-site-filtered')),
  enabled          boolean NOT NULL DEFAULT true, -- false = configured but not monitored
  deferred         boolean NOT NULL DEFAULT false,-- true = deliberately deferred (BBC/Axios policy)
  special_handling text,                          -- verified editorial notes from the 2026-08-09 inventory
  added_by         text NOT NULL DEFAULT 'felix',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Editorial-consistency constraints ────────────────────────────────
-- Evidence-role sources must be designation evidence or first-party;
-- discovery designation forces discovery role.
ALTER TABLE curated_source_registry
  DROP CONSTRAINT IF EXISTS curated_role_designation_check;
ALTER TABLE curated_source_registry
  ADD CONSTRAINT curated_role_designation_check
  CHECK ((designation = 'evidence' AND role = 'evidence')
      OR (designation = 'first-party' AND role = 'evidence')
      OR designation = 'discovery');

-- First-party is always core and never discovery.
ALTER TABLE curated_source_registry
  DROP CONSTRAINT IF EXISTS curated_first_party_check;
ALTER TABLE curated_source_registry
  ADD CONSTRAINT curated_first_party_check
  CHECK (designation <> 'first-party' OR (tier = 'core' AND role = 'evidence'));

-- feed_url NULL ⇒ feed_type must be 'none' (and vice versa).
ALTER TABLE curated_source_registry
  DROP CONSTRAINT IF EXISTS curated_feed_url_type_check;
ALTER TABLE curated_source_registry
  ADD CONSTRAINT curated_feed_url_type_check
  CHECK ((feed_url IS NULL AND feed_type = 'none') OR (feed_url IS NOT NULL AND feed_type <> 'none'));

-- Tier sanity: 'discovery' tier only for discovery-role sources.
ALTER TABLE curated_source_registry
  DROP CONSTRAINT IF EXISTS curated_tier_role_check;
ALTER TABLE curated_source_registry
  ADD CONSTRAINT curated_tier_role_check
  CHECK (tier <> 'discovery' OR role = 'discovery');

-- ── Indexes ──────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_curated_registry_enabled
  ON curated_source_registry (enabled, tier);
CREATE INDEX IF NOT EXISTS idx_curated_registry_category
  ON curated_source_registry (category);

-- ── updated_at maintenance ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_curated_registry_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_curated_registry_updated_at
  ON curated_source_registry;
CREATE TRIGGER trg_curated_registry_updated_at
  BEFORE UPDATE ON curated_source_registry
  FOR EACH ROW EXECUTE FUNCTION set_curated_registry_updated_at();

-- ── RLS (service role only, matching existing tables) ────────────────
ALTER TABLE curated_source_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access"
  ON curated_source_registry
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
