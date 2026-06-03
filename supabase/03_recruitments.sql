-- ============================================================
-- RECRUITMENTS
-- Admin-managed recruitment drives with deadlines.
-- The homepage banner + public /recruitment page read the most
-- recent OPEN drive; admins manage these from /admin/recruitment.
-- ============================================================

create table if not exists recruitments (
  id            uuid primary key default gen_random_uuid(),
  title         text not null default 'Recruitment',
  session_label text,                       -- e.g. "2025–26"
  subtitle      text,                       -- tagline under the title
  deadline      timestamptz not null,       -- applications close at this instant
  form_action   text,                       -- Formspree endpoint for submissions
  is_open       boolean not null default true,
  created_at    timestamptz default now()
);

create index if not exists recruitments_open_deadline_idx
  on recruitments (is_open, deadline desc);

-- ── Row-Level Security ──────────────────────────────────────
alter table recruitments enable row level security;

drop policy if exists "Public can view recruitments"  on recruitments;
drop policy if exists "Admins can insert recruitments" on recruitments;
drop policy if exists "Admins can update recruitments" on recruitments;
drop policy if exists "Admins can delete recruitments" on recruitments;

-- Anyone (including anon visitors) can read recruitment drives so the
-- public site can show the banner / countdown.
create policy "Public can view recruitments"
  on recruitments for select using (true);

-- Only admins (public.is_admin()) can create / edit / remove drives.
create policy "Admins can insert recruitments"
  on recruitments for insert with check (public.is_admin());
create policy "Admins can update recruitments"
  on recruitments for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete recruitments"
  on recruitments for delete using (public.is_admin());
