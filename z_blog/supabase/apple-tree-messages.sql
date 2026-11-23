begin;

create table if not exists public.apple_tree_messages (
  user_id uuid not null references auth.users(id) on delete cascade,
  id uuid not null,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.apple_tree_messages enable row level security;
revoke all on public.apple_tree_messages from anon, authenticated;
grant select on public.apple_tree_messages to authenticated;
grant insert (user_id, id, body) on public.apple_tree_messages to authenticated;

drop policy if exists "Read own apple tree messages" on public.apple_tree_messages;
create policy "Read own apple tree messages"
  on public.apple_tree_messages for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Save own apple tree messages" on public.apple_tree_messages;
create policy "Save own apple tree messages"
  on public.apple_tree_messages for insert to authenticated
  with check ((select auth.uid()) = user_id);

create index if not exists apple_tree_messages_by_owner_date
  on public.apple_tree_messages (user_id, created_at desc, id);

commit;
