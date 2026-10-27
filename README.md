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

## Tech stack (actual)

React 19, TanStack Start / Router, TypeScript, Tailwind CSS v4, Vite 7, Vitest.
There is **no server, database or login** in this version — everything runs in the browser.

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
- Nothing is sent to any server. Storage is not encrypted — don't enter phone numbers or addresses.
- Damaged stored data is ignored instead of crashing the app. If storage is blocked or full,
  the form shows an error instead of pretending to save.
- Use **Export JSON** on the Records page to keep a copy.

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

`bun run test` runs 28 tests in `src/test/`:
- `waste.test.ts` — quantity limits, Odisha districts, future dates, notes length, units, corrupt storage
- `reuse-rules.test.ts` — size limits, minimum quantities, burning bonus, sort order, reasons
- `dashboard.test.ts` — totals, breakdown, which records count toward the estimate
- `impact.test.ts` — emission factor maths and invalid input

See `docs/ARCHITECTURE.md` for the technical design.

## License

MIT — see [LICENSE](./LICENSE).
