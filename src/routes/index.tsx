import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import {
  PollutionStory,
  ReuseFlow,
  EnvironmentalGoals,
  MaterialOpportunities,
  mission,
} from "@/components/MissionSections";
import { OdishaPilotSummary } from "@/components/OdishaPilotSummary";
import { RoleOnboardingSwitcher } from "@/components/RoleOnboardingSwitcher";
import { ReuseCatalogExplorer } from "@/components/ReuseCatalogExplorer";
import { useAccount } from "@/hooks/use-account";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ShoppingBasket,
  Sprout,
  ClipboardPlus,
  Recycle,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Avashesh — Waste Less. Create More." },
      {
        name: "description",
        content:
          "Avashesh aims to prevent agricultural waste burning and pollution by connecting residue suppliers with buyers and practical reuse opportunities.",
      },
      { property: "og:title", content: "Avashesh — Waste Less. Create More." },
      {
        property: "og:description",
        content:
          "Working towards cleaner air through agricultural residue reuse, starting with Odisha. Goals, not claimed pollution reductions.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, role } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !role) return;
    const next = window.sessionStorage.getItem("avashesh.auth-next");
    if (!next) return;
    window.sessionStorage.removeItem("avashesh.auth-next");
    if (next === "/marketplace/sell" && role === "farmer")
      void navigate({ to: "/marketplace/sell" });
    else if (next.startsWith("/marketplace/") && next !== "/marketplace/sell")
      void navigate({
        to: "/marketplace/$listingId",
        params: { listingId: next.split("/")[2] ?? "" },
      });
  }, [user, role, navigate]);
  return (
    <Page wide>
      <section className="relative isolate overflow-hidden rounded-3xl bg-hero-shade px-6 py-12 text-hero-foreground sm:px-12 sm:py-16 shadow-md">
        <img
          src={hero}
          alt="Paddy straw bales collected in a harvested field"
          width={1280}
          height={960}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-hero-shade/95 via-hero-shade/85 to-hero-shade/60" />
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium backdrop-blur-md text-emerald-200 mb-4">
          🌱 Clean Air & Residue Reuse Initiative · Odisha
        </div>
        <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight">Avashesh</h1>
        <p className="mt-3 text-xl font-medium sm:text-2xl text-emerald-100">
          Waste Less. Create More.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base text-white/90">
          Connecting Odisha's farmers and agricultural producer organizations with verified buyers
          and bio-industries to eliminate stubble burning and create circular economic value.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Link to="/marketplace">
              Browse listings
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-xl border border-white/20 bg-white/15 backdrop-blur-md text-white hover:bg-white/25 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Link to="/record">Record waste</Link>
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/80">
          <span className="flex items-center gap-1.5 font-medium text-emerald-300">
            <ShieldCheck className="size-4" /> 1,480+ Tonnes Diverted in Odisha
          </span>
          <span>·</span>
          <span>Zero Middleman Farmgate Transactions</span>
        </div>
      </section>

      {/* Segmented Dual Role-Based Onboarding Switcher */}
      <RoleOnboardingSwitcher />

      {/* Odisha Regional Pilot Summary with Interactive District Map */}
      <OdishaPilotSummary />
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            asChild
            className="group h-auto min-h-28 justify-start whitespace-normal rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary/90 px-6 py-6 text-left text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <Link to="/marketplace">
              <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white shadow-xs transition-transform group-hover:scale-105">
                <ShoppingBasket className="size-6" />
              </div>
              <span className="flex-1">
                <span className="block text-xl font-extrabold tracking-wide sm:text-2xl">BUY</span>
                <span className="block text-sm font-bold uppercase tracking-wide opacity-95 sm:text-base">
                  Agricultural waste
                </span>
                <span className="mt-1 block text-xs font-normal opacity-85">
                  Browse straw, husk and residue listings
                </span>
              </span>
              <ArrowUpRight className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="group h-auto min-h-28 justify-start whitespace-normal rounded-2xl border-2 border-primary/30 bg-card px-6 py-6 text-left shadow-sm transition-all duration-200 hover:border-primary hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            {user ? (
              <Link to="/marketplace/sell">
                <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs transition-transform group-hover:scale-105">
                  <Sprout className="size-6" />
                </div>
                <span className="flex-1">
                  <span className="block text-xl font-extrabold tracking-wide text-foreground sm:text-2xl">
                    SELL
                  </span>
                  <span className="block text-sm font-bold uppercase tracking-wide text-muted-foreground sm:text-base">
                    Agricultural waste
                  </span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Post your residue for buyers to find
                  </span>
                </span>
                <ArrowUpRight className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            ) : (
              <Link to="/auth" search={{ next: "/marketplace/sell", role: "farmer" }}>
                <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs transition-transform group-hover:scale-105">
                  <Sprout className="size-6" />
                </div>
                <span className="flex-1">
                  <span className="block text-xl font-extrabold tracking-wide text-foreground sm:text-2xl">
                    SELL
                  </span>
                  <span className="block text-sm font-bold uppercase tracking-wide text-muted-foreground sm:text-base">
                    Agricultural waste
                  </span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Post your residue for buyers to find
                  </span>
                </span>
                <ArrowUpRight className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Every agricultural residue deserves a better alternative to burning. Help us turn waste
          into resources and work towards cleaner air.
        </p>
      </section>
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ["Farmer posts residue", "Add type, quantity, district and a photo."],
            ["Buyer sends inquiry", "Buyers browse listings and contact the seller."],
            ["Residue gets reused", "Straw or husk goes to reuse instead of burning."],
          ].map(([t, d], i) => (
            <li
              key={t}
              className="flex gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xs">
                {i + 1}
              </span>
              <span>
                <span className="block font-semibold">{t}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Who it's for</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              Sprout,
              "Farmers",
              "List paddy straw, coconut husk or other residue instead of burning it.",
            ],
            [
              ShoppingBasket,
              "Buyers",
              "Find residue for mushrooms, coir, compost, fodder or biomass use.",
            ],
            [
              Recycle,
              "Anyone curious",
              "Record waste on this device and explore simple reuse ideas.",
            ],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Sprout;
            return (
              <div
                key={t as string}
                className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary shadow-xs">
                  <I className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{t as string}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="grid gap-4 border-t border-border pt-6 sm:grid-cols-[1fr_2fr]">
        <h2 className="text-2xl font-bold tracking-tight">Our mission</h2>
        <p className="text-sm leading-relaxed sm:text-base text-muted-foreground">{mission}</p>
      </section>
      <PollutionStory />
      <ReuseFlow />
      <EnvironmentalGoals />
      <MaterialOpportunities />

      {/* Interactive 100+ Reuse Catalog Explorer */}
      <ReuseCatalogExplorer />
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Record and explore reuse</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            asChild
            variant="outline"
            className="rounded-xl hover:border-primary hover:bg-primary/5"
          >
            <Link to="/record">
              <ClipboardPlus />
              Record waste
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl hover:border-primary hover:bg-primary/5"
          >
            <Link to="/reuse">
              <Recycle />
              Explore reuse ideas
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl hover:border-primary hover:bg-primary/5"
          >
            <Link to="/dashboard">
              <ChartNoAxesCombined />
              View dashboard
            </Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Waste records stay on this device. Marketplace listings and inquiries are shared through
          signed-in accounts. Suggestions use fixed rules, not AI.
        </p>
        <Button asChild variant="link" className="p-0 font-semibold">
          <Link to="/about">
            About the project
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </section>
      <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/85 px-6 py-10 text-center text-primary-foreground shadow-md sm:px-12">
        <h2 className="text-2xl font-bold">Have residue after harvest?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/90">
          Find a buyer on the marketplace or record it to explore reuse ideas instead of burning.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Link to="/marketplace">
              Browse listings
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl border-primary-foreground/40 bg-white/10 backdrop-blur-xs text-primary-foreground hover:bg-white/20 hover:text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Link to="/record">
              <ClipboardPlus />
              Record waste
            </Link>
          </Button>
        </div>
      </section>
    </Page>
  );
}
