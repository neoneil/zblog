export type BirthForm = {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  houseSystem:
    | "placidus"
    | "koch"
    | "campanus"
    | "whole-sign"
    | "equal-house"
    | "regiomontanus"
    | "topocentric";
  zodiac: "tropical" | "sidereal";
};

export type ChartPointJson = {
  key: string;
  label: string;
  labelZh: string;
  absoluteDegrees: number;
  sign: string;
  signZh: string;
  signDegrees: number;
  retrograde?: boolean;
  house?: number;
};

export type OpenAIChartJson = {
  meta: {
    name: string;
    generatedAt: string;
    zodiac: string;
    zodiacZh: string;
    houseSystem: string;
    houseSystemZh: string;
    birth: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      latitude: number;
      longitude: number;
    };
    notes: string[];
  };
  planets: ChartPointJson[];
  angles: ChartPointJson[];
  houses: Array<{
    house: number;
    cuspDegrees: number;
    sign: string;
    signZh: string;
    signDegrees: number;
  }>;
  aspects: Array<{
    point1Key: string;
    point1Label: string;
    point1LabelZh: string;
    point2Key: string;
    point2Label: string;
    point2LabelZh: string;
    label: string;
    labelZh: string;
    orb: number;
  }>;
};

type LooseRecord = Record<string, unknown>;

type HoroscopeConstructor = new (options: LooseRecord) => unknown;

type HoroscopeModule = {
  Origin?: HoroscopeConstructor;
  Horoscope?: HoroscopeConstructor;
};

export const DEFAULT_FORM: BirthForm = {
  name: "",
  year: 1998,
  month: 8,
  day: 12,
  hour: 10,
  minute: 24,
  latitude: 0,
  longitude: 0,
  houseSystem: "placidus",
  zodiac: "tropical",
};

const CORE_PLANET_KEYS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const;


const ANGLE_KEYS = ["ascendant", "midheaven"] as const;

const LABELS_EN: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  ascendant: "Ascendant",
  midheaven: "Midheaven",
};

const LABELS_ZH: Record<string, string> = {
  sun: "太阳",
  moon: "月亮",
  mercury: "水星",
  venus: "金星",
  mars: "火星",
  jupiter: "木星",
  saturn: "土星",
  uranus: "天王星",
  neptune: "海王星",
  pluto: "冥王星",
  ascendant: "上升",
  midheaven: "天顶",
};

const SIGN_EN = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const SIGN_ZH = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
] as const;


export const HOUSE_SYSTEM_ZH: Record<BirthForm["houseSystem"], string> = {
  placidus: "普拉西德制",
  koch: "柯赫制",
  campanus: "坎帕努斯制",
  "whole-sign": "整宫制",
  "equal-house": "等宫制",
  regiomontanus: "雷吉蒙塔努斯制",
  topocentric: "地平制",
};

export const ZODIAC_ZH: Record<BirthForm["zodiac"], string> = {
  tropical: "回归黄道",
  sidereal: "恒星黄道",
};

const ASPECT_LABEL_ZH: Record<string, string> = {
  conjunction: "合相",
  sextile: "六合",
  square: "刑相",
  trine: "拱相",
  opposition: "冲相",
};


const CORE_ASPECT_TYPES = new Set([
  "conjunction",
  "sextile",
  "square",
  "trine",
  "opposition",
]);

const CORE_POINT_KEYS = new Set([
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "ascendant",
  "midheaven",
]);


function normalizeDegrees(value: number) {
  const mod = value % 360;
  return mod < 0 ? mod + 360 : mod;
}

function signFromDegrees(deg: number) {
  const normalized = normalizeDegrees(deg);
  const index = Math.floor(normalized / 30);

  return {
    sign: SIGN_EN[index],
    signZh: SIGN_ZH[index],
    signDegrees: normalized % 30,
  };
}

export function isRecord(value: unknown): value is LooseRecord {
  return typeof value === "object" && value !== null;
}

function getRecord(value: unknown): LooseRecord {
  return isRecord(value) ? value : {};
}

