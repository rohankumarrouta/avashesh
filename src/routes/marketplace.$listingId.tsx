import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Page, SampleBadge } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ContactSeller, MarketplaceNotice, marketField, formatPrice } from "@/components/MarketplaceShared";
import { useMarketplace } from "@/hooks/use-marketplace";
import { inquiryInputSchema, marketLabel, pricePerKg } from "@/lib/marketplace";

export const Route = createFileRoute("/marketplace/$listingId")({
  head: () => ({ meta: [
    { title: "Waste listing details — Avashesh" }, { name: "description", content: "View a local waste listing, contact its supplied seller number, or save a local demo inquiry." },
    { property: "og:title", content: "Waste listing details — Avashesh" }, { property: "og:description", content: "Listing details and browser-only inquiries in the Avashesh marketplace prototype." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ListingDetails,
});
function ListingDetails() {
  const { listingId } = Route.useParams();
  const { state, ready, error, inquire } = useMarketplace();
  const listing = state?.listings.find((l) => l.id === listingId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSent(false);
    const form = e.currentTarget;
    const result = inquiryInputSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) { setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({});
    if (inquire(listingId, result.data)) { setSent(true); form.reset(); }
  }
  const err = (name: string) => errors[name] && <p role="alert" className="text-sm text-destructive">{errors[name]}</p>;
  return <Page>
    <Link to="/marketplace" className="text-sm text-primary underline">← Marketplace</Link><MarketplaceNotice />
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!ready ? <p>Loading listing…</p> : !listing ? <><h1 className="text-2xl font-bold">Listing unavailable</h1><p>This listing was deleted or does not exist in this browser. Links do not share local listings across devices.</p></> : <>
      <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold">{marketLabel(listing.wasteType)}</h1>{listing.isDemo && <SampleBadge />}</div>
      {listing.photo && <img src={listing.photo} alt={`${marketLabel(listing.wasteType)} supplied by seller`} className="aspect-[4/3] w-full max-w-lg rounded-md object-cover" />}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm"><dt>Available</dt><dd>{formatPrice(listing.quantity)} {listing.unit}</dd><dt>Asking price</dt><dd>₹{formatPrice(listing.price)} / {listing.unit} (₹{formatPrice(pricePerKg(listing))}/kg)</dd><dt>Location</dt><dd className="break-words">{listing.location}</dd><dt>Seller</dt><dd className="break-words">{listing.sellerName}</dd>{!listing.isDemo && <><dt>Contact</dt><dd>{listing.contact}</dd></>}</dl>
      <p className="whitespace-pre-wrap break-words text-sm">{listing.description}</p><ContactSeller listing={listing} />
      <section className="space-y-3 border-t border-border pt-5">
        <h2 className="text-xl font-semibold">Express interest</h2>
        <p className="text-sm text-muted-foreground">This saves a demo inquiry in this browser only; it does not send a message to anyone. {listing.isDemo ? "This SAMPLE seller is fictional; no one will receive or reply to the inquiry." : "See it under My listings & inquiries on the Marketplace page."} Use test contact details.</p>
        <form onSubmit={submit} noValidate className="space-y-3">
          <label className="block text-sm font-medium">Buyer name<input name="buyerName" maxLength={100} className={marketField} />{err("buyerName")}</label>
          <label className="block text-sm font-medium">Buyer contact (phone or email)<input name="contact" maxLength={255} className={marketField} />{err("contact")}</label>
          <label className="block text-sm font-medium">Message<textarea name="message" maxLength={1000} rows={3} className={marketField} />{err("message")}</label>
          <Button type="submit" className="w-full">Save local inquiry</Button>
        </form>
        {sent && <p role="status" className="text-sm font-medium text-primary">Inquiry saved in this browser. No message was sent to a seller.</p>}
      </section>
      {listing.isDemo && <details className="border-t border-border pt-4 text-sm"><summary className="cursor-pointer font-semibold text-primary">Sample seller inquiry preview ({state?.inquiries.filter((i) => i.listingId === listingId).length ?? 0})</summary><ul className="mt-3 space-y-3">{state?.inquiries.filter((i) => i.listingId === listingId).map((i) => <li key={i.id} className="break-words"><strong>{i.buyerName}</strong><p>{i.contact}</p><p className="whitespace-pre-wrap">{i.message}</p></li>)}</ul></details>}
    </>}
  </Page>;
}