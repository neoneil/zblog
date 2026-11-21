# Events and salon registrations

## Database

The owner runs SQL manually. Run `supabase/events.sql` first, followed by
`supabase/event-registrations.sql`. Re-running the supplement preserves records.
The supplement defaults NEW events to AUD 50; it does not reprice existing demo
events. Prices are stored in integer Australian cents and editable by admins.

## Administration

`/admin/events` is linked from `/admin` and uses the existing `requireAdmin`.
Admins create, edit, publish/unpublish, open/close and delete events. Choose an
event to review its applicants. Event and applicant lists are paginated.
Events with registration history cannot be deleted: close/unpublish them instead.
The existing five demo records can contain synthetic booked counts; confirmation
adds to that existing count rather than resetting it.

Dates are entered as Sydney local time, stored as timestamptz, and displayed in
Australia/Sydney. Invalid/ambiguous times at DST transitions are rejected.

## Applications and account integration

`/events/[slug]` reads only published events. Signed-in users submit one request
per event. Repeated active submissions return the same record; cancelled or
declined applications can be resubmitted while registration remains open.
All submission, confirmation and cancellation functions lock the event row first.
Confirmation checks capacity and increments booked_count atomically; cancellation
of a confirmed place decrements it exactly once. Pending requests do not hold seats.

`/events/my-registrations` shows the signed-in user's latest 200 records, including
an event/price snapshot and customer-facing administrator notes. Users can withdraw
pending requests; confirmed cancellations require administrator handling.
`getMyEventRegistrations` and `MyEventRegistrations` can be reused by the future
account page. No new account/profile or wallet system is introduced.

Registrations are protected by owner/admin SELECT RLS. Direct browser writes are
revoked. Mutations use authenticated Supabase RPCs with their own authorization,
not service-role credentials. Administrator notes are visible to the applicant.

## Payment boundary

Formal paid events now use STARS, not direct Stripe event Checkout. Stripe remains
the existing wallet top-up path. AUD cents equal STARS at the agreed A$1=100 rate.
Run `event-ticket-payments.sql` to install service-role-only atomic purchase RPCs
in both ledgers. They verify price, event state, verified user, balance and seats;
consume reward first; then commit wallet debit, ledger, ticket and seat together.
Duplicate purchases return the original ticket. Paid applications cannot bypass
payment via the old RPC or be cancelled without a reviewed refund mechanism.
Automatic refunds and email/ticket delivery are NOT implemented in this release.

Test keys use sandbox tickets, wallet and inventory only. They never occupy a
public event's real seats or create confirmed public registrations. My registrations
and event administration show the current mode's tickets with an explicit test badge.
Missing SQL or invalid payment configuration disables paid booking; no live fallback.

The owner approved an online salon on Dec 4, 2026, 19:00-21:00 Sydney, A$50.
Run `event-salon-open.sql` AFTER payment SQL to activate ONLY demo-next-month-salon,
preserving dates and clearing synthetic occupancy only when no confirmed demo
applications exist. Confirmed demo applications block promotion for admin review.
It does not change Stripe mode or enable live charging. Joining links are not yet
automatically delivered and must be arranged by the organiser.

The homepage's monthly rotation, status badges, minute refresh and poster dialog
are retained. Public activity links still point to `/events/[slug]`.

## Verification

- `node tests/event-registrations.test.mjs`: isolated PGlite SQL, RLS, capacity,
  idempotency, history protection and Sydney/price validation; no remote writes.
- `node tests/events-browser.test.mjs`: real unauthenticated route guards and
  isolated UI controls in desktop/mobile and dark/light; server actions mocked.
- `pnpm lint` and `pnpm build` (includes TypeScript).
- `node tests/event-ticket-payments.test.mjs`: isolated reward-first purchase,
  duplicate/full/insufficient/stale-price cases, rollback and sandbox separation.

Real administrator review and two-account acceptance still require the owner to
log in and use the deployed database. These tests do not claim real payment tests.
