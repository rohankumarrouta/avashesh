import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { sellerLinks, type Listing } from "@/lib/marketplace";

export const marketField = "mt-1 w-full min-w-0 rounded-md border border-input bg-card px-3 py-2.5 text-sm";
export const formatPrice = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
export function MarketplaceNotice() {
  return <p className="border-l-4 border-primary bg-secondary p-3 text-sm text-secondary-foreground"><strong>Browser-only marketplace demo.</strong> Listings and inquiries stay in this browser; they are not shared with other users or devices. SAMPLE listings are fictional. No verified buyers, payments or transactions.</p>;
}
export function ContactSeller({ listing }: { listing: Listing }) {
  const links = sellerLinks(listing);
  if (!links) return <p className="text-sm text-muted-foreground">No seller contact available for this SAMPLE listing.</p>;
  return <div className="flex flex-wrap gap-2">
    <Button asChild variant="outline"><a href={links.phone}><Phone />Contact Seller</a></Button>
    <Button asChild variant="outline"><a href={links.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
  </div>;
}