# Stella Sky Catalog

`stars.ts` preserves the scene-facing `BRIGHT_STARS` and `CONSTELLATIONS` exports.
The generated data is local: no runtime downloads or dependencies are required.

## Stars

Source: HYG v4.1, David Nash / Astronomy Nexus, compiled from Hipparcos,
Yale Bright Star and Gliese catalogs. Copyright/license: CC BY-SA 4.0.
The adapted star catalog is distributed under that same license.

- Repository: https://github.com/astronexus/HYG-Database
- Revision: `3bf37f4b2d5460e1278286320d1d62fab9b493c1`
- Input: `hyg/CURRENT/hygdata_v41.csv`
- Documentation: https://github.com/astronexus/HYG-Database/tree/main/hyg
- Local notices: `LICENSE.HYG.md`, `LICENSE.CC-BY-SA-4.0.html` (legal code
  from Creative Commons' official `creativecommons.org` GitHub repository)

Selection: every non-Sun row with visual magnitude <=6, all HYG proper-named
stars with a magnitude, and any additional constellation-line endpoints.
RA is converted from hours to degrees and rounded to six decimals. Declination
and visual apparent magnitude are retained. Positions are equatorial J2000,
not ecliptic-of-date. No proper motion, parallax or extinction is applied.
Variable-star magnitudes are catalog values, not live brightness estimates.
This is completeness relative to HYG's rows, not a claim of a complete survey.

Names prefer HYG's proper name. Otherwise `HIP <number>` is used, with
`HYG <id>` for rows without HIP IDs. A duplicate proper name falls back to its
identifier; no artificial coordinates or stars are introduced.

## Constellation Lines

Source: d3-celestial by Olaf Frohn, copyright (c) 2015 Olaf Frohn,
BSD-3-Clause; full notice and disclaimer retained in `LICENSE.d3-celestial.txt`.

- Repository: https://github.com/ofrohn/d3-celestial
- Revision: `7e720a3de062059d4c5400a379146a601d9010e0`
- Inputs: `data/constellations.lines.json`, `data/stars.8.json`,
  `data/constellations.json`
- Upstream source notes: https://github.com/ofrohn/d3-celestial#files

Each J2000 line endpoint is matched exactly to the same coordinate in d3's
star catalog, whose ID is a HIP identifier. That identifier joins to HYG;
the output uses the corresponding local star name. For HIP endpoints absent
from HYG (combined/multiple-star records), d3's XHIP-derived star position and
magnitude are retained with a HIP name. These supplemental records are covered
by d3's BSD notice and listed in `supplementalD3HipIds` in the provenance file.
d3 cites XHIP: Anderson E., Francis C. (2012), VizieR V/137D:
https://cdsarc.cds.unistra.fr/viz-bin/cat/V/137D
No nearest-neighbor
guessing is performed. Polylines become consecutive endpoint pairs.
Self-links and duplicate undirected segments are omitted. The two Serpens
figures are merged into one constellation, yielding 88 constellations.
Figures are conventional Western stick figures, not IAU boundary polygons;
the IAU does not define an official set of constellation connecting lines.

## Rebuild And Audit

Run `python3 features/stella/data/generate_catalog.py` from the repository root.
Only Python's standard library is used. It reads pinned public upstream files
over HTTPS and mechanically regenerates the data and local license copies.
Unresolved line endpoints fail generation rather than silently dropping lines.
`catalog-provenance.json` records counts and SHA-256 hashes of fetched inputs.
The entire data directory is checked against a 700,000-byte uncompressed budget.
License conditions concern their respective data, not unrelated application code.