function getPathValue(value: unknown, pathSegments: string[]) {
  return pathSegments.reduce<unknown>((current, segment) => {
    if (!isRecord(current)) return undefined;

    return current[segment];
  }, value);
}

function extractAbsoluteDegrees(point: unknown): number {
  const candidate =
    getPathValue(point, ["ChartPosition", "Ecliptic", "DecimalDegrees"]) ??
    getPathValue(point, ["ChartPosition", "Horizon", "DecimalDegrees"]) ??
    getPathValue(point, ["ChartPosition", "Ecliptic", "ArcDegrees", "degrees"]) ??
    getRecord(point).DecimalDegrees ??
    getRecord(point).position ??
    0;

  return normalizeDegrees(Number(candidate) || 0);
}

function isRetrograde(point: unknown): boolean {
  const pointRecord = getRecord(point);

  return Boolean(pointRecord.isRetrograde || pointRecord.retrograde || pointRecord.Retrograde);
}

export function findHouseForDegree(houses: number[], degree: number) {
  const normalizedDegree = normalizeDegrees(degree);

  for (let i = 0; i < houses.length; i += 1) {
    const start = normalizeDegrees(houses[i]);
    const end = normalizeDegrees(houses[(i + 1) % houses.length]);

    if (start <= end) {
      if (normalizedDegree >= start && normalizedDegree < end) return i + 1;
    } else {
      if (normalizedDegree >= start || normalizedDegree < end) return i + 1;
    }
  }

  return 1;
}

function normalizeAspectKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");
}

function normalizePointKey(value: unknown) {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");

  const aliasMap: Record<string, string> = {
    sun: "sun",
    moon: "moon",
    mercury: "mercury",
    venus: "venus",
    mars: "mars",
    jupiter: "jupiter",
    saturn: "saturn",
    uranus: "uranus",
    neptune: "neptune",
    pluto: "pluto",
    asc: "ascendant",
    as: "ascendant",
    ascendant: "ascendant",
    midheaven: "midheaven",
    mc: "midheaven",
  };

  return aliasMap[raw] ?? raw;
}

function getAnglePoint(horoscope: unknown, key: (typeof ANGLE_KEYS)[number]) {
  const horoscopeRecord = getRecord(horoscope);
  const angles = getRecord(horoscopeRecord.Angles);

  return (
    angles[key] ??
    angles[key === "ascendant" ? "Ascendant" : "Midheaven"] ??
    horoscopeRecord[key] ??
    null
  );
}

function buildAstroChartCusps(horoscope: unknown) {
  const houses = getRecord(horoscope).Houses;

  if (!Array.isArray(houses) || houses.length < 12) {
    return Array.from({ length: 12 }, (_, i) => i * 30);
  }

  return houses.slice(0, 12).map((house: unknown, index: number) => {
    const degree =
      getPathValue(house, ["ChartPosition", "StartPosition", "Ecliptic", "DecimalDegrees"]) ??
      getPathValue(house, ["ChartPosition", "Ecliptic", "DecimalDegrees"]) ??
      index * 30;

    return normalizeDegrees(Number(degree) || 0);
  });
}

