import { describe, expect, it } from "vitest";
import { createRecord, parseRecords, toKg, validateRecord, type RecordInput } from "@/lib/waste";

const ok: RecordInput = { wasteType: "paddy_straw", quantityKg: 500, district: "Cuttack", date: "2026-10-01", practice: "burning", notes: "" };
const T = "2026-10-27";

describe("record validation", () => {
  it("accepts a valid record", () => expect(validateRecord(ok, T)).toEqual({}));
  it("rejects 0, negative, NaN and over 1,000 tonnes", () => {
    for (const q of [0, -1, NaN, 1_000_001]) expect(validateRecord({ ...ok, quantityKg: q }, T)["quantityKg"]).toBeDefined();
  });
  it("only accepts Odisha districts", () => expect(validateRecord({ ...ok, district: "Mumbai" }, T)["district"]).toBeDefined());
  it("rejects future dates", () => expect(validateRecord({ ...ok, date: "2026-10-28" }, T)["date"]).toBeDefined());
  it("rejects unknown waste type and missing practice", () => {
    const e = validateRecord({ ...ok, wasteType: "plastic" as never, practice: undefined }, T);
    expect(e["wasteType"]).toBeDefined();
    expect(e["practice"]).toBeDefined();
  });
  it("rejects notes over 300 characters", () => expect(validateRecord({ ...ok, notes: "x".repeat(301) }, T)["notes"]).toBeDefined());
});

describe("units", () => {
  it("1 quintal = 100 kg, 1 tonne = 1000 kg", () => {
    expect(toKg(1, "quintal")).toBe(100);
    expect(toKg(2.5, "tonne")).toBe(2500);
  });
});

describe("local storage parsing", () => {
  it("corrupt JSON gives an empty list", () => expect(parseRecords("not json")).toEqual([]));
  it("drops malformed entries", () => {
    const good = createRecord(ok);
    expect(parseRecords(JSON.stringify([good, { id: "x", quantityKg: -5 }, null]))).toHaveLength(1);
  });
  it("new records start without a plan and not as sample", () => {
    const r = createRecord(ok);
    expect(r.plannedReuseId).toBeNull();
    expect(r.isDemo).toBe(false);
  });
});
