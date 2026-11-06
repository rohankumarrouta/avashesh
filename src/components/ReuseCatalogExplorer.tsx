import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { REUSE_PATHWAYS, type ReusePathway } from "@/data/reuse-catalog-data";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  Layers,
  TrendingUp,
  Wind,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Tag,
  Sprout,
  Flame,
  Package,
  Milk,
  Scissors,
  Cpu,
} from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Pathways", icon: Layers },
  { id: "Mushroom Cultivation", label: "Mushroom Cultivation", icon: Sprout },
  { id: "Biomass Energy", label: "Biomass Energy", icon: Flame },
  { id: "Packaging & Construction", label: "Packaging & Construction", icon: Package },
  { id: "Animal Husbandry", label: "Animal Husbandry", icon: Milk },
  { id: "Handicrafts & Textiles", label: "Handicrafts & Textiles", icon: Scissors },
  { id: "Advanced Tech", label: "Advanced Tech", icon: Cpu },
] as const;

export function ReuseCatalogExplorer() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedResidue, setSelectedResidue] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    return REUSE_PATHWAYS.filter((p) => {
      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const matchResidue =
        selectedResidue === "ALL" ||
        p.residue.toLowerCase().includes(selectedResidue.toLowerCase());
      const query = search.trim().toLowerCase();
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.residue.toLowerCase().includes(query) ||
        p.keyBenefit.toLowerCase().includes(query);

      return matchCat && matchResidue && matchQuery;
    });
  }, [search, selectedCategory, selectedResidue]);

  return (
    <section className="space-y-6 border-t border-border pt-8">
      {/* Header and Intro */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" />
            <span>100+ Sustainable Pathways Database</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Interactive Reuse Catalog Explorer
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base max-w-2xl">
            Explore 105+ verified, scalable circular economy destinations for paddy straw, coconut husk, bagasse, and rice husk without open burning.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-xl border border-border/80 bg-card px-3 py-1.5 shadow-xs">
            <strong>{filtered.length}</strong> of {REUSE_PATHWAYS.length} pathways matched
          </span>
        </div>
      </div>

      {/* Real-Time Filter & Search Controls */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across 105+ reuse pathways, crops (paddy straw, coir, bagasse), or products..."
            className="w-full rounded-2xl border border-input bg-background/90 pl-10 pr-4 py-3 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Category Pills Switcher */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Filter className="size-3 text-primary" />
            <span>Sector Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "ALL"
                  ? REUSE_PATHWAYS.length
                  : REUSE_PATHWAYS.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleCount(12);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                      : "bg-secondary/60 text-secondary-foreground hover:bg-secondary border border-border/60"
                  }`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedstock Type Pills */}
        <div className="space-y-2 border-t border-border/50 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Tag className="size-3 text-primary" />
            <span>Target Feedstock:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "All Feedstocks" },
              { id: "Paddy Straw", label: "🌾 Paddy Straw" },
              { id: "Coconut", label: "🥥 Coconut Husk & Coir" },
              { id: "Bagasse", label: "🎋 Sugarcane Bagasse" },
              { id: "Husk", label: "🌾 Rice Mill Husk" },
            ].map((feed) => (
              <button
                key={feed.id}
                type="button"
                onClick={() => {
                  setSelectedResidue(feed.id);
                  setVisibleCount(12);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedResidue === feed.id
                    ? "bg-foreground text-background font-bold shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {feed.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Reuse Pathway Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center space-y-3">
          <p className="text-muted-foreground">No pathways matched your search or filter combination.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setSelectedResidue("ALL");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, visibleCount).map((p) => {
            const readinessColor =
              p.readiness === "Commercial Ready"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
                : p.readiness === "FPO Scale"
                  ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
                  : p.readiness === "Industrial Pilot"
                    ? "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30"
                    : "bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30";

            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Category & Readiness Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                      {p.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${readinessColor}`}
                    >
                      {p.readiness}
                    </span>
                  </div>

                  {/* Title & Residue */}
                  <div>
                    <h3 className="font-extrabold text-base text-foreground tracking-tight group-hover:text-primary transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <span className="mt-1 inline-block text-xs font-semibold text-muted-foreground">
                      Feedstock: <span className="text-foreground/90">{p.residue}</span>
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {p.summary}
                  </p>

                  {/* Telemetry Metric Badges */}
                  <div className="space-y-1.5 rounded-2xl bg-secondary/30 p-3 text-xs border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="size-3 text-emerald-600" /> Economic Value:
                      </span>
                      <strong className="text-foreground">{p.economicValue}</strong>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/40 pt-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Wind className="size-3 text-teal-600" /> Avoided Emissions:
                      </span>
                      <span className="font-bold text-primary">{p.co2Avoidance}</span>
                    </div>
                  </div>

                  {/* Key Feature */}
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground/80">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    <span className="font-medium">{p.keyBenefit}</span>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <Link
                    to="/marketplace"
                    search={{ q: p.residue.split(" ")[0] }}
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Find this residue
                    <ArrowUpRight className="size-3" />
                  </Link>
                  <Link to="/record" className="text-muted-foreground hover:text-foreground">
                    Record waste →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show More Button */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 18, filtered.length))}
            className="rounded-2xl border-primary/30 px-8 hover:bg-primary/5"
          >
            Load More Pathways ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </section>
  );
}

