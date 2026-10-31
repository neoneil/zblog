"use client";

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
}: {
  year: number;
  snapshot: SkySnapshot;
  periods: RetrogradePeriod[];
  time: string;
  planet?: string;
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
        en: "Current motion and a calculated annual schedule of apparent retrograde periods.",
        zh: "当前运动状态，以及通过实际视运动计算的全年逆行区间。",
      }}
    >
      <YearNav
        slug={planet ? `retrograde/${planet}` : "retrograde"}
        year={year}
      />
      <Section title={{ en: "Current Retrograde Status", zh: "当前逆行状态" }}>
        <p>
          {t({
            en: `${current.filter((p) => p.retrograde).length} of ${current.length} planets are retrograde.`,
            zh: `${current.length} 颗行星中，当前有 ${current.filter((p) => p.retrograde).length} 颗逆行。`,
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
                              ? { en: "Active now", zh: "进行中" }
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
      <Section title={{ en: "What Retrograde Means", zh: "逆行意味着什么" }}>
        <p>
          {t({
            en: "Retrograde occurs when a planet's apparent geocentric longitude decreases. Relative orbital motion creates this perspective; the planet does not reverse its physical orbit. Station times mark the transition between direct and retrograde motion.",
            zh: "当行星的地心视黄经减小时，称为逆行。这来自相对公转运动形成的观察视角，而非行星真的改变公转方向。留点是顺行与逆行之间的转换时刻。",
          })}
        </p>
      </Section>
      <Section
        title={{
          en: planet ? `Working with ${name!.en}` : "Reflection by Planet",
          zh: planet ? `与${name!.zh}主题相处` : "各行星的反思主题",
        }}
      >
        <div className={styles.grid}>
          {(planet ? [planet] : planetKeys).map((key) => (
            <article key={key}>
              <h3>
                {PLANET_SYMBOLS[key]} {t(planetCopy[key].name)}
              </h3>
              <p>
                {t({
                  en: `Review ${planetCopy[key].theme.en}. Revisit unfinished conversations or commitments, check assumptions, and allow time for adjustment. These are reflective prompts, not evidence that particular events must occur.`,
                  zh: `围绕${planetCopy[key].theme.zh}进行回顾。重新讨论未完成的交流或承诺，核对假设，也为调整留出时间。这些是反思提示，并不意味着某件事必然发生。`,
                })}
              </p>
            </article>
          ))}
        </div>
      </Section>
      <FAQ
        items={[
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
      {planet ? (
        <Back
          href="/stella/retrograde"
          label={{ en: "All retrograde planets", zh: "全部逆行行星" }}
        />
      ) : null}
    </ExploreShell>
  );
}
