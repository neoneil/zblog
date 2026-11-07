"use client";
import { retrogradeFaq } from "../lib/faq-content";
import { retrogradeMeaning } from "../lib/retrograde-meaning";
import { retrogradeGuides } from "../lib/retrograde-guides";
import PlanetRetrogradeGuide from "./planet-retrograde-guide";
import guideStyles from "./retrograde.module.css";
import { ArrowUpRight } from "lucide-react";

import Link from "next/link";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";
import {
  SIGN_NAMES,
  SIGN_SYMBOLS,
  PLANET_SYMBOLS,
  type SkySnapshot,
} from "../lib/sky";
import { planetKeys, planetCopy } from "../lib/explore-config";
import type { RetrogradePeriod } from "../lib/explore-calculations";
import {
  ExploreShell,
  Section,
  YearNav,
  TimeText,
  Back,
  FAQ,
  styles,
  useExplore,
} from "./explore-shared";

export default function RetrogradeExplorer({
  year,
  snapshot,
  periods,
  time,
  planet,
  isCurrentTime = true,
}: {
  year: number;
  snapshot: SkySnapshot;
  periods: RetrogradePeriod[];
  time: string;
  planet?: string;
  isCurrentTime?: boolean;
}) {
  const { t, language } = useExplore(),
    now = Date.parse(time),
    current = snapshot.planets.filter((p) =>
      planet ? p.key === planet : planetKeys.includes(p.key),
    );
  const name = planet ? planetCopy[planet].name : null;
  return (
    <ExploreShell
      title={{
        en: planet
          ? `${name!.en} Retrograde — ${year}`
          : `Retrograde Planets ${year}`,
        zh: planet ? `${name!.zh}逆行 · ${year}` : `行星逆行 · ${year}`,
      }}
      description={{
        en: "Planetary motion at the displayed reference time and the selected year's retrograde schedule.",
        zh: "查看显示参考时刻的行星运动状态，以及所选年份的逆行日历。",
      }}
    >
      <YearNav
        slug={planet ? `retrograde/${planet}` : "retrograde"}
        year={year}
      />
      <Section title={isCurrentTime ? { en: "Current Retrograde Status", zh: "当前逆行状态" } : { en: `Retrograde Status — ${year} Reference Date`, zh: `${year} 年参考日期的逆行状态` }}>
        {!isCurrentTime && <p className={styles.small}>{t({ en: "Historical and future years use the same UTC month and day as today in the selected year; a leap day is clamped to the last valid day. Schedule statuses are relative to this reference time.", zh: "历史或未来年份采用所选年中与今天相同的 UTC 月日，闰日取当月最后一个有效日期。下方日历状态也以此参考时刻为准。" })}</p>}
        <p>
          {t({
            en: `${current.filter((p) => p.retrograde).length} of ${current.length} planets are retrograde.`,
            zh: `${current.length} 颗行星中，该参考时刻有 ${current.filter((p) => p.retrograde).length} 颗逆行。`,
          })}{" "}
          <TimeText value={time} />
        </p>
        <div className={styles.grid}>
          {current.map((p) => (
            <article key={p.key} className={styles.card}>
              <h3>
                {PLANET_SYMBOLS[p.key]} {t(planetCopy[p.key].name)}
              </h3>
              <span
                className={`${styles.badge} ${p.retrograde ? styles.retro : styles.active}`}
              >
                {t(
                  p.retrograde
                    ? { en: "RETROGRADE", zh: "逆行" }
                    : { en: "DIRECT", zh: "顺行" },
                )}
              </span>
              <p>
                <ZodiacLabel sign={p.signIndex} size="compact">
                  {SIGN_SYMBOLS[p.signIndex]}{" "}
                  {SIGN_NAMES[language][p.signIndex]}
                </ZodiacLabel>{" "}
                {p.signDegrees.toFixed(2)}°
              </p>
              {!planet ? (
                <Link
                  className={styles.muted}
                  href={`/stella/retrograde/${p.key}?year=${year}`}
                >
                  {t({ en: "Learn more", zh: "了解详情" })} →
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </Section>
      <Section
        title={{
          en: `${year} Retrograde Schedule`,
          zh: `${year} 年逆行时间表`,
        }}
      >
        <p className={styles.small}>
          {t({
            en: "Calendar dates use daily UTC position samples, not exact station times. Clipped periods continue across the year boundary.",
            zh: "日历日期采用 UTC 每日位置取样，并非精确留点时刻。跨年区间会标明在年初之前开始或在年末之后继续。",
          })}
        </p>
        {periods.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {[
                    { en: "Planet", zh: "行星" },
                    { en: "Retrograde begins", zh: "逆行开始" },
                    { en: "Retrograde ends", zh: "逆行结束" },
                    { en: "Signs", zh: "星座" },
                    { en: "Constellation", zh: "星座图" },
                    { en: "Status", zh: "状态" },
                  ].map((item) => (
                    <th
                      key={item.en}
                      scope="col"
                      className={
                        item.en === "Constellation"
                          ? styles.constellationColumn
                          : undefined
                      }
                    >
                      {t(item)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => {
                  const active =
                    Date.parse(p.start) <= now && now < Date.parse(p.end);
                  return (
                    <tr key={`${p.planet}-${p.start}`}>
                      <th scope="row">
                        {PLANET_SYMBOLS[p.planet]}{" "}
                        {t(planetCopy[p.planet].name)}
                      </th>
                      <td>
                        {p.clippedStart
                          ? `${t({ en: "Before", zh: "早于" })} `
                          : ""}
                        <TimeText value={p.start} dateOnly />
                      </td>
                      <td>
                        {p.clippedEnd
                          ? `${t({ en: "After", zh: "晚于" })} `
                          : ""}
                        <TimeText
                          value={
                            p.clippedEnd
                              ? new Date(
                                  Date.parse(p.end) - 86400000,
                                ).toISOString()
                              : p.end
                          }
                          dateOnly
                        />
                      </td>
                      <td>
                        {SIGN_NAMES[language][p.startSign]}
                        {p.endSign !== p.startSign
                          ? ` → ${SIGN_NAMES[language][p.endSign]}`
                          : ""}
                      </td>
                      <td className={styles.constellationColumn}>
                        <div className={styles.constellationRow}>
                          <ZodiacConstellation
                            sign={p.startSign}
                            size="table"
                          />
                          {p.endSign !== p.startSign ? (
                            <ZodiacConstellation
                              sign={p.endSign}
                              size="table"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${active ? styles.active : ""}`}
                        >
                          {t(
                            active
                          ? { en: isCurrentTime ? "Active now" : "Active at reference time", zh: isCurrentTime ? "进行中" : "参考时刻进行中" }
                              : Date.parse(p.start) > now
                                ? { en: "Upcoming", zh: "即将到来" }
                                : { en: "Complete", zh: "已结束" },
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            {t({
              en: "No retrograde periods for this planet in the selected year.",
              zh: "所选年份这颗行星没有逆行区间。",
            })}
          </p>
        )}
      </Section>
      {planet ? <PlanetRetrogradeGuide planet={planet} position={current[0]} time={time} year={year} /> : <>
      <Section title={{ en: "What Retrograde Means", zh: "逆行意味着什么" }}>
        {retrogradeMeaning.map((paragraph, index) => <p key={index}>{t(paragraph)}</p>)}
      </Section>
      <Section
        title={{
          en: "How Each Planet's Retrograde Affects You",
          zh: "各行星逆行如何影响你",
        }}
      >
        <div className={guideStyles.cards}>
          {planetKeys.map((key) => (
            <article key={key} className={guideStyles.card}>
              <h3>
                <span className={guideStyles.symbol} aria-hidden="true">{PLANET_SYMBOLS[key]}</span> {t({ en: `${planetCopy[key].name.en} Retrograde`, zh: `${planetCopy[key].name.zh}逆行` })}
              </h3>
              <p>
                {t(retrogradeGuides[key].summary)}
              </p>
              <Link href={`/stella/retrograde/${key}?year=${year}`}>{t({ en: `Full ${planetCopy[key].name.en} Retrograde Guide`, zh: `${planetCopy[key].name.zh}逆行完整指南` })}<ArrowUpRight size={16} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </Section>
      <FAQ
        items={[
          ...retrogradeFaq,
          {
            question: {
              en: "How are the dates calculated?",
              zh: "逆行日期如何计算？",
            },
            answer: {
              en: "We compare apparent geocentric longitude at consecutive UTC midnights. A change in daily motion marks the calendar start or end. This date-only convention can differ from the instant of an exact station.",
              zh: "比较相邻两个 UTC 午夜的地心视黄经，以每日运动方向的变化标记开始或结束日期。这种日历约定可能与精确留点所在时刻不同。",
            },
          },
        ]}
      />
      </>}
      {planet ? (
        <Back
          href="/stella/retrograde"
          label={{ en: "All retrograde planets", zh: "全部逆行行星" }}
        />
      ) : null}
    </ExploreShell>
  );
}
