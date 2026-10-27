import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avashesh — Crop residue marketplace prototype" },
      { name: "description", content: "Prototype marketplace where farmers list crop residue and buyers post demand, with a cited emissions estimate." },
      { property: "og:title", content: "Avashesh — Crop residue marketplace prototype" },
      { property: "og:description", content: "List crop residue instead of burning it. Prototype with fictional sample data." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Avashesh · अवशेष</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Residue is a resource, not something to burn.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Farmers list straw and stalks. Buyers post what they need. See how much smoke a sale could keep out of the air.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/post" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Post a listing
              </Link>
              <Link to="/listings" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary">
                Browse listings
              </Link>
            </div>
          </div>
          <img src={hero} alt="Bales of rice straw stacked in a harvested field" className="aspect-[4/3] w-full rounded-2xl object-cover" width={1280} height={960} />
        </section>
        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ["Farmers", "List residue type, quantity, location and an asking price."],
            ["Buyers", "Biomass plants, pellet and board makers post their demand."],
            ["Impact", "Estimate emissions avoided, using published IPCC factors."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">{t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </section>
        <p className="mt-10 text-xs text-muted-foreground">
          Prototype for a social-cause competition. No real farmers, buyers or partners are onboarded yet.
        </p>
      </main>
    </div>
  );
}
