-- Run after event-ticket-payments.sql. This changes only the requested event.
-- It never enables Stripe live mode or charges any user.
begin;
do $$
begin
  if to_regprocedure('public.stardust_buy_event_ticket(uuid,uuid,uuid,text,integer)') is null
    or to_regprocedure('stardust_sandbox.stardust_buy_event_ticket(uuid,uuid,uuid,text,integer)') is null then
    raise exception 'Run event-ticket-payments.sql first';
  end if;
  if not exists(select 1 from public.events where slug='demo-next-month-salon' and starts_at>now()) then
    raise exception 'Event missing or already started; review its dates in admin first';
  end if;
  if exists(select 1 from public.events e join public.event_registrations r on r.event_id=e.id
    where e.slug='demo-next-month-salon' and e.is_demo and r.status='confirmed') then
    raise exception 'Cancel confirmed DEMO registrations in admin before promoting the event';
  end if;
end $$;
update public.events e set
  title_zh='下月神秘主题沙龙',
  title_en='Next Month Mystic Salon',
  description_zh='线上神秘主题沙龙。请以本页公布的时间为准，具体参与信息请联系主办方。',
  description_en='An online mystic salon. Please refer to the schedule on this page and contact the organiser for joining details.',
  location_zh='线上活动', location_en='Online event',
  price_cents=5000, is_demo=false, is_published=true, registration_open=true,
  -- No confirmed demo applications may be silently converted into real seats.
  booked_count=case when e.is_demo and not exists(
    select 1 from public.event_registrations r where r.event_id=e.id and r.status='confirmed'
  ) then 0 else e.booked_count end
where e.slug='demo-next-month-salon';
commit;
