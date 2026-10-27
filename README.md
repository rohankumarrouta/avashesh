# Avashesh — Waste Less. Create More.

Avashesh (अवशेष, "residue") is a student project that helps people record agricultural
waste — like paddy straw and coconut husk — and explore practical ways to reuse it instead
of burning it or leaving it unused. We are starting with Odisha.

> **Prototype status.** Suggestions come from fixed, written rules — there is **no AI**.
> No real farmer data is included and we have **no partnerships**. Sample records are
> made-up and marked **SAMPLE**. Emission numbers are **estimates**, not measurements.

## Features (all working)

| Page | What it does |
|---|---|
| Home `/` | Explains the problem and the project |
| Record `/record` | Enter waste type, quantity (kg / quintal / tonne), Odisha district, date, current handling, notes |
| Reuse `/reuse` | Ranked reuse options with the reasons and steps; "Plan this option" saves your choice. Without a record, explore any waste type + quantity |
| Dashboard `/dashboard` | Total recorded, number of records, plans made, breakdown by waste type and handling, estimated emissions |
| Records `/records` | View, delete, export as JSON, load/remove sample data, delete all |
| About `/about` | Idea, purpose, what works, future plans, honest limits |
| Marketplace `/marketplace` | Search/filter local listings, Buyer view, My listings & inquiries, remove/restore samples, clear marketplace data |
| Sell `/marketplace/sell` | Seller name, Indian mobile number, waste type, quantity/unit, asking price per unit, location, description, optional photo |
| Listing `/marketplace/$listingId` | Listing details, supplied phone/WhatsApp links, local inquiry form; sample inquiry preview |

## Tech stack (actual)

React 19, TanStack Start / Router, TypeScript, Tailwind CSS v4, Vite 7, Vitest.
TanStack Start serves and server-renders the pages, but there is **no application backend, database or login**. All user data is stored in the browser. No Express or separate Node API is required.

## Run locally

```bash
bun install        # or npm install
bun run dev        # or npm run dev
bun run test       # or npm test
```

## Data & privacy

- Records are saved in the browser's `localStorage` under the key `avashesh.records.v1`.
- They stay after refreshing, but only on that device and browser. Clearing browser data,
  private/incognito mode, or another device means they are not there.
- No record, listing, inquiry or uploaded photo is sent to an application server. The app itself and fonts are fetched over the network. Storage is not encrypted — avoid sensitive information and full addresses; use test contact details in the marketplace.
- Damaged stored data is ignored instead of crashing the app. If storage is blocked or full,
  the form shows an error instead of pretending to save.
- Use **Export JSON** on the Records page to keep a copy.

## Marketplace demo

- Marketplace data uses `avashesh.marketplace.v1`, separate from waste records. Listings and inquiries survive refresh but are **not shared across users, devices or browsers**. A listing URL cannot share its contents with another browser.
- Fictional sample listings in `src/data/sample-listings.json` appear on first visit, marked SAMPLE. They have no phone numbers and prices are illustrative, not fair-price estimates. Remove or restore them on the marketplace page.
- The seller view shows listings created in this browser and their inquiries. Ownership is a local identifier, **not authentication or security**: anyone with access to this browser can see contacts and manage its listings. Sample inquiries appear in a sample seller preview on the details page.
- Asking price is INR **per selected unit** (kg, quintal, tonne). Price filters use INR/kg so different units can be compared. Quantity is positive and at most 1,000,000 kg equivalent. Zero asking price is allowed for free material.
- Seller contact must be a valid-format Indian mobile number (10 digits starting 6–9, optionally +91). This checks format, not ownership or whether a number is active. Phone/WhatsApp links only use supplied valid numbers. WhatsApp opens an external service with an encoded message; nothing is sent automatically.
- Buyers can save name, phone/email and a message for a listing. **This is not a delivered message**; it is visible only within this browser. There are no payments, verified buyers, transactions, or active farmer network.
- Optional JPEG/PNG/WebP photos up to 500 KB are checked for type, file signature and decodability, then stored as a data URL. Avoid personal images or embedded location metadata; metadata is not stripped. Browser quota may fill quickly. A failed write reports an error and does not claim a save.
- Client forms and storage mutations both use Zod schemas. There is no server-side mutation to validate in this local-only version. A future shared backend must independently validate inputs and enforce authenticated ownership.
- Deleting a listing also deletes its inquiries. **Clear marketplace data** removes local listings, photos and inquiries without affecting waste records; it has no export/backup or undo.
- Corrupt marketplace data is reported without overwriting it. Back it up using browser tools before clearing the marketplace storage key if recovery is needed.

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
- `marketplace.test.ts` — validation, contacts, ownership, filters, inquiry linkage, sample honesty, serialization and deletion

See `docs/ARCHITECTURE.md` for the technical design.

## License

MIT — see [LICENSE](./LICENSE).

Copyright (c) 2026 Team Avashesh.
