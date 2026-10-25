"""Rebuild the local sky catalog using only Python's standard library.

Run: python3 features/stella/data/generate_catalog.py
Network access is build-time only. See CATALOG_SOURCES.md for provenance/licenses.
"""
import csv
import hashlib
import io
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parent
HYG_REV = "3bf37f4b2d5460e1278286320d1d62fab9b493c1"
D3_REV = "7e720a3de062059d4c5400a379146a601d9010e0"
HYG = f"https://raw.githubusercontent.com/astronexus/HYG-Database/{HYG_REV}/"
D3 = f"https://raw.githubusercontent.com/ofrohn/d3-celestial/{D3_REV}/"
hashes = {}


def fetch(url):
    with urllib.request.urlopen(url, timeout=120) as response:
        content = response.read()
    hashes[url] = hashlib.sha256(content).hexdigest()
    return content.decode("utf-8")


rows = list(csv.DictReader(io.StringIO(fetch(HYG + "hyg/CURRENT/hygdata_v41.csv"))))
by_hip = {int(row["hip"]): row for row in rows if row["hip"]}
stars = json.loads(fetch(D3 + "data/stars.8.json"))["features"]
figures = json.loads(fetch(D3 + "data/constellations.lines.json"))["features"]
names = {f["id"]: f["properties"]["name"] for f in json.loads(fetch(D3 + "data/constellations.json"))["features"]}
# The line coordinates are copied from this same d3 catalog, rounded to 4 decimals.
coordinate_hips = {tuple(s["geometry"]["coordinates"]): int(s["id"]) for s in stars}
d3_by_hip = {int(s["id"]): s for s in stars}
endpoint_hips = set()
resolved = []
for figure in figures:
    segments = []
    for polyline in figure["geometry"]["coordinates"]:
        hips = []
        for coordinate in polyline:
            hip = coordinate_hips.get(tuple(coordinate))
            if hip is None:
                raise ValueError(f"Unresolved endpoint: {figure['id']} {coordinate}, HIP={hip}")
            endpoint_hips.add(hip)
            hips.append(hip)
        segments.extend(zip(hips, hips[1:]))
    resolved.append((figure["id"], segments))

# Include named stars beyond the magnitude cutoff as well as all line endpoints.
selected = [r for r in rows if r["id"] != "0" and r["mag"] and
            (float(r["mag"]) <= 6 or r["proper"] or (r["hip"] and int(r["hip"]) in endpoint_hips))]
used_names = set()
hip_names = {}
catalog = []
for row in selected:
    fallback = "HIP " + row["hip"] if row["hip"] else "HYG " + row["id"]
    name = row["proper"] or fallback
    if name in used_names:
        name = fallback
    if name in used_names:
        raise ValueError(f"Duplicate star name: {name}")
    used_names.add(name)
    if row["hip"]:
        hip_names[int(row["hip"])] = name
    catalog.append(dict(name=name, ra=round(float(row["ra"]) * 15, 6),
                        dec=float(row["dec"]), magnitude=float(row["mag"])))

# A few combined/multiple-star HIP records are absent from HYG. Preserve these
# genuine endpoints from d3's XHIP-derived star catalog, not a nearest neighbor.
supplemental_hips = sorted(endpoint_hips - by_hip.keys())
for hip in supplemental_hips:
    star = d3_by_hip[hip]
    ra, dec = star["geometry"]["coordinates"]
    name = f"HIP {hip}"
    assert name not in used_names
    hip_names[hip] = name
    used_names.add(name)
    catalog.append(dict(name=name, ra=ra % 360, dec=dec, magnitude=star["properties"]["mag"]))

# d3 has two Serpens figures (head/tail); combine them into one IAU constellation.
constellations = {}
for abbreviation, segments in resolved:
    name = "Serpens" if abbreviation.startswith("Ser") else names[abbreviation]
    lines = constellations.setdefault(name, [])
    for a, b in segments:
        pair = [hip_names[a], hip_names[b]]
        if pair[0] != pair[1] and pair not in lines and pair[::-1] not in lines:
            lines.append(pair)
assert len(constellations) == 88, len(constellations)

header = '''/**
 * Generated HYG v4.1 stars (CC BY-SA 4.0, David Nash / Astronomy Nexus) and
 * d3-celestial constellation figures (BSD-3-Clause, Copyright 2015 Olaf Frohn).
 * See CATALOG_SOURCES.md and local license texts. Rebuild: generate_catalog.py.
 * RA/Dec: J2000 equatorial DEGREES; no proper motion. Magnitude <=6 plus all
 * named HYG stars and required line endpoints (d3/XHIP if absent from HYG).
 * Sun excluded. Names are proper
 * names where available, otherwise HIP identifiers (HYG fallback if no HIP).
 */
export interface BrightStar {
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
}

export interface SkyConstellation {
  name: string;
  lines: Array<[string, string]>;
}

'''
compact = lambda value: json.dumps(value, ensure_ascii=True, separators=(",", ":"))
output = header + "export const BRIGHT_STARS: BrightStar[] = [\n"
output += "".join("  " + compact(star) + ",\n" for star in catalog)
output += "];\n\nexport const CONSTELLATIONS: SkyConstellation[] = [\n"
output += "".join("  " + compact(dict(name=name, lines=lines)) + ",\n" for name, lines in constellations.items())
output += "];\n"
(ROOT / "stars.ts").write_text(output, encoding="utf-8")
(ROOT / "LICENSE.d3-celestial.txt").write_text(fetch(D3 + "LICENSE"), encoding="utf-8")
(ROOT / "LICENSE.HYG.md").write_text(fetch(HYG + "LICENSE"), encoding="utf-8")
(ROOT / "LICENSE.CC-BY-SA-4.0.html").write_text(fetch("https://raw.githubusercontent.com/creativecommons/creativecommons.org/main/docroot/legalcode/by-sa_4.0.html"), encoding="utf-8")
report = dict(stars=len(catalog), magnitudeLimit=6, magnitudeLimitedStars=sum(float(r["mag"]) <= 6 for r in selected),
              namedStars=sum(bool(r["proper"]) for r in selected),
              fainterLineEndpoints=sum(float(by_hip[h]["mag"]) > 6 for h in endpoint_hips if h in by_hip),
              supplementalD3HipIds=supplemental_hips,
              constellations=len(constellations), lineSegments=sum(map(len, constellations.values())),
              endpointStars=len(endpoint_hips), unresolvedEndpoints=0, sourceSha256=hashes)
(ROOT / "catalog-provenance.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
total = sum(p.stat().st_size for p in ROOT.iterdir() if p.is_file())
assert total < 700_000, total
print(json.dumps({k: v for k, v in report.items() if k != "sourceSha256"}, indent=2))
print(f"Data directory total: {total} bytes")
