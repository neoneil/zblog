import "server-only";
import { billingSchema } from "@/features/billing/lib/billing-db";
import type { EventRecord } from "@/features/events/lib/events";
import type { EventSnapshot, RegistrationStatus } from "@/features/events/lib/registration-types";
import { dailyDrawTableMissing } from "@/features/star-message/member-draws";
import { starCardImage } from "@/features/star-message/storage";
import type { createClient } from "@/lib/supabase/server";
import { archivedReadingSkus, type ReadingDetail, type ReadingSummary } from "./reading-archive";

type Client = Awaited<ReturnType<typeof createClient>>;
type QueryError = { code: string };
type Page<T> = { data: T[] | null; error: QueryError | null };

async function allRows<T>(load: (from: number, to: number) => PromiseLike<Page<T>>) {
  const records: T[] = [];
  const size = 100;
  for (let start = 0; ; start += size) {
    const { data, error } = await load(start, start + size - 1);
    if (error) return { records, error };
    records.push(...(data ?? []));
    if (!data || data.length < size) return { records, error: null };
  }
}

type EventDetails = Pick<EventSnapshot, "slug" | "title_zh" | "title_en" | "starts_at" | "timezone">;
type Registration = { id: string; event_id: string; status: RegistrationStatus; event_snapshot: EventDetails };
type Ticket = {
  id: string; event_id: string; status: "paid" | "refunded"; event_snapshot: EventDetails;
  created_at: string; paid_stars: number; reward_stars: number;
};
type EventListing = Pick<EventRecord, "id" | "slug" | "title_zh" | "title_en" | "starts_at" | "ends_at" | "timezone" | "is_published" | "is_demo">;
type DrawRow = { draw_id: string; card_id: number; draw_day: string };
type Membership = { plan: "monthly" | "annual"; valid_until: string };
type Topup = { id: string; status: string; amount_cents: number; created_at: string; paid_at: string | null };
type Spend = { id: string; sku: string; state: "held" | "completed" | "released"; paid: number; reward: number; created_at: string };

function tickets(db: Client, userId: string) {
  return allRows<Ticket>((from, to) => db.schema(billingSchema()).from("stardust_event_tickets")
    .select("id,event_id,status,event_snapshot,created_at,paid_stars,reward_stars").eq("user_id", userId)
    .order("created_at", { ascending: false }).order("id").range(from, to));
}

export async function loadOrders(db: Client, userId: string) {
  const ledger = db.schema(billingSchema());
  const [topups, spends, eventTickets] = await Promise.all([
    allRows<Topup>((from, to) => ledger.from("stardust_topups")
      .select("id,status,amount_cents,created_at,paid_at").eq("user_id", userId)
      .order("created_at", { ascending: false }).order("id").range(from, to)),
    allRows<Spend>((from, to) => ledger.from("stardust_requests")
      .select("id,sku,state,paid,reward,created_at").eq("user_id", userId)
      .or("paid.gt.0,reward.gt.0").order("created_at", { ascending: false }).order("id").range(from, to)),
    tickets(db, userId),
  ]);
  return {
    topups: topups.records, spends: spends.records, tickets: eventTickets.records,
    unavailable: Boolean(topups.error || spends.error || eventTickets.error),
    sandbox: billingSchema() === "stardust_sandbox",
  };
}

async function starTimeline(db: Client, userId: string) {
  const [saved, daily] = await Promise.all([
    allRows<DrawRow>((from, to) => db.from("star_message_collection").select("draw_id,card_id,draw_day")
      .eq("user_id", userId).order("draw_day", { ascending: false }).order("draw_id").range(from, to)),
    allRows<DrawRow>((from, to) => db.from("star_message_daily_draws").select("draw_id,card_id,draw_day")
      .eq("user_id", userId).order("draw_day", { ascending: false }).order("draw_id").range(from, to)),
  ]);
  const stored = new Map(daily.records.map((draw) => [draw.draw_id, { ...draw, saved: false }]));
  for (const draw of saved.records) stored.set(draw.draw_id, { ...draw, saved: true });
  const history = [...stored.values()].sort((a, b) => b.draw_day.localeCompare(a.draw_day));
  const images = await Promise.allSettled(history.map(async (row) => {
    const [image, download] = await Promise.all([starCardImage(row.card_id), starCardImage(row.card_id, true)]);
    return { drawId: row.draw_id, cardId: row.card_id, drawDay: row.draw_day, saved: row.saved, image, download };
  }));
  return {
    items: images.flatMap((image) => image.status === "fulfilled" ? [image.value] : []),
    unavailable: Boolean(saved.error || (daily.error && !dailyDrawTableMissing(daily.error)) || images.some((image) => image.status === "rejected")),
  };
}

