-- ============================================================================
-- JU Maths Society — PROJECTS: video + external link support  (file 6)
-- Run AFTER 01_schema.sql and 02_policies.sql. Idempotent — safe to re-run.
--
-- The projects table already has title, description, thumbnail_url, pdf_url and
-- author. This adds a video link and a generic external link so the admin can
-- attach a photo, PDF, video and/or any link to a project.
-- ============================================================================

alter table projects add column if not exists video_url text;
alter table projects add column if not exists link_url  text;

-- ── Storage bucket for project thumbnails / PDFs (public) ───────────────────
insert into storage.buckets (id, name, public) values
  ('projects', 'projects', true)
on conflict (id) do nothing;

drop policy if exists "Public read projects"   on storage.objects;
drop policy if exists "Admins manage projects" on storage.objects;

create policy "Public read projects"
  on storage.objects for select
  using (bucket_id = 'projects');

create policy "Admins manage projects"
  on storage.objects for all
  using (bucket_id = 'projects' and public.is_admin())
  with check (bucket_id = 'projects' and public.is_admin());

-- ============================================================================
-- DONE. (RLS for the projects TABLE itself is already handled in 02_policies.sql:
--        public read, admin-only insert/update/delete.)
-- ============================================================================
