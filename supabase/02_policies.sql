-- ============================================================================
-- JU Maths Society — RLS POLICIES, STORAGE & ADMIN ACCESS  (file 2 of 2)
-- Run this AFTER 01_schema.sql. Idempotent — safe to re-run.
--
-- Security model:
--   * Public can READ published content + verified donors/sponsors.
--   * Logged-in users manage their OWN profile and submit donations/sponsorships.
--   * Only ADMINS (profiles.role = 'admin') can create/edit/delete content and
--     approve/reject donor & sponsor applications, via the hidden /admin area.
--   * Admins are promoted MANUALLY (no UI):
--       update profiles set role='admin'
--       where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================================

-- ── is_admin() ────────────────────────────────────────────────────────────
-- SECURITY DEFINER so it reads profiles without tripping RLS recursion.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ── Enable RLS on every table ──────────────────────────────────────────────
alter table profiles    enable row level security;
alter table problems    enable row level security;
alter table gallery     enable row level security;
alter table potw        enable row level security;
alter table magazines   enable row level security;
alter table club_events enable row level security;
alter table projects    enable row level security;
alter table donators    enable row level security;
alter table sponsors    enable row level security;

-- ════════════════════════════════════════════════════════════════════════
-- PROFILES
-- ════════════════════════════════════════════════════════════════════════
drop policy if exists "Users can view own profile"     on profiles;
drop policy if exists "Anyone can view admin profiles"  on profiles;
drop policy if exists "Users can insert own profile"    on profiles;
drop policy if exists "Users can update own profile"     on profiles;
drop policy if exists "Admins can view all profiles"     on profiles;
drop policy if exists "Admins can update all profiles"    on profiles;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
-- Public Team page reads admin/core profiles (name, image, designation).
create policy "Anyone can view admin profiles"
  on profiles for select using (role in ('admin', 'core'));
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins can view all profiles"
  on profiles for select using (public.is_admin());
create policy "Admins can update all profiles"
  on profiles for update using (public.is_admin()) with check (public.is_admin());

-- ════════════════════════════════════════════════════════════════════════
-- CONTENT TABLES — public read, admin-only writes.
-- (problems are public only when published; admins always see drafts.)
-- ════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['gallery','potw','magazines','club_events','projects','problems']
  loop
    execute format('drop policy if exists "Public can view %1$s" on %1$s;', t);
    execute format('drop policy if exists "Admins can insert %1$s" on %1$s;', t);
    execute format('drop policy if exists "Admins can update %1$s" on %1$s;', t);
    execute format('drop policy if exists "Admins can delete %1$s" on %1$s;', t);

    if t = 'problems' then
      execute 'create policy "Public can view problems" on problems for select using (is_published = true or public.is_admin());';
    else
      execute format('create policy "Public can view %1$s" on %1$s for select using (true);', t);
    end if;

    execute format('create policy "Admins can insert %1$s" on %1$s for insert with check (public.is_admin());', t);
    execute format('create policy "Admins can update %1$s" on %1$s for update using (public.is_admin()) with check (public.is_admin());', t);
    execute format('create policy "Admins can delete %1$s" on %1$s for delete using (public.is_admin());', t);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════
-- DONATORS / SPONSORS — self-submit, public sees verified, admins moderate.
-- ════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['donators','sponsors']
  loop
    execute format('drop policy if exists "Public can view verified %1$s" on %1$s;', t);
    execute format('drop policy if exists "Users can view own %1$s" on %1$s;', t);
    execute format('drop policy if exists "Users can submit %1$s" on %1$s;', t);
    execute format('drop policy if exists "Admins can view all %1$s" on %1$s;', t);
    execute format('drop policy if exists "Admins can update %1$s" on %1$s;', t);

    execute format('create policy "Public can view verified %1$s" on %1$s for select using (status = ''verified'');', t);
    execute format('create policy "Users can view own %1$s" on %1$s for select using (auth.uid() = user_id);', t);
    execute format('create policy "Users can submit %1$s" on %1$s for insert with check (auth.uid() = user_id);', t);
    execute format('create policy "Admins can view all %1$s" on %1$s for select using (public.is_admin());', t);
    execute format('create policy "Admins can update %1$s" on %1$s for update using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
--   public:  profiles, gallery, potw, events, magazines, logos
--   private: payment_proofs  (only admins can read, via signed URLs)
-- ════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public) values
  ('profiles',       'profiles',       true),
  ('gallery',        'gallery',        true),
  ('potw',           'potw',           true),
  ('events',         'events',         true),
  ('magazines',      'magazines',      true),
  ('logos',          'logos',          true),
  ('payment_proofs', 'payment_proofs', false)
on conflict (id) do nothing;

-- Storage object policies
drop policy if exists "Public read public buckets"        on storage.objects;
drop policy if exists "Authenticated can upload"          on storage.objects;
drop policy if exists "Owner can read own payment proof"  on storage.objects;
drop policy if exists "Admins can read payment proofs"    on storage.objects;

-- Anyone can read files in the public buckets.
create policy "Public read public buckets"
  on storage.objects for select
  using (bucket_id in ('profiles','gallery','potw','events','magazines','logos'));

-- Logged-in users can upload to any of the app buckets (incl. payment proofs).
create policy "Authenticated can upload"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated'
    and bucket_id in ('profiles','gallery','potw','events','magazines','logos','payment_proofs')
  );

-- Admins can read private payment proofs so the review queue can sign URLs.
create policy "Admins can read payment proofs"
  on storage.objects for select
  using (bucket_id = 'payment_proofs' and public.is_admin());

-- ============================================================================
-- DONE. Create your first admin (replace the email), then visit /admin:
--   update profiles set role='admin'
--   where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================================
