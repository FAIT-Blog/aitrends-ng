-- editorial_queue table
-- Felix posts to #scout-editor in Slack → Slack Events API → /api/slack/editorial → here.
-- Scout reads pending rows instead of polling the Slack API every run.
--
-- Lifecycle:  pending → consumed (Scout used it) → posted_at set (Slack reply sent)
-- If Scout runs but no post is queued, rows stay pending and carry over to the next run.
--
-- Run once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS editorial_queue (
  id            bigint generated always as identity primary key,
  slack_ts      text unique not null,    -- Slack message timestamp — used as thread_ts when replying
  slack_channel text not null,           -- Slack channel ID — needed to target the reply
  text          text,                    -- stripped plain-text content of Felix's message
  urls          text[],                  -- URLs extracted from the message
  notes         text,                    -- any non-URL editorial annotation Felix included
  status        text default 'pending',  -- pending | consumed
  used_in_post  text,                    -- title of the post this input contributed to
  posted_at     timestamptz,             -- set after the Slack reply thread has been sent
  consumed_at   timestamptz,
  created_at    timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_editorial_queue_status
  ON editorial_queue (status, created_at DESC);

ALTER TABLE editorial_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access"
  ON editorial_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
