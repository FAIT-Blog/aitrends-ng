-- llm_request_ledger table
-- Per-call telemetry written by scout-agent/gemini.js (callGeminiWithFallback)
-- for every Groq/Gemini request: provider, model, purpose, category, story,
-- estimated input/output tokens, success/failure, error type, retry attempt,
-- duration, and the GH Actions run id. Session #40 — the run post-mortem
-- (run 30967158949: 36 LLM calls, 25 quota 429s, 1 published post) had to be
-- reverse-engineered from GH Actions logs; this table makes every future run
-- auditable per-request so token spend can be optimised from data instead of
-- guesswork.
--
-- Idempotent: safe to re-run. Run once in the Supabase SQL editor, then:
--   NOTIFY pgrst, 'reload schema';

-- Session #41 columns — per-post joins + blend-source metric.
--   pending_post_id: FK to pending_posts.id, backfilled by linkLedgerToPost()
--                    after a post is queued, so published-article metrics
--                    (LLM calls per article, token spend per article) are
--                    joinable per post from data instead of logs.
--   blend_sources:   number of sources digested in a blend-mode synthesis
--                    (set on the synthesis row) — avg gives blend cost per story.
CREATE TABLE IF NOT EXISTS llm_request_ledger (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_id           text,
  timestamp        timestamptz NOT NULL DEFAULT now(),
  provider         text NOT NULL,            -- 'groq' | 'gemini' | 'pipeline' (non-LLM events)
  model            text,                     -- 'llama-3.3-70b-versatile' | 'gemini-3.5-flash' | 'quality-gate'
  purpose          text NOT NULL,            -- 'rewrite' | 'source-digest' | 'synthesis' | 'editorial' | 'gate-check' | 'publish-outcome'
  category         text,                     -- 'industry' | 'ai-models' | 'anthropic' | 'tools' | 'editorial'
  story_title      text,
  input_tokens_est int NOT NULL DEFAULT 0,   -- ~chars/4 estimate
  output_tokens_est int NOT NULL DEFAULT 0,  -- ~chars/4 estimate
  success          boolean NOT NULL,
  error_type       text,                     -- 'quota' | 'tpd' | 'rate_limit' | 'model_error' | 'http_error' | gate reasons
  retry_attempt    int,                      -- -1 = non-LLM event sentinel
  duration_ms      int,
  pending_post_id  bigint,
  blend_sources    int
);

ALTER TABLE llm_request_ledger ADD COLUMN IF NOT EXISTS pending_post_id bigint;
ALTER TABLE llm_request_ledger ADD COLUMN IF NOT EXISTS blend_sources    int;

CREATE INDEX IF NOT EXISTS llm_request_ledger_timestamp_idx ON llm_request_ledger (timestamp);
CREATE INDEX IF NOT EXISTS llm_request_ledger_purpose_idx     ON llm_request_ledger (purpose);
CREATE INDEX IF NOT EXISTS llm_request_ledger_run_idx         ON llm_request_ledger (run_id);
CREATE INDEX IF NOT EXISTS llm_request_ledger_pending_post_idx ON llm_request_ledger (pending_post_id);

ALTER TABLE llm_request_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role full access" ON llm_request_ledger;
CREATE POLICY "service role full access"
  ON llm_request_ledger
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
