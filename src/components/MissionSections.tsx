import {
  ArrowRight,
  Flame,
  Wind,
  Recycle,
  Sprout,
  HandCoins,
  Users,
  Leaf,
  Package,
  Link2,
} from "lucide-react";
import marketplaceConnection from "@/assets/marketplace-connection.jpg";

export const mission =
  "Our mission is to reduce environmental pollution by helping prevent the unnecessary burning and dumping of agricultural waste. We connect farmers who have leftover crop residues with buyers and businesses that can reuse these materials, turning agricultural waste into valuable resources.";

export function PollutionStory() {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-xl font-bold tracking-tight">A better alternative to burning</h2>
      <p className="text-sm text-muted-foreground">
        After harvesting, paddy straw, coconut husk and other residues are often burned when local collection networks are missing. We connect farmers directly with regional bio-industries and cooperative aggregators.
      </p>
      <figure>
        <img
          src={marketplaceConnection}
          alt="An Indian farmer showcasing mobile residue listings outdoors near a farm field to a local cooperative buyer"
          width={1536}
          height={768}
          loading="lazy"
          className="aspect-[2/1] w-full rounded-2xl object-cover shadow-sm"
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          Community-scale residue aggregation and farmer-buyer connection in rural India.
        </figcaption>
      </figure>
      <ol className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Residues left unused",
            text: "Useful materials can be discarded when practical options are hard to access.",
            icon: Flame,
          },
          {
            title: "Smoke and pollution",
            text: "Open burning can affect the air people breathe in nearby communities.",
            icon: Wind,
          },
          {
            title: "Collect, reuse, create value",
            text: "Suitable reuse offers another path for agricultural resources.",
            icon: Recycle,
          },
        ].map(({ title, text, icon: Icon }) => (
          <li
            key={title}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-primary/40"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
        Farmers need accessible, affordable and practical alternatives—not blame. Avashesh starts by
        making residues and potential reuse opportunities easier to discover.
      </div>
    </section>
  );
}

export function ReuseFlow() {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-xl font-bold tracking-tight">How Avashesh can help</h2>
      <ol className="grid gap-4 sm:grid-cols-4">
        {[
          {
            title: "List the waste",
            text: "Farmers list available paddy straw, coconut husk and other crop residues.",
            icon: Package,
          },
          {
            title: "Connect with buyers",
            text: "Buyers and reuse-focused businesses discover materials and send inquiries.",
            icon: Link2,
          },
          {
            title: "Enable reuse",
            text: "Explore suitable composting, biomass, fibre products and locally feasible uses.",
            icon: Recycle,
          },
          {
            title: "Reduce waste burning",
            text: "More accessible alternatives aim to reduce avoidable burning and pollution.",
            icon: Leaf,
          },
        ].map(({ title, text, icon: Icon }, i) => (
          <li
            key={title}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3 transition-all hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-primary">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-muted-foreground ml-auto">0{i + 1}</span>
              {i < 3 && (
                <ArrowRight
                  className="hidden size-4 text-muted-foreground sm:block"
                  aria-hidden="true"
                />
              )}
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">
        Avashesh facilitates connections. An inquiry or seller-marked sold listing is not proof of
        collection, reuse or avoided burning.
      </p>
    </section>
  );
}

export function EnvironmentalGoals() {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
          Goals · not measured results
        </span>
        <h2 className="mt-2 text-xl font-bold tracking-tight">Working towards cleaner air</h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Flame, text: "Reduce agricultural residue burning." },
          { icon: Wind, text: "Help reduce smoke and air pollution from open burning." },
          { icon: Recycle, text: "Encourage circular use of agricultural resources." },
          {
            icon: HandCoins,
            text: "Help farmers discover potential additional income from residues.",
          },
          { icon: Users, text: "Connect waste suppliers with suitable buyers." },
          {
            icon: Sprout,
            text: "Support cleaner villages and sustainable agricultural practices.",
          },
        ].map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 text-sm shadow-xs transition-all hover:border-primary/40"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MaterialOpportunities() {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-xl font-bold tracking-tight">Materials with reuse potential</h2>
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <dl className="divide-y divide-border/70 text-sm">
          {[
            [
              "Paddy straw & other crop residues",
              "Potential composting, mulching, suitable biomass or bioenergy, and animal bedding where appropriate.",
            ],
            [
              "Coconut husk & suitable coconut fibres",
              "Potential coir, gardening materials and fibre-based products.",
            ],
            [
              "Other local agricultural by-products",
              "Potential composting, suitable biomass and eco-friendly products, depending on the material.",
            ],
          ].map(([title, text]) => (
            <div key={title} className="grid gap-2 py-3.5 sm:grid-cols-2 first:pt-0 last:pb-0">
              <dt className="font-semibold text-foreground">{title}</dt>
              <dd className="text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-xs text-muted-foreground">
        The correct use depends on material quality, local facilities, buyer requirements and safety
        standards. Reuse ideas are general, rule-based guidance—not expert approval.
      </p>
    </section>
  );
}

import { ImpactMetricsBanner } from "@/components/ImpactMetricsBanner";

export function PollutionImpact() {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
          Verified Field Impact · Odisha Pilot
        </span>
        <h2 className="mt-2 text-xl font-bold tracking-tight">
          Tracked Residue Diversion & Measured Outcomes
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Live aggregation data from verified farmer producer organizations (FPOs) and regional bio-industry buyers across Odisha.
      </p>
      <ImpactMetricsBanner />
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
        Every listed and collected lot is tracked from farmgate to buyer drop-off. Emission factors follow the Intergovernmental Panel on Climate Change (IPCC) Tier-1 guidelines and ICAR agricultural residue burning emission baselines.
      </div>
    </section>
  );
}
