import {
  Body,
  Ecliptic,
  Equator,
  GeoVector,
  Horizon,
  Observer,
  SearchMoonPhase,
  SearchRiseSet,
  SearchSunLongitude,
  SiderealTime,
} from "astronomy-engine";
import type {
  BirthForm,
  ChartPointJson,
  OpenAIChartJson,
} from "@/lib/astrology/natal-chart";
import { getSkySnapshot, SIGN_NAMES, type SkySnapshot } from "./sky";
import type { Copy } from "./explore-config";

export type ReadingPeriod = "today" | "week" | "month";
export type AnalysisStyle = "overview" | "practical" | "spiritual" | "detailed";
export const analysisTopics = [
  "personal",
  "energy",
  "guidance",
  "soul-insight",
  "featured-transit",
  "profection",
  "progressions",
  "solar-return",
  "saturn-return",
  "ray-constitution",
  "vehicles",
  "soul-purpose",
  "personality",
  "emotions",
  "esoteric",
  "saturn-lesson",
  "life-moment",
  "planet",
  "aspect",
] as const;
export type AnalysisTopic = (typeof analysisTopics)[number];
export const copy = (en: string, zh: string): Copy => ({ en, zh });
export const planetRays: Record<string, number> = {
  sun: 2,
  moon: 4,
  mercury: 4,
  venus: 5,
  mars: 6,
  jupiter: 2,
  saturn: 3,
  uranus: 7,
  neptune: 6,
  pluto: 1,
};
export const rayNames = [
  copy("Will & Power", "意志与力量"),
  copy("Love & Wisdom", "爱与智慧"),
  copy("Active Intelligence", "活跃智能"),
  copy("Harmony through Conflict", "冲突中的和谐"),
  copy("Concrete Knowledge", "具体知识"),
  copy("Devotion & Idealism", "奉献与理想"),
  copy("Ceremonial Order", "仪式与秩序"),
];
export const orthodoxRulers = [
  "mars",
  "venus",
  "mercury",
  "moon",
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "saturn",
  "jupiter",
];
export const esotericRulers = [
  "mercury",
  "venus",
  "venus",
  "neptune",
  "sun",
  "moon",
  "uranus",
  "mars",
  "earth",
  "saturn",
  "jupiter",
  "pluto",
];
const signRays = [
  [1, 7],
  [4],
  [2],
  [3, 7],
  [1, 5],
  [2, 6],
  [3],
  [4],
  [4, 5, 6],
  [1, 3, 7],
  [5],
  [2, 6],
];
const DAY = 86400000;
const normalize = (value: number) => ((value % 360) + 360) % 360;
const angularDistance = (a: number, b: number) =>
  Math.abs(((a - b + 540) % 360) - 180);
