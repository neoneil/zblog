-- Run in Supabase SQL Editor. Requires the existing profiles table.
begin;
create table if not exists public.novel_chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 120),
  chapter_number integer not null unique check (chapter_number between 1 and 10000),
  title_zh text not null check (length(trim(title_zh)) between 1 and 300),
  title_en text not null check (length(trim(title_en)) between 1 and 300),
  subtitle_zh text not null check (length(trim(subtitle_zh)) between 1 and 300),
  subtitle_en text not null check (length(trim(subtitle_en)) between 1 and 300),
  content_zh text not null default '' check (length(content_zh) <= 200000),
  content_en text not null default '' check (length(content_en) <= 200000),
  youtube_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or (length(trim(content_zh)) > 0 and length(trim(content_en)) > 0))
);
alter table public.novel_chapters enable row level security;
revoke all on public.novel_chapters from anon, authenticated;
grant select on public.novel_chapters to anon, authenticated;
grant insert, update, delete on public.novel_chapters to authenticated;
drop policy if exists novel_public_read on public.novel_chapters;
create policy novel_public_read on public.novel_chapters for select to anon, authenticated using (status = 'published');
drop policy if exists novel_admin_manage on public.novel_chapters;
create policy novel_admin_manage on public.novel_chapters for all to authenticated
using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));
create or replace function public.touch_novel_chapter() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists novel_chapter_updated on public.novel_chapters;
create trigger novel_chapter_updated before update on public.novel_chapters for each row execute function public.touch_novel_chapter();
commit;
