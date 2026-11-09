import type { Copy } from "./explore-config";
import {
  calendarPlanetIngresses,
  eclipseYear,
  validateYear,
} from "./explore-calculations";
import { getExploreSkySnapshot, SIGN_NAMES, type SkySnapshot } from "./sky";

export type HoroscopePeriod = "daily" | "monthly" | "yearly";
export interface HoroscopeForecast {
  sections: Array<{ title: Copy; paragraphs: Copy[] }>;
  keyDates: Array<{ date: string; event: Copy }>;
  /** Yearly forecasts contain January then July samples, including repeated planets. */
  transits: Array<{ planet: string; sign: number; house: number }>;
}

function validateSign(sign: number) {
  if (!Number.isInteger(sign) || sign < 0 || sign > 11)
    throw new RangeError("Sign index must be an integer from 0 to 11");
}

/** Whole-sign solar houses, with the selected Sun sign as house one. */
export function solarHouse(sign: number, transitSign: number): number {
  validateSign(sign);
  validateSign(transitSign);
  return ((transitSign - sign + 12) % 12) + 1;
}

const copy = (en: string, zh: string): Copy => ({ en, zh });
// Original reflective prompts, not predictions of inevitable events or source prose.
const themes: Copy[] = [
  copy("identity and personal initiative", "自我定位与主动行动"),
  copy("resources and self-worth", "资源与自我价值"),
  copy("communication and everyday learning", "沟通与日常学习"),
  copy("home and emotional foundations", "家庭与情感根基"),
  copy("creativity, play and romance", "创作、玩乐与浪漫"),
  copy("daily routines and sustainable care", "日常安排与可持续的照顾"),
  copy("partnerships and mutual agreements", "伙伴关系与共同约定"),
  copy("shared resources, trust and boundaries", "共享资源、信任与界限"),
  copy("study, travel and wider perspectives", "进修、旅行与更广阔的视角"),
  copy(
    "career, responsibility and public contribution",
    "事业、责任与公共贡献",
  ),
  copy("friendships, communities and shared hopes", "友谊、社群与共同愿景"),
  copy(
    "rest, privacy and unfinished inner work",
    "休息、私人空间与未完成的内在整理",
  ),
];
export function solarHouseTheme(sign:number,transitSign:number):Copy {
  return themes[solarHouse(sign,transitSign)-1];
}
const planetNames: Record<string, Copy> = {
  sun: copy("Sun", "太阳"),
  moon: copy("Moon", "月亮"),
  mercury: copy("Mercury", "水星"),
  venus: copy("Venus", "金星"),
  mars: copy("Mars", "火星"),
  jupiter: copy("Jupiter", "木星"),
  saturn: copy("Saturn", "土星"),
  uranus: copy("Uranus", "天王星"),
  neptune: copy("Neptune", "海王星"),
  pluto: copy("Pluto", "冥王星"),
};
interface CalendarEntry {
  date: string;
  sign: number;
  label: Copy;
  planet: string;
  eclipse: boolean;
}
const calendars = new Map<number, CalendarEntry[]>();
function yearCalendar(year: number): CalendarEntry[] {
  const hit = calendars.get(year);
  if (hit) return hit;
  const entries: CalendarEntry[] = [];
  for (const [planet, name] of Object.entries(planetNames)) {
    for (const entry of calendarPlanetIngresses(planet, year)) {
      if (new Date(entry.time).getUTCFullYear() !== year) continue;
      entries.push({
        date: entry.time.slice(0, 10),
        sign: entry.sign,
        planet,
        eclipse: false,
        label: copy(
          `${name.en} enters ${SIGN_NAMES.en[entry.sign]}${entry.retrograde ? " (retrograde re-entry)" : ""} (sampled UTC calendar date)`,
          `${name.zh}进入${SIGN_NAMES.zh[entry.sign]}${entry.retrograde ? "（逆行返回）" : ""}（UTC日历采样日期）`,
        ),
      });
    }
  }
  for (const eclipse of eclipseYear(year)) {
    entries.push({
      date: eclipse.time.slice(0, 10),
      sign: Math.floor(eclipse.longitude / 30),
      planet: eclipse.body === "solar" ? "sun" : "moon",
      eclipse: true,
      label: copy(
        `${eclipse.kind} ${eclipse.body} eclipse; peak ${eclipse.time}`,
        `${eclipse.body === "solar" ? "日食" : "月食"}（${({ total: "全食", partial: "偏食", annular: "环食", penumbral: "半影食" } as Record<string, string>)[eclipse.kind] ?? eclipse.kind}）；峰值 ${eclipse.time}`,
      ),
    });
  }
  entries.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.label.en.localeCompare(b.label.en),
  );
  // Sign-independent calendar work is shared; retain at most eight years.
  if (calendars.size >= 8) calendars.delete(calendars.keys().next().value!);
  calendars.set(year, entries);
  return entries;
}

