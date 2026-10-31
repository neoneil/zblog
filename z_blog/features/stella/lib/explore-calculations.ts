import {
  Body,
  Ecliptic,
  GeoVector,
  MoonPhase,
  SearchMoonQuarter,
  NextMoonQuarter,
  SearchLunarEclipse,
  NextLunarEclipse,
  SearchGlobalSolarEclipse,
  NextGlobalSolarEclipse,
} from "astronomy-engine";

const DAY = 86400000;
const bodies: Record<string, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto,
};
const norm = (n: number) => ((n % 360) + 360) % 360;
const signed = (n: number) => norm(n + 180) - 180;
export function longitude(key: string, time: number): number {
  if (!bodies[key] || !Number.isFinite(time))
    throw new RangeError("Invalid body or date");
  return Ecliptic(GeoVector(bodies[key], new Date(time), true)).elon;
}
export function speed(key: string, time: number): number {
  return (
    signed(longitude(key, time + 1800000) - longitude(key, time - 1800000)) * 24
  );
}
export function refineRoot(
  fn: (time: number) => number,
  start: number,
  end: number,
): number {
  let left = start,
    right = end,
    value = fn(left);
  if (value === 0) return left;
  for (let i = 0; i < 40 && right - left > 1000; i++) {
    const middle = (left + right) / 2,
      next = fn(middle);
    if (next === 0) return middle;
    if (Math.sign(next) === Math.sign(value)) {
      left = middle;
      value = next;
    } else right = middle;
  }
  return (left + right) / 2;
}
export interface Ingress {
  time: string;
  sign: number;
  retrograde: boolean;
}
export interface RetrogradePeriod {
  planet: string;
  start: string;
  end: string;
  startSign: number;
  endSign: number;
  clippedStart: boolean;
  clippedEnd: boolean;
}
export interface MoonDay {
  day: number;
  time: string;
  sign: number;
  phase: number;
  illumination: number;
}
export interface MoonQuarter {
  time: string;
  quarter: number;
}
export interface VoidPeriod {
  start: string;
  end: string;
  sign: number;
  lastPlanet: string | null;
  angle: number | null;
  wholeSign: boolean;
}
export interface EclipseEvent {
  id: string;
  time: string;
  body: "solar" | "lunar";
  kind: string;
  longitude: number;
  partialMinutes: number | null;
  totalMinutes: number | null;
}
export function validateYear(year: number) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100)
    throw new RangeError("Year must be 1900–2100");
}
const cache = new Map<string, unknown>();
function cached<T>(key: string, compute: () => T): T {
  if (cache.has(key)) return cache.get(key) as T;
  const result = compute();
  if (cache.size >= 48) cache.delete(cache.keys().next().value!);
  cache.set(key, result);
  return result;
}
export function ingresses(key: string, start: number, end: number): Ingress[] {
  const events: Ingress[] = [];
  const step = (key === "moon" ? 0.125 : 0.5) * DAY;
  let a = start,
    previous = longitude(key, a);
  while (a < end) {
    const b = Math.min(a + step, end),
      next = longitude(key, b);
    if (Math.floor(previous / 30) !== Math.floor(next / 30)) {
      const motion = signed(next - previous),
        boundary = norm(
          motion > 0
            ? (Math.floor(previous / 30) + 1) * 30
            : Math.floor(previous / 30) * 30,
        );
      const root = refineRoot(
        (t) => signed(longitude(key, t) - boundary),
        a,
        b,
      );
      if (root >= start && root < end)
        events.push({
          time: new Date(root).toISOString(),
          sign: Math.floor(longitude(key, root + 2000) / 30),
          retrograde: motion < 0,
        });
    }
    a = b;
    previous = next;
  }
  return events;
}
export function planetIngresses(key: string, year: number): Ingress[] {
  validateYear(year);
  return cached(`ingress:${key}:${year}`, () =>
    ingresses(key, Date.UTC(year - 1, 0, 1), Date.UTC(year + 2, 0, 1)),
  );
}
export function retrogradePeriods(
  year: number,
  keys = Object.keys(bodies).slice(2),
): RetrogradePeriod[] {
  validateYear(year);
  return cached(`retro:${year}:${keys.join(",")}`, () => {
    const start = Date.UTC(year, 0, 1),
      end = Date.UTC(year + 1, 0, 1),
      periods: RetrogradePeriod[] = [];
    for (const planet of keys) {
      let active: number | null = speed(planet, start) < 0 ? start : null;
      let previous = speed(planet, start);
      for (let a = start; a < end; a += DAY) {
        const b = Math.min(a + DAY, end),
          next = speed(planet, b);
        if (previous < 0 !== next < 0) {
          const station = refineRoot((t) => speed(planet, t), a, b);
          if (next < 0) active = station;
          else if (active !== null) {
            periods.push({
              planet,
              start: new Date(active).toISOString(),
              end: new Date(station).toISOString(),
              startSign: Math.floor(longitude(planet, active) / 30),
              endSign: Math.floor(longitude(planet, station) / 30),
              clippedStart: active === start,
              clippedEnd: false,
            });
            active = null;
          }
        }
        previous = next;
      }
      if (active !== null)
        periods.push({
          planet,
          start: new Date(active).toISOString(),
          end: new Date(end).toISOString(),
          startSign: Math.floor(longitude(planet, active) / 30),
          endSign: Math.floor(longitude(planet, end - 1000) / 30),
          clippedStart: active === start,
          clippedEnd: true,
        });
    }
    return periods.sort((a, b) => a.start.localeCompare(b.start));
  });
}
export function moonMonth(
  year: number,
  month: number,
): { days: MoonDay[]; quarters: MoonQuarter[] } {
  validateYear(year);
  if (!Number.isInteger(month) || month < 1 || month > 12)
    throw new RangeError("Invalid month");
  return cached(`moon:${year}:${month}`, () => {
    const start = Date.UTC(year, month - 1, 1),
      end = Date.UTC(year, month, 1),
      days: MoonDay[] = [],
      quarters: MoonQuarter[] = [];
    for (let t = start; t < end; t += DAY) {
      const date = new Date(t + DAY / 2),
        phase = MoonPhase(date);
      days.push({
        day: date.getUTCDate(),
        time: date.toISOString(),
        sign: Math.floor(longitude("moon", date.getTime()) / 30),
        phase,
        illumination: (1 - Math.cos((phase * Math.PI) / 180)) / 2,
      });
    }
    let quarter = SearchMoonQuarter(new Date(start));
    while (quarter.time.date.getTime() < end) {
      quarters.push({
        time: quarter.time.date.toISOString(),
        quarter: quarter.quarter,
      });
      quarter = NextMoonQuarter(quarter);
    }
    return { days, quarters };
  });
}
export function voidPeriods(year: number, month: number): VoidPeriod[] {
  validateYear(year);
  if (month < 1 || month > 12 || !Number.isInteger(month))
    throw new RangeError("Invalid month");
  return cached(`void:${year}:${month}`, () => {
    const start = Date.UTC(year, month - 1, 1),
      end = Date.UTC(year, month, 1),
      changes = ingresses("moon", start - 4 * DAY, end + 4 * DAY),
      periods: VoidPeriod[] = [];
    const targets = [0, 60, 90, 120, 180, 240, 270, 300];
    for (let i = 1; i < changes.length; i++) {
      const enter = Date.parse(changes[i - 1].time),
        exit = Date.parse(changes[i].time);
      if (exit < start || enter >= end) continue;
      let last = enter,
        lastPlanet: string | null = null,
        lastAngle: number | null = null;
      // Exact aspects to all nine other bodies, restricted to this sign transit.
      for (const key of Object.keys(bodies).filter((key) => key !== "moon")) {
        for (let a = enter + 1000; a < exit - 1000; a += 3 * 3600000) {
          const b = Math.min(a + 3 * 3600000, exit - 1000),
            r1 = norm(longitude("moon", a) - longitude(key, a)),
            r2 = norm(longitude("moon", b) - longitude(key, b));
          for (const target of targets) {
            const va = signed(r1 - target),
              vb = signed(r2 - target);
            if (va <= 0 && vb > 0 && vb - va < 30) {
              const time = refineRoot(
                (t) =>
                  signed(longitude("moon", t) - longitude(key, t) - target),
                a,
                b,
              );
              if (time > last) {
                last = time;
                lastPlanet = key;
                lastAngle = Math.min(target, 360 - target);
              }
            }
          }
        }
      }
      if (exit > start && last < end)
        periods.push({
          start: new Date(last).toISOString(),
          end: new Date(exit).toISOString(),
          sign: changes[i - 1].sign,
          lastPlanet,
          angle: lastAngle,
          wholeSign: lastPlanet === null,
        });
    }
    return periods;
  });
}
export function eclipseYear(year: number): EclipseEvent[] {
  validateYear(year);
  return cached(`eclipse:${year}`, () => {
    const start = new Date(Date.UTC(year, 0, 1)),
      end = Date.UTC(year + 1, 0, 1),
      result: EclipseEvent[] = [];
    let lunar = SearchLunarEclipse(start);
    while (lunar.peak.date.getTime() < end) {
      const time = lunar.peak.date.toISOString();
      result.push({
        id: `${time.slice(0, 10)}-lunar`,
        time,
        body: "lunar",
        kind: lunar.kind,
        longitude: longitude("moon", lunar.peak.date.getTime()),
        partialMinutes: lunar.sd_partial * 2,
        totalMinutes: lunar.sd_total * 2,
      });
      lunar = NextLunarEclipse(lunar.peak);
    }
    let solar = SearchGlobalSolarEclipse(start);
    while (solar.peak.date.getTime() < end) {
      const time = solar.peak.date.toISOString();
      result.push({
        id: `${time.slice(0, 10)}-solar`,
        time,
        body: "solar",
        kind: solar.kind,
        longitude: longitude("sun", solar.peak.date.getTime()),
        partialMinutes: null,
        totalMinutes: null,
      });
      solar = NextGlobalSolarEclipse(solar.peak);
    }
    return result.sort((a, b) => a.time.localeCompare(b.time));
  });
}
export function birthdayProfile(month: number, day: number) {
  const time = Date.UTC(2000, month - 1, day),
    date = new Date(time);
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day)
    throw new RangeError("Invalid birthday");
  // Public birthday profiles use fixed calendar boundaries, not a natal ephemeris.
  const starts = [
    [3, 21],
    [4, 20],
    [5, 21],
    [6, 21],
    [7, 23],
    [8, 23],
    [9, 23],
    [10, 23],
    [11, 22],
    [12, 22],
    [1, 20],
    [2, 19],
  ];
  const calendarDay = month * 100 + day;
  const sign = starts.findIndex(([startMonth, startDay], index) => {
    const first = startMonth * 100 + startDay;
    const [nextMonth, nextDay] = starts[(index + 1) % 12];
    const next = nextMonth * 100 + nextDay;
    return first < next
      ? calendarDay >= first && calendarDay < next
      : calendarDay >= first || calendarDay < next;
  });
  const [startMonth, startDay] = starts[sign];
  // Preserve the reference's January Capricorn reset, verified across all 366 dates.
  const start =
    month < startMonth
      ? Date.UTC(2000, 0, 1)
      : Date.UTC(2000, startMonth - 1, startDay);
  const degree = Math.min(29, Math.floor((time - start) / DAY));
  const decan = Math.min(2, Math.floor(degree / 10));
  // Match the reference's modern triplicity rulers, not Chaldean decan rulers.
  const decanRulers = [
    ["mars", "sun", "jupiter"],
    ["venus", "mercury", "saturn"],
    ["mercury", "venus", "uranus"],
    ["moon", "pluto", "neptune"],
    ["sun", "jupiter", "mars"],
    ["mercury", "saturn", "venus"],
    ["venus", "uranus", "mercury"],
    ["pluto", "neptune", "moon"],
    ["jupiter", "mars", "sun"],
    ["saturn", "venus", "mercury"],
    ["uranus", "mercury", "venus"],
    ["neptune", "moon", "pluto"],
  ];
  return {
    sign,
    degree,
    decan: decan + 1,
    ruler: decanRulers[sign][decan],
  };
}

