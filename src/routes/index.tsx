import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PollutionStory, ReuseFlow, EnvironmentalGoals, MaterialOpportunities, PollutionImpact, mission } from '@/components/MissionSections';
import { useAccount } from "@/hooks/use-account";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ShoppingBasket, Sprout, MapPin, ClipboardPlus, Recycle, ChartNoAxesCombined } from 'lucide-react';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Avashesh — Waste Less. Create More." },
      { name: "description", content: "Avashesh aims to prevent agricultural waste burning and pollution by connecting residue suppliers with buyers and practical reuse opportunities." },
      { property: "og:title", content: "Avashesh — Waste Less. Create More." },
      { property: "og:description", content: "Working towards cleaner air through agricultural residue reuse, starting with Odisha. Goals, not claimed pollution reductions." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, role } = useAccount();
  const navigate = useNavigate();
  useEffect(() => { if (!user || !role) return; const next = window.sessionStorage.getItem("avashesh.auth-next"); if (!next) return; window.sessionStorage.removeItem("avashesh.auth-next"); if (next === "/marketplace/sell" && role === "farmer") void navigate({ to: "/marketplace/sell" }); else if (next.startsWith("/marketplace/") && next !== "/marketplace/sell") void navigate({ to: "/marketplace/$listingId", params: { listingId: next.split("/")[2] ?? "" } }); }, [user, role, navigate]);
  return (
    <Page wide>
      <section className="relative isolate -mx-4 overflow-hidden bg-hero-shade px-6 py-10 text-hero-foreground sm:-mx-8 sm:px-10 sm:py-14">
        <img src={hero} alt="Paddy straw bales collected in a harvested field" width={1280} height={960} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-shade/65" />
        <p className="mb-5 flex items-center gap-2 text-xs font-semibold"><MapPin className="size-4" />Starting with Odisha</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Avashesh</h1>
        <p className="mt-3 text-xl font-medium sm:text-2xl">Waste Less. Create More.</p>
        <p className="mt-5 max-w-lg text-sm leading-relaxed sm:text-base">Working towards cleaner air by preventing unnecessary agricultural waste burning and promoting reuse.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/marketplace">Browse listings<ArrowUpRight /></Link></Button><Button asChild size="lg" variant="secondary"><Link to="/record">Record waste</Link></Button></div>
        <p className="mt-5 text-xs opacity-90">Pollution reduction is our goal, not a measured achievement.</p>
      </section>
      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild className="h-auto min-h-24 justify-start whitespace-normal rounded-xl px-5 py-5 text-left shadow-sm"><Link to="/marketplace"><ShoppingBasket className="mr-3 size-7 shrink-0" /><span className="flex-1"><span className="block text-sm font-bold tracking-wide">BUY AGRICULTURAL WASTE</span><span className="mt-1 block text-xs font-normal opacity-90">Browse straw, husk and residue listings</span></span><ArrowUpRight className="shrink-0" /></Link></Button>
          <Button asChild variant="outline" className="h-auto min-h-24 justify-start whitespace-normal rounded-xl border-2 border-primary px-5 py-5 text-left shadow-sm">{user ? <Link to="/marketplace/sell"><Sprout className="mr-3 size-7 shrink-0 text-primary" /><span className="flex-1"><span className="block text-sm font-bold tracking-wide">SELL AGRICULTURAL WASTE</span><span className="mt-1 block text-xs font-normal text-muted-foreground">Post your residue for buyers to find</span></span><ArrowUpRight className="shrink-0" /></Link> : <Link to="/auth" search={{next:"/marketplace/sell",role:"farmer"}}><Sprout className="mr-3 size-7 shrink-0 text-primary" /><span className="flex-1"><span className="block text-sm font-bold tracking-wide">SELL AGRICULTURAL WASTE</span><span className="mt-1 block text-xs font-normal text-muted-foreground">Post your residue for buyers to find</span></span><ArrowUpRight className="shrink-0" /></Link>}</Button>
        </div>
        <p className="text-sm text-muted-foreground">Every agricultural residue deserves a better alternative to burning. Help us turn waste into resources and work towards cleaner air.</p>
      </section>
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[["Farmer posts residue","Add type, quantity, district and a photo."],["Buyer sends inquiry","Buyers browse listings and contact the seller."],["Residue gets reused","Straw or husk goes to reuse instead of burning."]].map(([t,d],i)=>(
            <li key={t} className="flex gap-3 rounded-xl border border-border bg-card p-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i+1}</span><span><span className="block font-semibold">{t}</span><span className="mt-1 block text-sm text-muted-foreground">{d}</span></span></li>
          ))}
        </ol>
      </section>
      <section className="grid gap-4 border-t border-border pt-6 sm:grid-cols-[1fr_2fr]"><h2 className="text-2xl font-semibold">Our mission</h2><p className="text-sm leading-relaxed sm:text-base">{mission}</p></section>
      <PollutionStory/><ReuseFlow/><EnvironmentalGoals/><MaterialOpportunities/><PollutionImpact/>
      <section className="space-y-4 border-t border-border pt-6"><h2 className="text-2xl font-semibold">Record and explore reuse</h2><div className="grid gap-3 sm:grid-cols-3"><Button asChild variant="outline"><Link to="/record"><ClipboardPlus />Record waste</Link></Button><Button asChild variant="outline"><Link to="/reuse"><Recycle />Explore reuse ideas</Link></Button><Button asChild variant="outline"><Link to="/dashboard"><ChartNoAxesCombined />View dashboard</Link></Button></div><p className="text-xs text-muted-foreground">Waste records stay on this device. Marketplace listings and inquiries are shared through signed-in accounts. Suggestions use fixed rules, not AI.</p><Button asChild variant="link"><Link to="/about">About the project<ArrowUpRight /></Link></Button></section>
    </Page>
  );
}
