-- Community profiles are separate from profiles.role (admin/editor permissions).
begin;
create table if not exists public.community_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,32}$'),
  display_name text not null check (length(trim(display_name)) between 1 and 80),
  member_type text not null check (member_type in ('reader', 'customer')),
  zodiac_sign text not null check (zodiac_sign in ('aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces')),
  location text not null default '' check (length(location) <= 100),
  about text not null default '' check (length(about) <= 6000),
  website text not null default '' check (website = '' or (website ~ '^https://' and length(website) <= 300)),
  avatar_url text not null default '' check (length(avatar_url) <= 1000),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists community_directory_idx on public.community_profiles (zodiac_sign, member_type, created_at desc) where is_public;
alter table public.community_profiles enable row level security;
revoke all on public.community_profiles from anon, authenticated;
grant select on public.community_profiles to anon, authenticated;
grant insert (user_id,username,display_name,member_type,zodiac_sign,location,about,website,avatar_url,is_public) on public.community_profiles to authenticated;
grant update (username,display_name,member_type,zodiac_sign,location,about,website,avatar_url,is_public) on public.community_profiles to authenticated;
drop policy if exists "Community public profiles" on public.community_profiles;
create policy "Community public profiles" on public.community_profiles for select using (is_public or (select auth.uid()) = user_id);
drop policy if exists "Community insert own" on public.community_profiles;
create policy "Community insert own" on public.community_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Community update own" on public.community_profiles;
create policy "Community update own" on public.community_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.community_set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists community_updated_at on public.community_profiles;
create trigger community_updated_at before update on public.community_profiles for each row execute function public.community_set_updated_at();

create or replace function public.community_directory_counts() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'members', count(*),
    'readers', count(*) filter (where member_type = 'reader'),
    'customers', count(*) filter (where member_type = 'customer'),
    'signs', coalesce((select jsonb_object_agg(zodiac_sign, n) from
      (select zodiac_sign, count(*) as n from public.community_profiles where is_public group by zodiac_sign) s), '{}'::jsonb)
  ) from public.community_profiles where is_public;
$$;
revoke all on function public.community_directory_counts() from public;
grant execute on function public.community_directory_counts() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community-avatars', 'community-avatars', true, 2097152, array['image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg'];
drop policy if exists "Community avatar insert own" on storage.objects;
create policy "Community avatar insert own" on storage.objects for insert to authenticated with check (
  bucket_id = 'community-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(storage.extension(name)) = 'jpg'
);
drop policy if exists "Community avatar delete own" on storage.objects;
create policy "Community avatar delete own" on storage.objects for delete to authenticated using (
  bucket_id = 'community-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
commit;
