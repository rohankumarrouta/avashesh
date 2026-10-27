# Avashesh — Technical architecture

## Overview

TanStack Start serves and server-renders the web pages. There is no application data
backend: React reads/writes records, marketplace listings and inquiries in `localStorage`
after hydration. No private server credentials or server-side data mutations are used.

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
| `src/hooks/use-marketplace.ts` | Read after hydration; validate fresh stored state before each write; report quota/corruption failures; cross-tab refresh |
| `src/data/sample-listings.json` | Fictional initial listings with `isDemo: true`, no contact numbers |
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
- **localStorage** — simplest way to keep data after refresh for a demo; replaced by a
  real database once accounts are added.
- **Kg everywhere** — one unit internally avoids conversion bugs.

## Known limitations

- Data is per device/browser; no sync, backup or sharing (use Export JSON).
- No accounts, no Odia translation yet, no list of real reuse units.
- Reuse rules are not yet validated by experts or farmers.
- Emission estimate assumes dry residue fully burned; ignores transport and processing.

## Next steps

## Marketplace model and boundaries

`avashesh.marketplace.v1` stores one versioned object containing a browser-local
`ownerId`, `listings`, and `inquiries`. IDs are generated in event handlers or effects,
never at module scope. First visit persists the literal SAMPLE JSON once; removing
samples or clearing data does not re-seed on refresh.

```ts
Listing {
  id; ownerId; sellerName; contact; wasteType;
  quantity; unit; price; // asking INR per selected unit
  location; description; photo; // optional safe image data URL
  isDemo; createdAt;
}
Inquiry { id; listingId; buyerName; contact; message; createdAt; }
```

Seller form and pure mutations independently apply the same Zod schema. Stored state
is validated before reads and writes; corruption is not silently overwritten. Seller
mobile contacts are format-checked; sample contacts must be empty. Buyer contact may be
an Indian mobile number or valid-format email. Names ≤100 characters, location ≤120,
description/message ≤1000, contact ≤255 for inquiries. Quantity ≤1,000,000 kg equivalent;
asking price is nonnegative and ≤10,000,000 INR per unit. Filters normalize price to INR/kg.

Optional photos allow JPEG/PNG/WebP only, up to 500 KB, with signature/decoding checks in
the form and constrained data URLs in stored schemas. They are stored in localStorage,
not uploaded. Original image metadata is not stripped. React escapes text; no user HTML
is rendered. Contact links use validated supplied numbers and encode WhatsApp text.

Deletion checks the local owner ID and rejects SAMPLE listings or foreign owner IDs,
then removes associated inquiries in the same storage write. This is a demo guard,
**not authorization**: users can change browser storage and anyone using this browser
has access. My listings shows only browser-created entries; SAMPLE inquiries have a
preview in listing details. No cross-user messaging occurs. Clear marketplace removes
its listings/inquiries/photos only, not waste records. No marketplace export exists.

Future backend work must add independent server validation, authenticated ownership,
access control for contact data, consent/retention rules, and secure media storage.

## Next steps (future work)

1. Field interviews in Odisha to check rules and quantities.
2. Odia language.
3. Optional accounts with a hosted database.
4. Verified directory of local coir, compost and biomass units.
