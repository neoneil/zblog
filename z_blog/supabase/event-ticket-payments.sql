-- Run after event-registrations.sql and stardust-sandbox.sql.
-- Installs both isolated ledgers. Does not charge anyone or enable an event.
begin;
do $migration$
declare target text;
begin
  foreach target in array array['public','stardust_sandbox'] loop
    if to_regclass(format('%I.stardust_wallets',target)) is null then
      raise exception 'Missing wallet schema: %',target;
    end if;
    execute format($ddl$
      create table if not exists %1$I.stardust_event_tickets (
        id uuid primary key,
        user_id uuid not null references auth.users(id) on delete restrict,
        event_id uuid not null references public.events(id) on delete restrict,
        contact_name text not null check(length(contact_name) between 1 and 120),
        contact_email text not null,
        amount_stars bigint not null check(amount_stars>=0),
        paid_stars bigint not null check(paid_stars>=0),
        reward_stars bigint not null check(reward_stars>=0),
        status text not null default 'paid' check(status in('paid','refunded')),
        event_snapshot jsonb not null,
        created_at timestamptz not null default now(),
        check(amount_stars=paid_stars+reward_stars)
      );
      create unique index if not exists event_ticket_one_active
        on %1$I.stardust_event_tickets(user_id,event_id) where status='paid';
      create table if not exists %1$I.stardust_event_inventory (
        event_id uuid primary key references public.events(id) on delete restrict,
        booked_count integer not null check(booked_count>=0)
      );
      alter table %1$I.stardust_event_tickets enable row level security;
      alter table %1$I.stardust_event_inventory enable row level security;
      revoke all on %1$I.stardust_event_tickets,%1$I.stardust_event_inventory from anon,authenticated;
      grant select on %1$I.stardust_event_tickets to authenticated;
      grant all on %1$I.stardust_event_tickets,%1$I.stardust_event_inventory to service_role;
      drop policy if exists event_ticket_owner on %1$I.stardust_event_tickets;
      create policy event_ticket_owner on %1$I.stardust_event_tickets for select to authenticated
        using(user_id=auth.uid() or exists(select 1 from public.profiles where id=auth.uid() and role='admin'));
    $ddl$,target);

    execute format($fn$
      create or replace function %1$I.stardust_buy_event_ticket(
        p_user uuid,p_event uuid,p_request uuid,p_name text,p_expected_price integer
      ) returns jsonb language plpgsql security definer set search_path=%1$I,public,pg_temp as $body$
      declare e public.events; w %1$I.stardust_wallets; ticket %1$I.stardust_event_tickets;
        used integer; reward_part bigint; paid_part bigint; email text; snapshot jsonb;
      begin
        if p_request is null or p_name is null or length(trim(p_name)) not between 1 and 120 then raise exception 'INVALID_NAME'; end if;
        select * into e from public.events where id=p_event for update;
        if not found then raise exception 'EVENT_UNAVAILABLE'; end if;
        select * into ticket from %1$I.stardust_event_tickets where id=p_request;
        if found then
          if ticket.user_id<>p_user or ticket.event_id<>p_event then raise exception 'REQUEST_CONFLICT'; end if;
          if ticket.status<>'paid' then raise exception 'TICKET_REFUNDED'; end if;
          return jsonb_build_object('status','paid','ticket_id',ticket.id);
        end if;
        select * into ticket from %1$I.stardust_event_tickets where user_id=p_user and event_id=p_event and status='paid';
        if found then return jsonb_build_object('status','paid','ticket_id',ticket.id); end if;
        if not e.is_published or e.is_demo then raise exception 'EVENT_UNAVAILABLE'; end if;
        if not e.registration_open or e.starts_at<=now() then raise exception 'REGISTRATION_CLOSED'; end if;
        if p_expected_price is null or p_expected_price<>e.price_cents then raise exception 'PRICE_CHANGED'; end if;
        if %2$L::boolean then
          insert into %1$I.stardust_event_inventory(event_id,booked_count) values(e.id,e.booked_count) on conflict do nothing;
          select booked_count into used from %1$I.stardust_event_inventory where event_id=e.id for update;
        else used:=e.booked_count;
        end if;
        if used>=e.capacity then raise exception 'EVENT_FULL'; end if;
        select u.email into email from auth.users u where u.id=p_user and u.email_confirmed_at is not null;
        if email is null then raise exception 'EMAIL_VERIFICATION_REQUIRED'; end if;
        perform %1$I.stardust_bootstrap(p_user);
        select * into w from %1$I.stardust_wallets where user_id=p_user for update;
        if w.blocked then raise exception 'ACCOUNT_REVIEW'; end if;
        if w.paid+w.reward<e.price_cents then return jsonb_build_object('status','insufficient'); end if;
        reward_part:=least(w.reward,e.price_cents);
        paid_part:=e.price_cents-reward_part;
        snapshot:=jsonb_build_object('title_zh',e.title_zh,'title_en',e.title_en,'slug',e.slug,
          'starts_at',e.starts_at,'ends_at',e.ends_at,'timezone',e.timezone,'location_zh',e.location_zh,
          'location_en',e.location_en,'price_cents',e.price_cents,'is_demo',false);
        insert into %1$I.stardust_event_tickets(id,user_id,event_id,contact_name,contact_email,amount_stars,paid_stars,reward_stars,event_snapshot)
          values(p_request,p_user,e.id,trim(p_name),email,e.price_cents,paid_part,reward_part,snapshot);
        update %1$I.stardust_wallets set paid=paid-paid_part,reward=reward-reward_part where user_id=p_user;
        insert into %1$I.stardust_ledger(user_id,kind,reference,paid_delta,reward_delta)
          values(p_user,'event_purchase',p_request::text,-paid_part,-reward_part);
        if %2$L::boolean then
          update %1$I.stardust_event_inventory set booked_count=booked_count+1 where event_id=e.id;
        else
          update public.events set booked_count=booked_count+1 where id=e.id;
          insert into public.event_registrations(event_id,user_id,contact_name,contact_email,status,event_snapshot)
            values(e.id,p_user,trim(p_name),email,'confirmed',snapshot)
            on conflict(event_id,user_id) do update set status='confirmed',contact_name=excluded.contact_name,
              contact_email=excluded.contact_email,event_snapshot=excluded.event_snapshot,admin_note='',updated_at=now();
        end if;
        return jsonb_build_object('status','paid','ticket_id',p_request);
      end $body$;
      revoke all on function %1$I.stardust_buy_event_ticket(uuid,uuid,uuid,text,integer) from public,anon,authenticated;
      grant execute on function %1$I.stardust_buy_event_ticket(uuid,uuid,uuid,text,integer) to service_role;
    $fn$,target,target='stardust_sandbox');
  end loop;
end $migration$;

-- Prevent the old application/review RPCs from bypassing payment or silently cancelling paid seats.
create or replace function public.event_registration_payment_guard()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare e public.events; has_paid boolean;
begin
  select * into e from public.events where id=new.event_id;
  select exists(select 1 from public.stardust_event_tickets where user_id=new.user_id and event_id=new.event_id and status='paid') into has_paid;
  if new.status='requested' and e.price_cents>0 and not e.is_demo then raise exception 'PAYMENT_REQUIRED'; end if;
  if new.status='confirmed' and e.price_cents>0 and not e.is_demo and not has_paid then raise exception 'PAYMENT_REQUIRED'; end if;
  if tg_op='UPDATE' and old.status='confirmed' and new.status<>'confirmed' and has_paid then raise exception 'PAID_TICKET_CONTACT_SUPPORT'; end if;
  return new;
end $$;
drop trigger if exists event_registration_payment_guard on public.event_registrations;
create trigger event_registration_payment_guard before insert or update on public.event_registrations
for each row execute function public.event_registration_payment_guard();
commit;