const majorPlanets = new Set([
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
]);
function usefulDate(
  entry: CalendarEntry,
  sign: number,
  period: HoroscopePeriod,
): boolean {
  if (entry.eclipse) return true;
  if (period === "yearly")
    return (
      entry.planet !== "moon" &&
      (entry.sign === sign || majorPlanets.has(entry.planet))
    );
  return entry.planet === "sun" || entry.sign === sign;
}

function forecastSections(
  sign: number,
  period: HoroscopePeriod,
  skies: SkySnapshot[],
  year: number,
): HoroscopeForecast["sections"] {
  const context = (key: string, index = 0) => {
    const planet = skies[index].planets.find((p) => p.key === key)!;
    const house = solarHouse(sign, planet.signIndex);
    return {
      planet,
      house,
      theme: themes[house - 1],
      placement: copy(
        `${planetNames[key].en} in ${SIGN_NAMES.en[planet.signIndex]} (solar house ${house})`,
        `${planetNames[key].zh}位于${SIGN_NAMES.zh[planet.signIndex]}（太阳第${house}宫）`,
      ),
    };
  };
  const section = (en: string, zh: string, paragraphs: Copy[]) => ({
    title: copy(en, zh),
    paragraphs,
  });
  const overview = (index: number) => {
    const placements = ["jupiter", "saturn", "venus", "mars"].map(
      (key) => context(key, index).placement,
    );
    return copy(
      `${placements.map((p) => p.en).join("; ")}. Read these as different priorities to balance, rather than a single promise about what will happen.`,
      `${placements.map((p) => p.zh).join("；")}。这些位置提示需要平衡的不同重点，并不意味着某件事必然发生。`,
    );
  };
  const love = (index: number) => {
    const v = context("venus", index);
    return copy(
      `${v.placement.en} brings ${v.theme.en} into the conversation about closeness. Offer a specific gesture of care, then ask what the other person actually needs. Shared preferences matter more than performing an ideal relationship.${v.planet.retrograde ? " Revisit an old expectation before making a new agreement." : " Leave space for a different answer from your own."}`,
      `${v.placement.zh}，让${v.theme.zh}成为亲密关系中的话题。尝试一个具体的关心举动，再询问对方真正需要什么。共同的意愿比扮演理想关系更重要。${v.planet.retrograde ? "达成新约定前，先重新审视旧期待。" : "也为不同于自己的回答留出空间。"}`,
    );
  };
  const career = (index: number) => {
    const s = context("saturn", index),
      m = context("mars", index);
    return copy(
      `${s.placement.en} asks for reliable foundations in ${s.theme.en}, while ${m.placement.en} directs effort toward ${m.theme.en}. Separate the responsibility you must sustain from the task you can finish next. Set a clear scope before accelerating; visible progress need not mean taking on everything.`,
      `${s.placement.zh}，提醒你在${s.theme.zh}方面打好可靠的基础；${m.placement.zh}，则把行动重点带向${m.theme.zh}。区分需要长期承担的责任与眼前可以完成的任务。加速前先明确范围，进展并不等于包揽一切。`,
    );
  };
  const growth = (index: number) => {
    const j = context("jupiter", index);
    return copy(
      `${j.placement.en} opens a reflective focus on ${j.theme.en}. Try one unfamiliar approach, gather feedback, and keep what genuinely expands your understanding. Opportunity is useful when your time and resources can support it, not merely when the idea sounds bigger.`,
      `${j.placement.zh}，为${j.theme.zh}带来值得探索的方向。尝试一种不熟悉的方法，收集反馈，留下真正拓宽理解的部分。机会的价值在于时间与资源能够支持它，而不只是听起来宏大。`,
    );
  };
  if (period === "daily") {
    const moon = context("moon"),
      sun = context("sun");
    return [
      section("Today's Energy", "今日能量", [
        copy(
          `The Moon in ${SIGN_NAMES.en[moon.planet.signIndex]} (solar house ${moon.house}, ${moon.planet.signDegrees.toFixed(1)} degrees) draws attention to ${moon.theme.en}. The Sun in ${SIGN_NAMES.en[sun.planet.signIndex]} (solar house ${sun.house}) keeps ${sun.theme.en} in view. Give the immediate feeling a name, then choose one small action that serves the larger priority. You do not have to resolve both at once.`,
          `月亮位于${SIGN_NAMES.zh[moon.planet.signIndex]}（太阳第${moon.house}宫，${moon.planet.signDegrees.toFixed(1)}度），让你更容易留意${moon.theme.zh}；太阳位于${SIGN_NAMES.zh[sun.planet.signIndex]}（太阳第${sun.house}宫），则把${sun.theme.zh}保留为较长远的重点。先辨认眼前的感受，再选择一个服务于长期方向的小行动，不必一次解决所有事情。`,
        ),
      ]),
    ];
  }
  if (period === "monthly") {
    const s = context("saturn");
    return [
      section("Overview", "本月概览", [overview(0)]),
      section("Love & Relationships", "爱情与关系", [love(0)]),
      section("Career & Ambition", "事业与抱负", [career(0)]),
      section("Personal Growth", "个人成长", [growth(0)]),
      section("This Month's Challenge", "本月挑战", [
        copy(
          `${s.placement.en} makes ${s.theme.en} a place to examine your limits. Notice where duty has turned into an automatic yes. Replace one vague obligation with a practical boundary and a review date; consistency can be kinder than overextending yourself.${s.planet.retrograde ? " An unfinished commitment may deserve revision rather than more force." : " Start with a commitment small enough to keep."}`,
          `${s.placement.zh}，让${s.theme.zh}成为检查自身限度的领域。留意哪些责任已变成习惯性的答应。把一项模糊义务换成实际的界限与复盘日期，稳定履行往往比勉强承担更有帮助。${s.planet.retrograde ? "未完成的承诺也许需要修订，而不是继续硬撑。" : "先从能够兑现的小承诺开始。"}`,
        ),
      ]),
    ];
  }
  const half = (paragraph: Copy, index: number) =>
    copy(
      `${index === 0 ? "January-June" : "July-December"} focus (based on the ${index === 0 ? "January" : "July"} 1 sky): ${paragraph.en}`,
      `${index === 0 ? "一至六月" : "七至十二月"}的参考重点（依据${index === 0 ? "一" : "七"}月一日天象）：${paragraph.zh}`,
    );
  const saturn = skies.map((_, index) => {
    const s = context("saturn", index);
    return half(
      copy(
        `${s.placement.en} puts the long practice of ${s.theme.en} in perspective. Decide what deserves a durable structure and what is only an inherited expectation. A realistic routine and a clearly stated limit can support the same goal.`,
        `${s.placement.zh}，让你从长期角度看待${s.theme.zh}。辨认哪些事情值得建立稳定结构，哪些只是沿袭的期待。务实的习惯与明确的界限可以共同支持一个目标。`,
      ),
      index,
    );
  });
  const eclipses = eclipseYear(year).map((event) => {
    const house = solarHouse(sign, Math.floor(event.longitude / 30)),
      theme = themes[house - 1];
    return copy(
      `The ${event.body} eclipse on ${event.time.slice(0, 10)} reaches solar house ${house}, highlighting ${theme.en}. Use this seasonal checkpoint to reconsider an assumption, not as a deadline for a dramatic decision.`,
      `${event.time.slice(0, 10)}的${event.body === "solar" ? "日食" : "月食"}落在太阳第${house}宫，提示关注${theme.zh}。把这个季节节点当作重新审视想法的机会，不必将它当作重大决定的期限。`,
    );
  });
  return [
    section(
      "Overview",
      "年度概览",
      skies.map((_, index) => half(overview(index), index)),
    ),
    section(
      "Jupiter in Your Houses",
      "木星与你的宫位",
      skies.map((_, index) => half(growth(index), index)),
    ),
    section("Saturn in Your House", "土星与你的宫位", saturn),
    section(
      "Eclipse Season",
      "食相季",
      eclipses.length
        ? eclipses
        : [
            copy(
              "No eclipses fall within this UTC calendar year.",
              "这个UTC日历年内没有食相。",
            ),
          ],
    ),
    section(
      "Love",
      "爱情",
      skies.map((_, index) => half(love(index), index)),
    ),
    section(
      "Career",
      "事业",
      skies.map((_, index) => half(career(index), index)),
    ),
  ];
}

