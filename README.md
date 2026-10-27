# Avashesh — Waste Less. Create More.

Prepared for the **My Bharat Code for Social Cause** competition by **Team Avashesh**.

## Problem statement and solution

Agricultural residues can be left unused or burned when people lack accessible reuse guidance or ways to find interested buyers. Avashesh explores this problem starting with Odisha: record waste, review transparent reuse options, and publish agricultural material listings that Buyers can discover and inquire about. These are project goals, not evidence of increased income or reduced pollution.

Avashesh (अवशेष, "residue") is a student project that helps people record agricultural
waste — like paddy straw and coconut husk — and explore practical ways to reuse it instead
of burning it or leaving it unused. We are starting with Odisha.

> **Prototype status.** Suggestions come from fixed, written rules — there is **no AI**.
> No real farmer data is included and we have **no partnerships**. Sample records are
> made-up and marked **SAMPLE**. Emission numbers are **estimates**, not measurements.

## Implemented features

| Page | What it does |
|---|---|
| Home `/` | Primary Buy Waste and Sell Waste actions, plus existing reuse/record tools |
| Record `/record` | Enter waste type, quantity (kg / quintal / tonne), Odisha district, date, current handling, notes |
| Reuse `/reuse` | Ranked reuse options with the reasons and steps; "Plan this option" saves your choice. Without a record, explore any waste type + quantity |
| Dashboard `/dashboard` | Total recorded, number of records, plans made, breakdown by waste type and handling, estimated emissions |
| Records `/records` | View, delete, export as JSON, load/remove sample data, delete all |
| About `/about` | Idea, purpose, what works, future plans, honest limits |
| Buy Waste `/marketplace` | Published shared listings; search and type/location/quantity/price filters, no login required to browse |
| Sell `/marketplace/sell` | Seller name, Indian mobile number, waste type, quantity/unit, asking price per unit, public district/state, private full location, description, optional photo |
| Listing `/marketplace/$listingId` | Shared details, supplied phone/WhatsApp links, Buyer-only inquiry submission |
| Auth `/auth`, `/reset-password` | Email signup/login/logout and password recovery; Farmer/Buyer signup |
| Farmer `/farmer` | Own listings, create/edit/publish/unavailable/delete, inquiries/status and private profile |
| Buyer `/buyer` | Own inquiry history/status and private profile |

## Tech stack (actual)

React 19, TanStack Start / Router, TypeScript, Tailwind CSS v4, Vite (installed version in package.json), Vitest, Zod and Lovable Cloud (PostgreSQL, authentication and private photo storage). TanStack server functions handle validated listing/inquiry/profile writes. No Express or separate Node API is required.

## Run locally

```bash
bun install        # or npm install
bun run dev        # or npm run dev
bun run test       # or npm test
```

Open the address printed by Vite (the managed preview uses port 8080). Use a current Bun installation; `bun.lock` records dependencies. `bun run build` creates the production build; `bun run preview` previews that output. These are the existing scripts, not proof an independent deployment was verified.

## Setup configuration

The connected Lovable environment provisions runtime variables. For an independent source checkout, configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for the same backend; never commit private keys. Apply the tracked Drizzle migrations and create the private `waste-photos` bucket (500 KB/file) with its recorded storage policies. Enable email/password auth and configure allowed auth redirect origins. The managed preview supplies these automatically. Email confirmation remains on.

### Environment variables (names only)

| Variable | Actual purpose |
|---|---|
| `VITE_SUPABASE_URL` | Browser-accessible backend URL used by generated client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser publishable key; not a private secret |
| `VITE_SUPABASE_PROJECT_ID` | Generated Cloud project configuration identifier |
| `SUPABASE_URL` | Server runtime backend URL |
| `SUPABASE_PUBLISHABLE_KEY` | Server user-scoped client configuration |
| `SUPABASE_SERVICE_ROLE_KEY` | Generated privileged server client; used only to sign a photo path from an independently verified published listing; server-only, never commit or expose |
| `LOVABLE_DB_MIGRATION_URL` | Connection consumed by `drizzle.config.ts` for migration tooling, not a browser variable |

