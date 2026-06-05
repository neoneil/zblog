"use client";

import { useMemo } from "react";

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

const DISPLAY_POINT_KEYS = [
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
] as const;

const HOUSE_LABELS = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];

const SIGN_SYMBOLS = [
  "白羊",
  "金牛",
  "双子",
  "巨蟹",
  "狮子",
  "处女",
  "天秤",
  "天蝎",
  "射手",
  "摩羯",
  "水瓶",
  "双鱼",
];

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

const STAR_POINTS = Array.from({ length: 55 }, (_, i) => {
  const x = ((i * 73) % 1000) / 10;
  const y = ((i * 47 + 19) % 1000) / 10;
  const r = i % 9 === 0 ? 1.3 : i % 5 === 0 ? 0.9 : 0.55;
  const o = i % 7 === 0 ? 0.26 : i % 3 === 0 ? 0.16 : 0.08;
  return { x, y, r, o };
});

export function NatalWheelCN({ chartJson }: { chartJson: OpenAIChartJson }) {
  const allPoints = useMemo(
    () => [...chartJson.planets, ...chartJson.angles],
    [chartJson.planets, chartJson.angles],
  );

  const pointMap = useMemo(() => {
    const map = new Map<string, ChartPointJson>();
    allPoints.forEach((point) => map.set(point.key, point));
    return map;
  }, [allPoints]);

  const asc = pointMap.get("ascendant");
  const rotation = asc ? 180 - asc.absoluteDegrees : 0;

  const size = 760;
  const center = size / 2;

  // const zodiacOuter = 318;
  // const zodiacInner = 260;
  // const houseOuter = 252;
  // const houseInner = 184;  // 它外面的第一个圈
  // const aspectRadius = houseInner ;// 最小相位圈
  // const signLabelRadius = 290;
  // const houseLabelRadius = 216;
  // const pointBaseRadius = 220;

  const zodiacOuter = 355;
  const zodiacInner = 300;
  const houseOuter = 292;
  const houseInner = 220;
  const aspectRadius = 220;
  const signLabelRadius = 327;
  const houseLabelRadius = 255;
  const pointBaseRadius = 260;
  

  const visiblePoints = useMemo(() => {
    const points = DISPLAY_POINT_KEYS.map((key) => pointMap.get(key)).filter(
      Boolean,
    ) as ChartPointJson[];
    return arrangePointLabels(points);
  }, [pointMap]);

  return (
    <div className="relative mx-auto w-full max-w-[780px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full rounded-[30px] bg-[var(--card-soft)]"
      >
        <defs>
          <radialGradient id="cnWheelBg" cx="50%" cy="45%" r="66%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="58%" stopColor="#f7f3ea" stopOpacity="1" />
            <stop offset="100%" stopColor="#ebe3d5" stopOpacity="1" />
          </radialGradient>

          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="12"
              floodColor="#8a6a3d"
              floodOpacity="0.13"
            />
          </filter>
        </defs>

        <rect
          x="0"
          y="0"
          width={size}
          height={size}
          rx="30"
          fill="url(#cnWheelBg)"
        />

        {STAR_POINTS.map((star, i) => (
          <circle
            key={i}
            cx={(star.x / 100) * size}
            cy={(star.y / 100) * size}
            r={star.r}
            fill="#b8965b"
            opacity={star.o}
          />
        ))}

        <circle
          cx={center}
          cy={center}
          r={zodiacOuter}
          fill="#f0ece5"
          stroke="#d7d0c4"
          strokeWidth="2"
          filter="url(#softShadow)"
        />
        <circle
          cx={center}
          cy={center}
          r={zodiacInner}
          fill="#fbfaf7"
          stroke="#ddd6ca"
          strokeWidth="2"
        />
        <circle
          cx={center}
          cy={center}
          r={houseOuter}
          fill="none"
          stroke="#e4ded4"
          strokeWidth="1.5"
        />
        <circle
          cx={center}
          cy={center}
          r={houseInner}
          fill="#f7f3ec"
          stroke="#d6c8b8"
          strokeWidth="1.5"
        />
        <circle
          cx={center}
          cy={center}
          r={aspectRadius}
          fill="#fdfbf7"
          stroke="#e3d8c8"
          strokeWidth="1.2"
        />

        {Array.from({ length: 12 }, (_, i) => {
          const deg = i * 30 + rotation;
          const p1 = polarToCartesian(center, center, zodiacInner, deg);
          const p2 = polarToCartesian(center, center, zodiacOuter, deg);
          return (
            <line
              key={`sign-boundary-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#d7c4a4"
              strokeWidth="1.5"
            />
          );
        })}

        {Array.from({ length: 72 }, (_, i) => {
          const deg = i * 5 + rotation;
          const inner = i % 6 === 0 ? zodiacOuter - 18 : zodiacOuter - 9;
          const p1 = polarToCartesian(center, center, inner, deg);
          const p2 = polarToCartesian(center, center, zodiacOuter, deg);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={i % 6 === 0 ? "#c5ac83" : "#dfd2bd"}
              strokeWidth={i % 6 === 0 ? 1.1 : 0.8}
            />
          );
        })}

        {Array.from({ length: 12 }, (_, i) => {
          const midDeg = i * 30 + 15 + rotation;
          const pos = polarToCartesian(center, center, signLabelRadius, midDeg);
          return (
            <text
              key={`sign-label-${i}`}
              x={pos.x}
              y={pos.y}
              fill="#b9812f"
              fontSize="18"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {SIGN_SYMBOLS[i]}
            </text>
          );
        })}

        {chartJson.houses.map((house, index) => {
          const deg = house.cuspDegrees + rotation;
          const p1 = polarToCartesian(center, center, houseInner, deg);
          const p2 = polarToCartesian(center, center, houseOuter, deg);
          const p3 = polarToCartesian(center, center, zodiacInner, deg);
          return (
            <g key={`house-cusp-${index}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={index === 0 || index === 9 ? "#a17944" : "#cfc2af"}
                strokeWidth={index === 0 || index === 9 ? 2 : 1.1}
              />
              <line
                x1={p2.x}
                y1={p2.y}
                x2={p3.x}
                y2={p3.y}
                stroke={index === 0 || index === 9 ? "#b58a4a" : "#ded4c5"}
                strokeWidth={index === 0 || index === 9 ? 1.5 : 0.9}
              />
            </g>
          );
        })}

        {chartJson.houses.map((house, index) => {
          const next = chartJson.houses[(index + 1) % chartJson.houses.length];
          const mid =
            circularMidAngle(house.cuspDegrees, next.cuspDegrees) + rotation;
          const pos = polarToCartesian(center, center, houseLabelRadius, mid);
          return (
            <text
              key={`house-label-${index}`}
              x={pos.x}
              y={pos.y}
              fill="#79bca2"
              fontSize="15"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {HOUSE_LABELS[index]}
            </text>
          );
        })}

        {chartJson.houses.map((house, index) => {
          const deg = house.cuspDegrees + rotation;
          const pos = polarToCartesian(center, center, houseOuter + 10, deg);
          return (
            <circle
              key={`house-cusp-dot-${index}`}
              cx={pos.x}
              cy={pos.y}
              r={index === 0 || index === 9 ? 4.2 : 2.6}
              fill={index === 0 || index === 9 ? "#b9812f" : "#d2b17c"}
            />
          );
        })}

        {chartJson.aspects.map((aspect, index) => {
          const p1 = pointMap.get(aspect.point1Key);
          const p2 = pointMap.get(aspect.point2Key);
          if (!p1 || !p2) return null;

          const a = p1.absoluteDegrees + rotation;
          const b = p2.absoluteDegrees + rotation;
          const c1 = polarToCartesian(center, center, aspectRadius, a);
          const c2 = polarToCartesian(center, center, aspectRadius, b);

          const color = getAspectColor(aspect.label);

          return (
            <line
              key={`aspect-${index}`}
              x1={c1.x}
              y1={c1.y}
              x2={c2.x}
              y2={c2.y}
              stroke={color}
              strokeWidth="1.8"
              opacity="0.82"
            />
          );
        })}

        {visiblePoints.map((item) => {
          const point = item.point;
          const deg = point.absoluteDegrees + rotation;
          const labelPos = polarToCartesian(center, center, item.radius, deg);
          const lineStart = polarToCartesian(
            center,
            center,
            houseInner + 8,
            deg,
          );
          const lineEnd = polarToCartesian(
            center,
            center,
            item.radius - 17,
            deg,
          );
          const isAngle =
            point.key === "ascendant" || point.key === "midheaven";

          return (
            <g key={point.key}>
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke={isAngle ? "#b9812f" : "#c5b395"}
                strokeWidth={isAngle ? 1.8 : 1}
                opacity="0.9"
              />
              <circle
                cx={labelPos.x}
                cy={labelPos.y}
                r={isAngle ? 16 : 14}
                fill="#ffffff"
                stroke={isAngle ? "#b9812f" : "#c4a778"}
                strokeWidth={isAngle ? 2 : 1.5}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill={getPointColor(point.key)}
                fontSize={isAngle ? "17" : "18"}
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {POINT_SYMBOLS[point.key] ?? "✦"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function arrangePointLabels(points: ChartPointJson[]) {
  const sorted = [...points].sort(
    (a, b) => a.absoluteDegrees - b.absoluteDegrees,
  );
  const result: Array<{ point: ChartPointJson; radius: number }> = [];
  const baseRadius = 222;
  const radiusSteps = [0, -24, 24, -48, 48, -70];

  sorted.forEach((point) => {
    const nearby = result.filter(
      (item) =>
        angleDistance(item.point.absoluteDegrees, point.absoluteDegrees) < 13,
    );
    const radius =
      baseRadius + radiusSteps[Math.min(nearby.length, radiusSteps.length - 1)];
    result.push({ point, radius });
  });

  const originalOrder = new Map(
    points.map((point, index) => [point.key, index]),
  );
  return result.sort(
    (a, b) =>
      (originalOrder.get(a.point.key) ?? 0) -
      (originalOrder.get(b.point.key) ?? 0),
  );
}

function getAspectColor(label: string) {
  if (label === "trine" || label === "sextile") return "#2d8fd5";
  if (label === "square" || label === "opposition") return "#d95555";
  if (label === "conjunction") return "#42b883";
  return "#9c8f7a";
}

function getPointColor(key: string) {
  if (key === "sun" || key === "mars") return "#d95555";
  if (
    key === "moon" ||
    key === "mercury" ||
    key === "neptune" ||
    key === "pluto"
  )
    return "#2d8fd5";
  if (
    key === "venus" ||
    key === "jupiter" ||
    key === "saturn" ||
    key === "midheaven"
  )
    return "#b9812f";
  if (key === "uranus" || key === "ascendant") return "#42b883";
  return "#8b7658";
}

function polarToCartesian(cx: number, cy: number, r: number, degrees: number) {
  const rad = ((degrees - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function circularMidAngle(a: number, b: number) {
  const start = normalizeDegrees(a);
  const end = normalizeDegrees(b);
  const diff = (end - start + 360) % 360;
  return normalizeDegrees(start + diff / 2);
}

function angleDistance(a: number, b: number) {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return Math.min(diff, 360 - diff);
}

function normalizeDegrees(value: number) {
  const mod = value % 360;
  return mod < 0 ? mod + 360 : mod;
}
