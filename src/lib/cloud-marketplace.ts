import { z } from "zod";
import { listingInputSchema } from "@/lib/marketplace";
import type { Database } from "@/integrations/supabase/types";
export type CloudListing = Database["public"]["Tables"]["listings"]["Row"];
export type CloudInquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export function publicListingArea(l: Pick<CloudListing, 'district' | 'state'>) { return [l.district, l.state].filter(Boolean).join(', ') || 'District/state not yet provided'; }
export function publishedPhotoPath(l: Pick<CloudListing, 'seller_id' | 'photo' | 'status'> | null) {
  return l?.status === 'published' && l.photo.startsWith(`${l.seller_id}/`) ? l.photo : null;
}
export const cloudListingSchema = z.object({
  waste_type: z.enum(["paddy_straw", "coconut_husk", "other_crop_residue"]), quantity: z.number(), unit: z.enum(["kg", "quintal", "tonne"]), price: z.number(),
  district: z.string().trim().min(1, 'District is required').max(100), state: z.string().trim().min(1, 'State is required').max(100), full_location: z.string().trim().min(1, 'Full location is required').max(120), description: z.string(), seller_name: z.string(), seller_contact: z.string(), photo: z.string().max(500).regex(/^$|^[a-f0-9-]{36}\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/), status: z.enum(["draft", "published", "sold"]),
}).superRefine((v, ctx) => {
  const r = listingInputSchema.safeParse({ sellerName: v.seller_name, contact: v.seller_contact, wasteType: v.waste_type, quantity: v.quantity, unit: v.unit, price: v.price, location: v.full_location, description: v.description, photo: "" });
  if (!r.success) for (const i of r.error.issues) ctx.addIssue({ code: "custom", message: i.message, path: i.path });
});
export function cloudPriceKg(l: CloudListing) { return l.price / (l.unit === "tonne" ? 1000 : l.unit === "quintal" ? 100 : 1); }
export function filterCloudListings(listings: CloudListing[], f: { q: string; type: string; location: string; min: string; max: string; quantity: string }) {
  const min = f.min === "" ? 0 : Number(f.min), max = f.max === "" ? Infinity : Number(f.max), qty = f.quantity === "" ? 0 : Number(f.quantity);
  if (!Number.isFinite(min) || min < 0 || Number.isNaN(max) || max < min || !Number.isFinite(qty) || qty < 0) return [];
  return listings.filter((l) => l.status === "published" && (!f.type || l.waste_type === f.type) && publicListingArea(l).toLowerCase().includes(f.location.slice(0,120).toLowerCase()) && `${l.waste_type} ${l.description} ${publicListingArea(l)}`.toLowerCase().includes(f.q.slice(0,120).toLowerCase()) && cloudPriceKg(l)>=min && cloudPriceKg(l)<=max && l.quantity*(l.unit==='tonne'?1000:l.unit==='quintal'?100:1)>=qty);
}