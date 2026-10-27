import { estimateAvoidedEmissions, type ImpactEstimate } from "@/lib/impact";
import { isBurnable, PRACTICES, WASTE_TYPES, type WasteRecord } from "@/lib/waste";

export interface Summary {
  count: number;
  totalKg: number;
  demoCount: number;
  byType: { id: string; label: string; kg: number }[];
  byPractice: { id: string; label: string; count: number }[];
  plannedCount: number;
  plannedKg: number;
  /** Burnable waste that was usually burned AND now has a reuse plan. */
  burningWithPlanKg: number;
  /** Estimated emissions from that waste IF it had been burned. Not measured. */
  burningEstimate: ImpactEstimate | null;
}

export function summarize(records: WasteRecord[]): Summary {
  const totalKg = records.reduce((s, r) => s + r.quantityKg, 0);
  const planned = records.filter((r) => r.plannedReuseId);
  const burningWithPlanKg = planned
    .filter((r) => r.practice === "burning" && isBurnable(r.wasteType))
    .reduce((s, r) => s + r.quantityKg, 0);
  return {
    count: records.length,
    totalKg,
    demoCount: records.filter((r) => r.isDemo).length,
    byType: WASTE_TYPES.map((w) => ({
      id: w.id,
      label: w.label,
      kg: records.filter((r) => r.wasteType === w.id).reduce((s, r) => s + r.quantityKg, 0),
    }))
      .filter((t) => t.kg > 0)
      .sort((a, b) => b.kg - a.kg),
    byPractice: PRACTICES.map((p) => ({ id: p.id, label: p.label, count: records.filter((r) => r.practice === p.id).length })).filter(
      (p) => p.count > 0,
    ),
    plannedCount: planned.length,
    plannedKg: planned.reduce((s, r) => s + r.quantityKg, 0),
    burningWithPlanKg,
    burningEstimate: burningWithPlanKg > 0 ? estimateAvoidedEmissions(burningWithPlanKg) : null,
  };
}
