import { readFileSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import ts from "typescript";

const source = new URL("../features/stella/data/stars.ts", import.meta.url);
const target = new URL("../public/stella/constellations/", import.meta.url);
const { outputText } = ts.transpileModule(readFileSync(source, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});
const catalog = {};
new Function("exports", outputText)(catalog);
const names = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpius",
  "Sagittarius",
  "Capricornus",
  "Aquarius",
  "Pisces",
];
const slugs = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];
const stars = new Map(catalog.BRIGHT_STARS.map((star) => [star.name, star]));
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const normalize = (vector) => {
  const length = Math.hypot(...vector);
  return vector.map((x) => x / length);
};
mkdirSync(target, { recursive: true });

for (const [index, name] of names.entries()) {
  const figure = catalog.CONSTELLATIONS.find((item) => item.name === name);
  const keys = [...new Set(figure.lines.flat())];
  const vectors = keys.map((key) => {
    const star = stars.get(key),
      ra = (star.ra * Math.PI) / 180,
      dec = (star.dec * Math.PI) / 180;
    return [
      Math.cos(dec) * Math.cos(ra),
      Math.cos(dec) * Math.sin(ra),
      Math.sin(dec),
    ];
  });
  // North-up gnomonic projection preserves the real constellation geometry.
  const center = normalize(
    vectors.reduce((sum, v) => sum.map((x, i) => x + v[i]), [0, 0, 0]),
  );
  const ra = Math.atan2(center[1], center[0]),
    east = [-Math.sin(ra), Math.cos(ra), 0];
  const north = [
    -center[2] * Math.cos(ra),
    -center[2] * Math.sin(ra),
    Math.hypot(center[0], center[1]),
  ];
  const projected = vectors.map((v) => [
    -dot(v, east) / dot(v, center),
    -dot(v, north) / dot(v, center),
  ]);
  const xs = projected.map((p) => p[0]),
    ys = projected.map((p) => p[1]);
  const left = Math.min(...xs),
    right = Math.max(...xs),
    top = Math.min(...ys),
    bottom = Math.max(...ys);
  const scale = Math.min(92 / (right - left), 56 / (bottom - top));
  const points = projected.map((p, i) => [
    +(56 + (p[0] - (left + right) / 2) * scale).toFixed(2),
    +(38 + (p[1] - (top + bottom) / 2) * scale).toFixed(2),
    +Math.max(1.45, 2.7 - stars.get(keys[i]).magnitude * 0.17).toFixed(2),
  ]);
  const lines = figure.lines
    .map(([a, b]) => {
      const p = points[keys.indexOf(a)],
        q = points[keys.indexOf(b)];
      return `<path d="M${p[0]} ${p[1]}L${q[0]} ${q[1]}"/>`;
    })
    .join("");
  const halo = points
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${(r * 1.65).toFixed(3)}"/>`,
    )
    .join("");
  const dots = points
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${(r * 0.38).toFixed(3)}" fill="#eefaff"/>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 76" width="112" height="76" fill="none"><title>${slugs[index]} constellation</title><desc>HYG v4.1 star positions: David Nash, CC BY-SA 4.0. d3-celestial lines: Olaf Frohn, BSD-3-Clause. See SOURCES.md and accompanying licenses.</desc><defs><filter id="halo" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.8"/></filter></defs><g stroke="#62d8ff" stroke-width="1.3" stroke-opacity=".78" stroke-linecap="round" stroke-linejoin="round">${lines}</g><g fill="#62d8ff" opacity=".48" filter="url(#halo)">${halo}</g><g fill="#62d8ff">${dots}</g></svg>\n`;
  writeFileSync(new URL(`${slugs[index]}.svg`, target), svg);
}
for (const license of [
  "LICENSE.HYG.md",
  "LICENSE.d3-celestial.txt",
  "LICENSE.CC-BY-SA-4.0.html",
]) {
  copyFileSync(
    new URL(`../features/stella/data/${license}`, import.meta.url),
    new URL(license, target),
  );
}
console.log("Generated 12 Stella constellation images.");
