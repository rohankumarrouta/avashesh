import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import { useRecords } from "@/hooks/use-records";
import { summarize } from "@/lib/dashboard";
import { IMPACT_SOURCE } from "@/lib/impact";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Avashesh" },
      { name: "description", content: "Track the agricultural waste you have recorded and your reuse plans." },
      { property: "og:title", content: "Dashboard — Avashesh" },
      { property: "og:description", content: "Track recorded agricultural waste and reuse plans." },
    ],
  }),
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });
const btn = "rounded-md border border-border bg-card px-3 py-2 text-sm font-medium";

function Dashboard() {
  const { records, ready, loadDemo } = useRecords();
  const s = summarize(records);
  const max = Math.max(1, ...s.byType.map((t) => t.kg));

  return (
    <Page>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {s.demoCount > 0 && (
        <p className="rounded-md bg-accent/50 p-3 text-sm">Includes {s.demoCount} SAMPLE records (made-up examples, not real farmers). Remove them on the Records page.</p>
      )}

      {ready && s.count === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p>No waste recorded yet.</p>
          <div className="mt-3 flex justify-center gap-2">
            <Link to="/record" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Record waste</Link>
            <button onClick={loadDemo} className={btn}>Load sample data</button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total recorded" value={`${fmt(s.totalKg)} kg`} />
            <Stat label="Records" value={String(s.count)} />
            <Stat label="With a reuse plan" value={`${s.plannedCount} of ${s.count}`} />
            <Stat label="Waste with a plan" value={`${fmt(s.plannedKg)} kg`} />
          </div>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="font-semibold">By waste type</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {s.byType.map((t) => (
                <li key={t.id}>
                  <div className="flex justify-between"><span>{t.label}</span><span>{fmt(t.kg)} kg</span></div>
                  <div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${(t.kg / max) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
            <h2 className="mt-4 font-semibold">What usually happens</h2>
            <p className="mt-1 text-sm">{s.byPractice.map((p) => `${p.label}: ${p.count}`).join(" · ")}</p>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 text-sm">
            <h2 className="font-semibold">Estimated impact (not measured)</h2>
            {s.burningEstimate ? (
              <>
                <p className="mt-1">
                  {fmt(s.burningWithPlanKg)} kg of waste that is usually burned now has a reuse plan. If that amount were burned, it would release about{" "}
                  <strong>{fmt(s.burningEstimate.totalCo2eKg)} kg CO₂e</strong> ({fmt(s.burningEstimate.nonCo2Co2eKg)} kg from methane and N₂O).
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  A plan is not proof the waste was reused. Assumes dry residue fully burned. Source: {IMPACT_SOURCE}
                </p>
              </>
            ) : (
              <p className="mt-1 text-muted-foreground">Shows up when a record marked "Usually burned" (paddy straw, husk, bagasse or shells) gets a reuse plan.</p>
            )}
          </section>

          <div className="grid grid-cols-2 gap-2">
            <Link to="/records" className="rounded-md bg-primary py-3 text-center font-semibold text-primary-foreground">View records</Link>
            <Link to="/record" className={`${btn} py-3 text-center`}>Add waste</Link>
          </div>
        </>
      )}
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
