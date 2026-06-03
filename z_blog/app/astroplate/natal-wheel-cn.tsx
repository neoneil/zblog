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

const DISPLAY_SUMMARY_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "ascendant", "midheaven"] as const;
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

const STAR_POINTS = Array.from({ length: 90 }, (_, i) => {
  const x = ((i * 73) % 1000) / 10;
  const y = ((i * 47 + 19) % 1000) / 10;
  const r = i % 9 === 0 ? 1.8 : i % 5 === 0 ? 1.2 : 0.7;
  const o = i % 7 === 0 ? 0.9 : i % 3 === 0 ? 0.42 : 0.22;
  return { x, y, r, o };
});


export function NatalWheelCN({ chartJson }: { chartJson: OpenAIChartJson }) {
  const allPoints = useMemo(
    () => [...chartJson.planets, ...chartJson.angles],
    [chartJson.planets, chartJson.angles]
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
  const zodiacOuter = 305;
  const zodiacInner = 246;
  const houseInner = 197;
  const markerRadius = 216;
  const aspectRadius = 128;
  const signLabelRadius = 275;
  const houseLabelRadius = 155;
  const pointLabelRadius = markerRadius;

  const visiblePoints = DISPLAY_SUMMARY_KEYS.map((key) => pointMap.get(key)).filter(Boolean) as ChartPointJson[];

  return (
    <div className="relative mx-auto w-full max-w-[780px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
        <defs>
          <radialGradient id="wheelBg" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#11335f" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#071426" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020814" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="goldStroke" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#8a5e25" />
            <stop offset="35%" stopColor="#f4c66e" />
            <stop offset="70%" stopColor="#bf893a" />
            <stop offset="100%" stopColor="#8a5e25" />
          </linearGradient>

          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={size} height={size} rx="30" fill="url(#wheelBg)" />

        {STAR_POINTS.map((star, i) => (
          <circle
            key={i}
            cx={(star.x / 100) * size}
            cy={(star.y / 100) * size}
            r={star.r}
            fill="#fff0bf"
            opacity={star.o}
          />
        ))}

        <circle
          cx={center}
          cy={center}
          r={zodiacOuter + 8}
          fill="none"
          stroke="rgba(244,198,110,0.18)"
          strokeWidth="2"
          filter="url(#softGlow)"
        />
        <circle
          cx={center}
          cy={center}
          r={zodiacOuter}
          fill="none"
          stroke="url(#goldStroke)"
          strokeWidth="3"
          filter="url(#goldGlow)"
        />
        <circle
          cx={center}
          cy={center}
          r={zodiacInner}
          fill="none"
          stroke="rgba(244,198,110,0.86)"
          strokeWidth="2.2"
          filter="url(#goldGlow)"
        />
        <circle
          cx={center}
          cy={center}
          r={houseInner}
          fill="none"
          stroke="rgba(244,198,110,0.45)"
          strokeWidth="1.5"
        />
        <circle
          cx={center}
          cy={center}
          r={aspectRadius}
          fill="rgba(1,6,14,0.45)"
          stroke="rgba(244,198,110,0.10)"
          strokeWidth="1"
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
              stroke="rgba(244,198,110,0.72)"
              strokeWidth="1.5"
            />
          );
        })}

        {Array.from({ length: 72 }, (_, i) => {
          const deg = i * 5 + rotation;
          const outer = zodiacOuter;
          const inner = i % 6 === 0 ? zodiacInner + 8 : zodiacOuter - 8;
          const p1 = polarToCartesian(center, center, inner, deg);
          const p2 = polarToCartesian(center, center, outer, deg);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={i % 6 === 0 ? "rgba(244,198,110,0.65)" : "rgba(244,198,110,0.28)"}
              strokeWidth={i % 6 === 0 ? 1.2 : 0.8}
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
              fill="#efc36b"
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                filter: "drop-shadow(0 0 12px rgba(239,195,107,0.24))",
              }}
            >
              {SIGN_SYMBOLS[i]}
            </text>
          );
        })}

        {chartJson.houses.map((house, index) => {
          const deg = house.cuspDegrees + rotation;
          const p1 = polarToCartesian(center, center, houseInner, deg);
          const p2 = polarToCartesian(center, center, zodiacInner, deg);
          return (
            <line
              key={`house-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={index === 0 || index === 9 ? "rgba(244,198,110,0.95)" : "rgba(244,198,110,0.35)"}
              strokeWidth={index === 0 || index === 9 ? 2.2 : 1}
            />
          );
        })}

        {chartJson.houses.map((house, index) => {
          const next = chartJson.houses[(index + 1) % chartJson.houses.length];
          const mid = circularMidAngle(house.cuspDegrees, next.cuspDegrees) + rotation;
          const pos = polarToCartesian(center, center, houseLabelRadius, mid);
          return (
            <text
              key={`house-label-${index}`}
              x={pos.x}
              y={pos.y}
              fill="rgba(244,198,110,0.58)"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {HOUSE_LABELS[index]}
            </text>
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

          const color =
            aspect.label === "trine" || aspect.label === "sextile"
              ? "#18d0df"
              : "#ff7a1a";

          return (
            <line
              key={`aspect-${index}`}
              x1={c1.x}
              y1={c1.y}
              x2={c2.x}
              y2={c2.y}
              stroke={color}
              strokeWidth="2.2"
              opacity="0.95"
              style={{
                filter:
                  color === "#18d0df"
                    ? "drop-shadow(0 0 7px rgba(24,208,223,0.35))"
                    : "drop-shadow(0 0 7px rgba(255,122,26,0.38))",
              }}
            />
          );
        })}

        {visiblePoints.map((point, index) => {
          const deg = point.absoluteDegrees + rotation;
          const spread = (index % 5) * 18;
          const pos = polarToCartesian(center, center, pointLabelRadius - spread, deg);
          const isAngle = point.key === "ascendant" || point.key === "midheaven";

          return (
            <g key={point.key}>
              <line
                x1={polarToCartesian(center, center, houseInner + 6, deg).x}
                y1={polarToCartesian(center, center, houseInner + 6, deg).y}
                x2={polarToCartesian(center, center, pointLabelRadius - 18 - spread, deg).x}
                y2={polarToCartesian(center, center, pointLabelRadius - 18 - spread, deg).y}
                stroke={isAngle ? "rgba(244,198,110,0.9)" : "rgba(244,198,110,0.35)"}
                strokeWidth={isAngle ? 2 : 1}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isAngle ? 16 : 13}
                fill="rgba(4,16,28,0.92)"
                stroke="rgba(244,198,110,0.58)"
                strokeWidth="1.5"
              />
              <text
                x={pos.x}
                y={pos.y}
                fill="#efc36b"
                fontSize="18"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(239,195,107,0.22))",
                  fontWeight: 600,
                }}
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
  const diff = ((end - start + 360) % 360);
  return normalizeDegrees(start + diff / 2);
}



function normalizeDegrees(value: number) {
  const mod = value % 360;
  return mod < 0 ? mod + 360 : mod;
}