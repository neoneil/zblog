begin;
create table if not exists public.novel_comments (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.novel_chapters(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 1 and 60),
  body text not null check (length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists novel_comments_chapter_date on public.novel_comments(chapter_id, created_at desc);
create index if not exists novel_comments_user_date on public.novel_comments(user_id, created_at desc);
alter table public.novel_comments enable row level security;
revoke all on public.novel_comments from anon, authenticated;
grant select (id, chapter_id, display_name, body, created_at) on public.novel_comments to anon, authenticated;
grant insert (chapter_id, user_id, display_name, body) on public.novel_comments to authenticated;
grant delete on public.novel_comments to authenticated;
drop policy if exists novel_comments_read on public.novel_comments;
create policy novel_comments_read on public.novel_comments for select to anon, authenticated
using (exists (select 1 from public.novel_chapters c where c.id = chapter_id and c.status = 'published'));
drop policy if exists novel_comments_insert on public.novel_comments;
create policy novel_comments_insert on public.novel_comments for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.novel_chapters c where c.id = chapter_id and c.status = 'published'));
drop policy if exists novel_comments_admin_delete on public.novel_comments;
create policy novel_comments_admin_delete on public.novel_comments for delete to authenticated
using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));
create or replace function public.check_novel_comment_rate()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or new.user_id <> auth.uid() then
    raise exception 'Sign in required';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if (select count(*) from public.novel_comments where user_id = new.user_id and chapter_id = new.chapter_id) >= 3 then
    raise exception 'CHAPTER_COMMENT_LIMIT';
  end if;
  if exists (select 1 from public.novel_comments where user_id = new.user_id and created_at > now() - interval '1 minute') then
    raise exception 'Please wait one minute between comments';
  end if;
  new.created_at = now();
  return new;
end;
$$;
revoke all on function public.check_novel_comment_rate() from public;
drop trigger if exists novel_comment_rate on public.novel_comments;
create trigger novel_comment_rate before insert on public.novel_comments
for each row execute function public.check_novel_comment_rate();
create or replace function public.my_novel_comment_count(target_chapter uuid)
returns bigint language sql stable security definer set search_path = '' as $$
  select count(*) from public.novel_comments where user_id = auth.uid() and chapter_id = target_chapter;
$$;
revoke all on function public.my_novel_comment_count(uuid) from public;
grant execute on function public.my_novel_comment_count(uuid) to authenticated;
commit;
