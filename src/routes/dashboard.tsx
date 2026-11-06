import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import { useRecords } from "@/hooks/use-records";
import { summarize } from "@/lib/dashboard";
import { IMPACT_SOURCE } from "@/lib/impact";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ClipboardPlus,
  ChartNoAxesCombined,
  Sprout,
  Wind,
  Layers,
  Recycle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard — Avashesh" },
      {
        name: "description",
        content: "Track the agricultural waste you have recorded and your reuse plans.",
      },
      { property: "og:title", content: "Dashboard — Avashesh" },
      { property: "og:description", content: "Track recorded agricultural waste and reuse plans." },
    ],
  }),
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });

function Dashboard() {
  const { records, ready, loadDemo } = useRecords();
  const s = summarize(records);
  const max = Math.max(1, ...s.byType.map((t) => t.kg));

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground">
            <ChartNoAxesCombined className="size-7 text-primary" />
            Residue & Reuse Dashboard
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Local offline telemetry: Track farmgate volumes, reuse plans, and avoided emissions.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl shadow-xs">
          <Link to="/record">
            <ClipboardPlus className="size-4" />
            Record new residue
          </Link>
        </Button>
      </div>

      {s.demoCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent/20 p-4 text-xs">
          <span className="text-accent-foreground font-medium">
            Currently displaying <strong>{s.demoCount} SAMPLE records</strong> (Odisha pilot reference examples).
          </span>
          <Button asChild variant="link" size="sm" className="p-0 text-xs">
            <Link to="/records">Manage records →</Link>
          </Button>
        </div>
      )}

      {!ready ? (
        <DashboardSkeleton />
      ) : s.count === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-primary/40 bg-card p-10 text-center shadow-xs">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-xs">
            <Sprout className="size-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            No crop residues recorded yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            Record straw, husk, or bagasse from your harvest to uncover tailored circular reuse
            opportunities, compute verifiable CO₂e avoidance, and connect with Odisha buyers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl shadow-md">
              <Link to="/record">
                <ClipboardPlus className="size-4" />
                Record your harvest residue
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button onClick={loadDemo} variant="outline" size="lg" className="rounded-xl">
              <Sparkles className="size-4 mr-1.5 text-primary" />
              Load Odisha sample data
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              icon={Layers}
              label="Total Recorded"
              value={`${fmt(s.totalKg)} kg`}
              sub="Across all lots"
            />
            <Stat
              icon={ClipboardPlus}
              label="Total Batches"
              value={String(s.count)}
              sub="Saved locally"
            />
            <Stat
              icon={Recycle}
              label="Reuse Planned"
              value={`${s.plannedCount} of ${s.count}`}
              sub={`${fmt(s.plannedKg)} kg planned`}
            />
            <Stat
              icon={Wind}
              label="Burning Diverted"
              value={`${fmt(s.burningWithPlanKg)} kg`}
              sub="Protected from open smoke"
            />
          </div>

          {/* Breakdown Section */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Distribution by Waste Type
              </h2>
              <p className="text-xs text-muted-foreground">Volume breakdown in kilograms</p>
            </div>

            <ul className="space-y-3 text-sm">
              {s.byType.map((t) => (
                <li key={t.id} className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">{t.label}</span>
                    <span className="font-bold text-foreground">{fmt(t.kg)} kg</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(t.kg / max) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/60 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Typical Handling Practices Logged
              </h3>
              <div className="flex flex-wrap gap-2">
                {s.byPractice.map((p) => (
                  <span
                    key={p.label}
                    className="rounded-lg bg-secondary/80 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {p.label}: <strong>{p.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Environmental Impact Calculation Card */}
          <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="size-4" />
              </span>
              <div>
                <h2 className="font-bold text-foreground">Calculated Emissions Avoidance</h2>
                <span className="text-[11px] text-muted-foreground">Tier-1 IPCC factors</span>
              </div>
            </div>

            {s.burningEstimate ? (
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-foreground/90">
                  <strong>{fmt(s.burningWithPlanKg)} kg</strong> of residue that is usually burned
                  now has a documented circular reuse plan. If burned, it would have emitted approximately{" "}
                  <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold text-base">
                    {fmt(s.burningEstimate.totalCo2eKg)} kg CO₂e
                  </strong>{" "}
                  ({fmt(s.burningEstimate.nonCo2Co2eKg)} kg from CH₄ & N₂O).
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Assumes dry residue diverted from open field combustion. Source: {IMPACT_SOURCE}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Emissions avoidance will calculate automatically when a residue lot marked "Usually
                burned" (such as paddy straw, coconut husk, or bagasse) receives a reuse plan.
              </p>
            )}
          </section>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl shadow-xs">
              <Link to="/records">
                View all records
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/record">
                <ClipboardPlus className="size-4 mr-1.5" />
                Add more waste
              </Link>
            </Button>
          </div>
        </>
      )}
    </Page>
  );
}

function Stat({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Sprout;
}) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-3.5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-foreground tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-3xl border border-border/80 bg-card p-5"
          >
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-8 w-28 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="animate-pulse space-y-4 rounded-3xl border border-border/80 bg-card p-6">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
    </div>
  );
}
