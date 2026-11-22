-- story_memory table
-- Cross-run story memory for the discovery pipeline (C-2 in the Session #43
-- approved design). Remembers every story Scout has already handled so a
-- "new" hit that is actually the same story resurfacing (from a different feed,
-- category, or after a provider-quota gap) is not re-searched and re-generated
-- from scratch.
-- STATUS: DESIGN ARTIFACT — NOT APPLIED.
-- Intended rollout: DUPLICATE / DEVELOPMENT-CONTROL STAGE (after Stage 1
-- registry-based monitoring is approved and proven). Behaviourally inactive
-- until then.
-- DESIGN ARTIFACT — Session #43, observe mode. NOT applied to the live database.
--
-- What it stores per story:
--   story_key      canonical key = normalised title tokens + source cluster
--                  (same signature used by story-worthiness.js storiesOverlap)
--   last_status    searched | skipped | gate_failed | published | quota_skipped
--   last_seen_at   last time the story was processed by any run
--   last_skipped_at, last_failed_at, last_published_at — per-status timestamps
--                  so cooldowns are computed against the RIGHT event, not just
--                  "whenever we last saw it"
--
-- Cooldown rules (Felix, Session #43 approved):
--   12h after a search/skip verdict    → if the SAME story reappears, skip the
--       re-search + re-generation (it was already judged and handled).
--   24h after a gate_fail or a publish → longer cooldown: a story that died at
--       the quality gate or already published does NOT deserve a full re-spend
--       within a day. (A re-spend after 24h is the deliberate "second chance"
--       window, not an accident.)
--   Development-signal re-entry: a genuinely NEW development (≥2 new named
--       entities vs. what the story held when last seen, OR the primary source
--       itself re-opened the story with new facts) resets the cooldown —
--       "new developments resurface old stories, but a headline re-shared on
--       social does not." The ≥2-entity rule exists so the same story recycled
--       by a different outlet cannot sneak back in as "new".
--
-- Idempotent: safe to re-run. If/when applied, run:
--   NOTIFY pgrst, 'reload schema';

CREATE TABLE IF NOT EXISTS story_memory (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  story_key          text NOT NULL UNIQUE,
  title_seed         text,                      -- the title that created the key (diagnostics)
  category           text,
  last_status        text NOT NULL DEFAULT 'searched',
                     CHECK (last_status IN ('searched','skipped','gate_failed','published','quota_skipped')),
  last_seen_at       timestamptz NOT NULL DEFAULT now(),
  last_searched_at   timestamptz,
  last_skipped_at    timestamptz,
  last_gate_failed_at timestamptz,
  last_published_at  timestamptz,
  last_quota_skipped_at timestamptz,
  seen_count         int NOT NULL DEFAULT 1,    -- how many times the story has resurfaced
  entity_snapshot    jsonb,                     -- named entities seen last time (development-signal check)
  pending_post_id    bigint,                    -- most recent queue row for this story (if any)
  post_id            text                       -- most recent published post id (if any)
);

CREATE INDEX IF NOT EXISTS story_memory_status_idx   ON story_memory (last_status);
CREATE INDEX IF NOT EXISTS story_memory_seen_idx     ON story_memory (last_seen_at);
CREATE INDEX IF NOT EXISTS story_memory_key_idx      ON story_memory (story_key);

ALTER TABLE story_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role full access" ON story_memory;
CREATE POLICY "service role full access"
  ON story_memory
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
