# Database-backed event announcements

Run `supabase/events.sql` in the project's Supabase SQL Editor. The script creates
`public.events`, RLS policies and five demo events. It does not replace existing
records on rerun. There is no hardcoded fallback schedule in the frontend.

Manage records through Supabase Table Editor. Public readers see only published
events; only profiles with role `admin` can insert/update/delete via RLS. All
timestamps are stored as timestamptz and displayed in Australia/Sydney.

The homepage rotates current-month events every six seconds, pauses for hover,
focus and reduced-motion preferences, and opens the supplied poster/list dialog
before linking to `/events/[slug]`. Expired events disappear locally within one
second; database changes are rechecked every minute and on returning to the tab.
When this month is empty, the next published month's events are shown.

The five seed rows are explicitly DEMO data, not real sales. Their open/closed/full
states are display fixtures; demo payments are always disabled. The event product
page rechecks availability but intentionally has no checkout. A future real
checkout must atomically reserve inventory server-side and revalidate status,
time, capacity and price before creating a payment session, then reconcile
payment webhooks. Frontend status alone cannot prevent concurrent overselling.
