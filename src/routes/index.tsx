import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import { BrandLogo } from "@/components/BrandLogo";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PollutionStory, ReuseFlow, EnvironmentalGoals, MaterialOpportunities, PollutionImpact, mission } from '@/components/MissionSections';
import { useAccount } from "@/hooks/use-account";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

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
    <Page>
      <section className="rounded-lg border border-border bg-card px-4 py-6">
        <BrandLogo className="mx-auto w-64 sm:w-80" />
      </section>
      <section className="relative isolate -mx-4 overflow-hidden bg-primary px-5 py-7 text-primary-foreground sm:py-10">
        <img src={hero} alt="Paddy straw bales collected in a harvested field" width={1280} height={960} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-primary/85" />
        <h1 className="text-3xl font-bold">Avashesh</h1>
        <p className="mt-2 text-lg font-semibold">Waste Less. Create More.</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed">Working towards cleaner air by preventing unnecessary agricultural waste burning and promoting reuse.</p>
        <p className="mt-3 text-xs">Starting with Odisha · Pollution reduction is our goal, not a measured achievement.</p>
      </section>
      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2"><Button asChild className="h-auto min-h-12 whitespace-normal px-3 py-3 text-sm"><Link to="/marketplace">BUY AGRICULTURAL WASTE</Link></Button><Button asChild variant="outline" className="h-auto min-h-12 whitespace-normal px-3 py-3 text-sm">{user ? <Link to="/marketplace/sell">SELL AGRICULTURAL WASTE</Link> : <Link to="/auth" search={{next:"/marketplace/sell",role:"farmer"}}>SELL AGRICULTURAL WASTE</Link>}</Button></div>
        <p className="text-sm text-muted-foreground">Every agricultural residue deserves a better alternative to burning. Help us turn waste into resources and work towards cleaner air.</p>
      </section>
      <section className="space-y-2 border-t border-border pt-6"><h2 className="text-xl font-bold">Our mission</h2><p className="text-sm leading-relaxed">{mission}</p></section>
      <PollutionStory/><ReuseFlow/><EnvironmentalGoals/><MaterialOpportunities/><PollutionImpact/>
      <section className="space-y-3 border-t border-border pt-6"><h2 className="text-xl font-bold">Record and explore reuse</h2><div className="grid gap-2 sm:grid-cols-3"><Button asChild variant="outline"><Link to="/record">Record waste</Link></Button><Button asChild variant="outline"><Link to="/reuse">Explore reuse ideas</Link></Button><Button asChild variant="outline"><Link to="/dashboard">View dashboard</Link></Button></div><p className="text-xs text-muted-foreground">Waste records stay on this device. Marketplace listings and inquiries are shared through signed-in accounts. Suggestions use fixed rules, not AI.</p><Button asChild variant="link"><Link to="/about">About the project</Link></Button></section>
    </Page>
  );
}
