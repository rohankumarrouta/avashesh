import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PrototypeNotice, SiteHeader } from "@/components/SiteHeader";
import { useListings } from "@/hooks/use-listings";
import { filterListings, RESIDUE_TYPES, type ListingKind, type ResidueType } from "@/lib/listings";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings — Avashesh" },
      { name: "description", content: "Browse crop residue offers from farmers and requests from buyers." },
      { property: "og:title", content: "Listings — Avashesh" },
      { property: "og:description", content: "Crop residue offers and buyer requests (prototype)." },
    ],
  }),
  component: ListingsPage,
});

const field = "rounded-lg border border-input bg-card px-3 py-2 text-sm";

function ListingsPage() {
  const { listings, remove } = useListings();
  const [kind, setKind] = useState<ListingKind | "all">("all");
  const [residue, setResidue] = useState<ResidueType | "all">("all");
  const [query, setQuery] = useState("");
  const shown = useMemo(() => filterListings(listings, { kind, residue, query }), [listings, kind, residue, query]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-8">
        <h1 className="font-display text-3xl font-semibold">Listings</h1>
        <PrototypeNotice />
        <div className="grid gap-2 sm:grid-cols-3">
          <select aria-label="Listing type" className={field} value={kind} onChange={(e) => setKind(e.target.value as ListingKind | "all")}>
            <option value="all">Offers and requests</option>
            <option value="offer">Farmer offers</option>
            <option value="request">Buyer requests</option>
          </select>
          <select aria-label="Residue type" className={field} value={residue} onChange={(e) => setResidue(e.target.value as ResidueType | "all")}>
            <option value="all">All residue types</option>
            {RESIDUE_TYPES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <input aria-label="District or state" className={field} placeholder="District or state" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {shown.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No listings match. <Link to="/post" className="text-primary underline">Post one</Link>.
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {shown.map((l) => (
              <li key={l.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${l.kind === "offer" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                    {l.kind === "offer" ? "Farmer offer" : "Buyer request"}
                  </span>
                  {l.isSample ? <span className="text-xs text-muted-foreground">Sample</span> : (
                    <button onClick={() => remove(l.id)} className="text-xs text-destructive hover:underline">Delete</button>
                  )}
                </div>
                <h2 className="mt-2 font-display text-lg font-semibold">{l.residue}</h2>
                <p className="text-sm">{l.quantityKg.toLocaleString("en-IN")} kg · {l.pricePerKg === null ? "Price on request" : `₹${l.pricePerKg}/kg`}</p>
                <p className="mt-1 text-sm text-muted-foreground">{l.district}, {l.state} · {l.name}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
