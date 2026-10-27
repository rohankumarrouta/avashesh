import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PrototypeNotice, SiteHeader } from "@/components/SiteHeader";
import { useListings } from "@/hooks/use-listings";
import { RESIDUE_TYPES, validateListing, type ListingInput, type ListingKind, type ResidueType } from "@/lib/listings";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post a listing — Avashesh" },
      { name: "description", content: "Offer crop residue as a farmer or post demand as a buyer." },
      { property: "og:title", content: "Post a listing — Avashesh" },
      { property: "og:description", content: "Offer crop residue or post buyer demand (prototype)." },
    ],
  }),
  component: PostPage,
});

const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm";

function PostPage() {
  const navigate = useNavigate();
  const { add } = useListings();
  const [kind, setKind] = useState<ListingKind>("offer");
  const [residue, setResidue] = useState<ResidueType>(RESIDUE_TYPES[0]);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const input: ListingInput = {
      kind, residue, district, state, name,
      quantityKg: qty === "" ? NaN : Number(qty),
      pricePerKg: price.trim() === "" ? null : Number(price),
    };
    const errs = validateListing(input);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (!add(input)) {
      setErrors({ form: "Could not save. Your browser may block storage or be full." });
      return;
    }
    navigate({ to: "/listings" });
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-xl space-y-5 px-4 py-8">
        <h1 className="font-display text-3xl font-semibold">Post a listing</h1>
        <PrototypeNotice />
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["offer", "request"] as const).map((k) => (
              <button type="button" key={k} onClick={() => setKind(k)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${kind === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
                {k === "offer" ? "I'm a farmer selling" : "I'm a buyer looking"}
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium">Residue type
            <select className={`${field} mt-1`} value={residue} onChange={(e) => setResidue(e.target.value as ResidueType)}>
              {RESIDUE_TYPES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">Quantity (kg)
              <input className={`${field} mt-1`} inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} />{err("quantityKg")}
            </label>
            <label className="block text-sm font-medium">Price ₹/kg (optional)
              <input className={`${field} mt-1`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />{err("pricePerKg")}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">District
              <input className={`${field} mt-1`} value={district} onChange={(e) => setDistrict(e.target.value)} />{err("district")}
            </label>
            <label className="block text-sm font-medium">State
              <input className={`${field} mt-1`} value={state} onChange={(e) => setState(e.target.value)} />{err("state")}
            </label>
          </div>
          <label className="block text-sm font-medium">Display name
            <input className={`${field} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />{err("name")}
          </label>
          <p className="text-xs text-muted-foreground">Don't enter phone numbers or exact addresses — this prototype has no private messaging.</p>
          {err("form")}
          <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Publish listing
          </button>
        </form>
      </main>
    </div>
  );
}
