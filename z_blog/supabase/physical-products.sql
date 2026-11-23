begin;

create table if not exists public.physical_products (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  title_zh text not null check (char_length(trim(title_zh)) between 1 and 120),
  title_en text not null check (char_length(trim(title_en)) between 1 and 120),
  subtitle_zh text not null check (char_length(trim(subtitle_zh)) between 1 and 500),
  subtitle_en text not null check (char_length(trim(subtitle_en)) between 1 and 500),
  price_stars integer not null check (price_stars between 1 and 100000000),
  image text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived boolean not null default false
);

alter table public.physical_products enable row level security;
revoke all on public.physical_products from anon, authenticated;
grant select on public.physical_products to anon, authenticated;
grant select, insert, update on public.physical_products to service_role;

drop policy if exists "Read published physical products" on public.physical_products;
create policy "Read published physical products"
  on public.physical_products for select to anon, authenticated
  using (not archived);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('physical-product-images', 'physical-product-images', true, 5242880,
  array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

insert into public.physical_products
  (slug, title_zh, title_en, subtitle_zh, subtitle_en, price_stars, image)
values
  ('stellar-soul-sigil', '星魂图腾', 'Stellar Soul Sigil',
   '觉醒灵魂的印记', 'The mark of an awakened soul', 2800, '/products/stellar-soul-sigil.png'),
  ('celestial-jewelry', '香薰星星蜡烛', 'Star Scented Candle',
   '以星辰为灵感的香薰蜡烛', 'A scented candle inspired by the stars', 1780, '/products/star.png'),
  ('mystic-fragrances', '星语心愿', 'Stellar Wishes',
   '为愿望与祝福留一处空间', 'A place for wishes and blessings', 1280, '/products/letter.png'),
  ('arcane-creations', '香薰苹果蜡烛', 'Apple Scented Candle',
   '以苹果为造型的香薰蜡烛', 'An apple-shaped scented candle', 1780, '/products/apple.png')
on conflict (slug) do nothing;

commit;
