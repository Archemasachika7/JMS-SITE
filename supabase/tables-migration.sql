-- Additional tables for the AstroSci website
-- Run this in your Supabase SQL editor AFTER profiles-migration.sql
--
-- Tables created:
--   gallery        — astrophotography uploads
--   potw           — photo of the week entries
--   magazines      — club magazine issues
--   club_events    — club-organised events
--   astronomy_events — astronomical phenomena calendar
--
-- IMPORTANT: Before running this, ensure the following Storage buckets exist
-- (create them in the Supabase dashboard under Storage):
--   profiles   (public) — profile avatars
--   gallery    (public) — gallery images
--   potw       (public) — photo of the week images
--   events     (public) — event poster images
--   magazines  (public) — magazine covers and PDFs

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

alter table gallery enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'gallery' and policyname = 'Anyone can view gallery'
  ) then
    create policy "Anyone can view gallery"
      on gallery for select
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'gallery' and policyname = 'Authenticated users can insert gallery'
  ) then
    create policy "Authenticated users can insert gallery"
      on gallery for insert
      with check (auth.role() = 'authenticated');
  end if;
end $$;

-- ============================================================
-- POTW (Photo of the Week)
-- ============================================================
create table if not exists potw (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  title text,
  photographer text,
  date timestamptz default now()
);

alter table potw enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'potw' and policyname = 'Anyone can view potw'
  ) then
    create policy "Anyone can view potw"
      on potw for select
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'potw' and policyname = 'Authenticated users can insert potw'
  ) then
    create policy "Authenticated users can insert potw"
      on potw for insert
      with check (auth.role() = 'authenticated');
  end if;
end $$;

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

alter table magazines enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'magazines' and policyname = 'Anyone can view magazines'
  ) then
    create policy "Anyone can view magazines"
      on magazines for select
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'magazines' and policyname = 'Authenticated users can insert magazines'
  ) then
    create policy "Authenticated users can insert magazines"
      on magazines for insert
      with check (auth.role() = 'authenticated');
  end if;
end $$;

-- ============================================================
-- CLUB EVENTS
-- ============================================================
create table if not exists club_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  poster text,
  location text,
  event_date timestamptz,
  created_at timestamptz default now()
);

alter table club_events enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'club_events' and policyname = 'Anyone can view club_events'
  ) then
    create policy "Anyone can view club_events"
      on club_events for select
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'club_events' and policyname = 'Authenticated users can insert club_events'
  ) then
    create policy "Authenticated users can insert club_events"
      on club_events for insert
      with check (auth.role() = 'authenticated');
  end if;
end $$;

-- ============================================================
-- ASTRONOMY EVENTS (astronomical phenomena calendar)
-- ============================================================
create table if not exists astronomy_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  event_date timestamptz,
  created_at timestamptz default now()
);

alter table astronomy_events enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'astronomy_events' and policyname = 'Anyone can view astronomy_events'
  ) then
    create policy "Anyone can view astronomy_events"
      on astronomy_events for select
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'astronomy_events' and policyname = 'Authenticated users can insert astronomy_events'
  ) then
    create policy "Authenticated users can insert astronomy_events"
      on astronomy_events for insert
      with check (auth.role() = 'authenticated');
  end if;
end $$;
