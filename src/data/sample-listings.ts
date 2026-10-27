import type { Listing } from "@/lib/listings";

/**
 * Fictional demo data. These are NOT real farmers, buyers, or prices.
 * Names and quantities are invented for the prototype.
 */
export const sampleListings: Listing[] = [
  { id: "s1", kind: "offer", residue: "Rice straw", quantityKg: 12000, pricePerKg: 1.5, district: "Sangrur", state: "Punjab", name: "Demo farmer A", createdAt: "2026-10-20T08:00:00.000Z", isSample: true },
  { id: "s2", kind: "offer", residue: "Wheat straw", quantityKg: 4000, pricePerKg: 3, district: "Karnal", state: "Haryana", name: "Demo farmer B", createdAt: "2026-10-18T08:00:00.000Z", isSample: true },
  { id: "s3", kind: "request", residue: "Rice straw", quantityKg: 50000, pricePerKg: 1.8, district: "Patiala", state: "Punjab", name: "Demo biomass plant", createdAt: "2026-10-19T08:00:00.000Z", isSample: true },
  { id: "s4", kind: "offer", residue: "Sugarcane trash", quantityKg: 8000, pricePerKg: null, district: "Kolhapur", state: "Maharashtra", name: "Demo farmer C", createdAt: "2026-10-15T08:00:00.000Z", isSample: true },
  { id: "s5", kind: "request", residue: "Cotton stalks", quantityKg: 20000, pricePerKg: 2, district: "Bathinda", state: "Punjab", name: "Demo pellet maker", createdAt: "2026-10-14T08:00:00.000Z", isSample: true },
  { id: "s6", kind: "offer", residue: "Coconut husk", quantityKg: 3000, pricePerKg: 2.5, district: "Thrissur", state: "Kerala", name: "Demo farmer D", createdAt: "2026-10-12T08:00:00.000Z", isSample: true },
];
