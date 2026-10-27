import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { cloudListingSchema, publishedPhotoPath } from "@/lib/cloud-marketplace";
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
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
    const { full_location, ...fields } = data.listing;
    const listing = { ...fields, seller_contact: normalizePhone(fields.seller_contact) ?? "" };
    const result = await supabase.rpc('save_listing_with_location', { listing_data: listing, full_location, listing_id: data.id });
    if (result.error || !result.data) throw new Error("Could not save listing. Check your details and permissions.");
    return { id: result.data };
  });
export const getPublishedListingPhoto = createServerFn({ method: 'GET' })
  .inputValidator((input) => z.object({ listingId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) throw new Error('Photo service unavailable.');
    const publicClient = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key); return fetch(input, { ...init, headers });
    } } });
    const { data: listing, error } = await publicClient.from('listings').select('seller_id,photo,status').eq('id', data.listingId).eq('status', 'published').maybeSingle();
    if (error) throw new Error('Could not load photo.');
    const path = publishedPhotoPath(listing);
    if (!path) return '';
    // Privilege is limited to signing the exact path from an RLS-approved published row; callers cannot supply paths.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: signed, error: signingError } = await supabaseAdmin.storage.from('waste-photos').createSignedUrl(path, 300);
    if (signingError) throw new Error('Could not load photo.');
    return signed.signedUrl;
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