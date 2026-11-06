import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, SampleBadge } from "@/components/SiteHeader";
import { useRecords } from "@/hooks/use-records";
import { optionById } from "@/lib/reuse-rules";
import { practiceLabel, wasteLabel } from "@/lib/waste";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  ClipboardList,
  MapPin,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Waste records — Avashesh" },
      {
        name: "description",
        content: "View, export and delete the agricultural waste entries saved on this device.",
      },
      { property: "og:title", content: "Waste records — Avashesh" },
      { property: "og:description", content: "View and delete saved agricultural waste entries." },
    ],
  }),
  component: RecordsPage,
});

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });

function RecordsPage() {
  const { records, ready, remove, loadDemo, clearDemo, clearAll } = useRecords();
  const sampleCount = records.filter((r) => r.isDemo).length;

  function exportJson() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `avashesh-odisha-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Saved Waste Records
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Encrypted in local browser storage. No cloud tracking without your explicit authorization.
          </p>
        </div>

        <Button asChild size="sm" className="rounded-xl shadow-xs">
          <Link to="/record">
            <Plus className="size-4" />
            Record new lot
          </Link>
        </Button>
      </div>

      {ready && records.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileText className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No records saved on this device</h2>
          <p className="mx-auto max-w-sm text-xs text-muted-foreground leading-relaxed">
            Record crop residues from your field or load Odisha demonstration records to test calculations.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Button asChild className="rounded-xl">
              <Link to="/record">Record waste</Link>
            </Button>
            <Button onClick={loadDemo} variant="outline" className="rounded-xl">
              <Sparkles className="size-3.5 mr-1.5 text-primary" />
              Load sample data
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            const plan = optionById(r.plannedReuseId);
            return (
              <div
                key={r.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <strong className="text-base text-foreground">
                      {wasteLabel(r.wasteType)}
                    </strong>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-primary">
                      {fmt(r.quantityKg)} kg
                    </span>
                  </div>
                  {r.isDemo && <SampleBadge />}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" />
                    {r.district}, Odisha
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 text-primary" />
                    {r.date}
                  </span>
                  <span>Handling: <strong>{practiceLabel(r.practice)}</strong></span>
                </div>

                <div className="rounded-xl bg-muted/60 p-3 text-xs flex items-center justify-between">
                  <span>
                    Reuse Plan:{" "}
                    {plan ? (
                      <strong className="text-primary">{plan.title}</strong>
                    ) : (
                      <span className="text-muted-foreground italic">None adopted yet</span>
                    )}
                  </span>
                  {plan && <span className="text-[11px] font-semibold text-emerald-600">✓ Active</span>}
                </div>

                {r.notes && !r.isDemo && (
                  <p className="text-xs italic text-muted-foreground border-l-2 border-border pl-2.5">
                    "{r.notes}"
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                  <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                    <Link to="/reuse" search={{ record: r.id }}>
                      {plan ? "Change reuse plan" : "Explore reuse ideas"}
                      <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => confirm("Delete this record permanently?") && remove(r.id)}
                  >
                    <Trash2 className="size-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {records.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportJson} className="rounded-xl text-xs">
              <Download className="size-3.5 mr-1" />
              Export JSON
            </Button>
            {sampleCount > 0 ? (
              <Button variant="outline" size="sm" onClick={clearDemo} className="rounded-xl text-xs">
                Remove sample data ({sampleCount})
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={loadDemo} className="rounded-xl text-xs">
                Load sample data
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => confirm("Delete ALL records on this device?") && clearAll()}
            className="text-xs text-destructive hover:bg-destructive/10"
          >
            Clear device storage
          </Button>
        </div>
      )}
    </Page>
  );
}