/** Daily UTC sampling used by the reference's date-only calendar. */
export function calendarRetrogradePeriods(
  year: number,
  keys = Object.keys(bodies).slice(2),
): RetrogradePeriod[] {
  validateYear(year);
  return cached(`calendar-retro:${year}:${keys.join(",")}`, () => {
    const start = Date.UTC(year, 0, 1),
      end = Date.UTC(year + 1, 0, 1),
      periods: RetrogradePeriod[] = [];
    for (const planet of keys) {
      const isRetro = (t: number) =>
        signed(longitude(planet, t + DAY) - longitude(planet, t)) < 0;
      let active: number | null = isRetro(start) ? start : null;
      for (let t = start + DAY; t < end; t += DAY) {
        const retro = isRetro(t);
        if (retro && active === null) active = t;
        else if (!retro && active !== null) {
          periods.push({
            planet,
            start: new Date(active).toISOString(),
            end: new Date(t).toISOString(),
            startSign: Math.floor(longitude(planet, active) / 30),
            endSign: Math.floor(longitude(planet, t) / 30),
            clippedStart: active === start,
            clippedEnd: false,
          });
          active = null;
        }
      }
      if (active !== null)
        periods.push({
          planet,
          start: new Date(active).toISOString(),
          end: new Date(end).toISOString(),
          startSign: Math.floor(longitude(planet, active) / 30),
          endSign: Math.floor(longitude(planet, end - DAY) / 30),
          clippedStart: active === start,
          clippedEnd: true,
        });
    }
    return periods.sort((a, b) => a.start.localeCompare(b.start));
  });
}

