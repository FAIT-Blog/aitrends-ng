-- AITrends.ng Database Schema
-- Run this in your Supabase SQL editor at https://app.supabase.com

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────
-- Table: posts
-- ─────────────────────────────────────────
create table if not exists posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text unique not null,
  content          text not null default '',
  excerpt          text not null default '',
  category         text not null default 'industry'
                   check (category in ('ai-models','anthropic','industry','tools','ai')),
  tags             text[] not null default '{}',
  cover_image_url  text not null default '',
  cover_image_prompt text not null default '',
  source_urls      text[] not null default '{}',
  status           text not null default 'draft'
                   check (status in ('published','draft')),
  auto_generated   boolean not null default false,
  created_at       timestamptz not null default now(),
  published_at     timestamptz
);

create index if not exists posts_status_published_at on posts (status, published_at desc);
create index if not exists posts_category on posts (category);
create index if not exists posts_slug on posts (slug);

-- ─────────────────────────────────────────
-- Table: scout_memory
-- Prevents Scout from re-publishing stories
-- ─────────────────────────────────────────
create table if not exists scout_memory (
  id           uuid primary key default gen_random_uuid(),
  feed_url     text not null,
  item_guid    text not null,
  item_title   text not null default '',
  processed_at timestamptz not null default now(),
  post_id      uuid references posts(id) on delete set null,
  unique (feed_url, item_guid)
);

create index if not exists scout_memory_guid on scout_memory (feed_url, item_guid);

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────
alter table posts enable row level security;
alter table scout_memory enable row level security;

-- Public: read published posts only
create policy "Public read published posts"
  on posts for select
  using (status = 'published');

-- Service role (Scout / API) can do everything — handled via service_role key
-- No additional policy needed; service_role bypasses RLS by default
