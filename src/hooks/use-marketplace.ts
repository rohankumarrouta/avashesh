import { useCallback, useEffect, useState } from "react";
import { addInquiry, addListing, deleteListing, initialMarketplace, MARKETPLACE_KEY, parseMarketplace, type MarketplaceState } from "@/lib/marketplace";

export function useMarketplace() {
  const [state, setState] = useState<MarketplaceState | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(MARKETPLACE_KEY);
        const next = raw === null ? initialMarketplace(crypto.randomUUID()) : parseMarketplace(raw);
        if (!next) throw new Error("Saved marketplace data is damaged. It has not been overwritten.");
        if (raw === null) window.localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(next));
        setState(next); setError("");
      } catch (e) { setState(null); setError(e instanceof Error ? e.message : "Browser storage is unavailable."); }
      setReady(true);
    };
    read(); window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  const commit = useCallback((transform: (s: MarketplaceState) => MarketplaceState) => {
    try {
      const raw = window.localStorage.getItem(MARKETPLACE_KEY);
      const current = raw === null ? null : parseMarketplace(raw);
      if (!current) throw new Error("Cannot read saved data. Refresh the page and try again.");
      const next = transform(current);
      window.localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(next));
      setState(next); setError(""); return true;
    } catch (e) {
      setError(e instanceof Error && e.name !== "ZodError" ? e.message : "Cannot save. Check your inputs or browser storage capacity."); return false;
    }
  }, []);
  function create(input: unknown): string | null {
    const id = crypto.randomUUID();
    return commit((s) => addListing(s, input, id, new Date().toISOString())) ? id : null;
  }
  function inquire(listingId: string, input: unknown): boolean {
    return commit((s) => addInquiry(s, listingId, input, crypto.randomUUID(), new Date().toISOString()));
  }
  function remove(id: string): boolean { return commit((s) => deleteListing(s, id)); }
  function removeSamples(): boolean { return commit((s) => ({ ...s, listings: s.listings.filter((l) => !l.isDemo), inquiries: s.inquiries.filter((i) => s.listings.some((l) => l.id === i.listingId && !l.isDemo)) })); }
  function restoreSamples(): boolean { return commit((s) => ({ ...s, listings: [...s.listings.filter((l) => !l.isDemo), ...initialMarketplace(s.ownerId).listings] })); }
  function clear(): boolean { return commit((s) => ({ ...s, listings: [], inquiries: [] })); }
  return { state, ready, error, create, inquire, remove, removeSamples, restoreSamples, clear };
}