export function planetCalendarWindow(key: string, year: number) {
  const fast = ["sun", "moon", "mercury", "venus"].includes(key);
  const startYear = fast ? year - 1 : Math.floor(year / 10) * 10;
  return {
    startYear,
    endYear: fast ? year + 1 : startYear + 10,
    hour: fast ? 12 : 0,
  };
}

export function calendarPlanetIngresses(key: string, year: number): Ingress[] {
  validateYear(year);
  const { startYear, endYear, hour } = planetCalendarWindow(key, year);
  return cached(`calendar-ingress:${key}:${year}`, () => {
    const start = Date.UTC(startYear, 0, 1, hour),
      end = Date.UTC(endYear + 1, 0, 1, hour),
      events: Ingress[] = [];
    let previous = Math.floor(longitude(key, start) / 30);
    for (let t = start + DAY; t < end; t += DAY) {
      const sign = Math.floor(longitude(key, t) / 30);
      if (sign !== previous) {
        events.push({
          time: new Date(t).toISOString(),
          sign,
          retrograde: speed(key, t) < 0,
        });
        previous = sign;
      }
    }
    return events;
  });
}

export function calendarVoidPeriods(year: number, month: number): VoidPeriod[] {
  validateYear(year);
  if (!Number.isInteger(month) || month < 1 || month > 12)
    throw new RangeError("Invalid month");
  return cached(`calendar-void:${year}:${month}`, () => {
    const start = Date.UTC(year, month - 1, 1),
      end = Date.UTC(year, month, 1),
      hour = 3600000,
      periods: VoidPeriod[] = [];
    let sign = Math.floor(longitude("moon", start - 4 * DAY) / 30),
      entered = start - 4 * DAY;
    for (let time = entered + hour; time < end; time += hour) {
      const next = Math.floor(longitude("moon", time) / 30);
      if (next === sign) continue;
      if (time >= start) {
        let last = entered,
          lastPlanet: string | null = null,
          angle: number | null = null;
        search: for (let t = time - hour / 2; t >= entered; t -= hour / 2) {
          for (const key of Object.keys(bodies).filter(
            (key) => key !== "moon",
          )) {
            const separation = Math.abs(
              signed(longitude("moon", t) - longitude(key, t)),
            );
            for (const target of [0, 60, 90, 120, 180])
              if (Math.abs(separation - target) < 1) {
                last = t;
                lastPlanet = key;
                angle = target;
                break search;
              }
          }
        }
        periods.push({
          start: new Date(last).toISOString(),
          end: new Date(time).toISOString(),
          sign,
          lastPlanet,
          angle,
          wholeSign: lastPlanet === null,
        });
      }
      entered = time;
      sign = next;
    }
    return periods;
  });
}
