-- Run in Supabase SQL Editor. No credentials or service-role key are needed in the browser.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_zh text not null,
  title_en text not null,
  description_zh text not null default '',
  description_en text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Australia/Sydney' check (timezone = 'Australia/Sydney'),
  location_zh text not null,
  location_en text not null,
  price_cents integer not null default 0 check (price_cents >= 0),
  capacity integer not null check (capacity > 0),
  booked_count integer not null default 0 check (booked_count >= 0 and booked_count <= capacity),
  registration_open boolean not null default false,
  is_published boolean not null default false,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_dates_check check (ends_at > starts_at)
);
create index if not exists events_schedule_idx on public.events (is_published, starts_at, ends_at);
create or replace function public.events_touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events for each row execute function public.events_touch_updated_at();

alter table public.events enable row level security;
revoke all on public.events from anon, authenticated;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
drop policy if exists events_published_read on public.events;
create policy events_published_read on public.events for select to anon, authenticated using (is_published);
drop policy if exists events_admin_manage on public.events;
create policy events_admin_manage on public.events for all to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- Five DEMO records. Relative dates keep this seed useful whenever it is first run.
-- ON CONFLICT never overwrites edits or resurrects old demo events.
with anchor as (
  select now() as now_utc,
    ((date_trunc('month', now() at time zone 'Australia/Sydney') + interval '1 month 3 days 19 hours') at time zone 'Australia/Sydney') as next_month
), seed(slug,title_zh,title_en,starts_at,ends_at,location_zh,location_en,capacity,booked_count,registration_open) as (
  select 'demo-moon-evening','月相与自我觉察 · 演示','Moon & Self-awareness · Demo',now_utc+interval '2 hours',now_utc+interval '4 hours','悉尼 · 演示场地','Sydney · Demo venue',20,6,true from anchor
  union all select 'demo-tarot-salon','塔罗故事私享沙龙 · 演示','Tarot Story Salon · Demo',now_utc+interval '5 hours',now_utc+interval '7 hours','悉尼 · 演示场地','Sydney · Demo venue',12,12,true from anchor
  union all select 'demo-stellar-workshop','星辰笔记工作坊 · 演示','Stellar Journal Workshop · Demo',now_utc+interval '8 hours',now_utc+interval '10 hours','线上 · 演示活动','Online · Demo event',18,3,false from anchor
  union all select 'demo-completed-evening','上一场星光之夜 · 演示','Previous Starlight Evening · Demo',now_utc-interval '4 hours',now_utc-interval '2 hours','悉尼 · 演示场地','Sydney · Demo venue',16,8,false from anchor
  union all select 'demo-next-month-salon','下月神秘主题沙龙 · 演示','Next Month Mystic Salon · Demo',next_month,next_month+interval '2 hours','悉尼 · 演示场地','Sydney · Demo venue',15,2,true from anchor
)
insert into public.events(slug,title_zh,title_en,description_zh,description_en,starts_at,ends_at,location_zh,location_en,price_cents,capacity,booked_count,registration_open,is_published,is_demo)
select slug,title_zh,title_en,'用于测试活动展示、轮播与状态，不接受真实报名或付款。','For testing schedules, rotation and availability. No real bookings or payments.',starts_at,ends_at,location_zh,location_en,7800,capacity,booked_count,registration_open,true,true from seed
on conflict (slug) do nothing;
