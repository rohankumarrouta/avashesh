import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { MarketplaceNotice, marketField } from "@/components/MarketplaceShared";
import { useMarketplace } from "@/hooks/use-marketplace";
import { listingInputSchema, MARKET_TYPES, MAX_PHOTO_BYTES } from "@/lib/marketplace";

export const Route = createFileRoute("/marketplace/sell")({
  head: () => ({ meta: [
    { title: "Sell your agricultural waste — Avashesh" }, { name: "description", content: "Create an agricultural waste listing stored only in your browser." },
    { property: "og:title", content: "Sell your agricultural waste — Avashesh" }, { property: "og:description", content: "Try creating a local agricultural waste listing in the Avashesh prototype." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Sell,
});
function Sell() {
  const navigate = useNavigate();
  const { create, ready, state, error } = useMarketplace();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = listingInputSchema.safeParse({ ...Object.fromEntries(form), quantity: form.get("quantity") === "" ? NaN : Number(form.get("quantity")), price: form.get("price") === "" ? NaN : Number(form.get("price")), photo });
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]))); return;
    }
    setErrors({});
    if (loadingPhoto || photoError) return;
    const id = create(result.data);
    if (id) navigate({ to: "/marketplace/$listingId", params: { listingId: id } });
  }
  async function upload(file: File | undefined) {
    setPhoto(""); setPhotoError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_PHOTO_BYTES) { setPhotoError("Choose a JPEG, PNG or WebP photo under 500 KB."); return; }
    setLoadingPhoto(true);
    try {
      const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      const valid = file.type === "image/jpeg" ? signature[0] === 255 && signature[1] === 216 && signature[2] === 255
        : file.type === "image/png" ? [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => signature[i] === v)
        : String.fromCharCode(...signature.slice(0, 4)) === "RIFF" && String.fromCharCode(...signature.slice(8, 12)) === "WEBP";
      if (!valid) throw new Error("The file does not match its image type.");
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Cannot read photo.")); reader.onerror = () => reject(new Error("Cannot read photo.")); reader.readAsDataURL(file); });
      await new Promise<void>((resolve, reject) => { const img = new Image(); img.onload = () => resolve(); img.onerror = () => reject(new Error("This photo could not be opened.")); img.src = data; });
      setPhoto(data);
    } catch (e) { setPhotoError(e instanceof Error ? e.message : "Cannot read photo."); }
    finally { setLoadingPhoto(false); }
  }
  const err = (name: string) => errors[name] && <p className="text-sm text-destructive" role="alert">{errors[name]}</p>;
  return <Page>
    <Link to="/marketplace" className="text-sm text-primary underline">← Marketplace</Link>
    <h1 className="text-2xl font-bold">Sell Your Waste</h1><MarketplaceNotice />
    <form onSubmit={submit} noValidate className="space-y-4">
      <label className="block font-medium">Seller name<input name="sellerName" autoComplete="name" maxLength={100} className={marketField} />{err("sellerName")}</label>
      <label className="block font-medium">Phone / WhatsApp<input name="contact" type="tel" autoComplete="tel" maxLength={30} placeholder="10-digit Indian mobile number" className={marketField} />{err("contact")}</label>
      <label className="block font-medium">Waste type<select name="wasteType" className={marketField} defaultValue=""><option value="">Select…</option>{MARKET_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>{err("wasteType")}</label>
      <div className="grid grid-cols-2 gap-3"><label className="font-medium">Available quantity<input name="quantity" type="number" step="any" min="0" className={marketField} />{err("quantity")}</label><label className="font-medium">Unit<select name="unit" className={marketField}><option value="kg">kg</option><option value="quintal">quintal</option><option value="tonne">tonne</option></select>{err("unit")}</label></div>
      <label className="block font-medium">Asking price (₹ per selected unit)<input name="price" type="number" min="0" max="10000000" step="0.01" className={marketField} />{err("price")}</label>
      <label className="block font-medium">Location<input name="location" maxLength={120} placeholder="Town or district, state — not a full address" className={marketField} />{err("location")}</label>
      <label className="block font-medium">Description<textarea name="description" rows={3} maxLength={1000} className={marketField} />{err("description")}</label>
      <label className="block font-medium">Photo (optional)<input type="file" accept="image/jpeg,image/png,image/webp" className={marketField} onChange={(e) => void upload(e.target.files?.[0])} /><span className="text-xs text-muted-foreground">JPEG, PNG or WebP, up to 500 KB. Avoid faces, addresses or location metadata.</span></label>
      {loadingPhoto && <p className="text-sm">Checking photo…</p>}{photoError && <p role="alert" className="text-sm text-destructive">{photoError}</p>}{err("photo")}
      {photo && <img src={photo} alt="Selected waste photo" className="aspect-[4/3] w-full max-w-xs rounded-md object-cover" />}
      <p className="text-xs text-muted-foreground">Use test details for this demo. Contact and photos are stored unencrypted and visible to anyone using this browser. Nothing is published to other users. Calling or opening WhatsApp uses the supplied number outside this app.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!ready || !state || loadingPhoto || !!photoError} className="w-full">Save demo listing</Button>
    </form>
  </Page>;
}