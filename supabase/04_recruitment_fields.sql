-- ============================================================
-- RECRUITMENT — CUSTOM FORM FIELDS
-- Adds an admin-editable application-form schema to each drive.
--
-- `fields` is a JSON array of teams, each with its own list of
-- fields:
--   [
--     {
--       "id": "general",
--       "label": "General",
--       "emoji": "∑",
--       "blurb": "…",
--       "fields": [
--         { "id": "f_x", "name": "name", "label": "Full name",
--           "type": "text", "required": true,
--           "placeholder": "…", "help": "…", "options": [] }
--       ]
--     }
--   ]
--
-- An empty array means "use the built-in default schema" (defined
-- in lib/recruitmentSchema.ts), so existing drives keep working.
-- ============================================================

alter table recruitments
  add column if not exists fields jsonb not null default '[]'::jsonb;

-- The existing RLS policies on `recruitments` (public read, admin
-- write) already cover this column — no further policy changes needed.
