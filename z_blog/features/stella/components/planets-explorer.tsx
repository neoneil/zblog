"use client";

import Link from "next/link";
import { ZodiacLabel } from "./zodiac-constellation";
import {
  SIGN_NAMES,
  SIGN_SYMBOLS,
  PLANET_SYMBOLS,
  type SkySnapshot,
} from "../lib/sky";
import {
  planetKeys,
  planetCopy,
  elements,
  signQualities,
} from "../lib/explore-config";
import type { Ingress } from "../lib/explore-calculations";
import {
  ExploreShell,
  Section,
  YearNav,
  TimeText,
  Back,
  styles,
  useExplore,
} from "./explore-shared";

export default function PlanetsExplorer({
  snapshot,
  planet,
  year,
  ingresses = [],
  ingressRange,
}: {
  snapshot: SkySnapshot;
  planet?: string;
  year: number;
  ingresses?: Ingress[];
  ingressRange?: { startYear: number; endYear: number };
}) {
  const { language, t } = useExplore();
  const current = planet
    ? snapshot.planets.find((p) => p.key === planet)
    : null;
  const meaning = (key: string, i: number) =>
    t({
      en: `${planetCopy[key].name.en} brings the themes of ${planetCopy[key].theme.en} into contact with ${signQualities[i].en}. Consider how that combination appears in your circumstances; the house and natal aspects provide the personal context.`,
      zh: `${planetCopy[key].name.zh}将${planetCopy[key].theme.zh}的主题，与${signQualities[i].zh}联系起来。可以结合真实处境观察这种组合，个人背景还需要宫位和本命相位来补充。`,
    });
  if (planet && current) {
    const name = planetCopy[planet].name;
    const { startYear, endYear } = ingressRange ?? {
      startYear: year - 1,
      endYear: year + 1,
    };
    return (
      <ExploreShell
        title={{
          en: `${PLANET_SYMBOLS[planet]} ${name.en} in Signs — Transit Dates & Meanings`,
          zh: `${PLANET_SYMBOLS[planet]} ${name.zh}落座：换座时间与含义`,
        }}
        description={{
          en: `Calendar sign changes from ${startYear} to ${endYear}, calculated from daily geocentric positions.`,
          zh: `根据每日地心位置计算 ${startYear} 至 ${endYear} 年的日历换座事件。`,
        }}
      >
        <Section
          sign={current.signIndex}
          title={{
            en: `${name.en} in ${SIGN_NAMES.en[current.signIndex]} Right Now`,
            zh: `当前${name.zh}位于${SIGN_NAMES.zh[current.signIndex]}`,
          }}
        >
          <p>
            {current.signDegrees.toFixed(2)}° ·{" "}
            {t(
              current.retrograde
                ? { en: "Retrograde", zh: "逆行" }
                : { en: "Direct", zh: "顺行" },
            )}
          </p>
          <p>{meaning(planet, current.signIndex)}</p>
        </Section>
        <Section title={{ en: "Sign Changes", zh: "换座时间表" }}>
          <YearNav slug={`planets/${planet}`} year={year} />
          {ingresses.length ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {[
                      { en: "Date (UTC)", zh: "日期（UTC）" },
                      { en: "Enters sign", zh: "进入星座" },
                      { en: "Element", zh: "元素" },
                      { en: "Motion", zh: "运动" },
                    ].map((c) => (
                      <th key={c.en} scope="col">
                        {t(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ingresses.map((row) => (
                    <tr key={row.time}>
                      <td>
                        <TimeText value={row.time} dateOnly />
                      </td>
                      <td>
                        <ZodiacLabel sign={row.sign} size="compact">
                          {SIGN_SYMBOLS[row.sign]}{" "}
                          {SIGN_NAMES[language][row.sign]}
                        </ZodiacLabel>
                      </td>
                      <td>{t(elements[row.sign % 4])}</td>
                      <td>
                        {t(
                          row.retrograde
                            ? { en: "Retrograde ingress", zh: "逆行换座" }
                            : { en: "Direct", zh: "顺行" },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>
              {t({
                en: "No sign changes within this three-year interval.",
                zh: "这三年区间内没有换座事件。",
              })}
            </p>
          )}
        </Section>
        <Section
          title={{
            en: `${name.en} Through the Signs`,
            zh: `${name.zh}经过十二星座`,
          }}
        >
          <div className={styles.grid}>
            {signQualities.map((_, i) => (
              <article key={i}>
                <h3>
                  <ZodiacLabel sign={i}>
                    {SIGN_SYMBOLS[i]} {SIGN_NAMES[language][i]}
                  </ZodiacLabel>{" "}
                  {i === current.signIndex ? (
                    <span className={styles.badge}>
                      {t({ en: "CURRENT", zh: "当前" })}
                    </span>
                  ) : null}
                </h3>
                <p>{meaning(planet, i)}</p>
              </article>
            ))}
          </div>
        </Section>
        <Back
          href="/stella/planets"
          label={{ en: "All planets", zh: "全部行星" }}
        />
      </ExploreShell>
    );
  }
  return (
    <ExploreShell
      title={{
        en: "Planets in Signs — Where Are the Planets Today?",
        zh: "行星落座：今天行星在哪里？",
      }}
      description={{
        en: "Follow each planet through the zodiac and explore its transit dates and interpretations.",
        zh: "跟随行星经过黄道十二星座，查看换座日期与相关诠释。",
      }}
    >
      <div className={styles.grid}>
        {snapshot.planets
          .filter((p) => planetKeys.includes(p.key))
          .map((p) => (
            <Link
              key={p.key}
              href={`/stella/planets/${p.key}`}
              className={styles.card}
            >
              <h3>
                {PLANET_SYMBOLS[p.key]} {t(planetCopy[p.key].name)}
              </h3>
              <p>
                <ZodiacLabel sign={p.signIndex} size="compact">
                  {SIGN_SYMBOLS[p.signIndex]}{" "}
                  {SIGN_NAMES[language][p.signIndex]}
                </ZodiacLabel>{" "}
                {p.signDegrees.toFixed(2)}° ·{" "}
                {t(
                  p.retrograde
                    ? { en: "Retrograde", zh: "逆行" }
                    : { en: "Direct", zh: "顺行" },
                )}
              </p>
              <span className={styles.small}>{t(planetCopy[p.key].theme)}</span>
            </Link>
          ))}
      </div>
      <Section
        title={{ en: "Understanding Planetary Transits", zh: "理解行星行运" }}
      >
        <p>
          {t({
            en: "A sign transit is the time a planet spends in one 30-degree sector of the tropical zodiac. Retrograde motion can take it back across a boundary, producing repeated entries. Inner planets describe faster-changing themes; outer planets describe longer collective cycles.",
            zh: "落座行运是行星在回归黄道一个 30 度区间内运行的过程。逆行可能让它重新越过边界，因此会出现多次进入。内行星对应较快变化的主题，外行星对应更长的集体周期。",
          })}
        </p>
      </Section>
      <Section
        title={{
          en: "How Long Each Planet Stays in a Sign",
          zh: "各行星停留时间",
        }}
      >
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t({ en: "Planet", zh: "行星" })}</th>
                <th>
                  {t({
                    en: "Approximate time per sign",
                    zh: "每个星座的大致停留时间",
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(planetCopy).map(([key, value]) => (
                <tr key={key}>
                  <th scope="row">
                    {PLANET_SYMBOLS[key]} {t(value.name)}
                  </th>
                  <td>{value.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </ExploreShell>
  );
}