/**
 * Database-free tropical solar-house interpretation, not a natal chart or a
 * reproduction of any source's hidden forecast algorithm. All boundaries are UTC.
 * Daily/monthly: supplied date at UTC noon; yearly: Jan/Jul 1 UTC noon.
 * Monthly current-day sampling is inferred from the source's public real-time
 * description and October 31, 2026 placements, not a proven hidden-rule match.
 * Supported years follow the shared calendar engine (1900 through 2100).
 */
export function getHoroscopeForecast(
  sign: number,
  period: HoroscopePeriod,
  date: Date,
): HoroscopeForecast {
  validateSign(sign);
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new RangeError("A valid Date is required");
  if (!["daily", "monthly", "yearly"].includes(period))
    throw new RangeError("Invalid horoscope period");
  const year = date.getUTCFullYear(),
    month = date.getUTCMonth();
  validateYear(year);
  const start =
    period === "yearly"
      ? Date.UTC(year, 0, 1)
      : period === "monthly"
        ? Date.UTC(year, month, 1)
        : Date.UTC(year, month, date.getUTCDate());
  const end =
    period === "yearly"
      ? Date.UTC(year + 1, 0, 1)
      : period === "monthly"
        ? Date.UTC(year, month + 1, 1)
        : start + 86400000;
  const samples =
    period === "yearly"
      ? [Date.UTC(year, 0, 1, 12), Date.UTC(year, 6, 1, 12)]
      : [Date.UTC(year, month, date.getUTCDate(), 12)];
  const snapshots = samples.map((time) =>
    getExploreSkySnapshot(new Date(time)),
  );
  const transits = snapshots.flatMap((sky) =>
    sky.planets.map((planet) => ({
      planet: planet.key,
      sign: planet.signIndex,
      house: solarHouse(sign, planet.signIndex),
    })),
  );
  const sections = forecastSections(sign, period, snapshots, year);
  const first = new Date(start).toISOString().slice(0, 10),
    last = new Date(end).toISOString().slice(0, 10);
  const keyDates = yearCalendar(year)
    .filter(
      (entry) =>
        entry.date >= first &&
        entry.date < last &&
        usefulDate(entry, sign, period),
    )
    .map((entry) => {
      const house = solarHouse(sign, entry.sign),
        theme = themes[house - 1];
      return {
        date: entry.date,
        event: copy(
          `${entry.label.en}; solar house ${house}: ${theme.en}.`,
          `${entry.label.zh}；太阳第${house}宫：${theme.zh}。`,
        ),
      };
    });
  return { sections, keyDates, transits };
}
