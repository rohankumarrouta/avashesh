import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { marketField, formatPrice } from "@/components/MarketplaceShared";
import { listingOptions } from "@/lib/cloud-queries";
import { marketLabel, inquiryInputSchema, normalizePhone } from "@/lib/marketplace";
import { publicListingArea, cloudPriceKg } from "@/lib/cloud-marketplace";
import { sendCloudInquiry, getPublishedListingPhoto } from "@/lib/marketplace.functions";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  MapPin,
  Lock,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Edit,
  Tag,
} from "lucide-react";
import demoPaddy from "@/assets/demo-paddy.jpg";
import demoCoconut from "@/assets/demo-coconut.jpg";
import demoBagasse from "@/assets/demo-bagasse.jpg";
import demoHusk from "@/assets/demo-husk.jpg";

export const Route = createFileRoute("/marketplace/$listingId")({
  head: () => ({
    meta: [
      { title: "Agricultural waste listing — Avashesh" },
      {
        name: "description",
        content: "View agricultural waste availability and contact its seller.",
      },
      { property: "og:title", content: "Agricultural waste listing — Avashesh" },
      { property: "og:description", content: "Shared listing details and secure Buyer inquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Details,
});

function fallbackImage(wasteType: string) {
  switch (wasteType) {
    case "paddy_straw":
      return demoPaddy;
    case "coconut_husk":
      return demoCoconut;
    case "other_crop_residue":
      return demoBagasse;
    default:
      return demoHusk;
  }
}

function Details() {
  const { listingId } = Route.useParams(),
    { user, role, profile } = useAccount();
  const { data: l, isPending, error } = useQuery(listingOptions(listingId));
  const send = useServerFn(sendCloudInquiry),
    getPhoto = useServerFn(getPublishedListingPhoto),
    client = useQueryClient();
  const [message, setMessage] = useState(""),
    [failure, setFailure] = useState(""),
    [busy, setBusy] = useState(false);

  const privateLocation = useQuery({
    queryKey: ["private-location", listingId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_locations")
        .select("full_location")
        .eq("listing_id", listingId)
        .maybeSingle();
      if (error) throw new Error("Could not load private location.");
      return data;
    },
  });

  const photo = useQuery({
    queryKey: ["photo", l?.id, l?.photo, l?.status, user?.id],
    enabled: !!l?.photo,
    queryFn: async () => {
      if (!l?.photo) return "";
      if (l.status === "published") return getPhoto({ data: { listingId: l.id } });
      if (l.seller_id !== user?.id) return "";
      const { data, error } = await supabase.storage
        .from("waste-photos")
        .createSignedUrl(l.photo, 300);
      if (error) throw new Error("Could not load photo.");
      return data.signedUrl;
    },
    staleTime: 240000,
  });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFailure("");
    setMessage("");
    const result = inquiryInputSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!result.success) {
      setFailure(result.error.issues.map((i) => i.message).join(" "));
      return;
    }
    setBusy(true);
    try {
      await send({ data: { listingId, inquiry: result.data } });
      setMessage("Inquiry sent successfully! The seller has been notified.");
      await Promise.all([
        client.invalidateQueries({ queryKey: ["inquiries"] }),
        client.invalidateQueries({ queryKey: ["private-location", listingId] }),
      ]);
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Could not send inquiry.");
    } finally {
      setBusy(false);
    }
  }

  const phone = l ? normalizePhone(l.seller_contact) : null;

  return (
    <Page>
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 text-xs text-muted-foreground hover:text-foreground">
          <Link to="/marketplace">
            <ArrowLeft className="size-3.5 mr-1" />
            Back to Marketplace Listings
          </Link>
        </Button>
      </div>

      {isPending ? (
        <div className="animate-pulse space-y-4 rounded-3xl border border-border/80 bg-card p-8">
          <div className="aspect-[16/9] w-full max-w-lg rounded-2xl bg-muted" />
          <div className="h-6 w-1/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          <p role="alert">{error.message}</p>
        </div>
      ) : !l ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <h1 className="text-2xl font-bold">Listing Unavailable</h1>
          <p className="mt-1 text-sm text-muted-foreground">This listing may be private, removed or sold.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Visual & Info Header Card */}
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Photo Column */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted lg:col-span-6 lg:aspect-auto">
                <img
                  src={photo.data || fallbackImage(l.waste_type)}
                  alt={marketLabel(l.waste_type)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md border shadow-xs ${
                      l.status === "published"
                        ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/40"
                        : l.status === "draft"
                          ? "bg-amber-500/20 text-amber-100 border-amber-400/40"
                          : "bg-muted/80 text-foreground border-border"
                    }`}
                  >
                    {l.status === "published" ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                        <span>Available · Published</span>
                      </>
                    ) : l.status === "draft" ? (
                      <>
                        <Clock className="size-3.5 text-amber-400" />
                        <span>Draft · Private</span>
                      </>
                    ) : (
                      <span>Seller-marked Sold</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Detail Info Column */}
              <div className="p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary">
                      <Tag className="size-3" />
                      {marketLabel(l.waste_type)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Published {new Date(l.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {marketLabel(l.waste_type)}
                  </h1>

                  {/* Quantity & Price Box */}
                  <div className="mt-4 rounded-2xl border border-border/80 bg-secondary/30 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Available Stock</span>
                      <span className="text-xl font-extrabold text-foreground">
                        {formatPrice(l.quantity)} {l.unit}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Asking Rate</span>
                      <span className="text-xl font-extrabold text-primary">
                        ₹{formatPrice(l.price)} <span className="text-xs font-medium text-muted-foreground">/ {l.unit}</span>
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        (₹{formatPrice(cloudPriceKg(l))} per kg)
                      </span>
                    </div>
                  </div>

                  {/* Location & Seller */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 text-primary shrink-0" />
                      <span className="text-foreground font-medium">{publicListingArea(l)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="size-4 text-primary shrink-0" />
                      <span>Seller: <strong className="text-foreground">{l.seller_name}</strong></span>
                    </div>
                  </div>

                  {/* Description */}
                  {l.description && (
                    <div className="mt-4 rounded-xl border border-border/60 bg-background/50 p-3.5 text-xs text-foreground/90 leading-relaxed">
                      {l.description}
                    </div>
                  )}

                  {/* Private Location Section */}
                  <div className="mt-4 rounded-xl border border-border/80 bg-card p-3.5 text-xs space-y-1">
                    {privateLocation.data ? (
                      <div className="text-foreground">
                        <strong className="text-primary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-600" /> Full Farmgate Address:
                        </strong>
                        <p className="mt-0.5 font-medium">{privateLocation.data.full_location}</p>
                      </div>
                    ) : (
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Lock className="size-3.5 text-muted-foreground shrink-0" />
                        <span>Exact farm location is confidential until you submit a buyer inquiry.</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  {phone && (
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" className="flex-1 rounded-xl">
                        <a href={`tel:${phone}`}>
                          <Phone className="size-4" />
                          Call Seller ({phone})
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 rounded-xl text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10">
                        <a
                          href={`https://wa.me/${phone.slice(1)}?text=${encodeURIComponent("Hello " + l.seller_name + ", I am interested in your " + marketLabel(l.waste_type) + " listing on Avashesh.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="size-4" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  )}

                  {l.seller_id === user?.id && (
                    <Button asChild className="w-full rounded-xl">
                      <Link to="/marketplace/sell" search={{ edit: l.id }}>
                        <Edit className="size-4 mr-1.5" />
                        Edit your listing
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form Section (when not the owner) */}
          {l.seller_id !== user?.id && l.status === "published" && (
            <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Send Buyer Inquiry & Request Farmgate Pickup
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Submitting an inquiry notifies the seller and unlocks their full farm location.
                </p>
              </div>

              {!user ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Sign in with a Buyer account to send official inquiries.</p>
                  <Button asChild className="rounded-xl shadow-xs">
                    <Link to="/auth" search={{ next: "/marketplace/" + listingId, role: "buyer" }}>
                      Sign in as Buyer to Inquire
                    </Link>
                  </Button>
                </div>
              ) : role === "buyer" ? (
                <form onSubmit={submit} noValidate className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Your Name / Company
                      <input
                        name="buyerName"
                        aria-label="Buyer name"
                        defaultValue={profile?.display_name}
                        placeholder="e.g. Sambalpur Mushroom Farms"
                        maxLength={100}
                        className={`${marketField} rounded-xl`}
                      />
                    </label>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Contact (Phone / WhatsApp / Email)
                      <input
                        name="contact"
                        aria-label="Buyer contact"
                        defaultValue={profile?.contact || user.email}
                        placeholder="e.g. +91 94370 00000"
                        maxLength={255}
                        className={`${marketField} rounded-xl`}
                      />
                    </label>
                  </div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Inquiry Message / Delivery Requirements
                    <textarea
                      name="message"
                      aria-label="Message"
                      rows={3}
                      placeholder="e.g. We require 1 tonne of paddy straw for mushroom cultivation. Can collect on Thursday..."
                      maxLength={1000}
                      className={`${marketField} rounded-xl`}
                    />
                  </label>

                  {failure && (
                    <p role="alert" className="text-xs font-semibold text-destructive">
                      {failure}
                    </p>
                  )}
                  {message && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>{message}</span>
                    </div>
                  )}

                  <Button type="submit" size="lg" disabled={busy} className="w-full rounded-xl shadow-md">
                    <Send className="size-4" />
                    {busy ? "Sending Inquiry…" : "Submit Official Inquiry"}
                  </Button>
                </form>
              ) : (
                <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
                  You are signed in with a Farmer account. Switch to a Buyer profile to send formal purchase inquiries.
                </div>
              )}

              <p className="text-[11px] text-muted-foreground">
                🔒 Privacy Assurance: Avashesh connects verified parties directly. We do not charge broker fees or hold escrow funds.
              </p>
            </section>
          )}
        </div>
      )}
    </Page>
  );
}
