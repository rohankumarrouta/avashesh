import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SampleBadge, Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useRecords } from "@/hooks/use-records";
import { recommend, type RecommendationResult } from "@/lib/reuse-rules";
import { practiceLabel, WASTE_TYPES, wasteLabel, type WasteTypeId } from "@/lib/waste";
import {
  Recycle,
  Sprout,
  CheckCircle2,
  ArrowRight,
  ShoppingBasket,
  ChevronDown,
  Sparkles,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/reuse")({
  validateSearch: (s: Record<string, unknown>): { record?: string } =>
    typeof s["record"] === "string" ? { record: s["record"] } : {},
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Reuse suggestions — Avashesh" },
      {
        name: "description",
        content: "Rule-based ideas to reuse paddy straw, coconut husk and other farm waste.",
      },
      { property: "og:title", content: "Reuse suggestions — Avashesh" },
      {
        property: "og:description",
        content: "Transparent, rule-based reuse ideas for agricultural waste.",
      },
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
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-3">
          <p className="text-muted-foreground">
            That record was not found on this device. It may have been cleared.
          </p>
          <Button asChild variant="outline">
            <Link to="/reuse" search={{}}>
              Explore general reuse ideas
            </Link>
          </Button>
        </div>
      </Page>
    );
  }

  if (record) {
    const result = recommend(record.wasteType, record.quantityKg, record.practice);
    return (
      <Page>
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Recycle className="size-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Tailored Reuse Pathways
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Tailored for <strong>{record.quantityKg.toLocaleString("en-IN")} kg</strong> of{" "}
            <span className="font-semibold text-foreground">{wasteLabel(record.wasteType)}</span> in{" "}
            <strong>{record.district}, Odisha</strong> · {practiceLabel(record.practice)}{" "}
            {record.isDemo && <SampleBadge />}
          </p>
        </div>

        <Results
          result={result}
          plannedId={record.plannedReuseId}
          onPlan={(id) => setPlan(record.id, id)}
        />

        {/* Sell / Marketplace callout */}
        <div className="rounded-3xl border border-primary/25 bg-secondary/30 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-foreground">Want buyers to pick up from your field?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Publish this residue on the shared marketplace to connect with mushroom growers, coir mills, and biomass boilers.
            </p>
          </div>
          <Button asChild className="rounded-xl shadow-xs">
            <Link to="/marketplace/sell">
              <ShoppingBasket className="size-4" />
              List on Marketplace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link to="/dashboard">Go to telemetry dashboard →</Link>
        </Button>
      </Page>
    );
  }

  const n = Number(kg);
  const valid = kg.trim() !== "" && Number.isFinite(n) && n > 0;
  return (
    <Page>
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Explore Circular Reuse Ideas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rule-based recommendations for crop residues without machine-learning opacity.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Waste Type
          <select
            className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs"
            value={type}
            onChange={(e) => setType(e.target.value as WasteTypeId)}
          >
            {WASTE_TYPES.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Quantity (kg)
          <input
            className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs"
            inputMode="decimal"
            placeholder="e.g. 500"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
          />
        </label>
      </div>

      {valid ? (
        <Results result={recommend(type, n)} />
      ) : (
        <p className="text-sm text-destructive font-medium">Please enter a valid quantity greater than 0 kg.</p>
      )}

      <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        Want to save this and track emissions avoidance?{" "}
        <Link to="/record" className="text-primary font-bold underline">
          Record your waste on this device
        </Link>
        .
      </div>
    </Page>
  );
}

function Results({
  result,
  plannedId,
  onPlan,
}: {
  result: RecommendationResult;
  plannedId?: string | null;
  onPlan?: (id: string | null) => void;
}) {
  return (
    <div className="space-y-4">
      {result.warning && (
        <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          <Info className="size-4 shrink-0" />
          <span>{result.warning}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Transparent fixed rule rankings (suitability, labor effort, speed)</span>
        <span className="font-semibold text-primary">Zero AI Implication</span>
      </div>

      <div className="space-y-3">
        {result.suitable.map(({ option, score, reasons }, i) => {
          const planned = plannedId === option.id;
          return (
            <div
              key={option.id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${
                planned
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40"
                  : "border-border/80 bg-card hover:border-primary/40 shadow-xs"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    0{i + 1}
                  </span>
                  <h2 className="font-bold text-lg text-foreground tracking-tight">{option.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    Score {score}
                  </span>
                  {planned && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      Current Plan
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{option.summary}</p>

              <details className="mt-3 group rounded-xl border border-border/60 bg-background/50 p-3 text-sm">
                <summary className="cursor-pointer font-semibold text-primary flex items-center justify-between text-xs">
                  <span>Why this was suggested & step-by-step guidance</span>
                  <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 space-y-2 border-t border-border/40 pt-2 text-xs">
                  <div>
                    <span className="font-bold text-foreground">Rule Matches:</span>
                    <ul className="mt-1 list-disc pl-5 text-muted-foreground space-y-0.5">
                      {reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">Implementation Steps:</span>
                    <ol className="mt-1 list-decimal pl-5 text-muted-foreground space-y-0.5">
                      {option.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </details>

              {onPlan && (
                <Button
                  type="button"
                  onClick={() => onPlan(planned ? null : option.id)}
                  variant={planned ? "outline" : "default"}
                  className={`mt-4 w-full rounded-xl font-semibold shadow-xs transition-all ${
                    planned
                      ? "border-primary text-primary hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                      : ""
                  }`}
                >
                  {planned ? "✓ Plan Adopted — Click to Remove" : "Adopt this Reuse Plan"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {result.notSuitable.length > 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 p-4 text-xs text-muted-foreground space-y-1.5">
          <p className="font-bold text-foreground">Not recommended for this specific volume:</p>
          <ul className="list-disc pl-5 space-y-1">
            {result.notSuitable.map((n) => (
              <li key={n.option.id}>
                <strong>{n.option.title}</strong> — {n.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
