import { z } from "zod";
import { listingInputSchema } from "@/lib/marketplace";
import type { Database } from "@/integrations/supabase/types";
export type CloudListing = Database["public"]["Tables"]["listings"]["Row"];
export type CloudInquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export const cloudListingSchema = z.object({
  waste_type: z.enum(["paddy_straw", "coconut_husk", "other_crop_residue"]), quantity: z.number(), unit: z.enum(["kg", "quintal", "tonne"]), price: z.number(),
  location: z.string(), description: z.string(), seller_name: z.string(), seller_contact: z.string(), photo: z.string().max(500).regex(/^$|^[a-f0-9-]{36}\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/), status: z.enum(["draft", "published", "sold"]),
}).superRefine((v, ctx) => {
  const r = listingInputSchema.safeParse({ sellerName: v.seller_name, contact: v.seller_contact, wasteType: v.waste_type, quantity: v.quantity, unit: v.unit, price: v.price, location: v.location, description: v.description, photo: "" });
  if (!r.success) for (const i of r.error.issues) ctx.addIssue({ code: "custom", message: i.message, path: i.path });
});
export function cloudPriceKg(l: CloudListing) { return l.price / (l.unit === "tonne" ? 1000 : l.unit === "quintal" ? 100 : 1); }
export function filterCloudListings(listings: CloudListing[], f: { q: string; type: string; location: string; min: string; max: string; quantity: string }) {
  const min = f.min === "" ? 0 : Number(f.min), max = f.max === "" ? Infinity : Number(f.max), qty = f.quantity === "" ? 0 : Number(f.quantity);
  if (!Number.isFinite(min) || min < 0 || Number.isNaN(max) || max < min || !Number.isFinite(qty) || qty < 0) return [];
  return listings.filter((l) => l.status === "published" && (!f.type || l.waste_type === f.type) && l.location.toLowerCase().includes(f.location.slice(0,120).toLowerCase()) && `${l.waste_type} ${l.description} ${l.location}`.toLowerCase().includes(f.q.slice(0,120).toLowerCase()) && cloudPriceKg(l)>=min && cloudPriceKg(l)<=max && l.quantity*(l.unit==='tonne'?1000:l.unit==='quintal'?100:1)>=qty);
}