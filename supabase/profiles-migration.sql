-- Profiles table for storing user profile data
-- Run this in your Supabase SQL editor
--
-- IMPORTANT: After running this migration, also set up the "profiles" storage
-- bucket in the Supabase dashboard:
--   1. Go to Storage in the Supabase dashboard
--   2. Create a new bucket named "profiles" (set it to public)
--   3. Add a storage policy allowing authenticated users to upload/update their
--      own avatar. The app stores avatars at  avatars/<user-id>.<ext>  so the
--      policy should check:
--        bucket_id = 'profiles'
--        AND auth.role() = 'authenticated'
--        AND (storage.foldername(name))[1] = 'avatars'
--        AND (split_part(storage.filename(name), '.', 1)) = auth.uid()::text

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
  created_at timestamptz default now(),
  last_login_at timestamptz,
  last_login_ip text
);

-- Add new columns to existing table (safe to run if columns already exist)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='year') then
    alter table profiles add column year text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='department') then
    alter table profiles add column department text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='phone') then
    alter table profiles add column phone text;
  end if;
end $$;

-- Enable Row Level Security
alter table profiles enable row level security;

-- Allow users to read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to insert their own profile (client-side fallback)
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
