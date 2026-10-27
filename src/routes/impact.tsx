import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { EMISSION_FACTORS_G_PER_KG, estimateAvoidedEmissions, GWP100, IMPACT_SOURCE, MAX_IMPACT_KG } from "@/lib/impact";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact calculator — Avashesh" },
      { name: "description", content: "Estimate emissions avoided when crop residue is sold instead of burned, using IPCC emission factors." },
      { property: "og:title", content: "Impact calculator — Avashesh" },
      { property: "og:description", content: "Emissions avoided by not burning crop residue, with cited IPCC factors." },
    ],
  }),
  component: ImpactPage,
});

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

function ImpactPage() {
  const [kg, setKg] = useState("1000");
  const r = kg.trim() === "" ? null : estimateAvoidedEmissions(Number(kg));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-xl space-y-5 px-4 py-8">
        <h1 className="font-display text-3xl font-semibold">Impact calculator</h1>
        <label className="block text-sm font-medium">Residue not burned (kg, dry)
          <input className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-lg" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} />
        </label>
        {r === null ? (
          <p className="text-sm text-destructive">Enter a number from 0 to {MAX_IMPACT_KG.toLocaleString("en-IN")} kg.</p>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <p className="text-sm opacity-80">Estimated CO₂-equivalent avoided</p>
              <p className="font-display text-4xl font-semibold">{fmt(r.totalCo2eKg)} kg</p>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-center text-sm">
              {[["CO₂", r.co2Kg], ["Methane", r.ch4Kg], ["N₂O", r.n2oKg]].map(([l, v]) => (
                <div key={l as string} className="rounded-xl border border-border bg-card p-3">
                  <dt className="text-muted-foreground">{l}</dt><dd className="font-semibold">{fmt(v as number)} kg</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm">Non-CO₂ gases only: <strong>{fmt(r.nonCo2Co2eKg)} kg CO₂e</strong> (the conservative figure, since inventories count crop CO₂ as biogenic).</p>
          </div>
        )}
        <section className="rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground space-y-1">
          <p><strong className="text-foreground">Method.</strong> kg × factor. Factors per kg dry matter burnt: CO₂ {EMISSION_FACTORS_G_PER_KG.co2} g, CH₄ {EMISSION_FACTORS_G_PER_KG.ch4} g, N₂O {EMISSION_FACTORS_G_PER_KG.n2o} g. GWP-100: CH₄ {GWP100.ch4}, N₂O {GWP100.n2o}.</p>
          <p><strong className="text-foreground">Source.</strong> {IMPACT_SOURCE}</p>
          <p><strong className="text-foreground">Assumes</strong> the residue would otherwise be fully burned in the open. This is an estimate, not a measurement, and ignores emissions from transport or reuse.</p>
        </section>
      </main>
    </div>
  );
}
