"use client";
import { ElementLabel } from "./element-label";

import Link from "next/link";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import {
  monthSlugs,
  monthLengths,
  birthdaySlugs,
  parseBirthday,
  signQualities,
  elements,
  modalities,
  rulers,
  planetCopy,
  signSlugs,
} from "../lib/explore-config";
import type { birthdayProfile } from "../lib/explore-calculations";
import { ExploreShell, Section, styles, useExplore } from "./explore-shared";
import { zodiacProfiles } from "../lib/zodiac-profiles";
import { decanReflections, birthdaySoulPractices } from "../lib/birthday-content";
import birthdayStyles from "./birthday.module.css";

export default function BirthdayExplorer({
  slug,
  profile,
}: {
  slug?: string;
  profile?: ReturnType<typeof birthdayProfile>;
}) {
  const { t, language, locale } = useExplore();
  const date = slug ? parseBirthday(slug) : null;
  if (date && profile) {
    const { sign, decan, degree, ruler } = profile,
      index = birthdaySlugs.indexOf(slug!),
      previous =
        birthdaySlugs[
          (index + birthdaySlugs.length - 1) % birthdaySlugs.length
        ],
      next = birthdaySlugs[(index + 1) % birthdaySlugs.length];
    const format = (m: number, d: number) =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2000, m - 1, d)));
    const zodiac = zodiacProfiles[sign];
    const compatibilityGroups = [
      { title: { en: "Best Matches", zh: "最佳配对" }, matches: zodiac.bestMatches.slice(0, 2), description: { en: "Shared elemental themes can make it easier to recognise each other's priorities. Lasting rapport still depends on listening, reliability and how you handle differences.", zh: "共同的元素主题有助于理解彼此重视的事。持久默契仍需要倾听、可靠回应，以及面对差异的方式。" } },
      { title: { en: "Also Compatible", zh: "同样合拍" }, matches: zodiac.bestMatches.slice(2), description: { en: "Complementary qualities can bring stimulating perspectives and different strengths. Make room for each person's pace, and discuss needs instead of assuming a Sun-sign pairing settles compatibility.", zh: "互补品质可以带来新鲜视角与不同优势。给彼此的节奏留出空间，主动讨论需求，不要以太阳星座组合代替真实关系判断。" } },
    ];
    return (
      <ExploreShell
        title={{
          en: `Born on ${monthSlugs[date.month - 1][0].toUpperCase() + monthSlugs[date.month - 1].slice(1)} ${date.day}`,
          zh: `${date.month}月${date.day}日出生`,
        }}
        description={{
          en: "A birthday profile through the Sun's sign, decan and traditional planetary symbolism.",
          zh: "从太阳星座、旬位与传统行星象征，探索生日档案。",
        }}
        subtitle={{
          en: `${SIGN_SYMBOLS[sign]} ${SIGN_NAMES.en[sign]} — ${zodiac.dates.en}`,
          zh: `${SIGN_SYMBOLS[sign]} ${SIGN_NAMES.zh[sign]} — ${zodiac.dates.zh}`,
        }}
      >
        <Section title={{ en: "Your Birthday Profile", zh: "你的生日档案" }}>
          <dl className={styles.facts}>
            <div>
              <dt>{t({ en: "Sun sign", zh: "太阳星座" })}</dt>
              <dd>
                <ZodiacLabel sign={sign} size="compact">
                  {SIGN_NAMES[language][sign]}
                </ZodiacLabel>
              </dd>
            </div>
            <div>
              <dt>{t({ en: "Decanate", zh: "旬位" })}</dt>
              <dd>
                {decan} · {t(planetCopy[ruler].name)}
              </dd>
            </div>
            <div>
              <dt>{t({ en: "Approximate Sun degree", zh: "太阳近似度数" })}</dt>
              <dd>~{degree}°</dd>
            </div>
          </dl>
          <p className={styles.small}>
            {t({
              en: "Birthday profiles use fixed calendar dates and approximate degrees, not a calculated natal Sun position. Actual signs and degrees depend on your birth year, time and time zone. Use the full calculator for precision.",
              zh: "生日档案使用固定日期区间与近似度数，并非本命太阳的天文计算结果。实际星座和度数取决于出生年份、时间和时区，精确结果请使用完整星盘计算器。",
            })}
          </p>
        </Section>
        <Section title={{ en: "Your Personality", zh: "性格探索" }}>
          <p>{t(zodiac.sun)}</p>
          <p>
            {t({
              en: `This solar archetype emphasises ${signQualities[sign].en}. Decan ${decan} adds the symbolism of ${planetCopy[ruler].name.en}: ${planetCopy[ruler].theme.en}. Explore where those themes fit your experience and where they do not.`,
              zh: `这一太阳原型着重于${signQualities[sign].zh}。第 ${decan} 旬增添${planetCopy[ruler].name.zh}的象征：${planetCopy[ruler].theme.zh}。可以观察哪些主题符合你的体验，哪些并不适合。`,
            })}
          </p>
          <p>{t(decanReflections[decan - 1])}</p>
          <p>{t({ en: "Read this as a starting point for self-observation, not a verdict about who you must be. Your experiences, relationships and choices can express the same symbolism in very different ways.", zh: "把这些内容当作自我观察的起点，而非对你必须成为谁的判决。经历、关系与选择，可以让相同象征呈现出截然不同的表达。" })}</p>
        </Section>
        <Section
          sign={sign}
          title={{
            en: `About ${SIGN_NAMES.en[sign]}`,
            zh: `关于${SIGN_NAMES.zh[sign]}`,
          }}
        >
          {zodiac.about.map((paragraph) => <p key={paragraph.en}>{t(paragraph)}</p>)}
          <p>
            <ElementLabel element={elements[sign % 4]} /> · {t(modalities[sign % 3])} ·{" "}
            {t(planetCopy[rulers[sign]].name)}
          </p>
        </Section>
        <Section title={{ en: `${SIGN_NAMES.en[sign]} Strengths & Challenges`, zh: `${SIGN_NAMES.zh[sign]}的优势与成长课题` }}>
          <div className={birthdayStyles.columns}>
            {[
              { title: { en: "Strengths", zh: "优势" }, items: zodiac.strengths },
              { title: { en: "Challenges", zh: "成长课题" }, items: zodiac.challenges },
            ].map((group) => <article className={styles.card} key={group.title.en}>
              <h3>{t(group.title)}</h3>
              <ul className={birthdayStyles.list}>{group.items.map((item) => <li key={item.en}>{t(item)}</li>)}</ul>
            </article>)}
          </div>
          <p>{t(zodiac.lesson)}</p>
        </Section>
        <Section title={{ en: "Compatibility", zh: "星座配对" }}>
          <div className={birthdayStyles.columns}>
            {compatibilityGroups.map((group) => <div key={group.title.en}>
              <h3>{t(group.title)}</h3>
              <p>{t(group.description)}</p>
              <div className={styles.grid}>{group.matches.map((other) => {
              const [a, b] = [sign, other].sort((a, b) => a - b);
              return (
                <Link
                  className={styles.link}
                  key={other}
                  href={`/stella/compatibility/${signSlugs[a]}-${signSlugs[b]}`}
                >
                  {SIGN_SYMBOLS[sign]} & {SIGN_SYMBOLS[other]}{" "}
                  {SIGN_NAMES[language][other]}
                  <ZodiacConstellation sign={other} size="compact" />
                </Link>
              );
              })}</div>
            </div>)}
          </div>
        </Section>
        <Section title={{ en: "Soul Purpose", zh: "灵魂使命" }}>
          <p>{t(zodiac.purpose)}</p>
          <p>{t(birthdaySoulPractices[sign])}</p>
          <h3>{t({ en: "A Practice for Growth", zh: "成长练习" })}</h3>
          <p>{t(zodiac.lesson)}</p>
          <p>{t({ en: "Treat purpose as something you practise, not a destiny assigned by a date. At the end of the week, recall one moment when you used a strength with care, one moment that challenged you and one small adjustment to try next. The spiritual language here invites reflection; it does not define your worth or require a particular belief.", zh: "把使命理解为不断实践的方向，而非出生日期分配的命运。每周结束时，回顾一次善用优势的时刻、一次受到挑战的经历，以及下一步可尝试的小调整。这里的灵性语言邀请反思，不定义你的价值，也不要求接受特定信仰。" })}</p>
        </Section>
        <Section title={{
          en: `About the ${["1st", "2nd", "3rd"][decan - 1]} Decanate of ${SIGN_NAMES.en[sign]}`,
          zh: `关于${SIGN_NAMES.zh[sign]}的第${["一", "二", "三"][decan - 1]}旬`,
        }}>
          <p>{t({
            en: `In the birthday convention used here, the ${["first", "second", "third"][decan - 1]} decanate of ${SIGN_NAMES.en[sign]} has ${planetCopy[ruler].name.en} as its secondary ruler. A zodiac sign spans thirty degrees, divided into three ten-degree sections called decanates. The secondary ruler adds another layer to the Sun-sign interpretation rather than replacing the sign's main ruler: ${planetCopy[ruler].theme.en} offers a further lens on how its central qualities may be expressed.`,
            zh: `按本页生日档案采用的划分，${SIGN_NAMES.zh[sign]}第${["一", "二", "三"][decan - 1]}旬由${planetCopy[ruler].name.zh}担任副守护星。每个星座占三十度，分为三个各十度的区段，称为旬。副守护星是在太阳星座解读中补充一层含义，并不替代星座的主要守护星；${planetCopy[ruler].theme.zh}为核心品质如何表达提供了另一个观察视角。`,
          })}</p>
          <p>{t({
            en: `This date-only profile places the Sun at approximately ${degree}° ${SIGN_NAMES.en[sign]}. It is a calendar approximation, not a calculated position for your birth year. The exact degree, and sometimes the sign or decan near a boundary, can differ with year, birth time and time zone. A complete birth chart can establish the actual solar position and place it alongside your other planets, houses and aspects.`,
            zh: `这一仅依据月日生成的档案，将太阳近似标记在${SIGN_NAMES.zh[sign]} ${degree}°。这是日历估算，不是针对出生年份计算的真实位置。精确度数会随年份、出生时间与时区变化，临近边界时星座或旬位也可能不同。完整出生星盘可以确定实际太阳位置，并结合其他行星、宫位与相位一起理解。`,
          })}</p>
        </Section>
        <Section
          title={{ en: "Explore Your Complete Chart", zh: "探索完整出生星盘" }}
        >
          <p>
            {t({
              en: "A birthday alone does not provide the Moon, Rising sign, houses or the full pattern of planetary aspects. Add a birth year, place and accurate time to see the broader picture.",
              zh: "仅凭生日无法得知准确的月亮、上升、宫位或完整相位。补充出生年份、地点和准确时间，才能看到更完整的图景。",
            })}
          </p>
          <div className={birthdayStyles.ctaRow}><Link className={`${styles.button} ${birthdayStyles.cta}`} href="/stella">
            {t({ en: "Calculate Your Birth Chart", zh: "计算出生星盘" })}
          </Link></div>
        </Section>
        <nav className={styles.nav}>
          <Link href={`/stella/birthday/${previous}`}>
            ←{" "}
            {format(
              parseBirthday(previous)!.month,
              parseBirthday(previous)!.day,
            )}
          </Link>
          <Link href="/stella/birthday">
            {t({ en: "All Birthdays", zh: "全部生日" })}
          </Link>
          <Link href={`/stella/birthday/${next}`}>
            {format(parseBirthday(next)!.month, parseBirthday(next)!.day)} →
          </Link>
        </nav>
      </ExploreShell>
    );
  }
  return (
    <ExploreShell
      title={{ en: "Birthday Horoscope", zh: "生日密码" }}
      description={{
        en: "Explore all 366 birthdays, including February 29, through solar signs and decans.",
        zh: "探索包含 2 月 29 日的全部 366 个生日，了解太阳星座与旬位。",
      }}
    >
      <div className={styles.months}>
        {monthSlugs.map((month, i) => (
          <section key={month}>
            <h2>
              {new Intl.DateTimeFormat(locale, {
                month: "long",
                timeZone: "UTC",
              }).format(new Date(Date.UTC(2000, i, 1)))}
            </h2>
            <div className={styles.dates}>
              {Array.from({ length: monthLengths[i] }, (_, d) => (
                <Link
                  key={d}
                  href={`/stella/birthday/${month}-${d + 1}`}
                  aria-label={`${language === "zh" ? `${i + 1}月` : month} ${d + 1}`}
                >
                  {d + 1}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ExploreShell>
  );
}
