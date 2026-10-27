# Avashesh — Technical design

My Bharat Code for Social Cause submission. Project credit: **Team Avashesh**.

## Architecture

React 19 and TypeScript pages use TanStack Start/Router, TanStack Query, Tailwind v4, Zod and Vite. Lovable Cloud provides PostgreSQL, email/password authentication and private file storage. There is no Express API, AI engine, payment system or GPS service.

```text
Homepage Buy / Sell
  -> Public listing reads -> generated browser client -> Cloud database RLS
  -> Login / Signup -> Cloud Auth -> profiles + user_roles signup trigger
  -> Listing / inquiry / profile forms
     -> Zod -> authenticated TanStack server function -> Zod -> user-scoped DB client
     -> PostgreSQL constraints / triggers / RLS
  -> Private photo upload -> Cloud Storage policies -> signed listing photo link

Waste entry -> localStorage -> fixed reuse rules -> local dashboard / impact estimate
```

Existing waste recording is intentionally still local, separate from shared marketplace accounts. No automatic import of former browser demo listings occurs. Source and managed runtime configuration are distinct; secrets are never included in these documents.

## Farmer flow

1. Select Sell Waste on homepage. Signed-out visitors go to `/auth` with Farmer selected and a return action.
2. Sign up with name, optional contact, email, password and Farmer role. Email confirmation is retained; successful signup is not treated as a session until confirmed.
3. Login returns to Sell or `/farmer`. Farmer creates a draft or published listing with a supplied valid Indian mobile number.
4. Draft remains private; published becomes available to anonymous visitors and Buyers.
5. Farmer edits only their own listings, marks unavailable/sold, or soft-deletes. Sold is a seller assertion, not a transaction record.
6. `/farmer` shows their listings and authorized inquiries; Farmer changes inquiry status to read/closed and updates their private profile. Previously published contact snapshots require editing the listing separately.

## Buyer flow

1. Buy Waste opens `/marketplace` without login. Search/type/location and normalized price/quantity filters operate on published database records.
2. Details show available quantity, asking price, location, seller-supplied name/contact and photo, if supplied.
3. Buyer login is required to send an inquiry. Return action preserves the chosen listing.
4. Validated name, phone/email and message are stored against Buyer ID and listing ID. Seller reads it from another account/browser; Buyer sees own status/history at `/buyer`.
5. Buyer cannot create/edit listings or access another user's private profile. Calls/WhatsApp are external user-initiated actions; no automatic delivery is implied.

## Database schema (actual)

| Table | Columns and relationships |
|---|---|
| `profiles` | `id` UUID PK references auth user (cascade), `display_name`, `contact`, `created_at` |
| `user_roles` | `user_id` UUID PK references auth user (cascade), `role` enum `market_role`: farmer/buyer |
| `listings` | UUID `id`, `seller_id` references profiles, `waste_type`, `quantity`, `unit`, `price`, `location`, `description`, `photo`, `seller_name`, `seller_contact`, `status`, `is_demo`, `created_at`, `updated_at` |
| `inquiries` | UUID `id`, `listing_id` references listings (cascade on hard delete), `buyer_id` references profiles, `buyer_name`, `contact`, `message`, `status`, `created_at` |

Listing statuses: draft/published/sold/deleted. Inquiry statuses: new/read/closed. `is_demo` is constrained false for shared listings; no sample rows are seeded. Table grants, indexes, triggers and policies are tracked in `drizzle/migrations/`. Bucket creation is a Storage API operation, not a migration insert.

## Validation and authorization

- Form and authenticated server mutations use Zod. Database bounds prevent zero/negative/excessive quantity (maximum 1,000,000 kg equivalent), negative/non-finite prices (maximum 10,000,000 INR per selected unit), oversized text and invalid contacts.
- `profiles`: authenticated own SELECT/UPDATE; no public profile reads.
- `user_roles`: authenticated own SELECT only; no client INSERT/UPDATE/DELETE. Signup initializes role once; later editable metadata is not permission authority.
- `listings`: public SELECT only published; own SELECT includes private statuses. Farmer create/update/delete requires authenticated ownership. Identity fields cannot change through update.
- `inquiries`: Buyer creates only against published listings; read is Buyer-own or listing seller-own. Seller updates status only; trigger prevents identity/content changes.
- `has_market_role` uses SECURITY INVOKER and protected role rows. `market_signup` is a restricted auth lifecycle trigger, not a public callable account-provisioning API.
- `_authenticated` gates account dashboards. Endpoint middleware and RLS protect data independently; public Sell UI is not the security boundary.
- `src/start.ts` attaches session bearer authorization and retains CSRF middleware. Logout cancels queries, clears cached private data, signs out, and replaces navigation.

## Photos and privacy

Private `waste-photos` bucket, 500 KB per file. Farmer upload uses own UUID directory; allowed image extensions are JPG/JPEG/PNG/WebP. The form checks MIME/decoding. Owners read their media; published-listing media may be read through a five-minute signed URL. Signed URLs can remain valid until expiration after availability changes.

There is no malware scan, metadata stripping, server image transcoding, old-photo cleanup, account deletion or automated retention policy. Private inquiry contact and published listing contact have different visibility rules. Do not enter full addresses or private image content. Original waste notes remain unencrypted browser data.

## Limits and pending work

Public listing reads page through 500 rows; dashboard queries still use the default Data API limit (1000 rows). No live push subscriptions or inquiry email notifications; refetch/navigation/refresh reads new database data. No price appraisal, AI, verified identities, payments, multilingual UI or measured social/environmental outcomes.

Real mailbox signup confirmation and reset-email completion are pending verification. Automated test accounts were administratively created/confirmed, not used to disable confirmation globally. Published/standalone deployment and independent fresh-backend installation have not been end-to-end tested.

See [TEST_CASES.md](TEST_CASES.md) for evidence and [../README.md](../README.md) for setup/environment names.