import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PollutionStory, ReuseFlow, EnvironmentalGoals, MaterialOpportunities, PollutionImpact, mission } from '@/components/MissionSections';
import { useAccount } from "@/hooks/use-account";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ShoppingBasket, Sprout, ClipboardPlus, Recycle, ChartNoAxesCombined } from 'lucide-react';

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
      <section className="relative isolate -mx-4 overflow-hidden bg-hero-shade px-6 py-12 text-hero-foreground sm:-mx-8 sm:rounded-b-3xl sm:px-12 sm:py-20">
        <img src={hero} alt="Paddy straw bales collected in a harvested field" width={1280} height={960} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-shade/65" />
        <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-medium backdrop-blur-sm"><Recycle className="size-3.5" aria-hidden="true" />Agricultural residue reuse</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Avashesh</h1>
        <p className="mt-2 text-base font-medium sm:text-lg">Waste Less. Create More.</p>
        <p className="mt-5 max-w-lg text-sm leading-relaxed sm:text-base">Working towards cleaner air by preventing unnecessary agricultural waste burning and promoting reuse.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/marketplace">Browse listings<ArrowUpRight /></Link></Button><Button asChild size="lg" variant="secondary"><Link to="/record">Record waste</Link></Button></div>
        <p className="mt-5 text-xs opacity-90">Pollution reduction is our goal, not a measured achievement.</p>
      </section>
      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild className="h-auto min-h-28 justify-start whitespace-normal rounded-xl px-5 py-5 text-left shadow-sm"><Link to="/marketplace"><ShoppingBasket className="mr-3 size-7 shrink-0" /><span className="flex-1"><span className="block text-xl font-extrabold tracking-wide sm:text-2xl">BUY AGRICULTURAL WASTE</span><span className="mt-1 block text-xs font-normal opacity-90">Browse straw, husk and residue listings</span></span><ArrowUpRight className="shrink-0" /></Link></Button>
          <Button asChild variant="outline" className="h-auto min-h-28 justify-start whitespace-normal rounded-xl border-2 border-primary px-5 py-5 text-left shadow-sm">{user ? <Link to="/marketplace/sell"><Sprout className="mr-3 size-7 shrink-0 text-primary" /><span className="flex-1"><span className="block text-xl font-extrabold tracking-wide sm:text-2xl">SELL AGRICULTURAL WASTE</span><span className="mt-1 block text-xs font-normal text-muted-foreground">Post your residue for buyers to find</span></span><ArrowUpRight className="shrink-0" /></Link> : <Link to="/auth" search={{next:"/marketplace/sell",role:"farmer"}}><Sprout className="mr-3 size-7 shrink-0 text-primary" /><span className="flex-1"><span className="block text-xl font-extrabold tracking-wide sm:text-2xl">SELL AGRICULTURAL WASTE</span><span className="mt-1 block text-xs font-normal text-muted-foreground">Post your residue for buyers to find</span></span><ArrowUpRight className="shrink-0" /></Link>}</Button>
        </div>
        <p className="text-sm text-muted-foreground">Every agricultural residue deserves a better alternative to burning. Help us turn waste into resources and work towards cleaner air.</p>
      </section>
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[["Farmer posts residue","Add type, quantity, district and a photo."],["Buyer sends inquiry","Buyers browse listings and contact the seller."],["Residue gets reused","Straw or husk goes to reuse instead of burning."]].map(([t,d],i)=>(
            <li key={t} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i+1}</span><span><span className="block font-semibold">{t}</span><span className="mt-1 block text-sm text-muted-foreground">{d}</span></span></li>
          ))}
        </ol>
      </section>
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-xl font-semibold">Who it's for</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[[Sprout,"Farmers","List paddy straw, coconut husk or other residue instead of burning it."],[ShoppingBasket,"Buyers","Find residue for mushrooms, coir, compost, fodder or biomass use."],[Recycle,"Anyone curious","Record waste on this device and explore simple reuse ideas."]].map(([Icon,t,d])=>{const I=Icon as typeof Sprout;return(
            <div key={t as string} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"><span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary"><I className="size-5" aria-hidden="true" /></span><h3 className="mt-3 font-semibold">{t as string}</h3><p className="mt-1 text-sm text-muted-foreground">{d as string}</p></div>)})}
        </div>
      </section>
      <section className="grid gap-4 border-t border-border pt-6 sm:grid-cols-[1fr_2fr]"><h2 className="text-xl font-semibold">Our mission</h2><p className="text-sm leading-relaxed sm:text-base">{mission}</p></section>
      <PollutionStory/><ReuseFlow/><EnvironmentalGoals/><MaterialOpportunities/><PollutionImpact/>
      <section className="space-y-4 border-t border-border pt-6"><h2 className="text-xl font-semibold">Record and explore reuse</h2><div className="grid gap-3 sm:grid-cols-3"><Button asChild variant="outline"><Link to="/record"><ClipboardPlus />Record waste</Link></Button><Button asChild variant="outline"><Link to="/reuse"><Recycle />Explore reuse ideas</Link></Button><Button asChild variant="outline"><Link to="/dashboard"><ChartNoAxesCombined />View dashboard</Link></Button></div><p className="text-xs text-muted-foreground">Waste records stay on this device. Marketplace listings and inquiries are shared through signed-in accounts. Suggestions use fixed rules, not AI.</p><Button asChild variant="link"><Link to="/about">About the project<ArrowUpRight /></Link></Button></section>
      <section className="rounded-2xl bg-primary px-6 py-8 text-center text-primary-foreground sm:px-10">
        <h2 className="text-xl font-semibold">Have residue after harvest?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm opacity-90">Find a buyer on the marketplace or record it to explore reuse ideas instead of burning.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3"><Button asChild size="lg" variant="secondary"><Link to="/marketplace">Browse listings<ArrowUpRight /></Link></Button><Button asChild size="lg" variant="outline" className="border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/record"><ClipboardPlus />Record waste</Link></Button></div>
      </section>
    </Page>
  );
}
