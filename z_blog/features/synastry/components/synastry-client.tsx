"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences } from "@/components/site/preferences-provider";
import type { AiAccessStatus } from "@/features/billing/lib/types";
import { DEFAULT_FORM } from "@/lib/astrology/natal-chart";
import { parseSynastryInput, relationships, topics, type PersonInput, type Relationship, type Topic, type SynastryInput, type SynastryResult, type SynastryReading } from "@/lib/astrology/synastry";
import { NatalWheelCN } from "@/app/astroplate/natal-wheel-cn-v3";
import BirthPersonForm from "./birth-person-form";
import SynastryWheel from "./synastry-wheel";

const initialPerson: PersonInput = { ...DEFAULT_FORM, latitude: -33.8688, longitude: 151.2093, timeKnown: true };
export default function SynastryClient({ accessStatus }: { accessStatus: AiAccessStatus }) {
  const { language, t } = usePreferences();
  const [a, setA] = useState<PersonInput>({ ...initialPerson });
  const [b, setB] = useState<PersonInput>({ ...initialPerson, year: 2000, month: 1, day: 1 });
  const [relationship, setRelationship] = useState<Relationship>("romantic");
  const [other, setOther] = useState("");
  const [result, setResult] = useState<SynastryResult | null>(null);
  const [snapshot, setSnapshot] = useState<SynastryInput | null>(null);
  const [reading, setReading] = useState<SynastryReading | null>(null);
  const [topic, setTopic] = useState<Topic>("emotional");
  const [pending, setPending] = useState<"calculate" | "read" | null>(null);
  const [error, setError] = useState("");
  const [limited, setLimited] = useState(!accessStatus.isAdmin && !accessStatus.isPaid && accessStatus.remainingToday <= 0);
  const inFlight = useRef(false);
  function invalidate() { setResult(null); setSnapshot(null); setReading(null); setError(""); }
  async function request(action: "calculate" | "read") {
    if (inFlight.current) return;
    let input: SynastryInput;
    try { input = parseSynastryInput(action === "read" && snapshot ? { ...snapshot, language } : { personA: a, personB: b, relationship, otherRelationship: other, language }); }
    catch (err) { setError(err instanceof Error ? err.message : "Invalid input"); return; }
    inFlight.current = true; setPending(action); setError("");
    try {
      const response = await fetch("/api/synastry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...input, action }) });
      const data = await response.json();
      if (!response.ok) {
        if (data.code === "daily_limit_reached") setLimited(true);
        throw new Error(data.error || "Request failed");
      }
      setResult(data.result); setSnapshot(input);
      if (action === "read") {
        setReading(data.reading);
        if (!accessStatus.isAdmin && !accessStatus.isPaid) setLimited(true);
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Request failed"); }
    finally { setPending(null); inFlight.current = false; }
  }
  return <main className="min-h-screen bg-[var(--bg)] text-[var(--text-soft)]">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <p className="mb-2 text-xs text-[var(--primary)]">SYNASTRY</p>
        <h1 className="text-3xl sm:text-4xl">{t({ zh: "双人合盘", en: "Synastry" })}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7">{t({ zh: "比较两人的本命盘、跨盘相位与双向宫位叠加，探索关系中的互动模式。", en: "Compare natal charts, cross-chart aspects and mutual house overlays to explore patterns in a relationship." })}</p>
      </header>
      <form onSubmit={e => { e.preventDefault(); void request("calculate"); }}>
        <fieldset disabled={!!pending} className="min-w-0 disabled:opacity-60">
          <div className="grid gap-8 md:grid-cols-2">
            <BirthPersonForm label="Person A" value={a} onChange={value => { setA(value); invalidate(); }} />
            <BirthPersonForm label="Person B" value={b} onChange={value => { setB(value); invalidate(); }} />
          </div>
          <section className="mt-8 border-t border-[var(--border)] py-6">
            <label htmlFor="synastry-zodiac" className="mb-2 block text-sm">{t({ zh: "共同黄道设置", en: "Shared zodiac" })}</label>
            <select id="synastry-zodiac" value={a.zodiac} className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)]" onChange={e => { const zodiac = e.target.value as PersonInput["zodiac"]; setA({ ...a, zodiac }); setB({ ...b, zodiac }); invalidate(); }}><option value="tropical">{t({ zh: "回归黄道", en: "Tropical" })}</option><option value="sidereal">{t({ zh: "恒星黄道", en: "Sidereal" })}</option></select>
            <fieldset className="mt-6"><legend className="mb-3 text-lg text-[var(--heading)]">{t({ zh: "你们的关系", en: "Your relationship" })}</legend><div className="flex flex-wrap gap-x-6 gap-y-2">{relationships.map(item => <label key={item.key} className="flex min-h-11 items-center gap-2 text-sm"><input type="radio" name="relationship" value={item.key} checked={relationship === item.key} onChange={() => { setRelationship(item.key); invalidate(); }} className="accent-[var(--primary)]" />{item[language]}</label>)}</div></fieldset>
            {relationship === "other" && <div className="mt-3 max-w-xl"><label htmlFor="other-relationship" className="mb-2 block text-sm">{t({ zh: "描述你们的关系", en: "Describe your relationship" })}</label><Textarea id="other-relationship" required maxLength={300} value={other} onChange={e => { setOther(e.target.value); invalidate(); }} /></div>}
            <Button type="submit" disabled={!!pending} className="mt-5 gap-2">{pending === "calculate" && <LoaderCircle size={16} className="animate-spin" />}{t({ zh: "生成双人合盘", en: "Calculate Synastry" })}</Button>
          </section>
        </fieldset>
      </form>
      {error && <p role="alert" className="my-4 text-sm text-[var(--danger)]">{error}</p>}
      {pending && <p role="status" className="my-4 text-sm">{pending === "calculate" ? t({ zh: "正在计算两人的星盘…", en: "Calculating both charts…" }) : t({ zh: "正在生成六个主题的关系解读…", en: "Preparing all six reading topics…" })}</p>}
      {result && <>
        {(!result.timeKnownA || !result.timeKnownB) && <p className="my-5 border-l-2 border-[var(--warning)] pl-4 text-sm leading-7 text-[var(--warning)]">{t({ zh: "含未知出生时间：无对应宫位与轴点，月亮及相关相位仅作暂定参考；双轮图按正午估算，不表示精确出生盘。", en: "Unknown birth time: houses and angles are omitted for that person. Moon contacts and noon-based positions are provisional, not an exact birth chart." })}</p>}
        <section className="border-t border-[var(--border)] py-8">
          <h2 className="mb-5 text-2xl">{t({ zh: "两人的本命盘", en: "Your Natal Charts" })}</h2>
          <div className="grid gap-8 lg:grid-cols-2">{[result.chartA, result.chartB].map((chart, index) => <div key={index} className="min-w-0">
            <h3 className="mb-3 text-xl">{index === 0 ? "Person A" : "Person B"}{chart.meta.name ? " · " + chart.meta.name : ""}</h3>
            <NatalWheelCN chartJson={chart} />
            <details className="mt-4 text-sm"><summary className="cursor-pointer py-2 text-[var(--primary)]">{t({ zh: "行星位置", en: "Planetary positions" })}</summary><ul className="mt-3 grid gap-2 sm:grid-cols-2">{chart.planets.map(p => <li key={p.key}>{language === "zh" ? p.labelZh + " · " + p.signZh : p.label + " · " + p.sign} {p.signDegrees.toFixed(2)}°{p.retrograde ? " ℞" : ""}</li>)}</ul></details>
          </div>)}</div>
        </section>
        <section className="border-t border-[var(--border)] py-8">
          <h2 className="text-2xl">{t({ zh: "合盘双轮图", en: "Synastry Bi-Wheel" })}</h2>
          <p className="mt-3 text-sm">{t({ zh: "内圈 A（金色），外圈 B（浅色）；连线展示前 15 个非暂定的行星主要相位。", en: "Inner ring A (gold), outer ring B (light); lines show the first 15 non-provisional planetary aspects." })}</p>
          <SynastryWheel result={result} language={language} />
        </section>
        <section className="border-t border-[var(--border)] py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl">{t({ zh: "关系解读", en: "Relationship Reading" })}</h2><Button type="button" disabled={!!pending || limited} onClick={() => void request("read")} className="gap-2"><Sparkles size={16} />{t({ zh: reading ? "重新生成解读" : "生成 AI 解读", en: reading ? "Regenerate Reading" : "Generate AI Reading" })}</Button></div>
          {!accessStatus.isAdmin && !accessStatus.isPaid && <p className="mb-5 text-sm">{t({ zh: "AI 解读与单人星盘共用每日 1 次免费额度；计算星盘不消耗额度。", en: "AI readings share the natal chart allowance of one free reading per day. Chart calculations do not use it." })}</p>}
          {limited && <div className="mb-5 flex flex-wrap items-center gap-3 text-sm"><p>{t({ zh: "今日免费 AI 额度已用完，已生成内容仍可查看。", en: "Today's free AI allowance is used. Existing results remain available." })}</p><ButtonLink href="/pricing?scope=astroplate" variant="secondary" size="sm">{t({ zh: "查看时间包", en: "View Access Plans" })}</ButtonLink></div>}
          <div role="tablist" aria-label={t({ zh: "合盘主题", en: "Synastry topics" })} className="flex flex-wrap gap-2">{topics.map((item, index) => <button key={item.key} id={"tab-" + item.key} role="tab" type="button" aria-selected={topic === item.key} aria-controls="synastry-topic" tabIndex={topic === item.key ? 0 : -1} onClick={() => setTopic(item.key)} onKeyDown={e => { const next = e.key === "ArrowRight" ? (index + 1) % topics.length : e.key === "ArrowLeft" ? (index + topics.length - 1) % topics.length : e.key === "Home" ? 0 : e.key === "End" ? topics.length - 1 : -1; if (next >= 0) { e.preventDefault(); setTopic(topics[next].key); document.getElementById("tab-" + topics[next].key)?.focus(); } }} className={"min-h-11 border-b-2 px-3 py-2 text-sm " + (topic === item.key ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-[var(--text-soft)]")}>{item[language]}</button>)}</div>
          <div id="synastry-topic" role="tabpanel" aria-labelledby={"tab-" + topic} tabIndex={0} className="mt-6 min-w-0">
            {reading ? <div className="max-w-4xl space-y-5 text-base leading-8 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold"><p className="border-l-2 border-[var(--primary)] pl-4">{reading.overview}</p><ReactMarkdown>{reading.sections[topic]}</ReactMarkdown></div> : <p className="text-sm leading-7">{t({ zh: "生成 AI 解读后，可在这里切换六个主题。下方的相位与宫位数据无需 AI 即可查看。", en: "Generate an AI reading to explore the six topics. Calculated aspects and overlays are available below without AI." })}</p>}
          </div>
          <details className="mt-8" open={topic === "aspects"}><summary className="cursor-pointer py-3 text-lg text-[var(--heading)]">{t({ zh: "主要跨盘相位", en: "Major Cross-Chart Aspects" })} · {result.aspects.length}</summary><p className="mb-4 text-xs leading-6">{t({ zh: "合、冲、刑、拱容许度 6°，六合 4°；优先个人行星，再按容许度排序。", en: "Orbs: 6° for conjunction, opposition, square and trine; 4° for sextile. Personal-planet contacts are prioritised, then tighter orbs." })}</p><div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm"><thead><tr className="border-b border-[var(--border)]"><th className="py-3">Person A</th><th>Person B</th><th>{t({ zh: "相位", en: "Aspect" })}</th><th>{t({ zh: "容许度", en: "Orb" })}</th></tr></thead><tbody>{result.aspects.map(item => <tr key={item.a + item.b + item.type} className="border-b border-[var(--border)]"><td className="py-3">{language === "zh" ? item.aZh : item.aEn}</td><td>{language === "zh" ? item.bZh : item.bEn}</td><td>{item[language]}{item.provisional && " *"}</td><td>{item.orb.toFixed(2)}°</td></tr>)}</tbody></table></div>{!result.aspects.length && <p>{t({ zh: "当前容许度内无主要相位。", en: "No major aspects within these orbs." })}</p>}</details>
          <section className="mt-8"><h3 className="mb-4 text-xl">{t({ zh: "双向宫位叠加", en: "Mutual House Overlays" })}</h3><div className="grid gap-6 sm:grid-cols-2">{[{ label: "A → B", items: result.aInB }, { label: "B → A", items: result.bInA }].map(group => <div key={group.label}><h4 className="mb-3">{group.label}</h4>{group.items.length ? <ul className="grid gap-2 text-sm">{group.items.map(p => <li key={p.key}>{p[language]} → {t({ zh: "第 " + p.house + " 宫", en: "House " + p.house })}{p.provisional ? " *" : ""}</li>)}</ul> : <p className="text-sm">{t({ zh: "对方出生时间未知，不计算其宫位。", en: "The receiving person's birth time is unknown; houses are omitted." })}</p>}</div>)}</div></section>
          <p className="mt-6 text-xs leading-6">{t({ zh: "* 月亮相关的暂定数据。占星用于自我反思，不代表科学诊断或确定的关系结局。", en: "* Provisional Moon-related data. Astrology is for reflection, not scientific diagnosis or a prediction of relationship outcomes." })}</p>
        </section>
      </>}
    </div>
  </main>;
}
