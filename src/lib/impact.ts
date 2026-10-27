/**
 * Environmental impact estimate for crop residue that is NOT burned in the open.
 *
 * Emission factors: IPCC 2006 Guidelines for National Greenhouse Gas Inventories,
 * Volume 4 (AFOLU), Chapter 2, Table 2.5 — "Agricultural residues":
 *   CO2 1515 g/kg, CH4 2.7 g/kg, N2O 0.07 g/kg of dry matter burnt.
 * GWP-100 values: IPCC AR5 (2013) — CH4 = 28, N2O = 265.
 *
 * Assumptions (shown to users): the input is dry matter and would otherwise have
 * been fully burned. IPCC inventories treat biomass CO2 as biogenic, so the
 * non-CO2 figure is the conservative "climate" number.
 */
export const EMISSION_FACTORS_G_PER_KG = { co2: 1515, ch4: 2.7, n2o: 0.07 } as const;
export const GWP100 = { ch4: 28, n2o: 265 } as const;
export const IMPACT_SOURCE =
  "IPCC 2006 Guidelines, Vol. 4, Ch. 2, Table 2.5 (agricultural residues); GWP-100 from IPCC AR5.";
export const MAX_IMPACT_KG = 10_000_000;

export interface ImpactEstimate {
  co2Kg: number;
  ch4Kg: number;
  n2oKg: number;
  nonCo2Co2eKg: number;
  totalCo2eKg: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Returns null for invalid input (non-number, negative, or above MAX_IMPACT_KG). */
export function estimateAvoidedEmissions(residueKg: number): ImpactEstimate | null {
  if (!Number.isFinite(residueKg) || residueKg < 0 || residueKg > MAX_IMPACT_KG) return null;
  const co2 = (residueKg * EMISSION_FACTORS_G_PER_KG.co2) / 1000;
  const ch4 = (residueKg * EMISSION_FACTORS_G_PER_KG.ch4) / 1000;
  const n2o = (residueKg * EMISSION_FACTORS_G_PER_KG.n2o) / 1000;
  const nonCo2 = ch4 * GWP100.ch4 + n2o * GWP100.n2o;
  return {
    co2Kg: round2(co2),
    ch4Kg: round2(ch4),
    n2oKg: round2(n2o),
    nonCo2Co2eKg: round2(nonCo2),
    totalCo2eKg: round2(co2 + nonCo2),
  };
}