function buildOpenAIJson(form: BirthForm, horoscope: unknown): OpenAIChartJson {
  const houseCusps = buildAstroChartCusps(horoscope);
  const horoscopeRecord = getRecord(horoscope);
  const celestialBodies = getRecord(horoscopeRecord.CelestialBodies);

  const planets = CORE_PLANET_KEYS.map((key) => {
    const point = celestialBodies[key];
    const absoluteDegrees = extractAbsoluteDegrees(point);
    const mapped = signFromDegrees(absoluteDegrees);

    return {
      key,
      label: LABELS_EN[key],
      labelZh: LABELS_ZH[key],
      absoluteDegrees,
      sign: mapped.sign,
      signZh: mapped.signZh,
      signDegrees: mapped.signDegrees,
      retrograde: isRetrograde(point),
      house: findHouseForDegree(houseCusps, absoluteDegrees),
    };
  });

  const angles = ANGLE_KEYS.map((key) => {
    const point = getAnglePoint(horoscope, key);
    const absoluteDegrees = extractAbsoluteDegrees(point);
    const mapped = signFromDegrees(absoluteDegrees);

    return {
      key,
      label: LABELS_EN[key],
      labelZh: LABELS_ZH[key],
      absoluteDegrees,
      sign: mapped.sign,
      signZh: mapped.signZh,
      signDegrees: mapped.signDegrees,
    };
  });

  const houses = houseCusps.map((cuspDegrees, index) => {
    const mapped = signFromDegrees(cuspDegrees);

    return {
      house: index + 1,
      cuspDegrees,
      sign: mapped.sign,
      signZh: mapped.signZh,
      signDegrees: mapped.signDegrees,
    };
  });

  const rawAspects = horoscopeRecord.Aspects;
  const aspectsRecord = getRecord(rawAspects);
  const aspectsSource = aspectsRecord.all ?? rawAspects ?? [];
  const aspects = Array.isArray(aspectsSource)
    ? aspectsSource
        .map((aspect) => {
          const aspectRecord = getRecord(aspect);
          const point1Key = normalizePointKey(
            aspectRecord.point1Key ?? aspectRecord.point1 ?? aspectRecord.pointA,
          );
          const point2Key = normalizePointKey(
            aspectRecord.point2Key ?? aspectRecord.point2 ?? aspectRecord.pointB,
          );
          const label = normalizeAspectKey(
            aspectRecord.aspectKey ?? aspectRecord.label ?? aspectRecord.type,
          );

          return {
            point1Key,
            point2Key,
            label,
            orb: Number(aspectRecord.orb ?? aspectRecord.Orb ?? 0),
          };
        })
        .filter(
          (aspect) =>
            CORE_ASPECT_TYPES.has(aspect.label) &&
            CORE_POINT_KEYS.has(aspect.point1Key) &&
            CORE_POINT_KEYS.has(aspect.point2Key),
        )
        .slice(0, 40)
        .map((aspect) => ({
          point1Key: aspect.point1Key,
          point1Label: LABELS_EN[aspect.point1Key] ?? aspect.point1Key,
          point1LabelZh: LABELS_ZH[aspect.point1Key] ?? aspect.point1Key,
          point2Key: aspect.point2Key,
          point2Label: LABELS_EN[aspect.point2Key] ?? aspect.point2Key,
          point2LabelZh: LABELS_ZH[aspect.point2Key] ?? aspect.point2Key,
          label: aspect.label,
          labelZh: ASPECT_LABEL_ZH[aspect.label] ?? aspect.label,
          orb: aspect.orb,
        }))
    : [];

  return {
    meta: {
      name: form.name,
      generatedAt: new Date().toISOString(),
      zodiac: form.zodiac,
      zodiacZh: ZODIAC_ZH[form.zodiac],
      houseSystem: form.houseSystem,
      houseSystemZh: HOUSE_SYSTEM_ZH[form.houseSystem],
      birth: {
        year: form.year,
        month: form.month,
        day: form.day,
        hour: form.hour,
        minute: form.minute,
        latitude: form.latitude,
        longitude: form.longitude,
      },
      notes: [
        "如果经纬度未知，可填 0。",
        "经纬度为 0 时，宫位、上升、天顶的精确性可能下降。",
        "当前已过滤掉 Sirius 等非核心附加点。",
      ],
    },
    planets,
    angles,
    houses,
    aspects,
  };
}

export async function calculateNatalChart(form: BirthForm): Promise<OpenAIChartJson> {
  const lib = await import("circular-natal-horoscope-js") as HoroscopeModule;
  if (!lib.Origin || !lib.Horoscope) throw new Error("星盘数据计算库加载失败。");
  const origin = new lib.Origin({
    year: form.year, month: form.month - 1, date: form.day,
    hour: form.hour, minute: form.minute, latitude: form.latitude, longitude: form.longitude,
  });
  const horoscope = new lib.Horoscope({
    origin, houseSystem: form.houseSystem, zodiac: form.zodiac,
    aspectPoints: ["bodies", "angles"], aspectWithPoints: ["bodies", "angles"],
    aspectTypes: ["major"], customOrbs: {}, language: "en",
  });
  return buildOpenAIJson(form, horoscope);
}