No AI, payment or GitHub API key is required by the application. Do not copy managed secret values into repository docs. Local `.env` files must not be committed; the current `.gitignore` does not explicitly exclude `.env`, so keep configuration outside source control or add an ignore rule before your own Git submission.

### Actual backend configuration

The connected project already has the five tables, auth trigger and RLS policies in `drizzle/migrations/0000` through `0003`. For a fresh independent backend, apply those SQL files in order using its database migration tools, preserving grants and policies. Create `waste-photos` through its Storage API as a **private** bucket with a 500 KB/file limit before exercising uploads. Initial storage policies are in migration `0001`; migration `0004` replaces photo reads with owner-only access. `drizzle/schema.ts` is intentionally not the source of truth; do not run an empty schema push. There is no repository database-migration script, one-command standalone installer or offline backend.

### Deployment

For the existing Lovable project, use **Publish** after checking the preview. On desktop it is at the top right; on mobile use the project menu → Publish. This documentation does not claim publishing occurred. Configure the production origin and password-reset URL in the backend's authentication redirect allow-list, keep server-only configuration private, then repeat the test checklist against the published origin.

Outside Lovable, this is a full-stack TanStack Start application, not a static-only SPA. Use compatible hosting for its configured server runtime and supply the backend environment above. Standalone deployment and mailbox redirect behavior are **pending verification**; no unsupported hosting command is presented as tested.

## Waste records & privacy

- Records are saved in the browser's `localStorage` under the key `avashesh.records.v1`.
- They stay after refreshing, but only on that device and browser. Clearing browser data,
  private/incognito mode, or another device means they are not there.
- Waste records stay local and unencrypted. Marketplace accounts, listings, photos and inquiries are stored in Lovable Cloud. Do not include sensitive notes or full addresses.
- Damaged stored data is ignored instead of crashing the app. If storage is blocked or full,
  the form shows an error instead of pretending to save.
- Use **Export JSON** on the Records page to keep a copy.

## Shared marketplace and privacy

- Homepage BUY/SELL cards are the central entry. Sell links select Farmer signup and return to the listing form after login; inquiry links return to the chosen listing. Buyer accounts cannot sell.
- Roles live in a protected `user_roles` table, separate from private `profiles`. The signup trigger copies the initial Farmer/Buyer choice once; later metadata edits cannot change privileges. No admin role is available.
- Public results contain **only published listings**. Draft and unavailable/sold listings stay accessible to their owner; deleted listings are hidden. Seller-marked sold is not proof of a transaction.
- Asking price is INR per selected unit. Price filters normalize to INR/kg, quantity filters to kg. Quantity must be positive and ≤1,000,000 kg equivalent; price must be nonnegative and ≤10,000,000 INR/unit.
- Public listings show only district/state, never the full-location field. Full locations live separately and are readable only by the seller and Buyers who submitted an inquiry; phone/WhatsApp clicks alone do not unlock them. Existing free-text locations were moved to private storage; sellers must provide district/state rather than having addresses guessed.
- Published listings expose their seller-supplied name/contact and photo, not the private profile. Mobile formats are validated, not verified for ownership. Phone and WhatsApp actions use supplied numbers, encode messages and do not send automatically.
- Buyer inquiries are stored in the shared database and read only by that Buyer and the listing's seller. Farmer can mark new/read/closed; these states do not imply a purchase. No email inquiry notifications are implemented.
- Forms and authenticated server functions validate with Zod; database constraints/triggers and row-level policies enforce rules even through direct requests. Users cannot change another seller's listing, private profile or role.
- Optional photos use private Cloud storage (JPEG/PNG/WebP ≤500 KB). Direct storage reads are owner-only. A server function accepts a listing ID, verifies a published row through public RLS, and signs only that row’s seller-owned photo for five minutes; owners can read their private media. Client checks MIME and decoding; storage checks size and permitted path/extension. There is no malware scanning or server-side image transcoding; avoid personal images and embedded location metadata.
- Delete is soft deletion; inquiry history remains available to authorized participants. Replaced/deleted photos are not automatically purged yet. No account-deletion or automatic retention policy is implemented.
- Waste records remain isolated in their existing browser store. Old marketplace demo localStorage is no longer read or migrated; its fictional JSON remains a test fixture only. **No sample marketplace listings are seeded or shown as real stock.**
- No payments, verified users/buyers, measured impact, actual transactions or partnerships are claimed.

