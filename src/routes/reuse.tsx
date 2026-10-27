import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SampleBadge, Page } from "@/components/SiteHeader";
import { useRecords } from "@/hooks/use-records";
import { recommend, type RecommendationResult } from "@/lib/reuse-rules";
import { practiceLabel, WASTE_TYPES, wasteLabel, type WasteTypeId } from "@/lib/waste";

export const Route = createFileRoute("/reuse")({
  validateSearch: (s: Record<string, unknown>): { record?: string } =>
    typeof s["record"] === "string" ? { record: s["record"] } : {},
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Reuse suggestions — Avashesh" },
      { name: "description", content: "Rule-based ideas to reuse paddy straw, coconut husk and other farm waste." },
      { property: "og:title", content: "Reuse suggestions — Avashesh" },
      { property: "og:description", content: "Transparent, rule-based reuse ideas for agricultural waste." },
    ],
  }),
  component: ReusePage,
});

function ReusePage() {
  const { record: recordId } = Route.useSearch();
  const { records, ready, setPlan } = useRecords();
  const record = records.find((r) => r.id === recordId);

  const [type, setType] = useState<WasteTypeId>("paddy_straw");
  const [kg, setKg] = useState("500");

  if (recordId && ready && !record) {
    return (
      <Page>
        <p>That record was not found on this device. It may have been deleted.</p>
        <Link to="/reuse" search={{}} className="text-primary underline">Explore reuse ideas</Link>
      </Page>
    );
  }

  if (record) {
    const result = recommend(record.wasteType, record.quantityKg, record.practice);
    return (
      <Page>
        <div>
          <h1 className="text-2xl font-bold">Reuse options</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            For {record.quantityKg.toLocaleString("en-IN")} kg of {wasteLabel(record.wasteType).toLowerCase()} in {record.district} · {practiceLabel(record.practice)} {record.isDemo && <SampleBadge />}
          </p>
        </div>
        <Results result={result} plannedId={record.plannedReuseId} onPlan={(id) => setPlan(record.id, id)} />
        <Link to="/dashboard" className="block rounded-md border border-border bg-card py-3 text-center font-semibold">Go to dashboard</Link>
      </Page>
    );
  }

  const n = Number(kg);
  const valid = kg.trim() !== "" && Number.isFinite(n) && n > 0;
  return (
    <Page>
      <h1 className="text-2xl font-bold">Explore reuse ideas</h1>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-sm font-medium">Waste type
          <select className="mt-1 w-full rounded-md border border-input bg-card px-2 py-2" value={type} onChange={(e) => setType(e.target.value as WasteTypeId)}>
            {WASTE_TYPES.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Quantity (kg)
          <input className="mt-1 w-full rounded-md border border-input bg-card px-2 py-2" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} />
        </label>
      </div>
      {valid ? <Results result={recommend(type, n)} /> : <p className="text-sm text-destructive">Enter a quantity greater than 0.</p>}
      <p className="text-sm">Want to save this? <Link to="/record" className="text-primary underline">Record your waste</Link>.</p>
    </Page>
  );
}

function Results({ result, plannedId, onPlan }: { result: RecommendationResult; plannedId?: string | null; onPlan?: (id: string | null) => void }) {
  return (
    <div className="space-y-3">
      {result.warning && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{result.warning}</p>}
      <p className="text-xs text-muted-foreground">
        Ranked by fixed rules: +2 if it suits your quantity, +2 low / +1 medium effort, +1 if quick and the waste is usually burned. Not AI.
      </p>
      {result.suitable.map(({ option, score, reasons }, i) => {
        const planned = plannedId === option.id;
        return (
          <div key={option.id} className={`rounded-lg border bg-card p-4 ${planned ? "border-primary" : "border-border"}`}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{i + 1}. {option.title}</h2>
              <span className="shrink-0 text-xs text-muted-foreground">Score {score}</span>
            </div>
            <p className="mt-1 text-sm">{option.summary}</p>
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer text-primary">Why and how</summary>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
              <ol className="mt-2 list-decimal pl-5">{option.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </details>
            {onPlan && (
              <button onClick={() => onPlan(planned ? null : option.id)}
                className={`mt-3 w-full rounded-md py-2 text-sm font-semibold ${planned ? "border border-primary text-primary" : "bg-primary text-primary-foreground"}`}>
                {planned ? "✓ Planned — tap to undo" : "Plan this option"}
              </button>
            )}
          </div>
        );
      })}
      {result.notSuitable.length > 0 && (
        <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
          <p className="font-medium">Not suitable for this quantity:</p>
          <ul className="list-disc pl-5">{result.notSuitable.map((n) => <li key={n.option.id}>{n.option.title} — {n.reason}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
