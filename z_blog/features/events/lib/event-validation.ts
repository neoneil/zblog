export const validEventId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export function sydneyInput(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (key: string) => parts.find((part) => part.type === key)?.value;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function parseSydneyInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("请填写完整的悉尼活动时间。");
  const base = Date.parse(`${value}:00Z`);
  const matches = [10, 11].map((offset) => new Date(base - offset * 3600000))
    .filter((date) => Number.isFinite(date.getTime()) && sydneyInput(date.toISOString()) === value);
  if (matches.length !== 1) throw new Error("此时间处于夏令时切换的无效或重复时段，请选择其他时间。");
  return matches[0].toISOString();
}

export function parseEventForm(form: FormData) {
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const slug = get("slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) throw new Error("链接标识须为小写英文、数字和短横线，最多120字符。");
  const text = (key: string, max: number, required = true) => {
    const value = get(key);
    if ((required && !value) || value.length > max) throw new Error("请填写标题、地点，并检查文字长度。");
    return value;
  };
  const price = get("price_aud");
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(price)) throw new Error("活动价格须为非负澳元金额，最多两位小数。");
  const [dollars, cents = ""] = price.split(".");
  const price_cents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
  const capacity = Number(get("capacity"));
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000) throw new Error("人数须为1–100000之间的整数。");
  const starts_at = parseSydneyInput(get("starts_at"));
  const ends_at = parseSydneyInput(get("ends_at"));
  if (ends_at <= starts_at) throw new Error("结束时间必须晚于开始时间。");
  return {
    slug, title_zh: text("title_zh", 200), title_en: text("title_en", 200),
    description_zh: text("description_zh", 10000, false), description_en: text("description_en", 10000, false),
    location_zh: text("location_zh", 300), location_en: text("location_en", 300),
    starts_at, ends_at, timezone: "Australia/Sydney", price_cents, capacity,
    registration_open: form.get("registration_open") === "on", is_published: form.get("is_published") === "on",
    is_demo: form.get("is_demo") === "on",
  };
}
