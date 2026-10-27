# Avashesh — Technical architecture

## Overview

TanStack Start serves the pages. Waste records retain browser-only persistence; the marketplace uses Lovable Cloud authentication, PostgreSQL and private photo storage. Authenticated server functions validate shared writes, and database RLS enforces ownership.

```text
 Pages (src/routes)            Logic (src/lib, pure + tested)       Storage
 ------------------            ------------------------------       -------
 /record  ── add() ─────────▶  waste.ts  validateRecord/createRecord ─┐
 /reuse   ── recommend() ───▶  reuse-rules.ts                          │
          ── setPlan() ─────▶                                          ├─▶ localStorage
 /dashboard ─ summarize() ──▶  dashboard.ts ──▶ impact.ts              │   "avashesh.records.v1"
 /records ── remove/export ─▶  hooks/use-records.ts  ──────────────────┘
```

## Modules

| File | Responsibility |
|---|---|
| `src/lib/waste.ts` | Waste types, practices, Odisha districts, units, `WasteRecord` type, validation, safe parse/load/save |
| `src/lib/reuse-rules.ts` | List of reuse options and the deterministic `recommend()` scoring with reasons |
| `src/lib/dashboard.ts` | `summarize()` — totals, breakdowns, estimate input |
| `src/lib/impact.ts` | IPCC emission factors and `estimateAvoidedEmissions()` |
| `src/hooks/use-records.ts` | React hook: add, delete, set plan, load/remove sample data, clear all |
| `src/data/sample-records.json` | Made-up sample records (`isDemo: true`) |
| `src/routes/*.tsx` | Home, Record, Reuse, Dashboard, Records, About pages |
| `src/lib/marketplace.ts` | Zod schemas, pure listing/inquiry mutations, normalized INR/kg filters, safe contact links, state parsing |
| `src/lib/cloud-marketplace.ts`, `marketplace.functions.ts` | Shared listing schemas, pure filters and authenticated validated writes |
| `src/hooks/use-account.tsx` | Session subscription, private profile/role reads and ordered sign-out |
| `src/lib/cloud-queries.ts` | Published listing reads (paged in 500-row batches), details |
| `src/data/sample-listings.json` | Legacy fictional test fixture, never seeded into the shared marketplace |
| `src/components/MarketplaceShared.tsx` | Shared prototype notice, contact actions and field styling |
| `src/routes/marketplace.*.tsx` | Buyer/seller views, sell form and details/inquiry page |

## Data model

```ts
WasteRecord {
  id: string; wasteType: WasteTypeId; quantityKg: number;   // always stored in kg
  district: string;  // one of 30 Odisha districts
  date: "YYYY-MM-DD"; practice: "burning"|"left"|"dumped"|"reused"|"unsure";
  plannedReuseId: string | null; notes: string;
  isDemo: boolean; createdAt: ISO string;
}
```

## Validation rules

- Quantity > 0 and ≤ 1,000,000 kg (after unit conversion: quintal = 100 kg, tonne = 1000 kg)
- District must be in the Odisha list; date must be valid and not in the future
- Notes ≤ 300 characters
- Stored data is re-validated on load; invalid entries are dropped

## Design decisions

- **Rules, not AI** — transparent and testable; each suggestion lists why it was shown.
- **Pure logic modules** — all rules live outside React so they can be unit-tested.
- **Split persistence** — waste recording stays unchanged locally; shared marketplace uses Cloud.
- **Kg everywhere** — one unit internally avoids conversion bugs.

## Known limitations

- Waste records are per browser (Export JSON); marketplace data is shared through Cloud.
- No Odia translation or verified directory of reuse units.
- Reuse rules are not yet validated by experts or farmers.
- Emission estimate assumes dry residue fully burned; ignores transport and processing.

## Shared marketplace architecture

`profiles` references auth users and stores private display name/contact. `user_roles` separately stores immutable-by-client Farmer/Buyer choice. An auth lifecycle trigger creates both; only Farmer/Buyer values are accepted once at signup. Role checks read protected table rows, never user-editable session metadata.

`listings` references profiles through seller ID and stores material, quantity/unit, per-unit asking price, public district/state, sanitized compatibility location, description, seller-supplied public name/contact, photo object path and status. `inquiries` references listing and Buyer profile; it stores Buyer name/contact/message and new/read/closed status. UUID identity/ownership fields cannot change. Quantities and prices have database bounds and finite-value constraints.

RLS: anon/authenticated may read published listings; owners may read their draft/sold/deleted rows. Farmer may create/update/delete only their own rows. Buyer may insert inquiries only against published listings; inquiry read is Buyer-own or listing seller-own. Only seller updates inquiry status; a trigger blocks changing its identity/message/contact. Profiles are own-read/own-update. Roles are own-read only; client role writes and callable signup trigger execution are explicitly revoked.

`src/lib/marketplace.functions.ts` uses generated `requireSupabaseAuth`; `src/start.ts` preserves bearer attachment and CSRF middleware. Protected dashboard routes use the `_authenticated` layout, while browse/details/sell are public surfaces with explicit login affordances. Sell writes still require authenticated Farmer at both function and RLS boundaries. Account logout cancels queries, clears cache, signs out then replaces navigation.

Client and server share Zod schemas; direct Data API writes remain database-validated. React escapes input text. WhatsApp URL values are encoded. Published listing reads fetch 500-row batches; dashboard reads currently have the Data API default row limit (1000), a scale limitation rather than a total-count claim.

Private `waste-photos` storage: insert/delete own UUID folder; direct read own only. A listing-ID-only server function verifies a public published row before signing its exact seller-owned photo. Signed URLs expire after five minutes. Only permitted image extensions and ≤500 KB/file are accepted; form decodes images. No server-side scanning or metadata stripping. Old media is not automatically purged.

`listing_locations` stores full addresses separately. SELECT is owner-only or Buyer-with-own-inquiry; an ownership-checked atomic save function writes both listing and location. Public search uses only district/state.

Soft deletion hides listings while retaining inquiry history. No payments, transaction proof, email inquiry notifications, account deletion or retention automation. Real email confirmation/reset delivery remains unverified. Legacy local demo JSON is test-only and never mixed into public stock. Local waste records are unaffected.

Migrations live in `drizzle/migrations/`; all public-table grants and RLS policies are recorded there. Bucket creation uses the Cloud Storage API, not SQL. The role helper is SECURITY INVOKER and signup trigger function is not executable by anon/authenticated.

## Next steps (future work)

1. Field interviews in Odisha to check rules and quantities.
2. Odia language.
3. Verify real mailbox signup/recovery, add retention and media cleanup.
4. Verified directory of local coir, compost and biomass units.