export const aspects = [
  {
    key: "conjunction",
    angle: 0,
    orb: 8,
    symbol: "☌",
    label: copy("Conjunction", "合相"),
  },
  {
    key: "sextile",
    angle: 60,
    orb: 6,
    symbol: "⚹",
    label: copy("Sextile", "六合"),
  },
  {
    key: "square",
    angle: 90,
    orb: 6,
    symbol: "□",
    label: copy("Square", "刑相"),
  },
  {
    key: "trine",
    angle: 120,
    orb: 8,
    symbol: "△",
    label: copy("Trine", "拱相"),
  },
  {
    key: "opposition",
    angle: 180,
    orb: 8,
    symbol: "☍",
    label: copy("Opposition", "冲相"),
  },
  {
    key: "quintile",
    angle: 72,
    orb: 2,
    symbol: "Q",
    label: copy("Quintile", "五分相"),
  },
  {
    key: "biquintile",
    angle: 144,
    orb: 2,
    symbol: "bQ",
    label: copy("Bi-Quintile", "倍五分相"),
  },
] as const;
export type AppAspect = {
  a: string;
  b: string;
  type: (typeof aspects)[number]["key"];
  orb: number;
  strength: number;
  applying: boolean;
};
export function aspectBetween(a: number, b: number) {
  const distance = angularDistance(a, b);
  return aspects
    .map((aspect) => ({ ...aspect, delta: Math.abs(distance - aspect.angle) }))
    .filter((aspect) => aspect.delta <= aspect.orb)
    .sort((a, b) => a.delta - b.delta)[0];
}
export function houseAt(longitude: number, chart: OpenAIChartJson) {
  const sorted = chart.houses;
  const index = sorted.findIndex(
    (house, i) =>
      normalize(longitude - house.cuspDegrees) <
      normalize(
        sorted[(i + 1) % sorted.length].cuspDegrees - house.cuspDegrees,
      ),
  );
  return index < 0 ? 1 : sorted[index].house;
}
export function chartTransits(
  chart: OpenAIChartJson,
  sky: SkySnapshot,
  next: SkySnapshot,
): AppAspect[] {
  const result: AppAspect[] = [];
  for (const p of sky.planets)
    for (const natal of [...chart.planets, ...chart.angles]) {
      const aspect = aspectBetween(p.longitude, natal.absoluteDegrees);
      if (!aspect || aspect.delta > 3) continue;
      const future = next.planets.find((point) => point.key === p.key);
      const futureOrb = future
        ? Math.abs(
            angularDistance(future.longitude, natal.absoluteDegrees) -
              aspect.angle,
          )
        : aspect.delta;
      result.push({
        a: p.key,
        b: natal.key,
        type: aspect.key,
        orb: aspect.delta,
        strength: Math.round((1 - aspect.delta / aspect.orb) * 100),
        applying: futureOrb < aspect.delta,
      });
    }
  return result.sort((a, b) => b.strength - a.strength || a.orb - b.orb);
}
export function skyAspects(sky: SkySnapshot, next: SkySnapshot): AppAspect[] {
  const result: AppAspect[] = [];
  sky.planets.forEach((p, i) =>
    sky.planets.slice(i + 1).forEach((q) => {
      const aspect = aspectBetween(p.longitude, q.longitude);
      if (!aspect) return;
      const pn = next.planets.find((n) => n.key === p.key),
        qn = next.planets.find((n) => n.key === q.key);
      const futureOrb =
        pn && qn
          ? Math.abs(angularDistance(pn.longitude, qn.longitude) - aspect.angle)
          : aspect.delta;
      result.push({
        a: p.key,
        b: q.key,
        type: aspect.key,
        orb: aspect.delta,
        strength: Math.round((1 - aspect.delta / aspect.orb) * 100),
        applying: futureOrb < aspect.delta,
      });
    }),
  );
  return result.sort((a, b) => b.strength - a.strength);
}
export function periodWindow(date: Date, period: ReadingPeriod) {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  if (period === "week")
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  if (period === "month") start.setUTCDate(1);
  const end = new Date(start);
  if (period === "month") end.setUTCMonth(end.getUTCMonth() + 1);
  else end.setUTCDate(end.getUTCDate() + (period === "week" ? 7 : 1));
  return { start, end };
}
export function moonEvents(date: Date, period: ReadingPeriod) {
  const { start, end } = periodWindow(date, period);
  return ([0, 90, 180, 270] as const)
    .flatMap((phase) => {
      const events: { phase: number; time: string; sign: number }[] = [];
      let cursor = new Date(start);
      for (let i = 0; i < 2; i++) {
        const found = SearchMoonPhase(phase, cursor, 40);
        if (!found || found.date >= end) break;
        events.push({
          phase,
          time: found.date.toISOString(),
          sign: getSkySnapshot(found.date).planets.find(
            (p) => p.key === "moon",
          )!.signIndex,
        });
        cursor = new Date(found.date.getTime() + DAY);
      }
      return events;
    })
    .sort((a, b) => a.time.localeCompare(b.time));
}
export function keyTransitDates(
  chart: OpenAIChartJson,
  date: Date,
  period: ReadingPeriod,
) {
  const { start, end } = periodWindow(date, period);
  const events: { time: string; transit: AppAspect }[] = [];
  const seen = new Set<string>();
  for (let at = start.getTime(); at < end.getTime(); at += DAY) {
    const sky = getSkySnapshot(new Date(at + DAY / 2)),
      next = getSkySnapshot(new Date(at + DAY / 2 + 3600000));
    for (const transit of chartTransits(chart, sky, next)
      .filter((t) => t.a !== "moon")
      .slice(0, 3)) {
      const key = `${transit.a}:${transit.b}:${transit.type}`;
      const existing = events.find(
        (e) => `${e.transit.a}:${e.transit.b}:${e.transit.type}` === key,
      );
      if (existing && transit.orb < existing.transit.orb) {
        existing.time = new Date(at + DAY / 2).toISOString();
        existing.transit = transit;
      } else if (!seen.has(key)) {
        seen.add(key);
        events.push({ time: new Date(at + DAY / 2).toISOString(), transit });
      }
    }
  }
  return events
    .sort((a, b) => a.transit.orb - b.transit.orb)
    .slice(0, period === "week" ? 3 : 6)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export async function enrichStellaChart(chart: OpenAIChartJson) {
  const { Origin, Horoscope } = await import("circular-natal-horoscope-js");
  const birth = chart.meta.birth;
  const origin = new Origin({
    year: birth.year,
    month: birth.month - 1,
    date: birth.day,
    hour: birth.hour,
    minute: birth.minute,
    latitude: birth.latitude,
    longitude: birth.longitude,
  });
  const horoscope = new Horoscope({
    origin,
    houseSystem: chart.meta.houseSystem,
    zodiac: chart.meta.zodiac,
    language: "en",
  });
  const extra = (
    [
      ["chiron", "Chiron", "凯龙星"],
      ["northnode", "North Node", "北交点"],
      ["southnode", "South Node", "南交点"],
    ] as const
  ).flatMap(([key, label, labelZh]) => {
    const source =
      key === "chiron"
        ? horoscope.CelestialBodies.chiron
        : horoscope.CelestialPoints[key];
    const longitude = source?.ChartPosition?.Ecliptic?.DecimalDegrees;
    if (!Number.isFinite(longitude)) return [];
    const index = Math.floor(normalize(longitude) / 30);
    const point: ChartPointJson = {
      key,
      label,
      labelZh,
      absoluteDegrees: longitude,
      sign: SIGN_NAMES.en[index],
      signZh: SIGN_NAMES.zh[index],
      signDegrees: normalize(longitude) % 30,
      house: houseAt(longitude, chart),
      retrograde: source.isRetrograde === true,
    };
    return [point];
  });
  return {
    chart: {
      ...chart,
      planets: [
        ...chart.planets,
        ...extra.filter((e) => !chart.planets.some((p) => p.key === e.key)),
      ],
    },
    utc: origin.utcTimeFormatted,
    timezone: origin.timezone.name,
  };
}

export function ageAt(birth: OpenAIChartJson["meta"]["birth"], date: Date) {
  let age = date.getUTCFullYear() - birth.year;
  if (
    date.getUTCMonth() + 1 < birth.month ||
    (date.getUTCMonth() + 1 === birth.month && date.getUTCDate() < birth.day)
  )
    age--;
  return Math.max(0, age);
}
export function timingTechniques(
  chart: OpenAIChartJson,
  utc: string,
  date: Date,
) {
  const birth = new Date(utc),
    age = ageAt(chart.meta.birth, date);
  const asc =
    chart.angles.find((p) => p.key === "ascendant") || chart.planets[0];
  const profectionHouse = (age % 12) + 1,
    profectionSign =
      (Math.floor(asc.absoluteDegrees / 30) + profectionHouse - 1) % 12;
  const progressedDate = new Date(
    birth.getTime() + (date.getTime() - birth.getTime()) / 365.2422,
  );
  const progressions = getSkySnapshot(progressedDate).planets.filter(
    (p) => p.key === "sun" || p.key === "moon",
  );
  const sun = chart.planets.find((p) => p.key === "sun")!;
  let year = date.getUTCFullYear();
  let solar = SearchSunLongitude(
    sun.absoluteDegrees,
    new Date(
      Date.UTC(year, chart.meta.birth.month - 1, chart.meta.birth.day) -
        4 * DAY,
    ),
    10,
  );
  if (solar && solar.date < date) {
    year++;
    solar = SearchSunLongitude(
      sun.absoluteDegrees,
      new Date(
        Date.UTC(year, chart.meta.birth.month - 1, chart.meta.birth.day) -
          4 * DAY,
      ),
      10,
    );
  }
  return {
    age,
    profectionHouse,
    profectionSign,
    timeLord: orthodoxRulers[profectionSign],
    progressions,
    progressedDate: progressedDate.toISOString(),
    solarReturn: solar?.date.toISOString() || null,
    solarYear: year,
  };
}
export function saturnReturns(chart: OpenAIChartJson, utc: string) {
  const saturn = chart.planets.find((p) => p.key === "saturn");
  if (!saturn) return [];
  const birth = new Date(utc).getTime();
  const longitude = (epoch: number) =>
    Ecliptic(GeoVector(Body.Saturn, new Date(epoch), true)).elon;
  const signed = (epoch: number) =>
    ((longitude(epoch) - saturn.absoluteDegrees + 540) % 360) - 180;
  return [1, 2, 3].map((cycle) => {
    const center = birth + cycle * 29.4571 * 365.2422 * DAY;
    let best: number | null = null,
      bestDistance = Infinity;
    for (
      let at = center - 2 * 365.2422 * DAY;
      at < center + 2 * 365.2422 * DAY;
      at += 10 * DAY
    ) {
      const a = signed(at),
        b = signed(at + 10 * DAY);
      if (a * b > 0 || Math.abs(a - b) > 180) continue;
      let lo = at,
        hi = at + 10 * DAY;
      for (let i = 0; i < 30; i++) {
        const middle = (lo + hi) / 2;
        if (signed(lo) * signed(middle) <= 0) hi = middle;
        else lo = middle;
      }
      const root = (lo + hi) / 2;
      if (Math.abs(root - center) < bestDistance) {
        best = root;
        bestDistance = Math.abs(root - center);
      }
    }
    return { cycle, time: best === null ? null : new Date(best).toISOString() };
  });
}

// Symbolic local weighting, not a recovered private algorithm or a psychological measure.
export function rayScores(points: { key: string; absoluteDegrees: number }[]) {
  const values = Array(7).fill(0) as number[];
  for (const point of points) {
    const ray = planetRays[point.key];
    if (!ray) continue;
    const weight = point.key === "sun" || point.key === "moon" ? 2 : 1;
    values[ray - 1] += weight;
    for (const signRay of signRays[
      Math.floor(normalize(point.absoluteDegrees) / 30)
    ])
      values[signRay - 1] += weight * 0.5;
  }
  const total = values.reduce((a, b) => a + b, 0) || 1;
  return values
    .map((value, index) => ({
      ray: index + 1,
      score: value,
      percent: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.score - a.score);
}
export function esotericProfile(chart: OpenAIChartJson) {
  const asc =
    chart.angles.find((p) => p.key === "ascendant") || chart.planets[0];
  const sign = Math.floor(asc.absoluteDegrees / 30);
  const classical = chart.planets.filter((p) =>
    ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"].includes(
      p.key,
    ),
  );
  const atmakaraka = classical
    .slice()
    .sort((a, b) => b.signDegrees - a.signDegrees)[0];
  return {
    sign,
    cross: sign % 3,
    orthodoxRuler: orthodoxRulers[sign],
    esotericRuler: esotericRulers[sign],
    atmakaraka,
    rays: rayScores(chart.planets),
  };
}
const baselineCache = new Map<number, number[]>();
export function skyRayEnergies(sky: SkySnapshot, date: Date) {
  const year = date.getUTCFullYear();
  let baseline = baselineCache.get(year);
  if (!baseline) {
    baseline = Array(7).fill(0);
    for (let month = 0; month < 12; month++)
      for (const row of rayScores(
        getSkySnapshot(new Date(Date.UTC(year, month, 15, 12))).planets.map(
          (p) => ({ key: p.key, absoluteDegrees: p.longitude }),
        ),
      ))
        baseline[row.ray - 1] += row.score / 12;
    if (baselineCache.size > 4) baselineCache.clear();
    baselineCache.set(year, baseline);
  }
  return rayScores(
    sky.planets.map((p) => ({ key: p.key, absoluteDegrees: p.longitude })),
  )
    .map((row) => ({
      ...row,
      relative: Math.round(
        (row.score / (baseline![row.ray - 1] || 1) - 1) * 100,
      ),
    }))
    .sort((a, b) => b.relative - a.relative);
}
export function currentAngles(date: Date, latitude: number, longitude: number) {
  const angle = ((SiderealTime(date) * 15 + longitude) * Math.PI) / 180,
    eps = (23.4393 * Math.PI) / 180,
    lat = (latitude * Math.PI) / 180;
  const asc = normalize(
    (Math.atan2(
      Math.cos(angle),
      -Math.sin(angle) * Math.cos(eps) - Math.tan(lat) * Math.sin(eps),
    ) *
      180) /
      Math.PI,
  );
  const mc = normalize(
    (Math.atan2(Math.sin(angle), Math.cos(angle) * Math.cos(eps)) * 180) /
      Math.PI,
  );
  return { asc, mc };
}
export function angularPlanets(
  sky: SkySnapshot,
  date: Date,
  latitude: number,
  longitude: number,
) {
  const angles = currentAngles(date, latitude, longitude),
    observer = new Observer(latitude, longitude, 0);
  return sky.planets
    .map((p) => {
      const body = Body[p.label as keyof typeof Body];
      const eq = Equator(body, date, observer, true, true),
        altitude = Horizon(date, observer, eq.ra, eq.dec, "normal").altitude;
      const nearest = [
        ["ASC", angles.asc],
        ["MC", angles.mc],
        ["DSC", normalize(angles.asc + 180)],
        ["IC", normalize(angles.mc + 180)],
      ] as const;
      const match = nearest
        .map(([label, value]) => ({
          label,
          orb: angularDistance(p.longitude, value),
        }))
        .sort((a, b) => a.orb - b.orb)[0];
      return {
        ...p,
        angle: match.label,
        angularity: Math.round(Math.max(0, 1 - match.orb / 90) * 100),
        altitude,
      };
    })
    .sort((a, b) => b.angularity - a.angularity);
}
export function planetaryHour(
  date: Date,
  latitude: number,
  longitude: number,
  timezone = "UTC",
) {
  const observer = new Observer(latitude, longitude, 0);
  const events: { time: number; rise: boolean }[] = [];
  for (const direction of [1, -1]) {
    let cursor = new Date(date.getTime() - 2 * DAY);
    for (let i = 0; i < 5; i++) {
      const event = SearchRiseSet(Body.Sun, observer, direction, cursor, 3);
      if (!event) break;
      events.push({ time: event.date.getTime(), rise: direction === 1 });
      cursor = new Date(event.date.getTime() + 60000);
    }
  }
  events.sort((a, b) => a.time - b.time);
  const index = events.findIndex(
    (event, i) =>
      event.time <= date.getTime() && events[i + 1]?.time > date.getTime(),
  );
  if (index < 0) return null;
  const start = events[index],
    end = events[index + 1],
    length = (end.time - start.time) / 12;
  const hour = Math.min(11, Math.floor((date.getTime() - start.time) / length));
  const sunrise = start.rise
    ? start
    : events
        .slice(0, index)
        .reverse()
        .find((event) => event.rise);
  if (!sunrise) return null;
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: timezone,
  }).format(new Date(sunrise.time));
  const dayRuler: Record<string, string> = {
    Sun: "sun",
    Mon: "moon",
    Tue: "mars",
    Wed: "mercury",
    Thu: "jupiter",
    Fri: "venus",
    Sat: "saturn",
  };
  const order = [
    "saturn",
    "jupiter",
    "mars",
    "sun",
    "venus",
    "mercury",
    "moon",
  ];
  const offset =
    order.indexOf(dayRuler[weekday]) + hour + (start.rise ? 0 : 12);
  return {
    planet: order[offset % 7],
    next: order[(offset + 1) % 7],
    end: new Date(start.time + (hour + 1) * length).toISOString(),
    daylight: start.rise,
  };
}

export function validBirth(value: unknown): value is BirthForm {
  if (!value || typeof value !== "object") return false;
  const birth = value as BirthForm;
  const date = new Date(Date.UTC(birth.year, birth.month - 1, birth.day));
  return (
    typeof birth.name === "string" &&
    birth.name.length <= 80 &&
    [birth.year, birth.month, birth.day, birth.hour, birth.minute].every(
      Number.isInteger,
    ) &&
    birth.year >= 1900 &&
    birth.year <= 2100 &&
    date.getUTCFullYear() === birth.year &&
    date.getUTCMonth() === birth.month - 1 &&
    date.getUTCDate() === birth.day &&
    birth.hour >= 0 &&
    birth.hour < 24 &&
    birth.minute >= 0 &&
    birth.minute < 60 &&
    Number.isFinite(birth.latitude) &&
    Math.abs(birth.latitude) < 89 &&
    Number.isFinite(birth.longitude) &&
    Math.abs(birth.longitude) <= 180 &&
    [
      "placidus",
      "koch",
      "campanus",
      "whole-sign",
      "equal-house",
      "regiomontanus",
      "topocentric",
    ].includes(birth.houseSystem) &&
    ["tropical", "sidereal"].includes(birth.zodiac)
  );
}
