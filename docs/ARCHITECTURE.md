# Avashesh — Technical architecture

## Overview

A browser-only web app. There is no backend: pages render with React and read/write
records in `localStorage`.

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

1. Field interviews in Odisha to check rules and quantities.
2. Odia language.
3. Optional accounts with a hosted database.
4. Verified directory of local coir, compost and biomass units.
