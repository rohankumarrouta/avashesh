import { describe, expect, it } from "vitest";
import { recommend, REUSE_OPTIONS, scaleOf } from "@/lib/reuse-rules";
import { WASTE_TYPES } from "@/lib/waste";

describe("reuse rules", () => {
  it("every waste type has at least two options", () => {
    for (const w of WASTE_TYPES) expect(REUSE_OPTIONS.filter((o) => o.wasteTypes.includes(w.id)).length).toBeGreaterThanOrEqual(2);
  });
  it("scale boundaries: <200 small, 200–1999 medium, ≥2000 large", () => {
    expect(scaleOf(199)).toBe("small");
    expect(scaleOf(200)).toBe("medium");
    expect(scaleOf(2000)).toBe("large");
  });
  it("paddy straw includes mulching and composting", () => {
    const ids = recommend("paddy_straw", 500).suitable.map((r) => r.option.id);
    expect(ids).toContain("mulch");
    expect(ids).toContain("compost");
  });
  it("coconut husk includes coir at 100 kg or more", () => {
    expect(recommend("coconut_husk", 100).suitable.map((r) => r.option.id)).toContain("coir");
  });
  it("coir is 'not suitable' under 100 kg, with the reason", () => {
    const r = recommend("coconut_husk", 50);
    expect(r.suitable.map((x) => x.option.id)).not.toContain("coir");
    expect(r.notSuitable.find((n) => n.option.id === "coir")?.reason).toContain("100");
  });
  it("bulk biomass supply only from 2000 kg", () => {
    expect(recommend("paddy_straw", 1999).suitable.some((r) => r.option.id === "biomass_supply")).toBe(false);
    expect(recommend("paddy_straw", 2000).suitable.some((r) => r.option.id === "biomass_supply")).toBe(true);
  });
  it("burning adds a warning and +1 to quick options", () => {
    const burn = recommend("paddy_straw", 500, "burning");
    const plain = recommend("paddy_straw", 500, "unsure");
    expect(burn.warning).not.toBeNull();
    expect(plain.warning).toBeNull();
    const s = (r: typeof burn) => r.suitable.find((x) => x.option.id === "mulch")!.score;
    expect(s(burn)).toBe(s(plain) + 1);
  });
  it("mulching for 500 kg paddy straw scores 4 (scale +2, low effort +2)", () => {
    expect(recommend("paddy_straw", 500).suitable.find((x) => x.option.id === "mulch")?.score).toBe(4);
  });
  it("results are sorted by score, highest first", () => {
    const scores = recommend("paddy_straw", 500).suitable.map((r) => r.score);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });
  it("every suggestion explains itself", () => {
    for (const r of recommend("vegetable_waste", 30).suitable) expect(r.reasons.length).toBeGreaterThan(0);
  });
});
