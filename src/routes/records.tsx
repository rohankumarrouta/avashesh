import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, SampleBadge } from "@/components/SiteHeader";
import { useRecords } from "@/hooks/use-records";
import { optionById } from "@/lib/reuse-rules";
import { practiceLabel, wasteLabel } from "@/lib/waste";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Waste records — Avashesh" },
      { name: "description", content: "View, export and delete the agricultural waste entries saved on this device." },
      { property: "og:title", content: "Waste records — Avashesh" },
      { property: "og:description", content: "View and delete saved agricultural waste entries." },
    ],
  }),
  component: RecordsPage,
});

const btn = "rounded-md border border-border bg-card px-3 py-2 text-sm font-medium";
const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });

function RecordsPage() {
  const { records, ready, remove, loadDemo, clearDemo, clearAll } = useRecords();
  const sampleCount = records.filter((r) => r.isDemo).length;

  function exportJson() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `avashesh-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Waste records</h1>
        <Link to="/record" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">+ Add</Link>
      </div>
      <p className="text-sm text-muted-foreground">Saved only in this browser. Clearing browser data deletes them.</p>

      {ready && records.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p>No records yet.</p>
          <button onClick={loadDemo} className={`${btn} mt-3`}>Load sample data</button>
        </div>
      ) : (
        <ul className="space-y-2">
          {records.map((r) => {
            const plan = optionById(r.plannedReuseId);
            return (
              <li key={r.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <strong>{wasteLabel(r.wasteType)} · {fmt(r.quantityKg)} kg</strong>
                  {r.isDemo && <SampleBadge />}
                </div>
                <p className="text-muted-foreground">{r.district} · {r.date} · {practiceLabel(r.practice)}</p>
                <p>Reuse plan: {plan ? plan.title : <span className="text-muted-foreground">none yet</span>}</p>
                {r.notes && !r.isDemo && <p className="text-muted-foreground">"{r.notes}"</p>}
                <div className="mt-2 flex gap-2">
                  <Link to="/reuse" search={{ record: r.id }} className={btn}>{plan ? "Change plan" : "See reuse options"}</Link>
                  <button className={`${btn} text-destructive`} onClick={() => confirm("Delete this record?") && remove(r.id)}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {records.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={exportJson} className={btn}>Export JSON</button>
          {sampleCount > 0 ? <button onClick={clearDemo} className={btn}>Remove sample data</button> : <button onClick={loadDemo} className={btn}>Load sample data</button>}
          <button onClick={() => confirm("Delete ALL records on this device?") && clearAll()} className={`${btn} text-destructive`}>Delete all</button>
        </div>
      )}
    </Page>
  );
}
