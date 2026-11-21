-- Run AFTER supabase/events.sql. No payment or wallet mutations.
begin;
alter table public.events alter column price_cents set default 5000;

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  contact_name text not null check (length(contact_name) between 1 and 120),
  contact_email text not null,
  status text not null default 'requested' check (status in ('requested','confirmed','cancelled','rejected')),
  admin_note text not null default '' check (length(admin_note) <= 1000),
  event_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id,user_id)
);
create index if not exists event_registrations_user_idx on public.event_registrations(user_id,created_at desc);
create index if not exists event_registrations_event_idx on public.event_registrations(event_id,status);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from anon,authenticated;
grant select on public.event_registrations to authenticated;
drop policy if exists event_registration_read on public.event_registrations;
create policy event_registration_read on public.event_registrations for select to authenticated using (
  user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')
);

create or replace function public.event_submit_registration(p_event_id uuid,p_contact_name text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare e public.events; r public.event_registrations; result_id uuid; email text;
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  email := auth.jwt()->>'email';
  if email is null or length(email)=0 then raise exception 'EMAIL_REQUIRED'; end if;
  if p_contact_name is null or length(trim(p_contact_name)) not between 1 and 120 then raise exception 'INVALID_NAME'; end if;
  -- Every application/confirmation takes the same event lock before row locks.
  select * into e from public.events where id=p_event_id for update;
  if not found or not e.is_published then raise exception 'EVENT_UNAVAILABLE'; end if;
  select * into r from public.event_registrations where event_id=e.id and user_id=auth.uid() for update;
  if found and r.status in ('requested','confirmed') then return r.id; end if;
  if not e.registration_open or e.starts_at<=now() then raise exception 'REGISTRATION_CLOSED'; end if;
  if e.booked_count>=e.capacity then raise exception 'EVENT_FULL'; end if;
  insert into public.event_registrations(event_id,user_id,contact_name,contact_email,event_snapshot)
  values(e.id,auth.uid(),trim(p_contact_name),email,
    jsonb_build_object('title_zh',e.title_zh,'title_en',e.title_en,'slug',e.slug,'starts_at',e.starts_at,
      'ends_at',e.ends_at,'timezone',e.timezone,'location_zh',e.location_zh,'location_en',e.location_en,
      'price_cents',e.price_cents,'is_demo',e.is_demo))
  on conflict(event_id,user_id) do update set status='requested',contact_name=excluded.contact_name,
    contact_email=excluded.contact_email,event_snapshot=excluded.event_snapshot,admin_note='',updated_at=now()
  returning id into result_id;
  return result_id;
end $$;

create or replace function public.event_cancel_request(p_registration_id uuid)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.event_registrations; target_event uuid;
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  select event_id into target_event from public.event_registrations where id=p_registration_id and user_id=auth.uid();
  if not found then raise exception 'REGISTRATION_NOT_FOUND'; end if;
  perform 1 from public.events where id=target_event for update;
  select * into r from public.event_registrations where id=p_registration_id and user_id=auth.uid() for update;
  if r.status='cancelled' then return; end if;
  if r.status<>'requested' then raise exception 'CONTACT_ADMIN'; end if;
  update public.event_registrations set status='cancelled',updated_at=now() where id=r.id;
end $$;

create or replace function public.event_review_registration(p_registration_id uuid,p_status text,p_note text default '')
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.event_registrations; e public.events; target_event uuid;
begin
  if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin') then raise exception 'ADMIN_REQUIRED'; end if;
  if p_status is null or p_status not in ('confirmed','cancelled','rejected') or p_note is null or length(p_note)>1000 then raise exception 'INVALID_REVIEW'; end if;
  select event_id into target_event from public.event_registrations where id=p_registration_id;
  if not found then raise exception 'REGISTRATION_NOT_FOUND'; end if;
  select * into e from public.events where id=target_event for update;
  select * into r from public.event_registrations where id=p_registration_id for update;
  if r.status=p_status then return; end if;
  if p_status='confirmed' then
    if r.status<>'requested' then raise exception 'INVALID_TRANSITION'; end if;
    if not e.is_published or not e.registration_open or e.starts_at<=now() then raise exception 'REGISTRATION_CLOSED'; end if;
    if e.booked_count>=e.capacity then raise exception 'EVENT_FULL'; end if;
    update public.events set booked_count=booked_count+1 where id=e.id;
  elsif r.status='confirmed' then
    if p_status<>'cancelled' then raise exception 'INVALID_TRANSITION'; end if;
    update public.events set booked_count=booked_count-1 where id=e.id;
  elsif r.status<>'requested' then raise exception 'INVALID_TRANSITION';
  end if;
  update public.event_registrations set status=p_status,admin_note=p_note,updated_at=now() where id=r.id;
end $$;

revoke all on function public.event_submit_registration(uuid,text) from public,anon;
revoke all on function public.event_cancel_request(uuid) from public,anon;
revoke all on function public.event_review_registration(uuid,text,text) from public,anon;
grant execute on function public.event_submit_registration(uuid,text) to authenticated;
grant execute on function public.event_cancel_request(uuid) to authenticated;
grant execute on function public.event_review_registration(uuid,text,text) to authenticated;
commit;