## Reuse rules (how suggestions are ranked)

1. Only options listed for the chosen waste type are shown.
2. If the quantity is below an option's minimum, it goes under "Not suitable for this quantity".
3. +2 if the quantity size (small < 200 kg, medium 200–1999 kg, large ≥ 2000 kg) matches the option.
4. +2 for low effort, +1 for medium effort.
5. +1 if the waste is usually burned and the option is quick.

Full list of options: `src/lib/reuse-rules.ts`. The rules are general guidance written by
the team and have **not yet been reviewed by agricultural experts or farmers**.

## Emission estimate

Shown only for burnable waste (paddy straw, coconut husk, bagasse, groundnut shells) that
is marked "Usually burned" **and** has a reuse plan:

`kg × factor` — CO₂ 1515 g/kg, CH₄ 2.7 g/kg, N₂O 0.07 g/kg dry matter
(IPCC 2006 Guidelines, Vol. 4, Ch. 2, Table 2.5, agricultural residues), GWP-100 CH₄ 28,
N₂O 265 (IPCC AR5). Example: 1000 kg → 1609.15 kg CO₂e. A plan is not proof of reuse.

## Sample data

`src/data/sample-records.json` — 5 made-up records, loaded only when you tap
"Load sample data". Each has `"isDemo": true` and shows a SAMPLE label.

## Tests

`bun run test` runs the tests in `src/test/`:
- `waste.test.ts` — quantity limits, Odisha districts, future dates, notes length, units, corrupt storage
- `reuse-rules.test.ts` — size limits, minimum quantities, burning bonus, sort order, reasons
- `dashboard.test.ts` — totals, breakdown, which records count toward the estimate
- `impact.test.ts` — emission factor maths and invalid input
- `marketplace.test.ts` — legacy pure demo fixtures plus shared phone/schema rules
- `cloud-marketplace.test.ts` — shared listing validation, published-only filters, unit conversion and safe return paths

## Verification and remaining checks

The earlier baseline had 65 automated tests on 27 October 2026; the location/photo privacy change added six cases. Two separate browser contexts with admin-created, confirmed test Farmer/Buyer accounts verified login/logout/refresh, draft hiding, publishing, cross-browser listing/photo visibility, combined filters, inquiry delivery/readback/status, profile update, editing, sold hiding, deletion and Buyer denial. Direct database requests confirmed private-profile isolation and blocked listing/role edits. Test fixtures were removed. The earlier database security advisor returned no warnings; a later storage scan identified broad photo reads, now replaced with owner-only direct access; this is not a full penetration-test claim.

Public signup was exercised with a reserved test email and correctly rejected by the email provider. Real mailbox signup confirmation and emailed password-reset completion remain **unverified**; confirmation was not disabled. Password recovery is implemented, but actual email delivery needs a real mailbox. Published deployment has not been tested or changed.

Competition documents: [Technical design](docs/TECHNICAL_DESIGN.md), [Sample data](docs/SAMPLE_DATA.md), [Test cases](docs/TEST_CASES.md). [Architecture notes](docs/ARCHITECTURE.md) retain supporting details.

## License

MIT — see [LICENSE](./LICENSE).

The LICENSE contains a copyright-holder placeholder as requested. Replace it with the actual rights holder before submission. MIT is appropriate only if the team owns or has permission to release its original code under those terms; it does not relicense third-party dependencies or media. Dependency/media licensing and competition eligibility terms remain your responsibility to review. Project credit: Team Avashesh.
