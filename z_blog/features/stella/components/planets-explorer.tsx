"use client";
import { ElementLabel } from "./element-label";

import Link from "next/link";
import planetStyles from "./planets.module.css";
import { planetaryTransits, planetaryDurations } from "../lib/planetary-transits";
import { planetAstrology } from "../lib/planet-astrology";
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
              <table className={`${styles.table} ${planetStyles.ingressTable}`}>
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
                    <tr key={row.time} className={planetStyles.ingressRow}>
                      <td>
                        <TimeText value={row.time} dateOnly />
                      </td>
                      <td>
                        <ZodiacLabel sign={row.sign} size="compact">
                          {SIGN_SYMBOLS[row.sign]}{" "}
                          {SIGN_NAMES[language][row.sign]}
                        </ZodiacLabel>
                      </td>
                      <td>
                        <ElementLabel element={elements[row.sign % 4]} />
                      </td>
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
        {planetAstrology[planet] ? (
          <Section title={{ en: `About ${name.en} in Astrology`, zh: `占星学中的${name.zh}` }}>
            {planetAstrology[planet].map((paragraph) => <p key={paragraph.en}>{t(paragraph)}</p>)}
          </Section>
        ) : null}
        <Section
          title={{
            en: `${name.en} Through the Signs`,
            zh: `${name.zh}经过十二星座`,
          }}
        >
          <div className={planetStyles.signCards}>
            {signQualities.map((_, i) => (
              <article key={i} className={styles.card}>
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
                <span className={planetStyles.motion}>
                  {p.signDegrees.toFixed(2)}° ·{" "}
                  {t(
                    p.retrograde
                      ? { en: "Retrograde", zh: "逆行" }
                      : { en: "Direct", zh: "顺行" },
                  )}
                </span>
              </p>
              <span className={styles.small}>{t(planetCopy[p.key].theme)}</span>
            </Link>
          ))}
      </div>
      <Section
        title={{ en: "Understanding Planetary Transits", zh: "理解行星行运" }}
      >
        {planetaryTransits.map((paragraph) => <p key={paragraph.en}>{t(paragraph)}</p>)}
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
                    en: "Average Time in Each Sign",
                    zh: "每个星座的大致停留时间",
                  })}
                </th>
                <th>{t({ en: "Full Zodiac Cycle", zh: "完整黄道周期" })}</th>
              </tr>
            </thead>
            <tbody>
              {planetaryDurations.map(({ key, stay, cycle }) => (
                <tr key={key}>
                  <th scope="row">
                    {PLANET_SYMBOLS[key]} {t(planetCopy[key].name)}
                  </th>
                  <td>{t(stay)}</td>
                  <td>{t(cycle)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.small}>{t({
          en: "Approximate reference values, not fixed transit durations. The cycle column gives the Moon's sidereal month, the Sun's apparent annual circuit and the planets' orbital periods around the Sun. In particular, Mercury's 88 days and Venus's 225 days are not their geocentric journeys through all twelve signs. Retrograde motion can extend or repeat a sign transit.",
          zh: "以上为近似参考值，并非固定行运时长。周期一栏列出月亮的恒星月、太阳的视周年运动，以及各行星绕太阳的公转周期。尤其是水星的 88 天和金星的 225 天，并不是从地球观察它们经过全部十二星座所需的时间。逆行可能延长或重复某个星座的行运。",
        })}</p>
      </Section>
    </ExploreShell>
  );
}
