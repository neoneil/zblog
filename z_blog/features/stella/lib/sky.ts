import { AstroTime, Body, Ecliptic, GeoVector, Illumination, MoonPhase, RotateVector, Rotation_EQJ_ECT, Vector } from "astronomy-engine";

export const PLANET_COLORS: Record<string, string> = {
  sun: "#facc15", moon: "#e2e8f0", mercury: "#a3a3a3", venus: "#f9a8d4",
  mars: "#ef4444", jupiter: "#fdba74", saturn: "#fde68a", uranus: "#67e8f9",
  neptune: "#818cf8", pluto: "#c4b5fd",
};
export const PLANET_SYMBOLS: Record<string, string> = {
  sun: "\u2609", moon: "\u263D", mercury: "\u263F", venus: "\u2640", mars: "\u2642",
  jupiter: "\u2643", saturn: "\u2644", uranus: "\u2645", neptune: "\u2646", pluto: "\u2647",
};
export const SIGN_NAMES: { en: string[]; zh: string[] } = {
  en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  zh: ["\u767d\u7f8a\u5ea7", "\u91d1\u725b\u5ea7", "\u53cc\u5b50\u5ea7", "\u5de8\u87f9\u5ea7", "\u72ee\u5b50\u5ea7", "\u5904\u5973\u5ea7", "\u5929\u79e4\u5ea7", "\u5929\u874e\u5ea7", "\u5c04\u624b\u5ea7", "\u6469\u7faf\u5ea7", "\u6c34\u74f6\u5ea7", "\u53cc\u9c7c\u5ea7"],
};
export const SIGN_SYMBOLS: string[] = ["\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D", "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653"];

export interface SkyPlanet {
  key: string;
  label: string;
  labelZh: string;
  longitude: number;
  latitude: number;
  distance: number;
  retrograde: boolean;
  signIndex: number;
  signDegrees: number;
}
export interface SkySnapshot {
  planets: SkyPlanet[];
  moon: { illumination: number; phase: number };
  aspects: Array<{ a: string; b: string; type: string; orb: number }>;
}

const BODIES = [
  ["sun", Body.Sun, "Sun", "\u592a\u9633"],
  ["moon", Body.Moon, "Moon", "\u6708\u4eae"],
  ["mercury", Body.Mercury, "Mercury", "\u6c34\u661f"],
  ["venus", Body.Venus, "Venus", "\u91d1\u661f"],
  ["mars", Body.Mars, "Mars", "\u706b\u661f"],
  ["jupiter", Body.Jupiter, "Jupiter", "\u6728\u661f"],
  ["saturn", Body.Saturn, "Saturn", "\u571f\u661f"],
  ["uranus", Body.Uranus, "Uranus", "\u5929\u738b\u661f"],
  ["neptune", Body.Neptune, "Neptune", "\u6d77\u738b\u661f"],
  ["pluto", Body.Pluto, "Pluto", "\u51a5\u738b\u661f"],
] as const;

// Display conventions, not physical quantities: major aspects with a uniform 6-degree orb.
const ASPECTS = [
  ["conjunction", 0], ["sextile", 60], ["square", 90],
  ["trine", 120], ["opposition", 180],
] as const;
const normalize = (angle: number) => ((angle % 360) + 360) % 360;
const signedAngle = (angle: number) => normalize(angle + 180) - 180;

/**
 * J2000 equatorial RA/Dec in degrees to a THREE world unit direction.
 * Includes precession/nutation into the same true ecliptic-of-date frame as
 * getSkySnapshot, mapped [x,z,-y]. No proper motion, parallax or aberration.
 */
export function getStarDirection(raDegrees: number, decDegrees: number, date: Date): [number, number, number] {
  if (!Number.isFinite(date.getTime())) throw new RangeError("getStarDirection requires a valid Date");
  if (!Number.isFinite(raDegrees) || !Number.isFinite(decDegrees) || Math.abs(decDegrees) > 90) {
    throw new RangeError("getStarDirection requires finite RA and declination within [-90, 90]");
  }
  const ra = normalize(raDegrees) * Math.PI / 180;
  const dec = decDegrees * Math.PI / 180;
  const time = new AstroTime(date);
  const equatorial = new Vector(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec), time);
  const ecliptic = RotateVector(Rotation_EQJ_ECT(time), equatorial);
  const length = Math.hypot(ecliptic.x, ecliptic.y, ecliptic.z);
  return [ecliptic.x / length, ecliptic.z / length, -ecliptic.y / length];
}

/**
 * Geocentric apparent positions: GeoVector includes light-time and aberration;
 * Ecliptic converts EQJ to true ecliptic/equinox of date (tropical, not sidereal).
 * Angles are degrees; distance is AU. Moon illumination is [0,1]; phase is
 * [0,360): 0 new, 90 first quarter, 180 full, 270 last quarter.
 * Retrograde is the sign of a centered one-hour longitude difference, including
 * wraparound. It is approximate at stations. No observer/horizon corrections.
 * API reference: https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md
 */
export function getSkySnapshot(date: Date): SkySnapshot {
  const time = date.getTime();
  if (!Number.isFinite(time)) throw new RangeError("getSkySnapshot requires a valid Date");
  const before = new Date(time - 30 * 60 * 1000);
  const after = new Date(time + 30 * 60 * 1000);
  const planets = BODIES.map(([key, body, label, labelZh]): SkyPlanet => {
    const vector = GeoVector(body, date, true);
    const coords = Ecliptic(vector);
    const longitude = normalize(coords.elon);
    const motion = signedAngle(
      Ecliptic(GeoVector(body, after, true)).elon - Ecliptic(GeoVector(body, before, true)).elon,
    );
    return {
      key, label, labelZh, longitude, latitude: coords.elat,
      distance: Math.hypot(vector.x, vector.y, vector.z), retrograde: motion < 0,
      signIndex: Math.floor(longitude / 30), signDegrees: longitude % 30,
    };
  });
  const aspects: SkySnapshot["aspects"] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      const separation = Math.abs(signedAngle(a.longitude - b.longitude));
      for (const [type, angle] of ASPECTS) {
        const orb = Math.abs(separation - angle);
        if (orb <= 6) aspects.push({ a: a.key, b: b.key, type, orb });
      }
    }
  }
  return {
    planets,
    moon: { illumination: Illumination(Body.Moon, date).phase_fraction, phase: normalize(MoonPhase(date)) },
    aspects,
  };
}
