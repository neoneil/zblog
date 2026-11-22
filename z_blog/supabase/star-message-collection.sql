-- Apply manually in Supabase SQL Editor before enabling personal collections.
create table if not exists public.star_message_collection (
  user_id uuid not null references auth.users(id) on delete cascade,
  draw_id uuid not null,
  card_id smallint not null check (card_id between 1 and 36),
  draw_day date not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, draw_id)
);

alter table public.star_message_collection enable row level security;
revoke all on public.star_message_collection from anon, authenticated;
grant select on public.star_message_collection to authenticated;
grant select, insert, update on public.star_message_collection to service_role;

drop policy if exists "Read own star message collection" on public.star_message_collection;
create policy "Read own star message collection"
  on public.star_message_collection for select to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists star_message_collection_recent_idx
  on public.star_message_collection (user_id, saved_at desc);
