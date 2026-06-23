-- homepage_monitor table
-- Single-row snapshot used by scout-agent/homepage-monitor.js to detect
-- changes to the live homepage between runs: site <title>, meta description,
-- nav links, and which off-topic-keyword hits have already been alerted on
-- (so the same post isn't re-alerted every run while it's still showing).
--
-- Run once in the Supabase SQL editor, then:
--   NOTIFY pgrst, 'reload schema';

CREATE TABLE IF NOT EXISTS homepage_monitor (
  id                    bigint primary key,
  title                 text,
  description           text,
  nav_links             jsonb default '[]'::jsonb,
  alerted_keyword_hits  jsonb default '[]'::jsonb,
  checked_at            timestamptz default now()
);

ALTER TABLE homepage_monitor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access"
  ON homepage_monitor
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
