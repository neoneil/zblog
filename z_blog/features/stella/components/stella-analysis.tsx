"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ChevronRight, Share2, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import type { BirthForm, OpenAIChartJson } from "@/lib/astrology/natal-chart";
import { analysisText, generalReading, topicNames } from "../lib/app-copy";
import {
  angularPlanets,
  aspects,
  chartTransits,
  currentAngles,
  esotericProfile,
  keyTransitDates,
  moonEvents,
  periodWindow,
  planetaryHour,
  rayNames,
  saturnReturns,
  skyAspects,
  skyRayEnergies,
  timingTechniques,
  type AnalysisStyle,
  type AnalysisTopic,
  type AppAspect,
  type ReadingPeriod,
} from "../lib/app-analysis";
import {
  getSkySnapshot,
  PLANET_SYMBOLS,
  SIGN_NAMES,
  SIGN_SYMBOLS,
  type SkySnapshot,
} from "../lib/sky";
import { ZodiacConstellation } from "./zodiac-constellation";
import s from "./stella-analysis.module.css";
import { STELLA_CONSULTATION_HREF } from "../lib/consultation";

type Context = {
  chart: OpenAIChartJson | null;
  birth: BirthForm | null;
  utc: string;
  timezone: string;
  sky: SkySnapshot;
  date: Date;
  period: ReadingPeriod;
  open: (topic: AnalysisTopic, detail?: string) => void;
};
const AnalysisContext = createContext<Context | null>(null);
function useAnalysis() {
  const value = useContext(AnalysisContext);
  if (!value) throw new Error("Missing Stella analysis context");
  return value;
}
export function AnalysisProvider({
  children,
  ...value
}: Omit<Context, "open"> & { children: ReactNode }) {
  const [selected, setSelected] = useState<{
    topic: AnalysisTopic;
    detail?: string;
  } | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return (
    <AnalysisContext.Provider
      value={{
        ...value,
        open: (topic, detail) => setSelected({ topic, detail }),
      }}
    >
      {children}
      {selected && (
        <AnalysisDialog
          key={selected.topic + selected.detail}
          {...selected}
          close={close}
        />
      )}
    </AnalysisContext.Provider>
  );
}
const names: Record<string, { en: string; zh: string }> = {
  sun: { en: "Sun", zh: "太阳" },
  moon: { en: "Moon", zh: "月亮" },
  mercury: { en: "Mercury", zh: "水星" },
  venus: { en: "Venus", zh: "金星" },
  mars: { en: "Mars", zh: "火星" },
  jupiter: { en: "Jupiter", zh: "木星" },
  saturn: { en: "Saturn", zh: "土星" },
  uranus: { en: "Uranus", zh: "天王星" },
  neptune: { en: "Neptune", zh: "海王星" },
  pluto: { en: "Pluto", zh: "冥王星" },
  chiron: { en: "Chiron", zh: "凯龙星" },
  northnode: { en: "North Node", zh: "北交点" },
  southnode: { en: "South Node", zh: "南交点" },
  ascendant: { en: "Ascendant", zh: "上升点" },
  midheaven: { en: "Midheaven", zh: "天顶" },
  earth: { en: "Earth", zh: "地球" },
};
export function planetName(key: string, language: "en" | "zh") {
  return names[key]?.[language] || key;
}
export const pointSymbols: Record<string, string> = {
  ...PLANET_SYMBOLS,
  chiron: "⚷",
  northnode: "☊",
  southnode: "☋",
  ascendant: "ASC",
  midheaven: "MC",
};
function dateText(value: string | Date, language: "en" | "zh", time = false) {
  return new Date(value).toLocaleString(language === "zh" ? "zh-CN" : "en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
function useDay() {
  const { date } = useAnalysis();
  const day = Math.floor(date.getTime() / 86400000);
  return useMemo(() => new Date(day * 86400000 + 43200000), [day]);
}
function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("stella-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("stella-storage", callback);
  };
}
function useBrowserText(key: string) {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        return localStorage.getItem(key) || "";
      } catch {
        return "";
      }
    },
    () => "",
  );
}
function storeText(key: string, value: string) {
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
  window.dispatchEvent(new Event("stella-storage"));
}

