-- source_reputation table
-- Tracks which external domains consistently appear in same-story bucket lists.
-- Promotion: domain appears 5+ times  → is_priority = true (checked first in future searches)
-- Demotion:  priority domain silent 7+ days → is_priority = false, count reset to 0
-- Re-entry:  demoted domain earns 5 hits again → re-promoted automatically
--
-- Run this once in the Supabase SQL editor for your project.

CREATE TABLE IF NOT EXISTS source_reputation (
  id           bigint generated always as identity primary key,
  domain       text unique not null,
  count        integer default 0,
  last_seen    timestamptz,
  is_priority  boolean default false,
  promoted_at  timestamptz,
  dropped_at   timestamptz,
  created_at   timestamptz default now()
);

-- Index for the demotion query (finds priority sources by last_seen age)
CREATE INDEX IF NOT EXISTS idx_source_reputation_priority_seen
  ON source_reputation (is_priority, last_seen);

-- Allow Scout's service role to read and write this table
ALTER TABLE source_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access"
  ON source_reputation
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
