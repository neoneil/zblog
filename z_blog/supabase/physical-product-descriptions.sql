alter table public.physical_products
  add column if not exists description_zh text not null default ''
    check (char_length(description_zh) <= 5000),
  add column if not exists description_en text not null default ''
    check (char_length(description_en) <= 5000);
