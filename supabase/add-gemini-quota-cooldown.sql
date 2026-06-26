-- gemini_quota_cooldown table
-- Single-row state used by scout-agent/gemini.js to record when BOTH
-- gemini-3.5-flash and gemini-2.5-flash return 429 (quota exhausted) in the
-- same call. scout.js and scout-podcast.js check this at the start of every
-- run and skip their entire Gemini-dependent work for the rest of the day if
-- a cooldown was already recorded today — instead of repeating the same
-- RSS fetch + Tavily search + fetchContent work every cycle against a quota
-- already known to be dead.
--
-- Run once in the Supabase SQL editor, then:
--   NOTIFY pgrst, 'reload schema';

CREATE TABLE IF NOT EXISTS gemini_quota_cooldown (
  id      integer primary key default 1,
  hit_at  timestamptz,
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE gemini_quota_cooldown ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access"
  ON gemini_quota_cooldown
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
