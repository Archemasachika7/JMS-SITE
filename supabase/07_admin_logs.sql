-- ============================================================================
-- JU Maths Society — IMMUTABLE ADMIN AUDIT LOG  (file 7)
-- Run AFTER 01_schema.sql and 02_policies.sql. Idempotent — safe to re-run.
--
-- Records every sensitive admin action (approve / reject / upload / issue /
-- revoke / delete / edit). The log is APPEND-ONLY: admins can read and add
-- entries, but NOBODY — not even an admin — can edit or delete them. This is
-- enforced both by RLS (no update/delete policy) and by hard database triggers
-- that block UPDATE / DELETE / TRUNCATE for every role, including the owner.
-- ============================================================================

create table if not exists admin_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles(id),
  actor_email text,
  action      text not null,        -- e.g. 'approved', 'rejected', 'uploaded'
  entity      text,                 -- table / area the action touched
  entity_id   text,                 -- id of the affected row, when known
  details     text,                 -- human-readable summary
  created_at  timestamptz default now()
);

create index if not exists admin_logs_created_at_idx on admin_logs(created_at desc);

alter table admin_logs enable row level security;

-- Admins may READ and INSERT. There is deliberately NO update or delete policy,
-- so RLS blocks all mutations through the app's anon/auth key.
drop policy if exists "Admins can view logs"   on admin_logs;
drop policy if exists "Admins can insert logs" on admin_logs;
create policy "Admins can view logs"
  on admin_logs for select using (public.is_admin());
create policy "Admins can insert logs"
  on admin_logs for insert with check (public.is_admin());

-- ── Hard immutability ───────────────────────────────────────────────────────
-- Triggers raise an exception on any UPDATE / DELETE / TRUNCATE, so the log
-- can never be altered or wiped, even by the table owner or a privileged role.
create or replace function public.prevent_log_mutation()
returns trigger as $$
begin
  raise exception 'admin_logs is append-only; % is not permitted', tg_op;
end;
$$ language plpgsql;

drop trigger if exists no_update_admin_logs   on admin_logs;
drop trigger if exists no_delete_admin_logs   on admin_logs;
drop trigger if exists no_truncate_admin_logs on admin_logs;

create trigger no_update_admin_logs
  before update on admin_logs
  for each row execute function public.prevent_log_mutation();
create trigger no_delete_admin_logs
  before delete on admin_logs
  for each row execute function public.prevent_log_mutation();
create trigger no_truncate_admin_logs
  before truncate on admin_logs
  for each statement execute function public.prevent_log_mutation();

-- ============================================================================
-- DONE.
-- ============================================================================
