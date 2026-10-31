# Stella Explore

## Scope

The existing `/stella` 3D calculator is unchanged. Ten new tools live under
`/stella/<tool>`, handled by `app/stella/[...path]/page.tsx`. The navbar and
footer share the eleven-entry registry in `lib/explore-config.ts`.

No database, migration, new credentials, AI endpoint, paid service or additional
runtime dependency is required by these tools. Server-side calculations use the
existing Astronomy Engine package; the numerology calculator runs in-browser.
The surrounding site's existing authentication/navbar infrastructure is unchanged.

## Pages

| Tool | Route | Details |
| --- | --- | --- |
| Compatibility | `/stella/compatibility` | 78 canonical unordered pairs |
| Birth Chart Guide | `/stella/birth-chart` | chart features, houses, signs, FAQ |
| Today's Sky | `/stella/todays-sky` | date selection, ten planets, aspects, elements |
| Moon Calendar | `/stella/moon-calendar` | month navigation, daily selection, exact quarters |
| Retrograde Tracker | `/stella/retrograde` | eight planet guides, annual station intervals |
| Void of Course Moon | `/stella/void-of-course-moon` | monthly intervals, last aspect, display time zones |
| Planets in Signs | `/stella/planets` | planet guides, planet-specific ingress windows |
| Numerology | `/stella/numerology` | life path, master numbers, repeating sequences |
| Birthday Horoscope | `/stella/birthday` | 366 profiles, leap day, previous/next navigation |
| Eclipses | `/stella/eclipse` | computed annual events and event detail pages |

All tools use the existing language preferences and theme toggle. Explore colors
are centralized as `--explore-*` variables in `app/globals.css`. The original
Stella scene's `--stella-*` variables are not modified.

## Calculation Conventions

- Tropical zodiac, apparent geocentric ecliptic longitude, existing engine.
- Current positions use a server-generated timestamp passed unchanged to the UI.
- Daily lunar samples and selected-day sky samples use 12:00 UTC.
- Quarter phases use `SearchMoonQuarter` / `NextMoonQuarter`.
- Explore's five major aspects use conjunction/opposition 8 degrees,
  square/trine 7 degrees, sextile 4 degrees. This matches the captured public
  eleven-aspect list, including its rounded orbs, on 2026-10-31 at 05:49:36 UTC.
  The original 3D scene retains its default 6-degree limits.
- Ingresses sample at 3 hours for the Moon and 12 hours for other bodies, then
  refine sign-boundary crossings to approximately one second using bisection.
- Retrograde stations are roots of central-difference angular speed. Intervals
  crossing the displayed year are explicitly labelled as clipped, not stations.
- VOC uses the last exact major aspect before lunar ingress to the Sun and all
  eight other planets, including Uranus, Neptune and Pluto. No exact aspect in a
  sign produces a whole-sign interval. Other planet conventions can differ.
- Eclipse times come from the engine's global solar and lunar eclipse searches.
  Global peak does not imply local visibility. Solar local duration is not given
  without an observer. Lunar duration is derived from engine semi-durations.
- Displayed calendar ingress dates use daily 12:00 UTC samples for Mercury/Venus
  and daily 00:00 UTC for Mars through Pluto. The former show a three-year window;
  the latter show the selected decade through its following boundary year.
  All 199 captured entries across eight planets match these conventions. Retrograde
  calendars compare successive UTC midnights, with clipped end dates displayed
  as December 31 while the internal exclusive boundary is January 1.
- Displayed VOC calendars find sign changes hourly, then scan backward at
  half-hour intervals for the last aspect within 1 degree. They include intervals
  ending inside the month. The precise root-finding helpers remain separate.
- Moon-calendar illumination uses `(1 - cos(phase)) / 2` and phase names use eight
  successive 45-degree bins, matching all 31 daily samples in the captured month.
- Birthday profiles use the reference's fixed calendar boundaries and integer
  day offsets capped at 29 degrees, not ephemeris-derived natal positions.
  January Capricorn deliberately resets the offset to January 1 to reproduce
  the public reference, per the request for matching behavior. This convention
  must not be used by the actual natal calculator. Modern triplicity rulers are
  used (Libra: Venus, Uranus, Mercury). All four output fields were compared
  against all 366 public birthday pages, stored as numeric regression fixtures.
- Life path reduces month, day and year separately, preserving 11/22/33 at every
  step, then reduces their sum using the same master-number rule.
- Time controls support 1900–2100; annual results have a bounded in-memory cache
  (48 entries). There is no persistent user storage for these new tools.

## Reference and Limits

Public reference inspected on 2026-10-31: https://stellasophy.com/ and its eleven
Explore destinations, including example compatibility, birthday, planet,
retrograde and eclipse detail pages. The dark palette, typography and content
hierarchy follow that reference, while the existing site's navbar/branding and
footer remain. Light mode follows the site's light-blue direction.

The original site's private source, hidden logic and exact editorial corpus are
not available. Descriptions here are independently written bilingual material;
they are not a word-for-word reproduction. No measured 98% visual or algorithmic
equivalence is asserted. Some public reference pages returned stale or mutually
inconsistent timestamps/content; computed results take precedence over those.

Engine reference: https://github.com/cosinekitty/astronomy/tree/master/source/js

## Verification

```bash
cd /home/neodev/zblog/z_blog
node --test tests/stella-explore.test.mjs tests/stella-sky.test.mjs tests/synastry.test.mjs
pnpm exec tsc --noEmit
pnpm build
```

Browser verification covers all ten tools at desktop/mobile sizes, every one of
the 444 pair/birthday URLs, individual planet and eclipse pages, language/theme
switches, menu/footer entries, date navigation and invalid-route handling.

### Public-Result Parity Fixtures

`tests/fixtures/stella-birthday-reference.json` stores only calendar/astrology
values (no copied articles) from 366 pages fetched on 2026-10-31.
`tests/fixtures/stella-calendar-reference.json` stores the public October 2026
moon samples, thirteen VOC windows, eleven 2026 retrograde intervals and 47
Mercury ingress dates for 2025–2027. Tests compare complete captured tables, not
only a few selected values. These establish parity for the captured inputs;
they do not prove equivalence to the original site's private implementation.
`tests/fixtures/stella-planets-reference.json` covers all eight planetary ingress
tables, including their distinct year ranges and all 199 date/sign entries.

Unverified private AI logic, editorial descriptions, original natal engine
settings and eclipse editorial selection remain outside the parity claim.
