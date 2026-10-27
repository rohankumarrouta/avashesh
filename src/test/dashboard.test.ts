import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/dashboard";
import { createRecord, type RecordInput } from "@/lib/waste";

const base: RecordInput = { wasteType: "paddy_straw", quantityKg: 1000, district: "Puri", date: "2026-10-01", practice: "burning", notes: "" };

describe("dashboard summary", () => {
  it("empty list gives zeros and no estimate", () => {
    const s = summarize([]);
    expect(s.totalKg).toBe(0);
    expect(s.count).toBe(0);
    expect(s.burningEstimate).toBeNull();
  });
  it("totals and breakdown by type", () => {
    const s = summarize([createRecord(base), createRecord({ ...base, wasteType: "coconut_husk", quantityKg: 200 })]);
    expect(s.totalKg).toBe(1200);
    expect(s.byType.map((t) => t.kg)).toEqual([1000, 200]);
  });
  it("estimate counts only burned + planned + burnable waste", () => {
    const planned = { ...createRecord(base), plannedReuseId: "mulch" };
    const unplanned = createRecord(base);
    const wet = { ...createRecord({ ...base, wasteType: "vegetable_waste" }), plannedReuseId: "compost" };
    const s = summarize([planned, unplanned, wet]);
    expect(s.burningWithPlanKg).toBe(1000);
    expect(s.burningEstimate?.totalCo2eKg).toBe(1609.15);
  });
});
