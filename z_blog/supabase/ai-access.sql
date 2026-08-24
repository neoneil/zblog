create table if not exists public.ai_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_scope text not null,
  valid_until timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_entitlements_scope_check
    check (product_scope in ('tarot', 'astroplate')),
  constraint ai_entitlements_user_scope_unique
    unique (user_id, product_scope)
);

create table if not exists public.ai_daily_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_scope text not null,
  usage_date date not null,
  created_at timestamptz not null default now(),
  constraint ai_daily_usage_scope_check
    check (product_scope in ('tarot', 'astroplate')),
  constraint ai_daily_usage_user_scope_date_unique
    unique (user_id, product_scope, usage_date)
);

create table if not exists public.ai_checkout_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_scope text not null,
  package_days integer not null,
  amount_cents integer not null,
  currency text not null default 'aud',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status text not null default 'pending',
  entitlement_started_at timestamptz,
  entitlement_valid_until timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_checkout_orders_scope_check
    check (product_scope in ('tarot', 'astroplate')),
  constraint ai_checkout_orders_days_check
    check (package_days in (30, 60, 90, 180)),
  constraint ai_checkout_orders_currency_check
    check (currency = 'aud'),
  constraint ai_checkout_orders_status_check
    check (status in ('pending', 'paid', 'expired', 'cancelled', 'failed'))
);

create table if not exists public.stripe_webhook_events (
  stripe_event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ai_entitlements_updated_at on public.ai_entitlements;
create trigger trg_ai_entitlements_updated_at
before update on public.ai_entitlements
for each row
execute function public.set_updated_at();

drop trigger if exists trg_ai_checkout_orders_updated_at on public.ai_checkout_orders;
create trigger trg_ai_checkout_orders_updated_at
before update on public.ai_checkout_orders
for each row
execute function public.set_updated_at();

create index if not exists idx_ai_entitlements_user_scope
on public.ai_entitlements(user_id, product_scope);

create index if not exists idx_ai_entitlements_valid_until
on public.ai_entitlements(valid_until);

create index if not exists idx_ai_daily_usage_user_scope_date
on public.ai_daily_usage(user_id, product_scope, usage_date);

create index if not exists idx_ai_checkout_orders_user
on public.ai_checkout_orders(user_id);

create index if not exists idx_ai_checkout_orders_status
on public.ai_checkout_orders(status);

create index if not exists idx_ai_checkout_orders_session
on public.ai_checkout_orders(stripe_checkout_session_id);

alter table public.ai_entitlements enable row level security;
alter table public.ai_daily_usage enable row level security;
alter table public.ai_checkout_orders enable row level security;
alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Users can read own AI entitlements" on public.ai_entitlements;
drop policy if exists "Admins can read all AI entitlements" on public.ai_entitlements;

create policy "Users can read own AI entitlements"
on public.ai_entitlements
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can read all AI entitlements"
on public.ai_entitlements
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "Users can read own daily AI usage" on public.ai_daily_usage;
drop policy if exists "Users can create own daily AI usage" on public.ai_daily_usage;
drop policy if exists "Admins can read all daily AI usage" on public.ai_daily_usage;

create policy "Users can read own daily AI usage"
on public.ai_daily_usage
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can create own daily AI usage"
on public.ai_daily_usage
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Admins can read all daily AI usage"
on public.ai_daily_usage
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "Users can read own checkout orders" on public.ai_checkout_orders;
drop policy if exists "Users can create own checkout orders" on public.ai_checkout_orders;
drop policy if exists "Users can update own pending checkout orders" on public.ai_checkout_orders;
drop policy if exists "Admins can read all checkout orders" on public.ai_checkout_orders;

create policy "Users can read own checkout orders"
on public.ai_checkout_orders
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can create own checkout orders"
on public.ai_checkout_orders
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own pending checkout orders"
on public.ai_checkout_orders
for update
to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid());

create policy "Admins can read all checkout orders"
on public.ai_checkout_orders
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "Admins can read stripe webhook events" on public.stripe_webhook_events;

create policy "Admins can read stripe webhook events"
on public.stripe_webhook_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create or replace function public.extend_ai_entitlement(
  p_user_id uuid,
  p_product_scope text,
  p_days integer
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base timestamptz;
  v_new_valid_until timestamptz;
begin
  if p_product_scope not in ('tarot', 'astroplate') then
    raise exception 'Invalid product_scope: %', p_product_scope;
  end if;

  if p_days not in (30, 60, 90, 180) then
    raise exception 'Invalid package_days: %', p_days;
  end if;

  select valid_until
  into v_base
  from public.ai_entitlements
  where user_id = p_user_id
    and product_scope = p_product_scope
  for update;

  v_base := greatest(coalesce(v_base, now()), now());
  v_new_valid_until := v_base + make_interval(days => p_days);

  insert into public.ai_entitlements (
    user_id,
    product_scope,
    valid_until
  )
  values (
    p_user_id,
    p_product_scope,
    v_new_valid_until
  )
  on conflict (user_id, product_scope)
  do update set
    valid_until = excluded.valid_until,
    updated_at = now();

  return v_new_valid_until;
end;
$$;
