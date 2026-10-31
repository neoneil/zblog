import { notFound } from "next/navigation";
import CompatibilityExplorer from "@/features/stella/components/compatibility-explorer";
import BirthGuide from "@/features/stella/components/birth-guide";
import SkyExplorer from "@/features/stella/components/sky-explorer";
import MoonExplorer from "@/features/stella/components/moon-explorer";
import RetrogradeExplorer from "@/features/stella/components/retrograde-explorer";
import VoidExplorer from "@/features/stella/components/void-explorer";
import PlanetsExplorer from "@/features/stella/components/planets-explorer";
import NumerologyExplorer from "@/features/stella/components/numerology-explorer";
import BirthdayExplorer from "@/features/stella/components/birthday-explorer";
import EclipseExplorer from "@/features/stella/components/eclipse-explorer";
import {
  stellaTools,
  parsePair,
  parseBirthday,
  planetKeys,
  planetCopy,
} from "@/features/stella/lib/explore-config";
import { getExploreSkySnapshot } from "@/features/stella/lib/sky";
import {
  moonMonth,
  calendarRetrogradePeriods,
  calendarVoidPeriods,
  calendarPlanetIngresses,
  planetCalendarWindow,
  birthdayProfile,
  eclipseYear,
} from "@/features/stella/lib/explore-calculations";

type Props = {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props) {
  const { path } = await params;
  const tool = stellaTools.find((t) => t.slug === path[0]);
  return { title: tool ? `Stella · ${tool.en}` : "Stella" };
}
export default async function StellaExplorePage({
  params,
  searchParams,
}: Props) {
  const { path } = await params,
    query = await searchParams;
  const [slug, detail] = path;
  if (path.length > 2) notFound();
  if (slug === "compatibility") {
    if (detail && !parsePair(detail)) notFound();
    return <CompatibilityExplorer pair={detail} />;
  }
  if (slug === "birth-chart") {
    if (detail) notFound();
    return <BirthGuide />;
  }
  if (slug === "numerology") {
    if (detail) notFound();
    return <NumerologyExplorer />;
  }
  if (slug === "birthday") {
    if (!detail) return <BirthdayExplorer />;
    const date = parseBirthday(detail);
    if (!date) notFound();
    return (
      <BirthdayExplorer
        slug={detail}
        profile={birthdayProfile(date.month, date.day)}
      />
    );
  }
  const now = new Date();
  const year = Number(query.year ?? now.getUTCFullYear()),
    month = Number(query.month ?? now.getUTCMonth() + 1);
  if (
    !Number.isInteger(year) ||
    year < 1900 ||
    year > 2100 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  )
    notFound();
  if (slug === "retrograde") {
    if (detail && !planetKeys.includes(detail)) notFound();
    return (
      <RetrogradeExplorer
        year={year}
        planet={detail}
        snapshot={getExploreSkySnapshot(now)}
        time={now.toISOString()}
        periods={calendarRetrogradePeriods(year, detail ? [detail] : undefined)}
      />
    );
  }
  if (slug === "planets") {
    if (detail && !Object.hasOwn(planetCopy, detail)) notFound();
    return (
      <PlanetsExplorer
        year={year}
        planet={detail}
        snapshot={getExploreSkySnapshot(now)}
        ingresses={detail ? calendarPlanetIngresses(detail, year) : undefined}
        ingressRange={detail ? planetCalendarWindow(detail, year) : undefined}
      />
    );
  }
  if (slug === "eclipse") {
    const eventYear = detail ? Number(detail.slice(0, 4)) : year;
    if (!Number.isInteger(eventYear) || eventYear < 1900 || eventYear > 2100)
      notFound();
    const events = eclipseYear(eventYear),
      event = detail ? events.find((e) => e.id === detail) : undefined;
    if (detail && !event) notFound();
    return <EclipseExplorer year={eventYear} events={events} event={event} />;
  }
  if (detail) notFound();
  if (slug === "void-of-course-moon")
    return (
      <VoidExplorer
        year={year}
        month={month}
        periods={calendarVoidPeriods(year, month)}
        time={now.toISOString()}
      />
    );
  if (slug === "todays-sky") {
    const raw = query.date;
    const date = typeof raw === "string" ? new Date(`${raw}T12:00:00Z`) : now;
    if (
      !Number.isFinite(date.getTime()) ||
      date.getUTCFullYear() < 1900 ||
      date.getUTCFullYear() > 2100 ||
      (raw && date.toISOString().slice(0, 10) !== raw)
    )
      notFound();
    return (
      <SkyExplorer
        key={date.toISOString()}
        snapshot={getExploreSkySnapshot(date)}
        time={date.toISOString()}
      />
    );
  }
  if (slug === "moon-calendar")
    return (
      <MoonExplorer
        key={`${year}-${month}`}
        year={year}
        month={month}
        {...moonMonth(year, month)}
        snapshot={getExploreSkySnapshot(now)}
      />
    );
  notFound();
}
