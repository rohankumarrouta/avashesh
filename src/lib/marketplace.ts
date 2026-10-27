import { z } from "zod";
import samples from "@/data/sample-listings.json";
import { UNIT_TO_KG } from "@/lib/waste";

export const MARKETPLACE_KEY = "avashesh.marketplace.v1";
export const MARKET_TYPES = [
  { id: "paddy_straw", label: "Paddy straw" },
  { id: "coconut_husk", label: "Coconut husk" },
  { id: "other_crop_residue", label: "Other crop residue" },
] as const;
export const MAX_PHOTO_BYTES = 500_000;
export function normalizePhone(value: string): string | null {
  const digits = value.replace(/[\s()+-]/g, "");
  const local = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? `+91${local}` : null;
}
const phone = z.string().trim().max(30).refine((v) => normalizePhone(v) !== null, "Enter a valid 10-digit Indian mobile number (optional +91).");
const photo = z.string().max(700_000).refine((v) => v === "" || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(v), "Use a JPEG, PNG or WebP photo under 500 KB.");
export const listingInputSchema = z.object({
  sellerName: z.string().trim().min(1, "Enter your name.").max(100),
  contact: phone,
  wasteType: z.enum(["paddy_straw", "coconut_husk", "other_crop_residue"]),
  quantity: z.number().finite().positive("Enter a quantity greater than zero."),
  unit: z.enum(["kg", "quintal", "tonne"]),
  price: z.number().finite().min(0, "Price cannot be negative.").max(10_000_000),
  location: z.string().trim().min(1, "Enter a town or district.").max(120),
  description: z.string().trim().min(1, "Describe the available waste.").max(1000),
  photo,
}).refine((v) => v.quantity * UNIT_TO_KG[v.unit] <= 1_000_000, { path: ["quantity"], message: "Maximum quantity is 1,000 tonnes." });
export type ListingInput = z.infer<typeof listingInputSchema>;
const listingSchema = z.object({
  id: z.string().min(1).max(100), ownerId: z.string().min(1).max(100),
  sellerName: z.string().trim().min(1).max(100), contact: z.string().max(30),
  wasteType: z.enum(["paddy_straw", "coconut_husk", "other_crop_residue"]),
  quantity: z.number().finite().positive(), unit: z.enum(["kg", "quintal", "tonne"]),
  price: z.number().finite().min(0).max(10_000_000), location: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000), photo,
  isDemo: z.boolean(), createdAt: z.string().datetime(),
}).refine((v) => v.quantity * UNIT_TO_KG[v.unit] <= 1_000_000)
  .refine((v) => v.isDemo ? v.contact === "" && v.ownerId === "sample" : normalizePhone(v.contact) !== null);
export type Listing = z.infer<typeof listingSchema>;
export const inquiryInputSchema = z.object({
  buyerName: z.string().trim().min(1, "Enter your name.").max(100),
  contact: z.string().trim().min(1).max(255).refine((v) => normalizePhone(v) !== null || z.string().email().safeParse(v).success, "Enter a valid Indian mobile number or email."),
  message: z.string().trim().min(1, "Enter a message.").max(1000),
});
export type InquiryInput = z.infer<typeof inquiryInputSchema>;
const inquirySchema = inquiryInputSchema.extend({ id: z.string().min(1).max(100), listingId: z.string().min(1).max(100), createdAt: z.string().datetime() });
export type Inquiry = z.infer<typeof inquirySchema>;
const stateSchema = z.object({ version: z.literal(1), ownerId: z.string().min(1).max(100), listings: z.array(listingSchema).max(100), inquiries: z.array(inquirySchema).max(500) });
export type MarketplaceState = z.infer<typeof stateSchema>;
export function initialMarketplace(ownerId: string): MarketplaceState {
  return stateSchema.parse({ version: 1, ownerId, listings: samples, inquiries: [] });
}
export function parseMarketplace(raw: string): MarketplaceState | null {
  try { const result = stateSchema.safeParse(JSON.parse(raw)); return result.success ? result.data : null; } catch { return null; }
}
export function addListing(state: MarketplaceState, input: unknown, id: string, now: string): MarketplaceState {
  const data = listingInputSchema.parse(input);
  return stateSchema.parse({ ...state, listings: [{ ...data, contact: normalizePhone(data.contact), id, ownerId: state.ownerId, isDemo: false, createdAt: now }, ...state.listings] });
}
export function addInquiry(state: MarketplaceState, listingId: string, input: unknown, id: string, now: string): MarketplaceState {
  if (!state.listings.some((l) => l.id === listingId)) throw new Error("This listing is no longer available.");
  const data = inquiryInputSchema.parse(input);
  return stateSchema.parse({ ...state, inquiries: [...state.inquiries, { ...data, id, listingId, createdAt: now }] });
}
export function deleteListing(state: MarketplaceState, id: string): MarketplaceState {
  const listing = state.listings.find((l) => l.id === id);
  if (!listing || listing.isDemo || listing.ownerId !== state.ownerId) throw new Error("Only listings created in this browser can be deleted here.");
  return { ...state, listings: state.listings.filter((l) => l.id !== id), inquiries: state.inquiries.filter((i) => i.listingId !== id) };
}
export function pricePerKg(listing: Listing): number { return listing.price / UNIT_TO_KG[listing.unit]; }
export function filterListings(listings: Listing[], filters: { search: string; wasteType: string; location: string; min: string; max: string }): Listing[] {
  const q = filters.search.trim().slice(0, 120).toLowerCase();
  const place = filters.location.trim().slice(0, 120).toLowerCase();
  const min = filters.min.trim() === "" ? 0 : Number(filters.min);
  const max = filters.max.trim() === "" ? Infinity : Number(filters.max);
  if (!Number.isFinite(min) || min < 0 || Number.isNaN(max) || max < min || max < 0) return [];
  return listings.filter((l) => {
    const label = marketLabel(l.wasteType);
    return (!filters.wasteType || l.wasteType === filters.wasteType) && l.location.toLowerCase().includes(place)
      && `${label} ${l.description} ${l.location}`.toLowerCase().includes(q)
      && pricePerKg(l) >= min && pricePerKg(l) <= max;
  });
}
export function marketLabel(type: string): string { return MARKET_TYPES.find((t) => t.id === type)?.label ?? type; }
export function sellerLinks(listing: Listing): { phone: string; whatsapp: string } | null {
  const number = normalizePhone(listing.contact);
  if (listing.isDemo || !number) return null;
  return { phone: `tel:${number}`, whatsapp: `https://wa.me/${number.slice(1)}?text=${encodeURIComponent(`Hello, I am interested in your ${marketLabel(listing.wasteType)} listing on Avashesh.`)}` };
}