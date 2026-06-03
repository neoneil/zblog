"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { NatalWheel } from "./natal-wheel";

import { NatalWheelCN } from "./natal-wheel-cn-v3";
type BirthForm = {
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

type ChartPointJson = {
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

type OpenAIChartJson = {
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

type CalculationState = {
  chartJson: OpenAIChartJson | null;
  error: string | null;
  isLoading: boolean;
};

const DEFAULT_FORM: BirthForm = {
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

const DISPLAY_SUMMARY_KEYS = [
  "sun",
  "moon",
  "ascendant",
  "mercury",
  "venus",
  "mars",
  "saturn",
  "midheaven",
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

const POINT_SYMBOLS: Record<string, string> = {
  sun: "日",
  moon: "月",
  mercury: "水",
  venus: "金",
  mars: "火",
  jupiter: "木",
  saturn: "土",
  uranus: "天",
  neptune: "海",
  pluto: "冥",
  ascendant: "升",
  midheaven: "顶",
};

const HOUSE_SYSTEM_ZH: Record<BirthForm["houseSystem"], string> = {
  placidus: "普拉西德制",
  koch: "柯赫制",
  campanus: "坎帕努斯制",
  "whole-sign": "整宫制",
  "equal-house": "等宫制",
  regiomontanus: "雷吉蒙塔努斯制",
  topocentric: "地平制",
};

const ZODIAC_ZH: Record<BirthForm["zodiac"], string> = {
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

const INPUT_CLASS =
  "w-full rounded-2xl border border-[#8a6730]/40 bg-[#071523]/90 px-4 py-3 text-sm text-[#f6e6b4] outline-none transition placeholder:text-[#8b98ac] focus:border-[#f1c36b] focus:ring-2 focus:ring-[#f1c36b]/20";

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

export default function AstrologyPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<BirthForm>(DEFAULT_FORM);
  const [submittedForm, setSubmittedForm] = useState<BirthForm>(DEFAULT_FORM);
  const [calcState, setCalcState] = useState<CalculationState>({
    chartJson: null,
    error: null,
    isLoading: false,
  });

  const [cityQuery, setCityQuery] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [userQuestion, setUserQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [readingLoading, setReadingLoading] = useState(false);
  const [readingError, setReadingError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const run = async () => {
      setCalcState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const horoscopeLib: any = await import("circular-natal-horoscope-js");
        if (cancelled) return;

        const OriginCtor = horoscopeLib?.Origin;
        const HoroscopeCtor = horoscopeLib?.Horoscope;

        if (!OriginCtor || !HoroscopeCtor) {
          throw new Error("星盘数据计算库加载失败。");
        }

        const origin = new OriginCtor({
          year: submittedForm.year,
          month: submittedForm.month - 1,
          date: submittedForm.day,
          hour: submittedForm.hour,
          minute: submittedForm.minute,
          latitude: submittedForm.latitude,
          longitude: submittedForm.longitude,
        });

        const horoscope = new HoroscopeCtor({
          origin,
          houseSystem: submittedForm.houseSystem,
          zodiac: submittedForm.zodiac,
          aspectPoints: ["bodies", "angles"],
          aspectWithPoints: ["bodies", "angles"],
          aspectTypes: ["major"],
          customOrbs: {},
          language: "en",
        });
        console.log("horoscope.Houses:", horoscope.Houses);
        console.log("full horoscope:", horoscope);
        const chartJson = buildOpenAIJson(submittedForm, horoscope);

        if (!cancelled) {
          setCalcState({
            chartJson,
            error: null,
            isLoading: false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setCalcState({
            chartJson: null,
            error: error instanceof Error ? error.message : "生成星盘失败。",
            isLoading: false,
          });
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [mounted, submittedForm]);

  const chartJson = calcState.chartJson;

  const summaryCards = useMemo(() => {
    if (!chartJson) return [];
    const allPoints = [...chartJson.planets, ...chartJson.angles];
    return DISPLAY_SUMMARY_KEYS.map((key) =>
      allPoints.find((item) => item.key === key),
    ).filter(Boolean) as ChartPointJson[];
  }, [chartJson]);

  async function handleLookupCity() {
    const query = cityQuery.trim();

    if (!query) {
      setGeoError("请输入城市名，例如：Melbourne 或 Melbourne, Australia");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(query)}` +
        `&format=jsonv2` +
        `&addressdetails=1` +
        `&limit=5` +
        `&accept-language=zh-CN,en`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("城市查询失败，请稍后再试。");
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("没有找到匹配的城市，请换一个更完整的写法。");
      }

      const preferred =
        data.find(
          (item: any) =>
            item?.category === "place" &&
            [
              "city",
              "town",
              "village",
              "administrative",
              "suburb",
              "county",
            ].includes(item?.type),
        ) ?? data[0];

      const lat = Number(preferred.lat);
      const lon = Number(preferred.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error("查询到了地点，但经纬度无效。");
      }

      setForm((prev) => ({
        ...prev,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lon.toFixed(6)),
      }));

      setGeoError(null);
    } catch (error) {
      setGeoError(error instanceof Error ? error.message : "城市查询失败。");
    } finally {
      setGeoLoading(false);
    }
  }

  async function handleGenerateReading() {
    if (!chartJson) {
      setReadingError("请先生成星盘。");
      return;
    }

    setReadingLoading(true);
    setReadingError(null);
    setReading("");

    try {
      const res = await fetch("/api/astroplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          chartJson,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "AI 解读生成失败。");
      }

      setReading(data?.reading || "暂时没有生成解读。");
    } catch (error) {
      setReadingError(
        error instanceof Error ? error.message : "AI 解读生成失败。",
      );
    } finally {
      setReadingLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020814] px-4 py-5 text-[#f4e7c2] sm:px-5 md:px-6 md:py-8 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(18,57,115,0.32),transparent_36%),radial-gradient(circle_at_20%_30%,rgba(0,153,255,0.08),transparent_26%),radial-gradient(circle_at_80%_35%,rgba(255,181,72,0.10),transparent_20%),linear-gradient(180deg,#020814_0%,#03101f_42%,#020814_100%)]" />
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(255,221,154,0.8)_0.8px,transparent_0.8px)] [background-size:34px_34px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_62%,rgba(0,0,0,0.38)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-[#c6923c]/50 bg-[#0a1626]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#ddb46c] shadow-[0_0_0_1px_rgba(255,199,107,0.08),0_0_24px_rgba(255,188,84,0.10)]">
              星盘 Natal Chart
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
              出生星盘解析
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#93a4bf] md:text-base">
              先输入出生信息，再点击按钮生成星盘。右侧会生成星盘，并进行AI解读。
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[500px_minmax(0,1fr)_500px]">
          <section className="rounded-[28px] border border-[#89662e]/45 bg-[linear-gradient(180deg,rgba(4,18,33,0.96),rgba(2,11,22,0.94))] p-5 shadow-[0_0_0_1px_rgba(255,196,99,0.06),0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,230,163,0.05)] md:p-6">
            <div className="mb-5">
              <h2 className="text-[32px] font-semibold leading-none text-white">
                出生信息
              </h2>
              <p className="mt-3 text-sm text-[#96a6c0]">
                不知道经纬度的话，可以都填 0，不影响生成。
              </p>
            </div>

            <div className="grid gap-4">
              <Field label="姓名">
                <input
                  className={INPUT_CLASS}
                  placeholder="可留空"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="出生年">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    value={form.year}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        year: Number(e.target.value),
                      }))
                    }
                  />
                </Field>

                <Field label="出生月">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    min={1}
                    max={12}
                    value={form.month}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        month: Number(e.target.value),
                      }))
                    }
                  />
                </Field>

                <Field label="出生日">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    min={1}
                    max={31}
                    value={form.day}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        day: Number(e.target.value),
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="出生小时">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    min={0}
                    max={23}
                    value={form.hour}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        hour: Number(e.target.value),
                      }))
                    }
                  />
                </Field>

                <Field label="出生分钟">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    min={0}
                    max={59}
                    value={form.minute}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        minute: Number(e.target.value),
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <Field label="出生城市 / 城市, 国家">
                  <div className="flex items-stretch gap-3">
                    <input
                      className={`${INPUT_CLASS} min-w-0 flex-1`}
                      placeholder="例如：Melbourne, Australia"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleLookupCity}
                      disabled={geoLoading}
                      className="shrink-0 min-w-[116px] rounded-2xl border border-[#8d6a33] bg-[#13243c] px-4 py-3 text-sm font-medium text-[#efc36b] transition hover:border-[#f2c36a] hover:bg-[#182d4b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {geoLoading ? "查询中..." : "自动查询"}
                    </button>
                  </div>
                </Field>

                <div className="rounded-2xl border border-[#365c86] bg-[#081b31] px-4 py-3 text-sm leading-7 text-[#7fa9d8]">
                  可以输入城市名自动填写经纬度。建议写成“城市, 国家”，例如
                  Melbourne, Australia，这样结果更稳定。
                </div>

                {geoError ? (
                  <div className="rounded-2xl border border-[#874152] bg-[#2a1018] px-4 py-3 text-sm leading-7 text-[#ffb8c3]">
                    {geoError}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="纬度 Latitude">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    step="0.0001"
                    placeholder="不知道可填 0"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        latitude: Number(e.target.value),
                      }))
                    }
                  />
                </Field>

                <Field label="经度 Longitude">
                  <input
                    className={INPUT_CLASS}
                    type="number"
                    step="0.0001"
                    placeholder="不知道可填 0"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        longitude: Number(e.target.value),
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="rounded-2xl border border-[#7e5c2d] bg-[#18120a] px-4 py-3 text-sm leading-7 text-[#d3ab60]">
                提示：经纬度会影响上升 Ascendant、天顶 Midheaven、宫位 Houses
                等结果。 如果用户不知道，也可以直接填 0，先生成可用版本。
              </div>

              <Field label="宫位系统 House System">
                <select
                  className={INPUT_CLASS}
                  value={form.houseSystem}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      houseSystem: e.target.value as BirthForm["houseSystem"],
                    }))
                  }
                >
                  <option value="placidus">普拉西德制 Placidus</option>
                  <option value="koch">柯赫制 Koch</option>
                  <option value="campanus">坎帕努斯制 Campanus</option>
                  <option value="whole-sign">整宫制 Whole Sign</option>
                  <option value="equal-house">等宫制 Equal House</option>
                  <option value="regiomontanus">
                    雷吉蒙塔努斯制 Regiomontanus
                  </option>
                  <option value="topocentric">地平制 Topocentric</option>
                </select>
              </Field>

              <Field label="黄道类型 Zodiac">
                <select
                  className={INPUT_CLASS}
                  value={form.zodiac}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      zodiac: e.target.value as BirthForm["zodiac"],
                    }))
                  }
                >
                  <option value="tropical">回归黄道 Tropical</option>
                  <option value="sidereal">恒星黄道 Sidereal</option>
                </select>
              </Field>

              <button
                type="button"
                onClick={() => {
                  setSubmittedForm({ ...form });
                  setReading("");
                  setReadingError(null);
                }}
                className="mt-2 w-full rounded-2xl border border-[#f1c36b]/50 bg-[linear-gradient(180deg,#d4a34a_0%,#c7903d_45%,#b57b2d_100%)] px-4 py-4 text-base font-semibold text-[#1b1205] shadow-[0_8px_28px_rgba(220,165,74,0.25),inset_0_1px_0_rgba(255,243,204,0.55)] transition hover:brightness-110"
              >
                {calcState.isLoading ? "生成中..." : "生成星盘 ✦"}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#89662e]/45 bg-[linear-gradient(180deg,rgba(4,18,33,0.96),rgba(2,11,22,0.94))] p-4 shadow-[0_0_0_1px_rgba(255,196,99,0.06),0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,230,163,0.05)] md:p-6">
            <div className="rounded-[24px] border border-[#8e6830]/40 bg-[radial-gradient(circle_at_50%_12%,rgba(24,63,120,0.34),rgba(3,10,19,0.94)_46%,rgba(2,7,15,0.98)_100%)] p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#d2a75e]">
                    已生成的本命盘 Natal Chart
                  </p>
                </div>
                <span className="rounded-xl border border-[#8d6a33] bg-[#0c1727] px-3 py-1.5 text-xs font-medium text-[#efc36b]">
                  SVG
                </span>
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-[#8d6a33]/35 bg-[radial-gradient(circle_at_center,rgba(17,49,92,0.48),rgba(4,13,24,0.94)_55%,rgba(2,7,15,1)_100%)] p-3">
                {chartJson ? (
                  <NatalWheelCN chartJson={chartJson} />
                ) : (
                  <div className="flex min-h-[720px] items-center justify-center rounded-[24px] border border-dashed border-[#8d6a33]/35 text-center text-[#7186a5]">
                    <div>
                      <div className="mb-3 text-3xl text-[#dcb367]">✦</div>
                      <p className="text-sm">生成后会在这里显示星盘</p>
                    </div>
                  </div>
                )}
              </div>

              {calcState.isLoading ? (
                <div className="mt-4 text-center text-sm text-[#9cb0ca]">
                  正在生成星盘...
                </div>
              ) : null}

              {calcState.error ? (
                <div className="mt-4 rounded-2xl border border-[#874152] bg-[#2a1018] px-4 py-3 text-sm text-[#ffb8c3]">
                  {calcState.error}
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((item) => (
                  <SummaryCard key={item.key} item={item} />
                ))}
              </div>

              <div className="mt-4 rounded-[22px] border border-[#88672f]/35 bg-[#07111d]/85 p-5">
                <h3 className="mb-3 text-[20px] font-semibold text-white">
                  星盘信息概览
                </h3>

                <div className="space-y-3 text-sm leading-7 text-[#b8c7db]">
                  <InfoRow
                    label="出生时间"
                    value={`${submittedForm.year}-${String(submittedForm.month).padStart(2, "0")}-${String(
                      submittedForm.day,
                    ).padStart(
                      2,
                      "0",
                    )} ${String(submittedForm.hour).padStart(2, "0")}:${String(
                      submittedForm.minute,
                    ).padStart(2, "0")}`}
                  />
                  <InfoRow
                    label="出生地点"
                    value={`纬度 ${submittedForm.latitude}, 经度 ${submittedForm.longitude}`}
                  />
                  <InfoRow
                    label="黄道类型"
                    value={ZODIAC_ZH[submittedForm.zodiac]}
                  />
                  <InfoRow
                    label="宫位系统"
                    value={HOUSE_SYSTEM_ZH[submittedForm.houseSystem]}
                  />
                  <p className="pt-2 text-[#8fa2be]">
                    经纬度为 0 时，宫位、上升、天顶的精确性可能下降。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#89662e]/45 bg-[linear-gradient(180deg,rgba(4,18,33,0.96),rgba(2,11,22,0.94))] p-5 shadow-[0_0_0_1px_rgba(255,196,99,0.06),0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,230,163,0.05)] md:p-6">
              {/* <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#d2a75e]">
                    用户星盘核心数据
                  </p>
                  <h2 className="text-[36px] font-semibold leading-none text-white">
                    AI 输入
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    if (!chartJson) return;
                    await navigator.clipboard.writeText(
                      JSON.stringify(chartJson, null, 2),
                    );
                  }}
                  className="rounded-xl border border-[#8d6a33] bg-[#0d1727] px-3 py-2 text-xs font-medium text-[#efc36b] transition hover:bg-[#13243c]"
                >
                  复制 JSON
                </button>
              </div> */}

              {/* <div className="mb-3 rounded-2xl border border-[#2c724b] bg-[#0b2318] px-4 py-3 text-sm leading-7 text-[#76d19a]">
                当前只保留：核心星体、上升 Ascendant、天顶 Midheaven、12
                宫头、主要相位。
              </div> */}

              {/* <pre className="max-h-[760px] overflow-auto rounded-2xl border border-[#29415e] bg-[#061120] p-4 text-xs leading-6 text-[#c7d3e3]">
                {chartJson
                  ? JSON.stringify(chartJson, null, 2)
                  : "等待生成结果..."}
              </pre> */}
            </div>

            <div className="rounded-[28px] border border-[#89662e]/45 bg-[linear-gradient(180deg,rgba(4,18,33,0.96),rgba(2,11,22,0.94))] p-5 shadow-[0_0_0_1px_rgba(255,196,99,0.06),0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,230,163,0.05)] md:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#d2a75e]">AI 解读</p>
                  <h2 className="text-[34px] font-semibold leading-none text-white">
                    星盘中文分析
                  </h2>
                </div>
                <div className="text-2xl text-[#efc36b]">✧</div>
              </div>

              <div className="space-y-3">
                <Field label="你想问 AI 的问题（可选）">
                  <textarea
                    className={`${INPUT_CLASS} min-h-[90px] resize-y`}
                    placeholder="例如：我的感情模式是什么？我的事业方向适合什么类型？不输入也可，由 AI 概括体验。"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                  />
                </Field>

                <button
                  type="button"
                  disabled={!chartJson || readingLoading || calcState.isLoading}
                  onClick={handleGenerateReading}
                  className="w-full rounded-2xl border border-[#f1c36b]/50 bg-[linear-gradient(180deg,#d4a34a_0%,#c7903d_45%,#b57b2d_100%)] px-4 py-4 text-base font-semibold text-[#1b1205] shadow-[0_8px_28px_rgba(220,165,74,0.25),inset_0_1px_0_rgba(255,243,204,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {readingLoading ? "AI 解读生成中..." : "AI 解读星盘 ✦"}
                </button>

                {!chartJson ? (
                  <div className="rounded-2xl border border-[#29415e] bg-[#08131f] px-4 py-3 text-sm text-[#8da0ba]">
                    请先生成星盘，然后点击上方按钮进行解读。
                  </div>
                ) : null}

                {readingError ? (
                  <div className="rounded-2xl border border-[#874152] bg-[#2a1018] px-4 py-3 text-sm text-[#ffb8c3]">
                    {readingError}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-[#29415e] bg-[#061120] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">
                      解读结果
                    </h3>
                    {reading ? (
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(reading);
                        }}
                        className="rounded-xl border border-[#8d6a33] bg-[#0d1727] px-3 py-2 text-xs font-medium text-[#efc36b] transition hover:bg-[#13243c]"
                      >
                        复制解读
                      </button>
                    ) : null}
                  </div>

                  <div className="max-h-[560px] overflow-auto rounded-2xl border border-[#203753] bg-[#07111d] p-4">
                    {readingLoading ? (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#9cb0ca]">
                        正在生成解读，请稍等...
                      </p>
                    ) : reading ? (
                      <div className="whitespace-pre-wrap text-sm leading-7 text-[#dbe4f2]">
                        {reading}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#7085a5]">
                        这里会显示 AI 返回的中文解读结果……
                        {"\n"}
                        请先生成星盘，然后点击上方按钮进行解读。
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d9aa5f]">
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryCard({ item }: { item: ChartPointJson }) {
  const symbol = POINT_SYMBOLS[item.key] ?? "✦";

  return (
    <div className="rounded-[20px] border border-[#89662e]/35 bg-[linear-gradient(180deg,rgba(8,19,32,0.92),rgba(6,15,26,0.88))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,231,177,0.05)]">
      <div className="text-[34px] leading-none text-[#efc36b] drop-shadow-[0_0_10px_rgba(239,195,107,0.22)]">
        {symbol}
      </div>
      <p className="mt-2 text-[14px] leading-5 text-white">
        {item.labelZh}
        <br />
        <span className="text-[#b8c7db]">{item.label}</span>
      </p>
      <p className="mt-2 text-[15px] font-medium text-[#efc36b]">
        {item.signZh}
      </p>
      <p className="text-[14px] text-[#efc36b]">
        {item.signDegrees.toFixed(2)}°
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="min-w-[76px] text-[#efc36b]">{label}</div>
      <div className="text-[#b8c7db]">{value}</div>
    </div>
  );
}

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

function extractAbsoluteDegrees(point: any): number {
  const candidate =
    point?.ChartPosition?.Ecliptic?.DecimalDegrees ??
    point?.ChartPosition?.Horizon?.DecimalDegrees ??
    point?.ChartPosition?.Ecliptic?.ArcDegrees?.degrees ??
    point?.DecimalDegrees ??
    point?.position ??
    0;

  return normalizeDegrees(Number(candidate) || 0);
}

function isRetrograde(point: any): boolean {
  return Boolean(point?.isRetrograde || point?.retrograde || point?.Retrograde);
}

function findHouseForDegree(houses: number[], degree: number) {
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

function getAnglePoint(horoscope: any, key: (typeof ANGLE_KEYS)[number]) {
  const angles = horoscope?.Angles ?? {};
  return (
    angles?.[key] ??
    angles?.[key === "ascendant" ? "Ascendant" : "Midheaven"] ??
    horoscope?.[key] ??
    null
  );
}

function buildAstroChartCusps(horoscope: any) {
  const houses = horoscope?.Houses;

  if (!Array.isArray(houses) || houses.length < 12) {
    return Array.from({ length: 12 }, (_, i) => i * 30);
  }

  return houses.slice(0, 12).map((house: any, index: number) => {
    const degree =
      house?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees ??
      house?.ChartPosition?.Ecliptic?.DecimalDegrees ??
      index * 30;

    return normalizeDegrees(Number(degree) || 0);
  });
}

function buildOpenAIJson(form: BirthForm, horoscope: any): OpenAIChartJson {
  const houseCusps = buildAstroChartCusps(horoscope);

  const planets = CORE_PLANET_KEYS.map((key) => {
    const point = horoscope?.CelestialBodies?.[key];
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

  const aspectsSource = horoscope?.Aspects?.all ?? horoscope?.Aspects ?? [];
  const aspects = Array.isArray(aspectsSource)
    ? aspectsSource
        .map((aspect: any) => {
          const point1Key = normalizePointKey(
            aspect?.point1Key ?? aspect?.point1 ?? aspect?.pointA,
          );
          const point2Key = normalizePointKey(
            aspect?.point2Key ?? aspect?.point2 ?? aspect?.pointB,
          );
          const label = normalizeAspectKey(
            aspect?.aspectKey ?? aspect?.label ?? aspect?.type,
          );

          return {
            point1Key,
            point2Key,
            label,
            orb: Number(aspect?.orb ?? aspect?.Orb ?? 0),
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
