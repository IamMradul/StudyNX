create extension if not exists pgcrypto;

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_name text not null unique,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.user_progress enable row level security;

drop policy if exists "Allow read progress" on public.user_progress;
drop policy if exists "Allow insert progress" on public.user_progress;
drop policy if exists "Allow update progress" on public.user_progress;

create policy "Allow read progress"
on public.user_progress
for select
to authenticated
using (user_name = auth.email());

create policy "Allow insert progress"
on public.user_progress
for insert
to authenticated
with check (user_name = auth.email());

create policy "Allow update progress"
on public.user_progress
for update
to authenticated
using (user_name = auth.email())
with check (user_name = auth.email());
