import { sampleListings } from "@/data/sample-listings";

export const RESIDUE_TYPES = [
  "Rice straw",
  "Wheat straw",
  "Sugarcane trash",
  "Cotton stalks",
  "Maize stover",
  "Coconut husk",
] as const;
export type ResidueType = (typeof RESIDUE_TYPES)[number];

/** offer = a farmer has residue to sell; request = a buyer wants residue. */
export type ListingKind = "offer" | "request";

export interface Listing {
  id: string;
  kind: ListingKind;
  residue: ResidueType;
  quantityKg: number;
  pricePerKg: number | null;
  district: string;
  state: string;
  name: string;
  createdAt: string;
  isSample: boolean;
}

export type ListingInput = Omit<Listing, "id" | "createdAt" | "isSample">;

export const LIMITS = { maxKg: 1_000_000, maxPrice: 100, maxText: 60 } as const;
export const STORAGE_KEY = "avashesh.listings.v1";

export function validateListing(input: Partial<ListingInput>): Record<string, string> {
  const e: Record<string, string> = {};
  if (input.kind !== "offer" && input.kind !== "request") e.kind = "Choose offer or request.";
  if (!input.residue || !RESIDUE_TYPES.includes(input.residue)) e.residue = "Choose a residue type.";
  const q = input.quantityKg;
  if (typeof q !== "number" || !Number.isFinite(q) || q <= 0) e.quantityKg = "Quantity must be more than 0 kg.";
  else if (q > LIMITS.maxKg) e.quantityKg = `Quantity must be at most ${LIMITS.maxKg.toLocaleString("en-IN")} kg.`;
  const p = input.pricePerKg;
  if (p !== null && p !== undefined && (!Number.isFinite(p) || p < 0 || p > LIMITS.maxPrice))
    e.pricePerKg = `Price must be between ₹0 and ₹${LIMITS.maxPrice} per kg.`;
  for (const f of ["district", "state", "name"] as const) {
    const v = (input[f] ?? "").trim();
    if (!v) e[f] = "Required.";
    else if (v.length > LIMITS.maxText) e[f] = `Keep it under ${LIMITS.maxText} characters.`;
  }
  return e;
}

export function createListing(input: ListingInput, now = new Date()): Listing {
  return {
    ...input,
    district: input.district.trim(),
    state: input.state.trim(),
    name: input.name.trim(),
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    isSample: false,
  };
}

/** Parses stored JSON defensively; drops anything malformed. */
export function parseStored(raw: string | null): Listing[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (l): l is Listing =>
        l && typeof l.id === "string" && typeof l.createdAt === "string" && Object.keys(validateListing(l)).length === 0,
    ).map((l) => ({ ...l, isSample: false }));
  } catch {
    return [];
  }
}

export function loadUserListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Returns false when storage is unavailable or full. */
export function saveUserListings(listings: Listing[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    return true;
  } catch {
    return false;
  }
}

export interface ListingFilter {
  kind?: ListingKind | "all";
  residue?: ResidueType | "all";
  query?: string;
}

export function filterListings(list: Listing[], f: ListingFilter): Listing[] {
  const q = (f.query ?? "").trim().toLowerCase();
  return list
    .filter((l) => !f.kind || f.kind === "all" || l.kind === f.kind)
    .filter((l) => !f.residue || f.residue === "all" || l.residue === f.residue)
    .filter((l) => !q || `${l.district} ${l.state}`.toLowerCase().includes(q))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function allListings(user: Listing[]): Listing[] {
  return [...user, ...sampleListings];
}
