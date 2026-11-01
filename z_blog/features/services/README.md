# Contact and Services

## Entrances

- About in the existing navbar: `/aboutus`, introduction then contact form.
- Services: `/services`, three products with category and sort controls.
- Product routes are `/services/<catalog slug>`; unknown slugs return 404.
- Cart icon in desktop navigation and mobile header: `/cart`.

The site's existing navbar, footer, theme and language preferences are retained.
New colors use the global `--bg`, `--card`, `--text`, `--primary`, `--border`
and semantic status tokens. Existing Button, Card, Input and Textarea are reused;
Select is a reusable addition to `components/ui`.

## Contact Email

`POST /api/contact` uses the Resend HTTPS API with server-only environment values:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`: a sender authorised by the configured Resend account.
- `CONTACT_TO_EMAIL`: one fixed recipient mailbox.

Visitor addresses are only used as `reply_to`, never as sender or recipient.
Mail uses plain text and a fixed subject. No credentials enter the browser.
Successful UI feedback is returned only after Resend accepts an email and returns
an ID. Provider details and credentials are not exposed in error responses.

The endpoint validates origin, content type, body size, field lengths, email,
control characters, a honeypot and a UUID submission ID. Repeated requests for
the same submission/payload use the same provider idempotency key. Client retries
retain the message and ID after a failure. Provider timeout is ten seconds.

The basic five-attempt/fifteen-minute limiter is per process and in memory. It is
not distributed protection, and forwarded IP headers must be supplied by a
trusted deployment proxy. Before higher-volume public use, add a shared limiter
and/or bot challenge. No new database table or credential is currently needed.

## Product and Cart Data

The editable catalog is `features/services/lib/catalog.ts`. Prices are temporary
AUD amounts stored as integer cents: 529.00, 319.00, 143.78. The three local images
are existing temporary site assets, not reference-site downloads.

Cart storage is `cosmic-childhood-cart-v1` in the browser. It stores only product
IDs and integer quantities (1-99), never trusted prices, personal information or
payment data. Unknown products and invalid quantities are dropped. Subtotals
come exclusively from the canonical local catalog. Duplicate adds merge, tabs
sync through storage events, and a memory cart remains available when storage
writes are blocked. No order is created by adding a product.

Newsletter subscription and Checkout are explicitly disabled. There is no Shop
Pay, Stripe checkout session, payment, automatic course delivery or booking yet.
Future payment work must revalidate prices/availability on the server and define
delivery, appointment, tax and refund terms before enabling checkout.

Social Share/Tweet/Pin links intentionally target `/` as requested.

## Reference and Verification

The middle sections and interactions were inspected on:
https://writteninthestars-astrology.com/pages/contact
https://writteninthestars-astrology.com/collections/all
and its transits, natal-chart-masterclass and tarot-reading product pages.

Layout and flow are adapted; long product descriptions are original bilingual
rewrites. Third-party delivery promises, refund terms, branding, images and payment
widgets are not copied. These are local preview products, not third-party orders.

`node --test tests/contact.test.mjs tests/services-cart.test.mjs` exercises the API
with a mocked mail provider, validation, rate limits, exact totals, filtering and
sorting. Browser checks mock sending success/failure; no real test email or paid
order is sent. Actual delivery depends on a valid Resend sender/domain setup.
