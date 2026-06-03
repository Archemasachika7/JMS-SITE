-- ============================================================================
-- JU Maths Society — DATABASE SCHEMA  (file 1 of 2)
-- Run this FIRST in the Supabase SQL editor, then run 02_policies.sql.
--
-- This creates every table the site uses. It is idempotent — safe to re-run.
-- ============================================================================

create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ============================================================
-- PROFILES  (one row per auth user)
-- role: 'member' | 'core' | 'admin'   plan: 'free' | 'monthly' | 'annual'
-- Promote an admin manually:  update profiles set role='admin' where id='<uuid>';
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  bio text,
  profile_image text,
  role text default 'member',
  plan text default 'free',
  year text,
  department text,
  phone text,
  designation text,
  created_at timestamptz default now(),
  last_login_at timestamptz,
  last_login_ip text
);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'New User'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- PROBLEMS  (Problem of the Day / Week — LaTeX)
-- ============================================================
create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  statement text,
  solution text,
  difficulty text default 'medium',   -- easy | medium | hard
  topic text,
  source text,
  is_published boolean default true,
  problem_date date default current_date,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ============================================================
-- GALLERY
-- ============================================================
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  caption text,
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz default now()
);

-- ============================================================
-- POTW  (Problem / Photo of the Week)
-- ============================================================
create table if not exists potw (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  title text,
  photographer text,
  date timestamptz default now()
);

-- ============================================================
-- MAGAZINES
-- ============================================================
create table if not exists magazines (
  id uuid primary key default gen_random_uuid(),
  title text,
  issue text,
  cover_image text,
  pdf_url text,
  published_at timestamptz default now()
);

-- ============================================================
-- CLUB EVENTS
-- ============================================================
create table if not exists club_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  poster_url text,
  location text,
  event_date timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- PROJECTS  (member research / project showcase)
-- ============================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  thumbnail_url text,
  pdf_url text,
  author text,
  created_at timestamptz default now()
);

-- ============================================================
-- DONATORS  (donation applications + payment proof)
-- status: 'pending' | 'verified' | 'rejected'   (public page shows 'verified')
-- ============================================================
create table if not exists donators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text,
  email text,
  phone text,
  amount numeric,
  is_anonymous boolean default false,
  profile_pic_url text,
  transaction_ref text,
  payment_proof_url text,            -- path inside the private payment_proofs bucket
  status text default 'pending',
  certificate_issued boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- SPONSORS  (sponsorship applications + payment proof)
-- plan_type: community | merchandise | event | major
-- ============================================================
create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  organization_name text,
  contact_name text,
  email text,
  phone text,
  website_url text,
  logo_url text,
  plan_type text,
  amount numeric,
  transaction_ref text,
  payment_proof_url text,            -- path inside the private payment_proofs bucket
  status text default 'pending',
  certificate_issued boolean default false,
  created_at timestamptz default now()
);
