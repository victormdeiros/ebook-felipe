-- ──────────────────────────────────────────────────────────────────
-- Manual do Empregador — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.
-- ──────────────────────────────────────────────────────────────────

-- Leads captured from the landing page CTA form
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  whatsapp    text not null,
  created_at  timestamptz not null default now()
);

-- Index for fast email lookups (deduplication / search)
create index if not exists leads_email_idx on leads (email);

-- Analytics events (page_view, form_start, purchase)
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  payload      jsonb,
  occurred_at  timestamptz not null default now()
);

create index if not exists events_name_idx   on events (name);
create index if not exists events_time_idx   on events (occurred_at desc);

-- ── Row Level Security ────────────────────────────────────────────
-- By default, the anon key can INSERT leads and events but NOT read them.
-- Only authenticated users (admin) can SELECT.

alter table leads  enable row level security;
alter table events enable row level security;

-- Allow anonymous INSERT (from the landing page)
create policy "leads_insert_anon"
  on leads for insert
  to anon
  with check (true);

create policy "events_insert_anon"
  on events for insert
  to anon
  with check (true);

-- Allow authenticated users full access (admin panel reads data via service role key or auth session)
create policy "leads_all_authed"
  on leads for all
  to authenticated
  using (true)
  with check (true);

create policy "events_all_authed"
  on events for all
  to authenticated
  using (true)
  with check (true);
