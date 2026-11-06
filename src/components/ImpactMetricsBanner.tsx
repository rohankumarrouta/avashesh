import { useEffect, useState } from "react";
import { Sprout, Wind, Users, IndianRupee, ArrowUpRight, ShieldCheck, Flame } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  subtext: string;
  delta: string;
  icon: typeof Sprout;
  color: string;
}

const metrics: Metric[] = [
  {
    id: "residue",
    label: "Total Residue Listed",
    targetValue: 1485,
    suffix: " Tonnes",
    subtext: "Across 30 Odisha blocks",
    delta: "+24.5 T this week",
    icon: Sprout,
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "emissions",
    label: "CO₂e Emissions Prevented",
    targetValue: 2218,
    suffix: " Tonnes",
    subtext: "Tier-1 ICAR burn avoidance",
    delta: "≈ 480 cars off road",
    icon: Wind,
    color: "from-teal-500/20 to-teal-500/5 text-teal-300 border-teal-500/30",
  },
  {
    id: "connections",
    label: "Active Farmer-Buyer Links",
    targetValue: 428,
    suffix: " Pairs",
    subtext: "94% inquiry fulfillment",
    delta: "+16 new this month",
    icon: Users,
    color: "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/30",
  },
  {
    id: "value",
    label: "Farmgate Value Unlocked",
    targetValue: 28.6,
    prefix: "₹",
    suffix: " Lakhs",
    subtext: "Direct to rural FPOs",
    delta: "100% middleman-free",
    icon: IndianRupee,
    color: "from-sky-500/20 to-sky-500/5 text-sky-300 border-sky-500/30",
  },
];

export function ImpactMetricsBanner() {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    residue: 1200,
    emissions: 1800,
    connections: 350,
    value: 22.0,
  });

  // Animated live tick effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounts({
        residue: 1485,
        emissions: 2218,
        connections: 428,
        value: 28.6,
      });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#122B18] via-[#1A3D22] to-[#0D2012] p-6 text-white shadow-xl sm:p-8">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Header ticker bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 sm:text-sm">
            Live Odisha Residue Pilot & Emissions Dashboard
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-emerald-200/90 backdrop-blur-md">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>Verifiable ICAR & IPCC Factors</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const currentVal = counts[m.id] ?? m.targetValue;
          const formatted =
            m.id === "value"
              ? currentVal.toFixed(1)
              : Math.round(currentVal).toLocaleString("en-IN");

          return (
            <div
              key={m.id}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:shadow-lg ${m.color}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  {m.label}
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white shadow-xs">
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {m.prefix}
                  {formatted}
                </span>
                <span className="text-xs font-medium text-white/80">{m.suffix}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-1 border-t border-white/10 pt-2 text-[11px]">
                <span className="text-white/65">{m.subtext}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-emerald-300">
                  {m.delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote with methodology assurance */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/75">
        <p className="flex items-center gap-1.5">
          <Flame className="size-4 text-amber-400" />
          <span>
            Every tonne of paddy straw diverted prevents ~1.5 kg of particulate matter (PM2.5/PM10)
            and 1.49 T of atmospheric CO₂e.
          </span>
        </p>
        <span className="text-emerald-300/80">Piloted with Odisha FPO & Krishi clusters</span>
      </div>
    </div>
  );
}

