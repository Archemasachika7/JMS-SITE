-- ============================================================
-- JU Maths Society — Admin & Problems migration
-- Run this in your Supabase SQL editor AFTER
--   profiles-migration.sql  and  tables-migration.sql
-- ============================================================
--
-- This migration:
--   1. Creates the `problems` table (Problem of the Day / Week) with LaTeX.
--   2. Adds an is_admin() helper that reads profiles.role.
--   3. Adds admin-only INSERT/UPDATE/DELETE policies to every content
--      table so promoted admins can manage content from the hidden
--      /admin dashboard.
--   4. Adds admin UPDATE/SELECT policies on donators & sponsors so the
--      review queue can approve/reject applications.
--
-- ADMINS ARE PROMOTED MANUALLY. There is intentionally no UI to grant
-- admin. To make someone an admin, run in the SQL editor:
--     update profiles set role = 'admin' where id = '<user-uuid>';
-- (or look the user up by joining auth.users on email).

-- ============================================================
-- is_admin() — true when the calling user has role = 'admin'.
-- SECURITY DEFINER so it can read profiles regardless of RLS,
-- avoiding recursive policy evaluation.
-- ============================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ============================================================
-- PROBLEMS (Problem of the Day / Week)
-- ============================================================
create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  statement text,            -- LaTeX-formatted problem statement
  solution text,             -- LaTeX-formatted solution (hidden until published)
  difficulty text default 'medium', -- easy | medium | hard
  topic text,                -- e.g. Combinatorics, Graph Theory
  source text,               -- optional attribution / contest name
  is_published boolean default true,
  problem_date date default current_date,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

alter table problems enable row level security;

-- The public Events section reads club_events.poster_url. Older installs may
-- have created the column as `poster`; ensure poster_url exists either way.
do $$ begin
  if exists (select 1 from information_schema.tables where table_name='club_events')
     and not exists (select 1 from information_schema.columns where table_name='club_events' and column_name='poster_url') then
    alter table club_events add column poster_url text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='problems' and policyname='Anyone can view published problems') then
    create policy "Anyone can view published problems"
      on problems for select using (is_published = true or public.is_admin());
  end if;
end $$;

-- ============================================================
-- Admin write access for all content tables.
-- Each block adds INSERT / UPDATE / DELETE for admins (idempotent).
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['gallery','potw','magazines','club_events','astronomy_events','problems']
  loop
    if not exists (select 1 from pg_policies where tablename=t and policyname='Admins can insert '||t) then
      execute format('create policy "Admins can insert %1$s" on %1$s for insert with check (public.is_admin());', t);
    end if;
    if not exists (select 1 from pg_policies where tablename=t and policyname='Admins can update '||t) then
      execute format('create policy "Admins can update %1$s" on %1$s for update using (public.is_admin()) with check (public.is_admin());', t);
    end if;
    if not exists (select 1 from pg_policies where tablename=t and policyname='Admins can delete '||t) then
      execute format('create policy "Admins can delete %1$s" on %1$s for delete using (public.is_admin());', t);
    end if;
  end loop;
end $$;

-- ============================================================
-- Donators & Sponsors — admin review queue access.
-- (Tables already exist; we only add admin policies + a status column
--  guard so the review queue can list and moderate every submission.)
-- ============================================================
do $$ begin
  if exists (select 1 from information_schema.tables where table_name='donators') then
    if not exists (select 1 from information_schema.columns where table_name='donators' and column_name='status') then
      alter table donators add column status text default 'pending';
    end if;
    if not exists (select 1 from pg_policies where tablename='donators' and policyname='Admins can view all donators') then
      create policy "Admins can view all donators" on donators for select using (public.is_admin());
    end if;
    if not exists (select 1 from pg_policies where tablename='donators' and policyname='Admins can update donators') then
      create policy "Admins can update donators" on donators for update using (public.is_admin()) with check (public.is_admin());
    end if;
  end if;

  if exists (select 1 from information_schema.tables where table_name='sponsors') then
    if not exists (select 1 from information_schema.columns where table_name='sponsors' and column_name='status') then
      alter table sponsors add column status text default 'pending';
    end if;
    if not exists (select 1 from pg_policies where tablename='sponsors' and policyname='Admins can view all sponsors') then
      create policy "Admins can view all sponsors" on sponsors for select using (public.is_admin());
    end if;
    if not exists (select 1 from pg_policies where tablename='sponsors' and policyname='Admins can update sponsors') then
      create policy "Admins can update sponsors" on sponsors for update using (public.is_admin()) with check (public.is_admin());
    end if;
  end if;
end $$;

-- ============================================================
-- Profiles — admins can view & update every profile so the
-- "student subscriptions" panel can list members and adjust plans.
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Admins can view all profiles') then
    create policy "Admins can view all profiles" on profiles for select using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Admins can update all profiles') then
    create policy "Admins can update all profiles" on profiles for update using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;
