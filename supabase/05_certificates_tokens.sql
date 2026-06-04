-- ============================================================================
-- JU Maths Society — CERTIFICATES & PUBLIC STATUS TOKENS  (file 5)
-- Run AFTER 01_schema.sql and 02_policies.sql. Idempotent — safe to re-run.
--
-- Adds:
--   * a short, unguessable access_token on every donation / sponsorship so a
--     donor can look up their status WITHOUT logging in,
--   * a certificate_url column holding the admin-uploaded certificate PDF,
--   * a public `certificates` storage bucket + policies,
--   * a SECURITY DEFINER lookup function so an anonymous visitor can fetch
--     ONLY their own row, by exact token OR exact email.
-- ============================================================================

-- ── 1. Columns ──────────────────────────────────────────────────────────────
alter table donators add column if not exists access_token   text;
alter table donators add column if not exists certificate_url text;
alter table sponsors add column if not exists access_token   text;
alter table sponsors add column if not exists certificate_url text;

-- Backfill existing rows, then make every NEW row get a token automatically.
-- 9 random bytes → 18 hex characters: unguessable but easy to copy/paste.
update donators set access_token = encode(gen_random_bytes(9), 'hex') where access_token is null;
update sponsors set access_token = encode(gen_random_bytes(9), 'hex') where access_token is null;

alter table donators alter column access_token set default encode(gen_random_bytes(9), 'hex');
alter table sponsors alter column access_token set default encode(gen_random_bytes(9), 'hex');

create unique index if not exists donators_access_token_key on donators(access_token);
create unique index if not exists sponsors_access_token_key on sponsors(access_token);

-- ── 2. Public lookup function (SECURITY DEFINER) ────────────────────────────
-- Runs as the function owner so it bypasses RLS, but it only ever returns rows
-- the caller has already identified by an exact token or email — nothing else.
create or replace function public.lookup_submissions(p_query text)
returns table (
  kind               text,
  name               text,
  amount             numeric,
  status             text,
  certificate_issued boolean,
  certificate_url    text,
  transaction_ref    text,
  access_token       text,
  created_at         timestamptz
) as $$
  select 'donation'::text as kind,
         coalesce(full_name, 'Anonymous') as name,
         amount, status, certificate_issued, certificate_url,
         transaction_ref, access_token, created_at
  from public.donators
  where coalesce(trim(p_query), '') <> ''
    and (access_token = p_query or lower(email) = lower(p_query))
  union all
  select 'sponsorship'::text as kind,
         organization_name as name,
         amount, status, certificate_issued, certificate_url,
         transaction_ref, access_token, created_at
  from public.sponsors
  where coalesce(trim(p_query), '') <> ''
    and (access_token = p_query or lower(email) = lower(p_query))
  order by created_at desc;
$$ language sql security definer stable;

grant execute on function public.lookup_submissions(text) to anon, authenticated;

-- ── 3. Certificates storage bucket (public, unguessable paths) ──────────────
insert into storage.buckets (id, name, public) values
  ('certificates', 'certificates', true)
on conflict (id) do nothing;

drop policy if exists "Public read certificates"   on storage.objects;
drop policy if exists "Admins manage certificates" on storage.objects;

-- Anyone with the (unguessable) URL can download the certificate PDF.
create policy "Public read certificates"
  on storage.objects for select
  using (bucket_id = 'certificates');

-- Only admins can upload / replace / remove certificate PDFs.
create policy "Admins manage certificates"
  on storage.objects for all
  using (bucket_id = 'certificates' and public.is_admin())
  with check (bucket_id = 'certificates' and public.is_admin());

-- ============================================================================
-- DONE.
-- ============================================================================
