"use client";

import { useState } from "react";
import { ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import { planetCopy } from "../lib/explore-config";
import type { VoidPeriod } from "../lib/explore-calculations";
import {
  ExploreShell,
  Section,
  MonthNav,
  TimeText,
  FAQ,
  styles,
  useExplore,
} from "./explore-shared";

export default function VoidExplorer({
  year,
  month,
  periods,
  time,
}: {
  year: number;
  month: number;
  periods: VoidPeriod[];
  time: string;
}) {
  const { language, t } = useExplore();
  const [zone, setZone] = useState("UTC");
  const active = periods.find((p) => p.start <= time && time < p.end),
    next = periods.find((p) => p.start > time);
  return (
    <ExploreShell
      title={{
        en: `Void of Course Moon — ${year}-${String(month).padStart(2, "0")}`,
        zh: `月亮空亡 · ${year}年${month}月`,
      }}
      description={{
        en: "A calendar view of the Moon's last major aspect window before its next sign ingress.",
        zh: "查看月亮换座之前最后一个主要相位窗口后的日历区间。",
      }}
    >
      <MonthNav slug="void-of-course-moon" year={year} month={month} />
      <label className={styles.field}>
        {t({ en: "Display time zone", zh: "显示时区" })}
        <select value={zone} onChange={(e) => setZone(e.target.value)}>
          {[
            "UTC",
            "Asia/Shanghai",
            "Australia/Sydney",
            "America/New_York",
            "Europe/London",
          ].map((z) => (
            <option key={z}>{z}</option>
          ))}
        </select>
      </label>
      <div className={styles.banner}>
        <strong>
          {t(
            active
              ? { en: "The Moon is void of course", zh: "月亮当前处于空亡" }
              : {
                  en: "No active VOC interval in this month right now",
                  zh: "本月当前没有正在发生的空亡区间",
                },
          )}
        </strong>
        {active ? (
          <p>
            {t({ en: "Ends", zh: "结束于" })}{" "}
            <TimeText value={active.end} zone={zone} />
          </p>
        ) : next ? (
          <p>
            {t({ en: "Next interval in this month", zh: "本月下一个区间" })}:{" "}
            <TimeText value={next.start} zone={zone} />
          </p>
        ) : null}
      </div>
      <Section title={{ en: "Void of Course Periods", zh: "月亮空亡时间表" }}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {[
                  { en: "VOC begins", zh: "空亡开始" },
                  { en: "VOC ends", zh: "空亡结束" },
                  { en: "Sign", zh: "星座" },
                  { en: "Duration", zh: "持续时间" },
                  { en: "Last aspect", zh: "最后相位" },
                  { en: "Status", zh: "状态" },
                ].map((c) => (
                  <th scope="col" key={c.en}>
                    {t(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => {
                const duration = Math.round(
                    (Date.parse(p.end) - Date.parse(p.start)) / 60000,
                  ),
                  isActive = p.start <= time && time < p.end;
                return (
                  <tr key={p.end}>
                    <td>
                      <TimeText value={p.start} zone={zone} />
                    </td>
                    <td>
                      <TimeText value={p.end} zone={zone} />
                    </td>
                    <td>
                      <ZodiacLabel sign={p.sign} size="compact">
                        {SIGN_SYMBOLS[p.sign]} {SIGN_NAMES[language][p.sign]}
                      </ZodiacLabel>
                    </td>
                    <td>
                      {Math.floor(duration / 60)}h {duration % 60}m
                    </td>
                    <td>
                      {p.lastPlanet
                        ? `${t(planetCopy[p.lastPlanet].name)} · ${p.angle}°`
                        : t({
                            en: "Whole sign; no exact aspect",
                            zh: "整个星座内无精确相位",
                          })}
                    </td>
                    <td className={isActive ? styles.active : styles.muted}>
                      {t(
                        isActive
                          ? { en: "Active now", zh: "进行中" }
                          : p.start > time
                            ? { en: "Upcoming", zh: "即将到来" }
                            : { en: "Past", zh: "已结束" },
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
      <Section
        title={{
          en: "How These Windows Are Calculated",
          zh: "这些区间如何计算",
        }}
      >
        <p>
          {t({
            en: "The calendar includes five major aspects to the Sun and eight other planets. Sign changes are sampled hourly; we scan backward in half-hour steps for the final aspect window within 1 degree. These are calendar estimates, not exact aspect times. This month's table includes intervals ending within the month.",
            zh: "日历纳入月亮与太阳及另外八颗行星的五种主要相位。换座按小时取样，再以半小时步长向前回查最后一个 1 度以内的相位窗口。因此这些是日历估算值，而非精确相位时刻。本月表格收录在本月结束的区间。",
          })}
        </p>
      </Section>
      <Section
        title={{ en: "Using a Quiet Interval", zh: "如何度过安静的间隙" }}
      >
        <div className={styles.grid}>
          <article>
            <h3>{t({ en: "Rest and review", zh: "休息与回顾" })}</h3>
            <p>
              {t({
                en: "Use the interval for familiar routines, finishing an existing task, journaling or rest. Notice what feels complete before deciding what comes next.",
                zh: "可以安排熟悉的日常、完成已有任务、记录感受或休息。决定下一步之前，先留意什么已经完成。",
              })}
            </p>
          </article>
          <article>
            <h3>{t({ en: "Keep perspective", zh: "保持理性" })}</h3>
            <p>
              {t({
                en: "Traditional caution about new beginnings is symbolic guidance, not a proven causal effect. Do not delay urgent care or important responsibilities because of a lunar calendar.",
                zh: "传统上对新开始的谨慎态度属于象征性指导，并非已证实的因果效应。不要因为月历而延误紧急照护或重要责任。",
              })}
            </p>
          </article>
        </div>
      </Section>
      <FAQ
        items={[
          {
            question: {
              en: "Why do times vary between calendars?",
              zh: "为什么不同日历的空亡时间不同？",
            },
            answer: {
              en: "Some use only traditional visible planets; others include Uranus, Neptune and Pluto. Exact-aspect rules and time zones also matter. This page states its convention explicitly.",
              zh: "有的只使用传统可见行星，有的纳入天王星、海王星和冥王星。精确相位规则与时区也会影响显示。本页明确采用上述计算约定。",
            },
          },
        ]}
      />
    </ExploreShell>
  );
}
