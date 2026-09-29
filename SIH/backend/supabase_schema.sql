-- Run in Supabase SQL Editor. The backend sends the caller's JWT, so RLS scopes rows to their owner.
create table if not exists public.saved_routes (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.saved_routes enable row level security;
create policy "Users manage their own saved routes" on public.saved_routes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
