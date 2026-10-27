import { useCallback, useEffect, useState } from "react";
import { allListings, createListing, loadUserListings, saveUserListings, type Listing, type ListingInput } from "@/lib/listings";

export function useListings() {
  const [user, setUser] = useState<Listing[]>([]);
  useEffect(() => setUser(loadUserListings()), []);

  const add = useCallback((input: ListingInput) => {
    const next = [createListing(input), ...loadUserListings()];
    const ok = saveUserListings(next);
    if (ok) setUser(next);
    return ok;
  }, []);

  const remove = useCallback((id: string) => {
    const next = loadUserListings().filter((l) => l.id !== id);
    if (saveUserListings(next)) setUser(next);
  }, []);

  return { listings: allListings(user), add, remove };
}
