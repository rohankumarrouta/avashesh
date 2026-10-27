import { describe, expect, it } from "vitest";
import { createListing, filterListings, parseStored, validateListing, type ListingInput } from "@/lib/listings";
import { sampleListings } from "@/data/sample-listings";

const ok: ListingInput = { kind: "offer", residue: "Rice straw", quantityKg: 500, pricePerKg: 2, district: "Sangrur", state: "Punjab", name: "Test" };

describe("listing validation", () => {
  it("accepts a valid listing", () => expect(validateListing(ok)).toEqual({}));
  it("rejects zero, negative and over 1,000,000 kg", () => {
    for (const q of [0, -5, 1_000_001, NaN]) expect(validateListing({ ...ok, quantityKg: q })["quantityKg"]).toBeDefined();
  });
  it("price is optional but must be 0–100 ₹/kg", () => {
    expect(validateListing({ ...ok, pricePerKg: null })).toEqual({});
    expect(validateListing({ ...ok, pricePerKg: 101 })["pricePerKg"]).toBeDefined();
    expect(validateListing({ ...ok, pricePerKg: -1 })["pricePerKg"]).toBeDefined();
  });
  it("rejects blank or whitespace-only text fields", () => {
    expect(validateListing({ ...ok, district: "   " })["district"]).toBeDefined();
  });
});

describe("storage parsing", () => {
  it("returns empty list for corrupt JSON", () => expect(parseStored("{bad")).toEqual([]));
  it("drops malformed entries and keeps valid ones", () => {
    const good = createListing(ok);
    expect(parseStored(JSON.stringify([good, { id: "x", quantityKg: -1 }]))).toHaveLength(1);
  });
});

describe("filtering", () => {
  it("filters buyer requests only", () => {
    expect(filterListings(sampleListings, { kind: "request" }).every((l) => l.kind === "request")).toBe(true);
  });
  it("matches location case-insensitively", () => {
    expect(filterListings(sampleListings, { query: "punjab" })).toHaveLength(3);
  });
});
