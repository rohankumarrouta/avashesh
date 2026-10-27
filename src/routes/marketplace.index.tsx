import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Page, SampleBadge } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ContactSeller, MarketplaceNotice, marketField, formatPrice } from "@/components/MarketplaceShared";
import { useMarketplace } from "@/hooks/use-marketplace";
import { filterListings, MARKET_TYPES, marketLabel, pricePerKg } from "@/lib/marketplace";

export const Route = createFileRoute("/marketplace/")({
  head: () => ({ meta: [
    { title: "Agricultural waste marketplace — Avashesh" },
    { name: "description", content: "Browse sample agricultural waste listings and try selling and inquiries in Avashesh’s browser-only marketplace demo." },
    { property: "og:title", content: "Agricultural waste marketplace — Avashesh" },
    { property: "og:description", content: "A transparent local marketplace prototype for agricultural waste." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Marketplace,
});
const emptyFilters = { search: "", wasteType: "", location: "", min: "", max: "" };
function Marketplace() {
  const { state, ready, error, remove, removeSamples, restoreSamples, clear } = useMarketplace();
  const [view, setView] = useState<"buyer" | "seller">("buyer");
  const [filters, setFilters] = useState(emptyFilters);
  const listings = state?.listings ?? [];
  const own = listings.filter((l) => !l.isDemo && l.ownerId === state?.ownerId);
  const shown = view === "buyer" ? filterListings(listings, filters) : own;
  const invalidPrice = (filters.min !== "" && (!Number.isFinite(Number(filters.min)) || Number(filters.min) < 0)) || (filters.max !== "" && (!Number.isFinite(Number(filters.max)) || Number(filters.max) < Number(filters.min)));
  return <Page>
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Marketplace</h1><Button asChild><Link to="/marketplace/sell"><Plus />Sell Your Waste</Link></Button></div>
    <MarketplaceNotice />
    <div className="flex gap-2" role="group" aria-label="Marketplace view">
      <Button variant={view === "buyer" ? "default" : "outline"} aria-pressed={view === "buyer"} onClick={() => setView("buyer")}>Buyer</Button>
      <Button variant={view === "seller" ? "default" : "outline"} aria-pressed={view === "seller"} onClick={() => setView("seller")}>My listings & inquiries</Button>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {view === "buyer" ? <section className="space-y-3 border-b border-border pb-5">
      <label className="block text-sm font-medium">Search listings<input type="search" className={marketField} maxLength={120} placeholder="Waste type, place or description" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">Waste type<select className={marketField} value={filters.wasteType} onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}><option value="">All types</option>{MARKET_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></label>
        <label className="text-sm font-medium">Location<input className={marketField} maxLength={120} placeholder="Town or district" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} /></label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium">Min price (₹/kg)<input type="number" min="0" step="any" className={marketField} value={filters.min} onChange={(e) => setFilters({ ...filters, min: e.target.value })} /></label>
        <label className="text-sm font-medium">Max price (₹/kg)<input type="number" min="0" step="any" className={marketField} value={filters.max} onChange={(e) => setFilters({ ...filters, max: e.target.value })} /></label>
      </div>
      {invalidPrice && <p role="alert" className="text-sm text-destructive">Enter non-negative prices with maximum at least minimum.</p>}
      <Button variant="ghost" onClick={() => setFilters(emptyFilters)}>Reset filters</Button>
    </section> : <p className="text-sm text-muted-foreground">Only listings created in this browser appear here. There are no seller accounts; anyone using this browser can manage these listings and see inquiries.</p>}
    {!ready ? <p>Loading marketplace…</p> : state && <>
      <p className="text-sm text-muted-foreground">{shown.length} {view === "buyer" ? "available listings" : "listings created here"}</p>
      {shown.length === 0 && <p>{view === "buyer" ? "No listings match. Try changing your filters or add a listing." : "You have not created any listings in this browser yet."}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((l) => {
          const inquiries = state.inquiries.filter((i) => i.listingId === l.id);
          return <article key={l.id} className="min-w-0 space-y-3 rounded-md border border-border bg-card p-4">
            {l.photo && <img src={l.photo} alt={`${marketLabel(l.wasteType)} supplied by seller`} className="aspect-[4/3] w-full rounded-md object-cover" />}
            <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{marketLabel(l.wasteType)}</h2>{l.isDemo && <SampleBadge />}</div>
            <p>{formatPrice(l.quantity)} {l.unit} available</p>
            <p className="font-semibold">₹{formatPrice(l.price)} / {l.unit} <span className="text-xs font-normal text-muted-foreground">(₹{formatPrice(pricePerKg(l))}/kg)</span></p>
            <p className="break-words text-sm text-muted-foreground">{l.location}</p>
            <Button asChild variant="outline" className="w-full"><Link to="/marketplace/$listingId" params={{ listingId: l.id }}>View details & express interest</Link></Button>
            {view === "buyer" && <ContactSeller listing={l} />}
            {view === "seller" && <>
              <h3 className="border-t border-border pt-3 text-sm font-semibold">Inquiries ({inquiries.length})</h3>
              {inquiries.length === 0 ? <p className="text-sm text-muted-foreground">No inquiries saved here yet.</p> : <ul className="space-y-3 text-sm">{inquiries.map((i) => <li key={i.id} className="space-y-1 break-words"><strong>{i.buyerName}</strong><p>{i.contact}</p><p className="whitespace-pre-wrap">{i.message}</p><p className="text-xs text-muted-foreground">{i.createdAt.slice(0, 10)} · Local demo inquiry</p></li>)}</ul>}
              <Button variant="destructive" onClick={() => window.confirm("Delete this listing and its inquiries from this browser?") && remove(l.id)}><Trash2 />Delete listing</Button>
            </>}
          </article>;
        })}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        {listings.some((l) => l.isDemo) ? <Button variant="outline" onClick={removeSamples}>Remove sample listings</Button> : <Button variant="outline" onClick={restoreSamples}>Restore sample listings</Button>}
        {(listings.length > 0 || state.inquiries.length > 0) && <Button variant="outline" onClick={() => window.confirm("Delete all marketplace listings and inquiries in this browser? Waste records are not affected.") && clear()}><Trash2 />Clear marketplace data</Button>}
      </div>
    </>}
  </Page>;
}