import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { cloudListingSchema } from "@/lib/cloud-marketplace";
import { inquiryInputSchema, normalizePhone } from "@/lib/marketplace";
import { profileSchema } from "@/lib/account";
import { z } from "zod";
export const saveCloudListing = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid().optional(), listing: cloudListingSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", userId).single();
    if (role?.role !== "farmer") throw new Error("Only Farmers can create or edit listings.");
    if (data.listing.photo && !data.listing.photo.startsWith(`${userId}/`)) throw new Error("Photo must belong to this seller.");
    const listing = { ...data.listing, seller_contact: normalizePhone(data.listing.seller_contact) ?? "" };
    const result = data.id ? await supabase.from("listings").update(listing).eq("id", data.id).eq("seller_id", userId).select("id").single() : await supabase.from("listings").insert({ ...listing, seller_id: userId }).select("id").single();
    if (result.error || !result.data) throw new Error("Could not save listing. Check your details and permissions.");
    return result.data;
  });
export const sendCloudInquiry = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ listingId: z.string().uuid(), inquiry: inquiryInputSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("inquiries").insert({ listing_id: data.listingId, buyer_id: userId, buyer_name: data.inquiry.buyerName, contact: data.inquiry.contact, message: data.inquiry.message });
    if (error) throw new Error("Could not send inquiry. You must be a Buyer and the listing must be published.");
    return { ok: true };
  });
export const updateCloudProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => profileSchema.parse(input)).handler(async ({ data, context }) => {
    const contact = data.contact ? normalizePhone(data.contact) ?? "" : "";
    const { error } = await context.supabase.from("profiles").update({ ...data, contact }).eq("id", context.userId);
    if (error) throw new Error("Could not update your profile.");
    return { ok: true };
  });