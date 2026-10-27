# Avashesh (अवशेष) — crop residue marketplace prototype

A prototype where farmers list crop residue (straw, stalks, husk) for sale and buyers
(biomass plants, pellet/board makers) post demand, plus a calculator that estimates the
emissions avoided when residue is sold instead of burned in the open.

> **Prototype status.** All sample listings are fictional. No real farmers, buyers or
> partners are onboarded. There is no AI, payment, chat, GPS or QR feature in this build.

## Feature status

| Feature | Status |
|---|---|
| Browse offers & requests, filter by type / residue / location | Working |
| Post and delete your own listing (with validation) | Working — saved in this browser only |
| Impact calculator with cited emission factors | Working — estimate only |
| Accounts, shared database, contacting a seller | Planned |
| AI waste identification, price estimates, multilingual UI | Planned |
| GPS logistics, QR tracking | Planned |

## Tech stack (actual)

- React 19 + TanStack Start / TanStack Router (file routes in `src/routes/`)
- Vite 7, Tailwind CSS v4, TypeScript
- Vitest for tests
- No separate Node/Express server and no database in this version.

## Run locally

```bash
bun install      # or: npm install
bun run dev      # or: npm run dev
bun run test     # or: npm test
```

## Project layout

```
src/lib/impact.ts            emission calculation + factors
src/lib/listings.ts          types, validation, filtering, browser storage
src/data/sample-listings.ts  fictional sample data
src/routes/                  pages: / , /listings , /post , /impact
src/test/                    unit tests
```

## Impact calculator method

`emissions avoided = residue kg (dry matter) × emission factor`

| Gas | Factor (g per kg dry matter burnt) | GWP-100 |
|---|---|---|
| CO₂ | 1515 | 1 |
| CH₄ | 2.7 | 28 |
| N₂O | 0.07 | 265 |

Sources: IPCC 2006 Guidelines for National Greenhouse Gas Inventories, Vol. 4, Ch. 2,
Table 2.5 ("Agricultural residues"); GWP-100 values from IPCC AR5 (2013).

Example: 1000 kg → 1515 kg CO₂, 94.15 kg CO₂e from CH₄ + N₂O, 1609.15 kg CO₂e total.

Limitations: assumes the residue would otherwise be fully burned; ignores transport and
reuse emissions; IPCC inventories treat crop CO₂ as biogenic, so the non-CO₂ figure is the
conservative climate number. Results are estimates, not measurements.

## Privacy & storage limitations

- Your listings are stored in this browser's `localStorage` (key `avashesh.listings.v1`).
  Other people cannot see them; clearing browser data deletes them.
- Nothing is sent to a server. Storage is not encrypted.
- The form asks users not to enter phone numbers or exact addresses.
- Corrupt or tampered stored data is ignored rather than crashing the app.

## Tests

`src/test/impact.test.ts` — factor math, zero, negative/NaN/over-limit input.
`src/test/listings.test.ts` — quantity and price limits, blank fields, corrupt storage,
filtering.

## License

MIT — see [LICENSE](./LICENSE).
