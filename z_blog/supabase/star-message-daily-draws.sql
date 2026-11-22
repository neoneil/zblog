-- Run once in the Supabase SQL Editor. Re-running preserves existing history.
create table if not exists public.star_message_daily_draws (
  user_id uuid not null references auth.users(id) on delete cascade,
  draw_day date not null,
  draw_id uuid not null,
  card_id smallint not null check (card_id between 1 and 36),
  primary key (user_id, draw_day),
  unique (user_id, draw_id)
);

alter table public.star_message_daily_draws enable row level security;
revoke all on public.star_message_daily_draws from anon, authenticated;
grant select on public.star_message_daily_draws to authenticated;
grant select, insert on public.star_message_daily_draws to service_role;

drop policy if exists "Read own daily star draws" on public.star_message_daily_draws;
create policy "Read own daily star draws"
  on public.star_message_daily_draws for select to authenticated
  using ((select auth.uid()) = user_id);

-- Retain existing saved cards. Use the first saved card as the daily
-- draw for a past date when browser-only history contains multiple cards.
insert into public.star_message_daily_draws (user_id, draw_day, draw_id, card_id)
select distinct on (user_id, draw_day) user_id, draw_day, draw_id, card_id
from public.star_message_collection
order by user_id, draw_day, saved_at, draw_id
on conflict do nothing;
