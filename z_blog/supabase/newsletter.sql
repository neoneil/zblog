begin;
create table if not exists public.newsletter_settings (
  id integer primary key check (id = 1),
  template jsonb not null default '{}'::jsonb
);
insert into public.newsletter_settings(id) values (1) on conflict do nothing;
alter table public.newsletter_settings enable row level security;
revoke all on public.newsletter_settings from anon, authenticated;
grant select, insert, update on public.newsletter_settings to authenticated;
drop policy if exists newsletter_settings_admin on public.newsletter_settings;
create policy newsletter_settings_admin on public.newsletter_settings for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  language text not null check (language in ('zh','en')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  welcome_sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;
grant all on public.newsletter_settings, public.newsletter_subscribers to service_role;
commit;
