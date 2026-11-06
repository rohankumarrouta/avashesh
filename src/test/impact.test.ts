import { describe, expect, it } from "vitest";
import { estimateAvoidedEmissions } from "@/lib/impact";

describe("impact calculator", () => {
  it("1000 kg dry residue avoids 1515 kg CO2 (IPCC factor 1515 g/kg)", () => {
    expect(estimateAvoidedEmissions(1000)?.co2Kg).toBe(1515);
  });
  it("1000 kg gives 94.15 kg non-CO2 CO2e (2.7×28 + 0.07×265)", () => {
    expect(estimateAvoidedEmissions(1000)?.nonCo2Co2eKg).toBe(94.15);
    expect(estimateAvoidedEmissions(1000)?.totalCo2eKg).toBe(1609.15);
  });
  it("0 kg gives zero", () => {
    expect(estimateAvoidedEmissions(0)?.totalCo2eKg).toBe(0);
  });
  it("rejects negative, NaN and above-limit input", () => {
    expect(estimateAvoidedEmissions(-1)).toBeNull();
    expect(estimateAvoidedEmissions(NaN)).toBeNull();
    expect(estimateAvoidedEmissions(10_000_001)).toBeNull();
  });
});