export function Feedback({ id }: { id: string }) {
  const { t } = usePreferences();
  const vote = useBrowserText("stella-feedback:" + id);
  const [shared, setShared] = useState(false);
  function choose(value: string) {
    try {
      storeText("stella-feedback:" + id, vote === value ? "" : value);
    } catch {}
  }
  async function share() {
    try {
      const url = new URL("/stella", location.origin).href;
      if (navigator.share) await navigator.share({ title: "Stella", url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
    } catch {
      setShared(false);
    }
  }
  return (
    <div className={s.feedback}>
      <span>{t({ en: "Did it resonate?", zh: "这段解读有共鸣吗？" })}</span>
      <button
        type="button"
        aria-label={t({ en: "Helpful", zh: "有帮助" })}
        aria-pressed={vote === "yes"}
        onClick={() => choose("yes")}
      >
        <ThumbsUp size={13} />
      </button>
      <button
        type="button"
        aria-label={t({ en: "Not helpful", zh: "帮助不大" })}
        aria-pressed={vote === "no"}
        onClick={() => choose("no")}
      >
        <ThumbsDown size={13} />
      </button>
      <button
        type="button"
        aria-label={t({ en: "Share", zh: "分享" })}
        onClick={() => void share()}
      >
        <Share2 size={13} />
      </button>
      {shared && (
        <span role="status">
          {t({ en: "Shared / link copied", zh: "已分享或复制链接" })}
        </span>
      )}
    </div>
  );
}
function DeepButton({ topic }: { topic: AnalysisTopic; detail?: string }) {
  const { t } = usePreferences();
  return (
    <Link
      className={s.link}
      href={STELLA_CONSULTATION_HREF}
      data-analysis-topic={topic}
    >
      {t({ en: "Go Deeper", zh: "深入解读" })}
      <ChevronRight size={13} />
    </Link>
  );
}
function Insight({
  topic,
  children,
  feedback = true,
}: {
  topic: AnalysisTopic;
  children?: ReactNode;
  feedback?: boolean;
}) {
  const { chart, sky, date, utc, period } = useAnalysis();
  const { language, t } = usePreferences();
  if (!chart) return null;
  return (
    <section className={s.section} data-analysis={topic}>
      <h3>{t(topicNames[topic])}</h3>
      <p>{analysisText(topic, chart, sky, language, period, utc, date)}</p>
      {children}
      <DeepButton topic={topic} />
      {feedback && (
        <Feedback
          id={`${chart.meta.birth.year}-${chart.meta.birth.month}-${chart.meta.birth.day}:${topic}:${language}:${period}`}
        />
      )}
    </section>
  );
}

function AnalysisDialog({
  topic,
  detail,
  close,
}: {
  topic: AnalysisTopic;
  detail?: string;
  close: () => void;
}) {
  const context = useAnalysis(),
    { language, t } = usePreferences();
  const [style, setStyle] = useState<AnalysisStyle>("overview");
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      prior?.focus();
    };
  }, [close]);
  return (
    <div
      className={s.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stella-analysis-title"
        tabIndex={-1}
        className={s.dialog}
      >
        <div className={s.dialogHeader}>
          <h2 id="stella-analysis-title">{t(topicNames[topic])}</h2>
          <button
            type="button"
            onClick={close}
            aria-label={t({ en: "Close analysis", zh: "关闭解读" })}
          >
            <X size={20} />
          </button>
        </div>
        <div className={s.tabs}>
          {(
            [
              ["overview", "Overview", "概览"],
              ["practical", "Practical", "实践"],
              ["spiritual", "Spiritual", "精神成长"],
              ["detailed", "Detailed", "详细"],
            ] as const
          ).map(([key, en, zh]) => (
            <button
              type="button"
              key={key}
              aria-pressed={style === key}
              onClick={() => setStyle(key)}
            >
              {t({ en, zh })}
            </button>
          ))}
        </div>
        {detail && <p>{detail}</p>}
        <>
          <p>
            {context.chart &&
              analysisText(
                topic,
                context.chart,
                context.sky,
                language,
                context.period,
                context.utc,
                context.date,
              )}
          </p>
          <p className={s.muted}>
            {t({
              en: {
                overview:
                  "Connect the key chart factors without treating them as a fixed outcome.",
                practical:
                  "Choose one observable behavior and a realistic next step for this theme.",
                spiritual:
                  "Consider how awareness, care and responsibility can change your response.",
                detailed:
                  "A personalized consultation combines precise positions, houses, aspects and timing.",
              }[style],
              zh: {
                overview: "综合观察核心星盘因素，不将象征主题视为固定结果。",
                practical:
                  "选择一个可以观察的行为，为这个主题制定切实可行的下一步。",
                spiritual: "反思觉察、关怀与责任如何改变你的回应方式。",
                detailed: "个性化咨询结合具体位置、宫位、相位及时间背景。",
              }[style],
            })}
          </p>
        </>
        <div className={s.actions}>
          <Link className={s.action} href={STELLA_CONSULTATION_HREF}>
            <ChevronRight size={14} />
            {t({ en: "Request personal reading", zh: "获取个人解读" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

function TransitRow({
  transit,
  natal = false,
}: {
  transit: AppAspect;
  natal?: boolean;
}) {
  const { language, t } = usePreferences();
  const { open } = useAnalysis();
  const type = aspects.find((a) => a.key === transit.type)!;
  return (
    <div className={s.row}>
      <button
        type="button"
        onClick={() =>
          open(
            "aspect",
            `${planetName(transit.a, language)} ${t(type.label)} ${natal ? t({ en: "natal", zh: "本命" }) : ""} ${planetName(transit.b, language)}; orb ${transit.orb.toFixed(2)}°; ${transit.applying ? "applying" : "separating"}`,
          )
        }
      >
        <span className={s.symbol}>{pointSymbols[transit.a]}</span>
        {planetName(transit.a, language)} {type.symbol}{" "}
        {natal ? t({ en: "natal ", zh: "本命" }) : ""}
        {planetName(transit.b, language)}
      </button>
      <small
        title={t({
          en: transit.applying ? "Applying" : "Separating",
          zh: transit.applying ? "入相" : "出相",
        })}
      >
        {transit.orb.toFixed(2)}° {transit.applying ? "↗" : "↘"}
        <br />
        {transit.strength}%
      </small>
    </div>
  );
}

export function ReadingsPanel({
  sign,
  setSign,
  enterBirth,
  hasBirth,
  signText,
}: {
  sign: number;
  setSign: (n: number) => void;
  enterBirth: () => void;
  hasBirth: boolean;
  signText: string;
}) {
  const { chart, sky, utc, date, period } = useAnalysis(),
    { language, t } = usePreferences();
  const day = useDay();
  const data = useMemo(() => {
    if (!chart || !utc) return null;
    const current = getSkySnapshot(day),
      next = getSkySnapshot(new Date(day.getTime() + 3600000));
    return {
      timing: timingTechniques(chart, utc, day),
      returns: period === "today" ? saturnReturns(chart, utc) : [],
      transits: chartTransits(chart, current, next),
      phases: moonEvents(day, period),
      dates: period === "today" ? [] : keyTransitDates(chart, day, period),
    };
  }, [chart, utc, day, period]);
  const window = periodWindow(date, period);
  const dateLabel =
    period === "today"
      ? dateText(date, language)
      : period === "week"
        ? `${dateText(window.start, language)} – ${dateText(new Date(window.end.getTime() - 1), language)}`
        : date.toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
            timeZone: "UTC",
            month: "long",
            year: "numeric",
          });
  const connection = (
    <Link className={s.banner} href="/stella/compatibility">
      <strong>{t({ en: "Explore a Connection", zh: "探索彼此的连接" })}</strong>
      {t({
        en: "Discover the dynamics of your relationship.",
        zh: "了解你们之间的互动与关系潜能。",
      })}
      <ChevronRight size={14} />
    </Link>
  );
  return (
    <>
      {hasBirth && chart && data && (
        <>
          <section className={s.section}>
            <h2>{t(topicNames.personal)}</h2>
            <small>{dateLabel} · UTC</small>
            {(["energy", "guidance", "soul-insight"] as const).map((topic) => (
              <Insight key={topic} topic={topic} feedback={false} />
            ))}
            <Feedback
              id={`personal:${chart.meta.birth.year}:${day.toISOString()}:${period}:${language}`}
            />
          </section>
          {data.transits[0] && (
            <section className={s.section}>
              <h3>{t(topicNames["featured-transit"])}</h3>
              <TransitRow transit={data.transits[0]} natal />
              <DeepButton
                topic="featured-transit"
                detail={JSON.stringify(data.transits[0])}
              />
            </section>
          )}
          {period === "today" ? (
            <>
              <section className={s.section}>
                <h3>
                  {language === "zh"
                    ? `${data.timing.profectionHouse}宫年限推运年`
                    : `${data.timing.profectionHouse}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[data.timing.profectionHouse] || "th"} House Profection Year`}
                </h3>
                <p>
                  {t({ en: "Time Lord", zh: "年主星" })}:{" "}
                  {planetName(data.timing.timeLord, language)}
                </p>
                <DeepButton topic="profection" />
              </section>
              <section className={s.section}>
                <h3>
                  {t({ en: "Progressed Moon", zh: "次限月亮" })} ·{" "}
                  {
                    SIGN_NAMES[language][
                      data.timing.progressions.find((p) => p.key === "moon")!
                        .signIndex
                    ]
                  }
                </h3>
                {data.timing.progressions.map((p) => (
                  <p key={p.key}>
                    {planetName(p.key, language)} ·{" "}
                    {SIGN_NAMES[language][p.signIndex]}{" "}
                    {p.signDegrees.toFixed(2)}°
                  </p>
                ))}
                <DeepButton topic="progressions" />
              </section>
              <section className={s.section}>
                <h3>
                  {data.timing.solarYear} {t(topicNames["solar-return"])}
                </h3>
                <p>
                  {data.timing.solarReturn
                    ? dateText(data.timing.solarReturn, language, true) + " UTC"
                    : "—"}
                </p>
                <DeepButton topic="solar-return" />
              </section>
              <section className={s.section}>
                <h3>{t(topicNames["saturn-return"])}</h3>
                {data.returns.map((row) => (
                  <p key={row.cycle}>
                    {t({ en: "Cycle", zh: "第" })} {row.cycle}
                    {language === "zh" ? "次" : ""} ·{" "}
                    {row.time ? dateText(row.time, language) : "—"}
                    <small>
                      {" "}
                      ·{" "}
                      {row.time && new Date(row.time) < date
                        ? t({ en: "Past", zh: "已发生" })
                        : t({ en: "Upcoming", zh: "未来" })}
                    </small>
                  </p>
                ))}
                <DeepButton topic="saturn-return" />
              </section>
              {connection}
            </>
          ) : (
            <>
              <section className={s.section}>
                <h3>{t({ en: "Moon Phases", zh: "月相" })}</h3>
                {data.phases.map((p) => (
                  <p key={p.time}>
                    {p.phase === 0
                      ? "🌑"
                      : p.phase === 180
                        ? "🌕"
                        : p.phase === 90
                          ? "🌓"
                          : "🌗"}{" "}
                    {dateText(p.time, language, true)} UTC ·{" "}
                    {SIGN_NAMES[language][p.sign]}
                  </p>
                ))}
                {!data.phases.length && (
                  <p>
                    {t({
                      en: "No quarter-phase transition in this interval.",
                      zh: "此时间段没有主要月相转换。",
                    })}
                  </p>
                )}
              </section>
              <section className={s.section}>
                <h3>{t({ en: "Key Dates", zh: "关键日期" })}</h3>
                <small>
                  {t({
                    en: "Closest daily samples · UTC; not exact peak times",
                    zh: "每日采样中最接近的日期 · UTC，非精确峰值",
                  })}
                </small>
                {data.dates.map((e) => (
                  <div key={e.time + e.transit.a + e.transit.b}>
                    <p>{dateText(e.time, language)}</p>
                    <TransitRow transit={e.transit} natal />
                  </div>
                ))}
              </section>
            </>
          )}
        </>
      )}
      {!hasBirth && period === "today" && connection}
      <section className={s.section}>
        <div className={s.selectRow}>
          <span>{SIGN_SYMBOLS[sign]}</span>
          <select
            aria-label={t({ en: "Select sign", zh: "选择星座" })}
            value={sign}
            onChange={(e) => setSign(Number(e.target.value))}
          >
            {SIGN_NAMES[language].map((name, i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
          <ZodiacConstellation sign={sign} size="compact" />
        </div>
        <small>{dateLabel} · UTC</small>
        <p>{signText}</p>
        {generalReading(sign, period, sky, language).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <p>
          {t({ en: "Current Sun", zh: "行运太阳" })}:{" "}
          {SIGN_NAMES[language][sky.planets[0].signIndex]}{" "}
          {sky.planets[0].signDegrees.toFixed(2)}° ·{" "}
          {t({ en: "Moon", zh: "月亮" })}:{" "}
          {SIGN_NAMES[language][sky.planets[1].signIndex]}{" "}
          {sky.planets[1].signDegrees.toFixed(2)}°
        </p>
        <Feedback
          id={`sign:${sign}:${period}:${day.toISOString()}:${language}`}
        />
        {!hasBirth && (
          <>
            <p>
              {t({
                en: "Enter your birth details for a personal reading based on your chart.",
                zh: "输入出生信息，查看基于你本命盘的个人解读。",
              })}
            </p>
            <button type="button" className={s.action} onClick={enterBirth}>
              {t({ en: "Enter My Chart", zh: "输入我的星盘" })}
            </button>
          </>
        )}
      </section>
    </>
  );
}

export function BirthInsights() {
  const { chart } = useAnalysis(),
    { language, t } = usePreferences();
  const [temperament, setTemperament] = useState<string[]>([]);
  if (!chart) return null;
  const profile = esotericProfile(chart);
  return (
    <>
      <section className={s.section}>
        <h2>{t({ en: "Go Deeper", zh: "深入了解你的星盘" })}</h2>
        <p>
          {t({
            en: "Explore the symbolic patterns behind your natal placements, from daily expression to long-term growth.",
            zh: "从日常表达走向长期成长，探索本命星位背后的象征与联系。",
          })}
        </p>
      </section>
      <Insight topic="ray-constitution">
        {profile.rays.map((row) => (
          <div key={row.ray} className={s.ray}>
            <div className={s.row}>
              <span>
                R{row.ray} · {t(rayNames[row.ray - 1])}
              </span>
              <small>{row.percent}%</small>
            </div>
            <div className={s.bar}>
              <span style={{ width: row.percent + "%" }} />
            </div>
          </div>
        ))}
      </Insight>
      <Insight topic="vehicles">
        <details>
          <summary>
            {t({ en: "Temperament self-observation", zh: "气质自我观察" })}
          </summary>
          {[
            {
              en: "I process experience through ideas and patterns.",
              zh: "我习惯通过概念和规律理解经历。",
            },
            {
              en: "I first notice emotional connection and atmosphere.",
              zh: "我首先关注情感连接和氛围。",
            },
            {
              en: "I understand best through practical action.",
              zh: "我通过实际行动获得理解。",
            },
          ].map((item, i) => (
            <label key={i}>
              <input
                style={{ width: "auto" }}
                type="checkbox"
                checked={temperament.includes(String(i))}
                onChange={(e) =>
                  setTemperament((old) =>
                    e.target.checked
                      ? [...old, String(i)]
                      : old.filter((x) => x !== String(i)),
                  )
                }
              />{" "}
              {t(item)}
            </label>
          ))}
          {temperament.length > 0 && (
            <p>
              {t({ en: "Your selected observations", zh: "你选择的观察方向" })}:{" "}
              {temperament
                .map((i) =>
                  t(
                    [
                      { en: "Mind", zh: "心智" },
                      { en: "Feeling", zh: "情绪" },
                      { en: "Action", zh: "行动" },
                    ][Number(i)],
                  ),
                )
                .join(" · ")}
            </p>
          )}
        </details>
      </Insight>
      <Insight topic="soul-purpose" />
      <Insight topic="personality" />
      <Insight topic="emotions" />
      <Insight topic="esoteric">
        <dl className={s.facts}>
          <div>
            <dt>{t({ en: "Dominant Cross", zh: "主导十字" })}</dt>
            <dd>
              {t(
                [
                  { en: "Cardinal", zh: "基本" },
                  { en: "Fixed", zh: "固定" },
                  { en: "Mutable", zh: "变动" },
                ][profile.cross],
              )}
            </dd>
          </div>
          <div>
            <dt>{t({ en: "Esoteric Ruler", zh: "秘传守护星" })}</dt>
            <dd>{planetName(profile.esotericRuler, language)}</dd>
          </div>
          <div>
            <dt>{t({ en: "Orthodox Ruler", zh: "传统守护星" })}</dt>
            <dd>{planetName(profile.orthodoxRuler, language)}</dd>
          </div>
          <div>
            <dt>Atmakaraka</dt>
            <dd>
              {planetName(profile.atmakaraka.key, language)}{" "}
              {profile.atmakaraka.signDegrees.toFixed(2)}°
            </dd>
          </div>
        </dl>
      </Insight>
      <details className={s.section}>
        <summary>{t(topicNames["saturn-lesson"])}</summary>
        <Insight topic="saturn-lesson" />
      </details>
    </>
  );
}

export function SkyPanel(props: { selectPlanet: (key: string) => void }) {
  return (
    <div className={s.sky}>
      <SkyPanelContent {...props} />
    </div>
  );
}
function SkyPanelContent({
  selectPlanet,
}: {
  selectPlanet: (key: string) => void;
}) {
  const { chart, sky, date, timezone } = useAnalysis(),
    { language, t } = usePreferences();
  const [tab, setTab] = useState<"now" | "esoteric">("now");
  const day = useDay();
  const minute = Math.floor(date.getTime() / 60000);
  const latitude = chart?.meta.birth.latitude ?? 0,
    longitude = chart?.meta.birth.longitude ?? 0;
  const daily = useMemo(
    () => ({
      phases: moonEvents(day, "month"),
      nextPhases: moonEvents(
        new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 1)),
        "month",
      ),
    }),
    [day],
  );
  const data = useMemo(() => {
    const at = new Date(minute * 60000),
      current = getSkySnapshot(at),
      next = getSkySnapshot(new Date(at.getTime() + 3600000));
    return {
      aspects: skyAspects(current, next),
      transits: chart ? chartTransits(chart, current, next) : [],
      hour: planetaryHour(at, latitude, longitude, timezone),
      angles: currentAngles(at, latitude, longitude),
      angular: angularPlanets(current, at, latitude, longitude),
      rays: skyRayEnergies(current, at),
    };
  }, [minute, chart, latitude, longitude, timezone]);
  const upcoming = [...daily.phases, ...daily.nextPhases]
    .filter(
      (p) => new Date(p.time) > date && (p.phase === 0 || p.phase === 180),
    )
    .slice(0, 2);
  const phaseIndex = Math.floor(((sky.moon.phase + 22.5) % 360) / 45),
    moonPhases = [
      { en: "New Moon", zh: "新月" },
      { en: "Waxing Crescent", zh: "娥眉月" },
      { en: "First Quarter", zh: "上弦月" },
      { en: "Waxing Gibbous", zh: "盈凸月" },
      { en: "Full Moon", zh: "满月" },
      { en: "Waning Gibbous", zh: "亏凸月" },
      { en: "Last Quarter", zh: "下弦月" },
      { en: "Waning Crescent", zh: "残月" },
    ];
  const moon = sky.planets.find((p) => p.key === "moon")!;
  return (
    <>
      <div className={s.tabs}>
        {(
          [
            ["now", "Now", "此刻"],
            ["esoteric", "Esoteric", "秘传"],
          ] as const
        ).map(([key, en, zh]) => (
          <button
            type="button"
            key={key}
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
          >
            {t({ en, zh })}
          </button>
        ))}
      </div>
      {tab === "now" ? (
        <>
          <section className={s.section}>
            <h2>{t({ en: "Moon", zh: "月亮" })}</h2>
            <span className={s.moon}>
              {["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][phaseIndex]}
            </span>
            <p>
              {t(moonPhases[phaseIndex])} ·{" "}
              {(sky.moon.illumination * 100).toFixed(1)}%
            </p>
            <p>
              {SIGN_NAMES[language][moon.signIndex]}{" "}
              {moon.signDegrees.toFixed(2)}°
            </p>
            {upcoming[0] && (
              <small>
                {t({
                  en:
                    upcoming[0].phase === 180 ? "Full Moon in" : "New Moon in",
                  zh: upcoming[0].phase === 180 ? "距满月" : "距新月",
                })}{" "}
                {Math.ceil(
                  (new Date(upcoming[0].time).getTime() - date.getTime()) /
                    86400000,
                )}{" "}
                {t({ en: "days", zh: "天" })}
              </small>
            )}
          </section>
          <section className={s.section}>
            <h2>{t({ en: "Upcoming", zh: "即将到来" })}</h2>
            {upcoming.map((p) => (
              <p key={p.time}>
                {t(p.phase === 0 ? moonPhases[0] : moonPhases[4])} ·{" "}
                {SIGN_NAMES[language][p.sign]}
                <br />
                <small>{dateText(p.time, language, true)} UTC</small>
              </p>
            ))}
          </section>
          <section className={s.section}>
            <h2>{t({ en: "Planetary Hour", zh: "行星时" })}</h2>
            {data.hour ? (
              <>
                <p>
                  {pointSymbols[data.hour.planet]}{" "}
                  {planetName(data.hour.planet, language)} ·{" "}
                  {t({ en: "until", zh: "至" })}{" "}
                  {dateText(data.hour.end, language, true)} UTC
                </p>
                <small>
                  {t({ en: "Next", zh: "下一个" })}:{" "}
                  {planetName(data.hour.next, language)} ·{" "}
                  {t({
                    en: data.hour.daylight ? "Daytime" : "Nighttime",
                    zh: data.hour.daylight ? "昼时" : "夜时",
                  })}
                </small>
              </>
            ) : (
              <p>
                {t({
                  en: "Unavailable here during polar day or night.",
                  zh: "此地点的极昼或极夜期间无法划分行星时。",
                })}
              </p>
            )}
          </section>
          <section className={s.section}>
            <h2>{t({ en: "Retrogrades", zh: "逆行" })}</h2>
            {sky.planets
              .filter((p) => p.retrograde)
              .map((p) => (
                <p key={p.key}>
                  {pointSymbols[p.key]} {planetName(p.key, language)} ·{" "}
                  {SIGN_NAMES[language][p.signIndex]} ℞
                </p>
              ))}
            {!sky.planets.some((p) => p.retrograde) && (
              <p>
                {t({
                  en: "No planets currently retrograde.",
                  zh: "当前没有逆行的行星。",
                })}
              </p>
            )}
          </section>
        </>
      ) : (
        <>
          <section className={s.section}>
            <h2>{t({ en: "Current Angles", zh: "当前四轴" })}</h2>
            {Object.entries(data.angles).map(([key, value]) => (
              <p key={key}>
                {key.toUpperCase()} ·{" "}
                {SIGN_NAMES[language][Math.floor(value / 30)]}{" "}
                {(value % 30).toFixed(2)}°
              </p>
            ))}
            <small>
              {latitude.toFixed(3)}°, {longitude.toFixed(3)}°
            </small>
          </section>
          <section className={s.section}>
            <h2>{t({ en: "Ray Energies", zh: "射线能量" })}</h2>
            <small>
              {t({
                en: "vs. monthly-sampled annual baseline · symbolic model",
                zh: "与全年每月采样均值比较 · 象征模型",
              })}
            </small>
            {data.rays.map((row) => (
              <div className={s.ray} key={row.ray}>
                <div className={s.row}>
                  <span>
                    R{row.ray} · {t(rayNames[row.ray - 1])}
                  </span>
                  <small>
                    {row.relative > 0 ? "+" : ""}
                    {row.relative}%
                  </small>
                </div>
                <div className={s.bar}>
                  <span style={{ width: row.percent + "%" }} />
                </div>
                <small>
                  {row.relative > 15
                    ? t({ en: "Strong", zh: "较强" })
                    : t({ en: "Moderate", zh: "适中" })}
                </small>
              </div>
            ))}
          </section>
        </>
      )}
      <section className={s.section}>
        <h2>{t({ en: "Aspects", zh: "相位" })}</h2>
        {data.aspects.map((a) => (
          <TransitRow key={a.a + a.b + a.type} transit={a} />
        ))}
      </section>
      {tab === "now" ? (
        <>
          {chart && (
            <section className={s.section}>
              <h2>{t({ en: "Your Transits", zh: "你的行运" })}</h2>
              {data.transits.slice(0, 5).map((a) => (
                <TransitRow key={a.a + a.b + a.type} transit={a} natal />
              ))}
              {data.transits.length > 5 && (
                <details>
                  <summary>
                    {t({ en: "All Transits", zh: "全部行运" })} (+
                    {data.transits.length - 5})
                  </summary>
                  {data.transits.slice(5).map((a) => (
                    <TransitRow key={a.a + a.b + a.type} transit={a} natal />
                  ))}
                </details>
              )}
              {!data.transits.length && (
                <p>
                  {t({
                    en: "No transits within the selected 3° orb.",
                    zh: "当前没有容许度 3° 内的行运相位。",
                  })}
                </p>
              )}
            </section>
          )}
          <section className={s.section}>
            <h2>{t({ en: "Planets", zh: "行星" })}</h2>
            {sky.planets
              .slice()
              .sort((a, b) => a.longitude - b.longitude)
              .map((p) => (
                <div key={p.key} className={s.row}>
                  <button type="button" onClick={() => selectPlanet(p.key)}>
                    {pointSymbols[p.key]} {planetName(p.key, language)}
                  </button>
                  <small>
                    {SIGN_SYMBOLS[p.signIndex]} {p.signDegrees.toFixed(2)}°{" "}
                    {p.retrograde ? "℞" : ""}
                  </small>
                </div>
              ))}
          </section>
        </>
      ) : (
        <section className={s.section}>
          <h2>{t({ en: "Angular Planets", zh: "近轴行星" })}</h2>
          {data.angular.map((p) => (
            <div key={p.key} className={s.row}>
              <span>
                {pointSymbols[p.key]} {planetName(p.key, language)} ·{" "}
                {SIGN_NAMES[language][p.signIndex]}
                <br />
                <small>
                  {p.angle} · {t({ en: "Altitude", zh: "高度角" })}{" "}
                  {p.altitude.toFixed(1)}°
                </small>
              </span>
              <small>{p.angularity}%</small>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export function LifeMomentAndReflection() {
  const { chart, open } = useAnalysis(),
    { language, t } = usePreferences();
  const [moment, setMoment] = useState(""),
    [category, setCategory] = useState("0"),
    [description, setDescription] = useState(""),
    [drafts, setDrafts] = useState<Record<string, string>>({}),
    [message, setMessage] = useState("");
  const day = useDay();
  const categories = [
    { en: "Career & Work", zh: "事业与工作" },
    { en: "Love & Relationships", zh: "爱情与关系" },
    { en: "Family & Home", zh: "家庭与居所" },
    { en: "Travel & Relocation", zh: "旅行与搬迁" },
    { en: "Health & Body", zh: "健康与身体" },
    { en: "Loss & Grief", zh: "失去与哀伤" },
    { en: "Spiritual & Inner Life", zh: "精神与内在生活" },
    { en: "Education & Learning", zh: "教育与学习" },
    { en: "Achievement & Milestone", zh: "成就与里程碑" },
    { en: "Daily Reflection", zh: "日常反思" },
    { en: "Other", zh: "其他" },
  ];
  const key = chart
    ? `stella-reflection:${JSON.stringify(chart.meta.birth)}:${day.toISOString()}:${language}`
    : "";
  const stored = useBrowserText(key),
    reflection = drafts[key] ?? stored;
  const setReflection = (value: string) =>
    setDrafts((old) => ({ ...old, [key]: value }));
  if (!chart) return null;
  return (
    <>
      <section className={s.section}>
        <h2>{t(topicNames["life-moment"])}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open(
              "life-moment",
              JSON.stringify({
                date: moment,
                category: t(categories[Number(category)]),
                description,
              }),
            );
          }}
        >
          <label htmlFor="stella-moment-date">
            {t({ en: "When?", zh: "发生时间" })}
          </label>
          <input
            id="stella-moment-date"
            type="date"
            required
            min="1900-01-01"
            max="2100-12-31"
            value={moment}
            onChange={(e) => setMoment(e.target.value)}
          />
          <label htmlFor="stella-moment-category">
            {t({ en: "What happened?", zh: "发生了什么？" })}
          </label>
          <select
            id="stella-moment-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c, i) => (
              <option key={i} value={i}>
                {t(c)}
              </option>
            ))}
          </select>
          <label htmlFor="stella-moment-description">
            {t({ en: "Your experience", zh: "你的经历" })}
          </label>
          <textarea
            id="stella-moment-description"
            required
            maxLength={1500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className={s.action} type="submit">
            {t({ en: "Explore This Moment", zh: "探索这个时刻" })}
          </button>
        </form>
        <p className={s.muted}>
          {t({
            en: "Explore the sky around an important moment without assuming it caused the event.",
            zh: "探索重要时刻的星象背景，不将它视为事件发生的必然原因。",
          })}
        </p>
      </section>
      <section className={s.section}>
        <h2>{t({ en: "Daily Reflection", zh: "每日反思" })}</h2>
        <p>
          {t({
            en: "Where can I respond with greater awareness today, instead of repeating a familiar reaction?",
            zh: "今天在哪件事上，我可以更有觉察地回应，而不是重复习惯性的反应？",
          })}
        </p>
        <Feedback id={key} />
        <label htmlFor="stella-reflection">
          {t({ en: "Your reflection", zh: "你的思考" })}
        </label>
        <textarea
          id="stella-reflection"
          maxLength={5000}
          value={reflection}
          onChange={(e) => {
            setReflection(e.target.value);
            setMessage("");
          }}
        />
        <button
          className={s.action}
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(key, reflection);
              setMessage(
                t({
                  en: "Saved privately in this browser.",
                  zh: "已私密保存在此浏览器。",
                }),
              );
            } catch {
              setMessage(
                t({
                  en: "Browser storage unavailable.",
                  zh: "当前浏览器无法保存。",
                }),
              );
            }
          }}
        >
          {t({ en: "Save Reflection", zh: "保存反思" })}
        </button>
        {message && <p role="status">{message}</p>}
      </section>
    </>
  );
}