async function readingSummaries(db: Client, userId: string) {
  const ledger = db.schema(billingSchema());
  const { records, error } = await allRows<ReadingSummary>((from, to) => ledger.from("stardust_requests")
    .select("id,sku,created_at,completed_at:result->archive->>completedAt,mode:result->>mode")
    .eq("user_id", userId).eq("state", "completed").in("sku", archivedReadingSkus)
    .not("result", "is", null).order("created_at", { ascending: false }).order("id").range(from, to));
  if (records.some((record) => !record.completed_at)) {
    const completed = await allRows<{ reference: string; created_at: string }>((from, to) =>
      ledger.from("stardust_ledger").select("reference,created_at")
        .eq("user_id", userId).eq("kind", "complete").order("id").range(from, to));
    const times = new Map(completed.records.map((row) => [row.reference, row.created_at]));
    for (const record of records) {
      record.completed_at ??= times.get(record.id) ?? null;
    }
  }
  records.sort((a, b) => Date.parse(b.completed_at ?? b.created_at) - Date.parse(a.completed_at ?? a.created_at));
  return { records, unavailable: Boolean(error) };
}

export async function loadReading(db: Client, userId: string, id: string): Promise<ReadingDetail | null> {
  const { data, error } = await db.schema(billingSchema()).from("stardust_requests")
    .select("id,sku,result").eq("id", id).eq("user_id", userId).eq("state", "completed")
    .in("sku", archivedReadingSkus).not("result", "is", null).maybeSingle();
  if (error) throw error;
  return data as ReadingDetail | null;
}

async function publishedEvents(db: Client) {
  const result = await allRows<EventListing>((from, to) => db.from("events")
    .select("id,slug,title_zh,title_en,starts_at,ends_at,timezone,is_published,is_demo")
    .eq("is_published", true).order("starts_at", { ascending: false }).order("id").range(from, to));
  const now = Date.now();
  const upcoming = result.records.filter((event) => Date.parse(event.ends_at) > now).reverse();
  const past = result.records.filter((event) => Date.parse(event.ends_at) <= now);
  return { records: [...upcoming, ...past], error: result.error };
}

export async function loadGuestAccount(db: Client): Promise<Awaited<ReturnType<typeof loadAccount>>> {
  const events = await publishedEvents(db);
  return {
    memberships: [],
    membershipUnavailable: false,
    sandbox: false,
    username: undefined,
    communityUnavailable: false,
    booked: [],
    bookedUnavailable: false,
    events: events.records,
    eventsUnavailable: Boolean(events.error),
    timeline: { items: [], unavailable: false },
    readings: { records: [], unavailable: false },
  };
}

export async function loadAccount(db: Client, userId: string) {
  const [memberships, profile, events, registrations, eventTickets, timeline, readings] = await Promise.all([
    db.schema(billingSchema()).from("stardust_memberships").select("plan,valid_until")
      .eq("user_id", userId).gt("valid_until", new Date().toISOString()),
    db.from("community_profiles").select("username").eq("user_id", userId).maybeSingle(),
    publishedEvents(db),
    allRows<Registration>((from, to) => db.from("event_registrations").select("id,event_id,status,event_snapshot")
      .eq("user_id", userId).order("created_at", { ascending: false }).order("id").range(from, to)),
    tickets(db, userId),
    starTimeline(db, userId),
    readingSummaries(db, userId).catch(() => ({ records: [], unavailable: true })),
  ]);

  const booked = new Map<string, EventDetails & { status: "paid" | RegistrationStatus }>();
  for (const registration of registrations.records) {
    if (registration.status === "confirmed" || registration.status === "requested") {
      booked.set(registration.event_id, { ...registration.event_snapshot, status: registration.status });
    }
  }
  for (const ticket of eventTickets.records) {
    if (ticket.status === "paid") booked.set(ticket.event_id, { ...ticket.event_snapshot, status: "paid" });
  }
  return {
    memberships: (memberships.data ?? []) as Membership[],
    membershipUnavailable: Boolean(memberships.error),
    sandbox: billingSchema() === "stardust_sandbox",
    username: profile.data?.username as string | undefined,
    communityUnavailable: Boolean(profile.error),
    booked: [...booked.values()].sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at)),
    bookedUnavailable: Boolean(registrations.error || eventTickets.error),
    events: events.records,
    eventsUnavailable: Boolean(events.error),
    timeline,
    readings,
  };
}
