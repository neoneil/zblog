"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PersonInput } from "@/lib/astrology/synastry";
import { usePreferences } from "@/components/site/preferences-provider";

type Place = { display_name: string; lat: string; lon: string };
const selectClass = "h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)]";
export default function BirthPersonForm({ label, value, onChange }: { label: string; value: PersonInput; onChange: (value: PersonInput) => void }) {
  const { t } = usePreferences();
  const id = useId();
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placeName, setPlaceName] = useState("");
  const date = `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`;
  const time = `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;
  async function lookup() {
    if (!query.trim() || busy) return;
    setBusy(true); setError(""); setPlaces([]);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=jsonv2&limit=5`);
      if (!response.ok) throw new Error();
      const data: unknown = await response.json();
      const valid = Array.isArray(data) ? data.filter((p): p is Place => typeof p.display_name === "string" && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon))) : [];
      setPlaces(valid);
      if (!valid.length) setError(t({ zh: "未找到城市，可手动输入经纬度。", en: "No city found. Enter coordinates manually." }));
    } catch { setError(t({ zh: "城市查询失败，可手动输入经纬度。", en: "City lookup failed. Enter coordinates manually." })); }
    finally { setBusy(false); }
  }
  return (
    <fieldset className="min-w-0 space-y-4">
      <legend className="mb-4 text-xl text-[var(--heading)]">{label}</legend>
      <div><label htmlFor={id + "-name"} className="mb-2 block text-sm">{t({ zh: "姓名（可选）", en: "Name (optional)" })}</label><Input id={id + "-name"} maxLength={80} value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor={id + "-date"} className="mb-2 block text-sm">{t({ zh: "出生日期", en: "Birth date" })}</label><Input id={id + "-date"} type="date" min="1900-01-01" max="2100-12-31" required value={date} onChange={e => { const [year, month, day] = e.target.value.split("-").map(Number); if (year && month && day) onChange({ ...value, year, month, day }); }} /></div>
        <div><label htmlFor={id + "-time"} className="mb-2 block text-sm">{t({ zh: "出生地当地时间", en: "Local birth time" })}</label><Input id={id + "-time"} type="time" required={value.timeKnown} disabled={!value.timeKnown} value={time} onChange={e => { const [hour, minute] = e.target.value.split(":").map(Number); if (Number.isFinite(hour) && Number.isFinite(minute)) onChange({ ...value, hour, minute }); }} /></div>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--primary)]" checked={!value.timeKnown} onChange={e => onChange({ ...value, timeKnown: !e.target.checked })} />{t({ zh: "出生时间不确定", en: "Birth time unknown" })}</label>
      {!value.timeKnown && <p className="text-sm leading-6 text-[var(--warning)]">{t({ zh: "按当地正午估算，不显示该人的宫位和轴点；月亮相关数据为暂定。", en: "Estimated at local noon. Houses and angles are omitted; Moon data is provisional." })}</p>}
      <div>
        <label htmlFor={id + "-city"} className="mb-2 block text-sm">{t({ zh: "出生城市、国家", en: "Birth city, country" })}</label>
        <div className="flex gap-2"><Input id={id + "-city"} value={query} placeholder="Sydney, Australia" onChange={e => { setQuery(e.target.value); setPlaces([]); }} /><Button type="button" size="icon" variant="secondary" disabled={busy || !query.trim()} onClick={lookup} title={t({ zh: "查询城市", en: "Find city" })} aria-label={t({ zh: "查询城市", en: "Find city" })}><Search size={18} aria-hidden="true" /></Button></div>
        {busy && <p role="status" className="mt-2 text-sm">{t({ zh: "查询中…", en: "Searching…" })}</p>}
        {error && <p role="alert" className="mt-2 text-sm text-[var(--danger)]">{error}</p>}
        {places.length > 0 && <ul className="mt-2 divide-y divide-[var(--border)] border border-[var(--border)]">{places.map((place, index) => <li key={index}><button type="button" className="w-full px-3 py-3 text-left text-sm hover:bg-[var(--bg-soft)]" onClick={() => { onChange({ ...value, latitude: Number(place.lat), longitude: Number(place.lon) }); setPlaceName(place.display_name); setQuery(place.display_name); setPlaces([]); }}>{place.display_name}</button></li>)}</ul>}
        {placeName && <p className="mt-2 break-words text-xs">{placeName}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label htmlFor={id + "-lat"} className="mb-2 block text-sm">{t({ zh: "纬度", en: "Latitude" })}</label><Input id={id + "-lat"} type="number" required step="any" min={-89} max={89} value={Number.isFinite(value.latitude) ? value.latitude : ""} onChange={e => { setPlaceName(""); onChange({ ...value, latitude: e.target.value === "" ? NaN : Number(e.target.value) }); }} /></div>
        <div><label htmlFor={id + "-lon"} className="mb-2 block text-sm">{t({ zh: "经度", en: "Longitude" })}</label><Input id={id + "-lon"} type="number" required step="any" min={-180} max={180} value={Number.isFinite(value.longitude) ? value.longitude : ""} onChange={e => { setPlaceName(""); onChange({ ...value, longitude: e.target.value === "" ? NaN : Number(e.target.value) }); }} /></div>
      </div>
      <p className="text-xs leading-6">{t({ zh: "请确认经纬度属于出生地，默认值为悉尼。时区与夏令时依据坐标自动计算。", en: "Confirm coordinates for the birthplace; defaults are Sydney. Timezone and daylight saving are derived from coordinates." })}</p>
      <div><label htmlFor={id + "-houses"} className="mb-2 block text-sm">{t({ zh: "宫位系统", en: "House system" })}</label><select id={id + "-houses"} className={selectClass} value={value.houseSystem} onChange={e => onChange({ ...value, houseSystem: e.target.value as PersonInput["houseSystem"] })}>{["placidus", "koch", "campanus", "whole-sign", "equal-house", "regiomontanus", "topocentric"].map(system => <option key={system} value={system}>{system}</option>)}</select></div>
    </fieldset>
  );
}
