import { calculateNatalChart, findHouseForDegree, type BirthForm, type OpenAIChartJson } from "./natal-chart";

export const relationships = [
  { key: "romantic", zh: "伴侣 / 恋爱", en: "Romantic partners" },
  { key: "business", zh: "商业伙伴", en: "Business partners" },
  { key: "parent-child", zh: "亲子", en: "Parent & child" },
  { key: "friends", zh: "朋友", en: "Friends" },
  { key: "work", zh: "工作关系", en: "Work relationship" },
  { key: "other", zh: "其他", en: "Other" },
] as const;
export const topics = [
  { key: "emotional", zh: "情感互动", en: "Emotional dynamics" },
  { key: "communication", zh: "沟通", en: "Communication" },
  { key: "attraction", zh: "吸引力", en: "Attraction & affinity" },
  { key: "conflict", zh: "冲突点", en: "Friction & conflict" },
  { key: "longTerm", zh: "长期关系", en: "Long-term connection" },
  { key: "aspects", zh: "主要相位", en: "Major aspects" },
] as const;
export type Relationship = typeof relationships[number]["key"];
export type Topic = typeof topics[number]["key"];
export type PersonInput = BirthForm & { timeKnown: boolean };
export type SynastryInput = {
  personA: PersonInput; personB: PersonInput;
  relationship: Relationship; otherRelationship: string; language: "zh" | "en";
};
const aspectTypes = [
  { key: "conjunction", zh: "合相", en: "Conjunction", angle: 0, orb: 6 },
  { key: "sextile", zh: "六合", en: "Sextile", angle: 60, orb: 4 },
  { key: "square", zh: "刑相", en: "Square", angle: 90, orb: 6 },
  { key: "trine", zh: "拱相", en: "Trine", angle: 120, orb: 6 },
  { key: "opposition", zh: "冲相", en: "Opposition", angle: 180, orb: 6 },
] as const;
export type CrossAspect = {
  a: string; b: string; aZh: string; bZh: string;
  aEn: string; bEn: string; type: string; zh: string; en: string;
  separation: number; orb: number; provisional: boolean;
};
export type Overlay = { key: string; zh: string; en: string; house: number; provisional: boolean };
export type SynastryResult = {
  chartA: OpenAIChartJson; chartB: OpenAIChartJson;
  timeKnownA: boolean; timeKnownB: boolean;
  aspects: CrossAspect[]; aInB: Overlay[]; bInA: Overlay[];
};
export type SynastryReading = { overview: string; sections: Record<Topic, string> };

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("出生信息格式不正确 / Invalid birth details.");
  return value as Record<string, unknown>;
}
function person(value: unknown): PersonInput {
  const p = record(value);
  const ranges: Record<string, [number, number]> = {
    year: [1900, 2100], month: [1, 12], day: [1, 31], hour: [0, 23],
    minute: [0, 59], latitude: [-89, 89], longitude: [-180, 180],
  };
  for (const [key, [min, max]] of Object.entries(ranges)) {
    const n = p[key];
    if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max ||
      (!["latitude", "longitude"].includes(key) && !Number.isInteger(n))) {
      throw new Error("请检查出生日期、时间和经纬度 / Check birth date, time and coordinates.");
    }
  }
  const date = new Date(Date.UTC(p.year as number, (p.month as number) - 1, p.day as number));
  if (date.getUTCMonth() !== (p.month as number) - 1 || date.getUTCDate() !== p.day) throw new Error("出生日期无效 / Invalid birth date.");
  if (typeof p.name !== "string" || p.name.length > 80 || typeof p.timeKnown !== "boolean") throw new Error("姓名或时间状态无效 / Invalid name or time status.");
  const systems = ["placidus", "koch", "campanus", "whole-sign", "equal-house", "regiomontanus", "topocentric"];
  if (!systems.includes(String(p.houseSystem)) || !["tropical", "sidereal"].includes(String(p.zodiac))) throw new Error("无效的星盘设置 / Invalid chart settings.");
  return {
    name: p.name.trim(), year: p.year as number, month: p.month as number, day: p.day as number,
    hour: p.timeKnown ? p.hour as number : 12, minute: p.timeKnown ? p.minute as number : 0,
    latitude: p.latitude as number, longitude: p.longitude as number,
    houseSystem: p.houseSystem as BirthForm["houseSystem"], zodiac: p.zodiac as BirthForm["zodiac"],
    timeKnown: p.timeKnown,
  };
}
export function parseSynastryInput(value: unknown): SynastryInput {
  const body = record(value);
  const personA = person(body.personA), personB = person(body.personB);
  if (personA.zodiac !== personB.zodiac) throw new Error("两人必须使用相同黄道 / Use the same zodiac for both people.");
  if (!relationships.some(item => item.key === body.relationship)) throw new Error("请选择关系类型 / Choose a relationship.");
  if (typeof body.otherRelationship !== "string" || body.otherRelationship.length > 300) throw new Error("关系描述最多 300 字 / Relationship description: maximum 300 characters.");
  if (body.relationship === "other" && !body.otherRelationship.trim()) throw new Error("请描述关系 / Describe the relationship.");
  if (body.language !== "zh" && body.language !== "en") throw new Error("无效语言 / Invalid language.");
  return { personA, personB, relationship: body.relationship as Relationship, otherRelationship: body.relationship === "other" ? body.otherRelationship.trim() : "", language: body.language };
}
export function compareCharts(chartA: OpenAIChartJson, chartB: OpenAIChartJson, timeKnownA: boolean, timeKnownB: boolean): SynastryResult {
  const aPoints = [...chartA.planets, ...(timeKnownA ? chartA.angles : [])];
  const bPoints = [...chartB.planets, ...(timeKnownB ? chartB.angles : [])];
  const aspects: CrossAspect[] = [];
  for (const a of aPoints) for (const b of bPoints) {
    // Axis-to-axis contacts are omitted to keep the first report focused on planets.
    if (chartA.angles.includes(a) && chartB.angles.includes(b)) continue;
    const delta = Math.abs(a.absoluteDegrees - b.absoluteDegrees) % 360;
    const separation = Math.min(delta, 360 - delta);
    for (const type of aspectTypes) {
      const orb = Math.abs(separation - type.angle);
      if (orb <= type.orb) {
        aspects.push({ a: a.key, b: b.key, aZh: a.labelZh, bZh: b.labelZh, aEn: a.label, bEn: b.label,
          type: type.key, zh: type.zh, en: type.en, separation, orb,
          provisional: (!timeKnownA && a.key === "moon") || (!timeKnownB && b.key === "moon") });
      }
    }
  }
  const personal = new Set(["sun", "moon", "mercury", "venus", "mars"]);
  aspects.sort((a, b) => Number(personal.has(b.a) || personal.has(b.b)) - Number(personal.has(a.a) || personal.has(a.b)) || a.orb - b.orb);
  function overlays(source: OpenAIChartJson, target: OpenAIChartJson, sourceKnown: boolean, targetKnown: boolean): Overlay[] {
    if (!targetKnown) return [];
    return source.planets.map(point => ({ key: point.key, zh: point.labelZh, en: point.label,
      house: findHouseForDegree(target.houses.map(h => h.cuspDegrees), point.absoluteDegrees),
      provisional: !sourceKnown && point.key === "moon" }));
  }
  return { chartA, chartB, timeKnownA, timeKnownB, aspects,
    aInB: overlays(chartA, chartB, timeKnownA, timeKnownB), bInA: overlays(chartB, chartA, timeKnownB, timeKnownA) };
}
export async function calculateSynastry(input: SynastryInput): Promise<SynastryResult> {
  const [chartA, chartB] = await Promise.all([calculateNatalChart(input.personA), calculateNatalChart(input.personB)]);
  for (const [chart, known] of [[chartA, input.personA.timeKnown], [chartB, input.personB.timeKnown]] as const) {
    if (chart.planets.some(p => !Number.isFinite(p.absoluteDegrees))) throw new Error("无法计算星体位置 / Cannot calculate planetary positions.");
    if (!known) {
      chart.angles = []; chart.houses = [];
      chart.planets = chart.planets.map(p => ({ ...p, house: undefined }));
      chart.aspects = chart.aspects.filter(a => !["ascendant", "midheaven"].includes(a.point1Key) && !["ascendant", "midheaven"].includes(a.point2Key));
      chart.meta.notes = ["出生时间未知；以当地正午估算。无宫位或轴点数据，月亮及其相位仅供暂定参考。"];
    } else chart.meta.notes = ["出生时间使用出生地当地时间；时区及历史夏令时由星盘引擎处理。"];
  }
  return compareCharts(chartA, chartB, input.personA.timeKnown, input.personB.timeKnown);
}
