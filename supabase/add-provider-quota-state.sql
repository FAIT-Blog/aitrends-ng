-- provider_quota_state table
-- Persisted provider quota state for the quota-first gate (R-1 in the Session
-- #43 approved design).
-- STATUS: DESIGN ARTIFACT — NOT APPLIED.
-- Intended rollout: QUOTA-EFFICIENCY STAGE (after Stage 1 registry-based
-- monitoring is approved and proven). Behaviourally inactive until then.
-- DESIGN ARTIFACT — Session #43, observe mode. NOT applied to the live database.
--
-- Why it exists: the current groqTpdExhausted() cache (gemini.js) is module-
-- level only — it dies when the Node process exits. Every GitHub Actions run
-- starts a fresh process, so a run that watched Groq hit 99% TPD + Gemini hit
-- its 20/day cap forgets everything before the next 6-hour run. The next run
-- then burns source-digests again (each with a 65s Groq TPM wait) until it
-- re-discovers the providers are dead. Persisting quota state makes the next
-- run know BEFORE any RSS fetch / Tavily search / LLM call.
--
-- Real evidence (runs 31254001647 + 31295744011): 4 of 5 blend categories
-- across the two runs died on provider quota AFTER their source-digests
-- succeeded — 23 LLM calls + ~20 minutes of 65s TPM waits burned for stories
-- that could never be synthesised. Quota-first would have skipped those
-- categories at run start (R-1) while still running the editorial path (R-3).
--
-- Rows: one per provider (groq, gemini). Status values:
--   ok        — not known exhausted; call normally
--   exhausted — known at/near daily cap; skip automated calls until reset
--   unknown   — provider never seen (e.g. a fresh key)
--
-- For Groq the signal is TPD (tokens per day, ~100K free). For Gemini the
-- signal is the request cap (20 req/day free tier). A provider is "exhausted"
-- when the last run's failure said so; staleness (cooldown-age) handling lives
-- in scout.js, same pattern as gemini_quota_cooldown (Session #27/#28 —
-- elapsed-time staleness, NOT UTC calendar dates).
--
-- Idempotent: safe to re-run. If/when applied, run:
--   NOTIFY pgrst, 'reload schema';

CREATE TABLE IF NOT EXISTS provider_quota_state (
  provider       text PRIMARY KEY CHECK (provider IN ('groq','gemini')),
  status         text NOT NULL DEFAULT 'unknown'
                 CHECK (status IN ('ok','exhausted','unknown')),
  limit_value    bigint,                  -- the provider's daily cap (Groq TPD, Gemini req/day)
  used_value     bigint,                  -- what the last failure reported
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  last_exhausted_at timestamptz,          -- when the last failure was observed
  note           text                     -- free-form (e.g. "20 req/day free tier cap")
);

INSERT INTO provider_quota_state (provider, status, note) VALUES
  ('groq',  'unknown', 'Groq Llama 3.3 70B — primary provider, ~100K TPD free'),
  ('gemini', 'unknown', 'gemini-3.5-flash — fallback provider, 20 req/day free tier cap')
ON CONFLICT (provider) DO NOTHING;

ALTER TABLE provider_quota_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role full access" ON provider_quota_state;
CREATE POLICY "service role full access"
  ON provider_quota_state
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
