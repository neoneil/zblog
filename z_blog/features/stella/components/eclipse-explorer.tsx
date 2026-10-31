"use client";

import Link from "next/link";
import { ZodiacLabel } from "./zodiac-constellation";
import { Eclipse } from "lucide-react";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import type { EclipseEvent } from "../lib/explore-calculations";
import { houseThemes } from "./birth-guide";
import {
  ExploreShell,
  Section,
  YearNav,
  TimeText,
  Back,
  styles,
  useExplore,
} from "./explore-shared";

export default function EclipseExplorer({
  year,
  events,
  event,
}: {
  year: number;
  events: EclipseEvent[];
  event?: EclipseEvent;
}) {
  const { t, language } = useExplore();
  const kind = (e: EclipseEvent) =>
    t({
      en: `${e.kind[0].toUpperCase() + e.kind.slice(1)} ${e.body === "solar" ? "Solar" : "Lunar"} Eclipse`,
      zh: `${e.body === "solar" ? "日" : "月"}${({ total: "全食", partial: "偏食", annular: "环食", penumbral: "半影食" } as Record<string, string>)[e.kind] ?? "食"}`,
    });
  if (event) {
    const sign = Math.floor(event.longitude / 30);
    return (
      <ExploreShell
        title={{
          en: `${kind({ ...event })} — ${event.time.slice(0, 10)}`,
          zh: `${event.time.slice(0, 10)} · ${kind({ ...event })}`,
        }}
        description={{
          en: "Astronomical timing, zodiac position and a reflective guide to the eclipse.",
          zh: "日月食的天文时刻、黄道位置与反思指南。",
        }}
      >
        <div className={styles.header}>
          <Eclipse size={64} className="mx-auto" aria-hidden />
          <p>
            <ZodiacLabel sign={sign}>
              {SIGN_SYMBOLS[sign]} {SIGN_NAMES[language][sign]}
            </ZodiacLabel>{" "}
            {(event.longitude % 30).toFixed(2)}°
          </p>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>{t({ en: "Global peak (UTC)", zh: "全球峰值时刻（UTC）" })}</dt>
            <dd>
              <TimeText value={event.time} />
            </dd>
          </div>
          <div>
            <dt>{t({ en: "Type", zh: "类型" })}</dt>
            <dd>{kind(event)}</dd>
          </div>
          <div>
            <dt>{t({ en: "Sign axis", zh: "星座轴线" })}</dt>
            <dd>
              <ZodiacLabel sign={sign} size="compact">
                {SIGN_NAMES[language][sign]}
              </ZodiacLabel>{" "}
              –{" "}
              <ZodiacLabel sign={(sign + 6) % 12} size="compact">
                {SIGN_NAMES[language][(sign + 6) % 12]}
              </ZodiacLabel>
            </dd>
          </div>
          {event.body === "lunar" ? (
            <div>
              <dt>
                {t({
                  en: "Partial / total phase duration",
                  zh: "偏食阶段 / 全食阶段时长",
                })}
              </dt>
              <dd>
                {event.partialMinutes?.toFixed(0)} /{" "}
                {event.totalMinutes?.toFixed(0)} min
              </dd>
            </div>
          ) : null}
        </dl>
        <Section
          title={{ en: "What Is This Eclipse?", zh: "这次食象是什么？" }}
        >
          <p>
            {t(
              event.body === "solar"
                ? {
                    en: "A solar eclipse occurs when the Moon passes between Earth and the Sun. The times here describe the global event; visibility, local contacts and duration depend on location. Never look directly at the Sun without certified solar-viewing protection.",
                    zh: "日食发生于月亮经过地球与太阳之间。本页给出全球事件时刻；当地可见性、接触时刻与持续时间取决于观察地点。没有合格的太阳观测防护时，切勿直视太阳。",
                  }
                : {
                    en: "A lunar eclipse occurs when the Moon passes through Earth's shadow. The partial and total phase durations describe the global event. Whether it can be seen from your location depends on whether the Moon is above your horizon.",
                    zh: "月食发生于月亮经过地球的影子。偏食和全食阶段时长是全球事件数据，所在地是否可见还取决于月亮是否在当地地平线以上。",
                  },
            )}
          </p>
        </Section>
        <Section
          title={{
            en: "How This Eclipse Connects with Your Sign",
            zh: "与十二星座的象征联系",
          }}
        >
          <p className={styles.small}>
            {t({
              en: "Whole-sign solar-house convention; not a personalised natal forecast.",
              zh: "以下采用太阳星座整宫法，不是个人本命行运预测。",
            })}
          </p>
          <div className={styles.grid}>
            {SIGN_NAMES[language].map((name, i) => {
              const house = (sign - i + 12) % 12;
              return (
                <article key={name}>
                  <h3>
                    <ZodiacLabel sign={i}>
                      {SIGN_SYMBOLS[i]} {name} · {house + 1}
                    </ZodiacLabel>
                  </h3>
                  <p>
                    {t({
                      en: `Reflect on ${houseThemes[house].en}. Notice what needs attention or a fresh perspective without assuming a predetermined event.`,
                      zh: `可以围绕${houseThemes[house].zh}反思，留意哪些事情需要关注或新的视角，而非假设必然会发生特定事件。`,
                    })}
                  </p>
                </article>
              );
            })}
          </div>
        </Section>
        <Back
          href={`/stella/eclipse?year=${year}`}
          label={{ en: "All eclipses", zh: "全部日月食" }}
        />
      </ExploreShell>
    );
  }
  return (
    <ExploreShell
      title={{
        en: "Eclipse Calendar & Astrology Guide",
        zh: "日月食日历与指南",
      }}
      description={{
        en: "Calculated solar and lunar eclipses, with peak times and zodiac positions.",
        zh: "通过实际计算查看日食、月食、峰值时刻与黄道位置。",
      }}
    >
      <YearNav slug="eclipse" year={year} />
      <div className={styles.grid}>
        {events.map((e) => {
          const sign = Math.floor(e.longitude / 30);
          return (
            <Link
              key={e.id}
              className={styles.card}
              href={`/stella/eclipse/${e.id}`}
            >
              <div className={styles.row}>
                <Eclipse aria-hidden />
                <h3>{kind(e)}</h3>
              </div>
              <p>
                <ZodiacLabel sign={sign} size="compact">
                  {SIGN_SYMBOLS[sign]} {SIGN_NAMES[language][sign]}
                </ZodiacLabel>{" "}
                {(e.longitude % 30).toFixed(2)}°
              </p>
              <TimeText value={e.time} />
            </Link>
          );
        })}
      </div>
      <Section title={{ en: "What Are Eclipses?", zh: "什么是日月食？" }}>
        <p>
          {t({
            en: "At a solar eclipse, the Moon crosses in front of the Sun. At a lunar eclipse, it passes through Earth's shadow. The orbit of the Moon is tilted, so these alignments do not occur at every new or full moon. Event dates are computed locally with Astronomy Engine, without an external service or database.",
            zh: "日食时月亮从太阳前方经过，月食时月亮进入地球的影子。由于月球轨道倾斜，这些排列并不会在每次新月或满月发生。事件日期使用 Astronomy Engine 在本地计算，无需外部服务或数据库。",
          })}
        </p>
      </Section>
      <Section
        title={{ en: "Observation and Interpretation", zh: "观测与诠释" }}
      >
        <p>
          {t({
            en: "Astronomical timing and astrological interpretation are different things. Timing can be computed; symbolic themes are not verified predictions. Global peak times do not establish local visibility. Solar observation always requires appropriate eye protection.",
            zh: "天文时刻与占星诠释是不同的层次。时刻可以计算，象征主题则不是经过验证的预测。全球峰值时刻并不代表当地一定可见。太阳观测始终需要适当的眼睛防护。",
          })}
        </p>
      </Section>
    </ExploreShell>
  );
}
