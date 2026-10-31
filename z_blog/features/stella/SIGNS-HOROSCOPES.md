# Signs and Horoscopes

## Routes and Entrances

- `/stella/zodiac`: directory and twelve `/stella/zodiac/<sign>` profiles.
- `/stella/horoscope`: daily directory and twelve `/<sign>` readings.
- `/stella/horoscope/monthly`: directory and twelve `/<sign>` readings.
- `/stella/horoscope/yearly`: directory and twelve `/<sign>` readings.
- The homepage's second and third category cards target these two directories.
- Legacy teaching-practice and family-education category URLs redirect to them.
- Footer Signs has twelve entries; Horoscopes has the three period directories
  and Aries, Taurus, Gemini, Cancer, matching the reference's navigation scope.
- All compatibility links reuse the existing canonical unordered pair routes.

## Implementation

No new database, external API, AI call, credential or runtime dependency.
Zodiac articles are local, original English/Chinese content. Existing language
and theme preferences apply. Figures reuse the twelve approved constellation
assets. All UI colors use the existing global `--explore-*` tokens.

Horoscopes use the existing Astronomy Engine with tropical geocentric positions
and whole-sign solar houses: `(transitSign - sunSign + 12) % 12 + 1`.
The server supplies one timestamp to keep headings and computations consistent.
Daily and monthly readings sample the supplied calendar day at 12:00 UTC. The
monthly current-day convention is inferred from the source's real-time description
and its captured October 31, 2026 positions; it is not proven hidden-rule parity.
Annual readings use January 1 and July 1 representative samples, not an exhaustive
interpretation of every transit through the interval.
Key dates reuse the existing sampled ingress calendar and computed eclipse peaks.

## Reference and Limits

Public page layouts and navigation inspected on 2026-11-01:
https://stellasophy.com/zodiac, `/zodiac/aries`, `/horoscope`, `/horoscope/aries`,
`/horoscope/monthly`, `/horoscope/monthly/aries`, `/horoscope/yearly`, and
`/horoscope/yearly/aries`.

The reconstruction preserves profile sections, period directories, sidebars,
cross-links and responsive grids. It does not copy the reference's long-form
copyrighted prose, brand, mailing list service or hidden forecast algorithm.
Daily forecasts are independently derived from the sky; they are not guaranteed
to reproduce the reference's daily editorial selections. No pixel-equivalence
percentage or hidden backend equivalence is claimed. Astronomical opposition is
always six signs apart; apparent editorial errors are not reproduced.

## Checks

`node --test tests/stella-*.test.mjs tests/synastry.test.mjs`

Browser checks cover all 52 new URLs, homepage and footer entrances, old redirects,
invalid-route 404s, constellation assets, mobile overflow and both preferences.
