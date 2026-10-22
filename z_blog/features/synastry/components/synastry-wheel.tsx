import type { SynastryResult } from "@/lib/astrology/synastry";

const signs = ["白羊 Aries", "金牛 Taurus", "双子 Gemini", "巨蟹 Cancer", "狮子 Leo", "处女 Virgo", "天秤 Libra", "天蝎 Scorpio", "射手 Sagittarius", "摩羯 Capricorn", "水瓶 Aquarius", "双鱼 Pisces"];
const symbols: Record<string, string> = { sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂", jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇" };
function point(degrees: number, radius: number) {
  const angle = (180 - degrees) * Math.PI / 180;
  return { x: 380 + radius * Math.cos(angle), y: 380 - radius * Math.sin(angle) };
}
function labelPositions(points: SynastryResult["chartA"]["planets"]) {
  const labels = points.map(p => ({ key: p.key, degree: p.absoluteDegrees })).sort((a, b) => a.degree - b.degree);
  // Repel adjacent labels on the circle while retaining true positions as separate ticks.
  for (let pass = 0; pass < 120; pass++) for (let i = 0; i < labels.length; i++) {
    const next = (i + 1) % labels.length;
    const gap = labels[next].degree + (next === 0 ? 360 : 0) - labels[i].degree;
    if (gap < 10) {
      const shift = (10 - gap) / 2;
      labels[i].degree -= shift;
      labels[next].degree += shift;
    }
  }
  return new Map(labels.map(label => [label.key, label.degree]));
}
export default function SynastryWheel({ result, language }: { result: SynastryResult; language: "zh" | "en" }) {
  return <figure className="mx-auto w-full max-w-3xl">
    <svg viewBox="0 0 760 760" role="img" aria-label="Synastry: Person A inner ring, Person B outer ring" className="h-auto w-full">
      <circle cx="380" cy="380" r="360" fill="var(--card)" stroke="var(--border)" />
      {[330, 285, 215, 145].map(r => <circle key={r} cx="380" cy="380" r={r} fill="none" stroke="var(--border)" />)}
      {signs.map((sign, index) => {
        const p = point(index * 30, 330), q = point(index * 30, 360), label = point(index * 30 + 15, 345);
        return <g key={sign}><line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="var(--border)" /><text x={label.x} y={label.y} fontSize="12" textAnchor="middle" dominantBaseline="middle" fill="var(--text-soft)">{sign.split(" ")[language === "zh" ? 0 : 1]}</text></g>;
      })}
      {result.aspects.filter(a => symbols[a.a] && symbols[a.b] && !a.provisional).slice(0, 15).map(a => {
        const first = result.chartA.planets.find(p => p.key === a.a)!;
        const second = result.chartB.planets.find(p => p.key === a.b)!;
        const p = point(first.absoluteDegrees, 140), q = point(second.absoluteDegrees, 140);
        return <line key={a.a + a.b + a.type} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={["square", "opposition"].includes(a.type) ? "var(--danger)" : "var(--primary)"} opacity=".5" strokeWidth="1.5"><title>{a.aEn} — {a.bEn}: {a.en} ({a.orb.toFixed(2)}°)</title></line>;
      })}
      {[result.chartA, result.chartB].map((chart, person) => {
        const labels = labelPositions(chart.planets);
        return chart.planets.map(p => {
        const radius = person === 0 ? 175 : 250;
        const location = point(labels.get(p.key) ?? p.absoluteDegrees, radius);
        const tick = point(p.absoluteDegrees, person === 0 ? 212 : 282);
        return <g key={person + p.key}><line x1={tick.x} y1={tick.y} x2={location.x} y2={location.y} stroke={person === 0 ? "var(--primary)" : "var(--text-soft)"} opacity=".4" /><circle cx={tick.x} cy={tick.y} r="3" fill={person === 0 ? "var(--primary)" : "var(--text)"} /><text x={location.x} y={location.y} textAnchor="middle" dominantBaseline="middle" fontSize="22" fill={person === 0 ? "var(--primary)" : "var(--text)"}>{symbols[p.key]}<title>{person === 0 ? "A" : "B"} {p.label}: {p.absoluteDegrees.toFixed(2)}°</title></text></g>;
      }); })}
      <text x="380" y="374" fill="var(--heading)" textAnchor="middle" fontSize="17">A × B</text>
      <text x="380" y="398" fill="var(--text-soft)" textAnchor="middle" fontSize="12">SYNASTRY</text>
    </svg>
    <figcaption className="text-center text-sm text-[var(--text-soft)]">A · {result.chartA.meta.name || "Person A"} · B · {result.chartB.meta.name || "Person B"}</figcaption>
  </figure>;
}
