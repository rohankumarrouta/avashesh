import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, ArrowUpRight, CheckCircle2, TrendingUp, Layers, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DistrictPilot {
  id: string;
  name: string;
  tagline: string;
  divertedTonnes: number;
  activeFPOs: number;
  primaryCrop: string;
  mainReuse: string;
  pickupHub: string;
  status: "ACTIVE" | "EXPANDING";
  coordinates: { x: number; y: number }; // Percentage for map pin
  highlights: string[];
}

const pilotDistricts: DistrictPilot[] = [
  {
    id: "cuttack",
    name: "Cuttack",
    tagline: "Paddy Straw Baling & Mushroom Substrate Hub",
    divertedTonnes: 485,
    activeFPOs: 38,
    primaryCrop: "Paddy Straw (Baled & Loose)",
    mainReuse: "Oyster Mushroom Bedding & Bio-Briquette Pellets",
    pickupHub: "NH16 Choudwar Agro-Terminal",
    status: "EXPANDING",
    coordinates: { x: 62, y: 52 },
    highlights: [
      "Supplying 24 local mushroom spawn units across Athagarh & Banki",
      "Average pickup turn-around: 24-48 hours from listing",
      "Direct farmer earnings: ₹1,800 - ₹2,400 per acre",
    ],
  },
  {
    id: "puri",
    name: "Puri",
    tagline: "Coastal Coconut Husk & Coir Fibre Pilot",
    divertedTonnes: 342,
    activeFPOs: 26,
    primaryCrop: "Coconut Husk & Coir Pith",
    mainReuse: "Horticulture Cocopeat & Erosion-Control Geotextiles",
    pickupHub: "Sakhigopal Coconut Cluster",
    status: "ACTIVE",
    coordinates: { x: 66, y: 70 },
    highlights: [
      "Coir defibering units connected along Konark-Puri coastal corridor",
      "Zero burning of coconut husks across 14 Gram Panchayats",
      "Export-grade coir blocks packaged for greenhouse nurseries",
    ],
  },
  {
    id: "bargarh",
    name: "Bargarh",
    tagline: "Western Rice Bowl Biomass & Compost Cluster",
    divertedTonnes: 518,
    activeFPOs: 44,
    primaryCrop: "Paddy Straw & Rice Mill Husk",
    mainReuse: "Enriched Vermicompost & Industrial Bio-Boiler Feedstock",
    pickupHub: "Attabira Canal Biomass Aggregation Yard",
    status: "EXPANDING",
    coordinates: { x: 26, y: 44 },
    highlights: [
      "Heavy mechanized baling fleets deployed post-Kharif harvest",
      "Industrial tie-up with local solvent extraction & processing boilers",
      "Displaced over 780 Tonnes of open-field stubble smoke",
    ],
  },
  {
    id: "sambalpur",
    name: "Sambalpur",
    tagline: "Hirakud Valley Residue Aggregation Depot",
    divertedTonnes: 140,
    activeFPOs: 16,
    primaryCrop: "Sugarcane Bagasse & Straw",
    mainReuse: "Pelleted Livestock Fodder & Green Pulp Packaging",
    pickupHub: "Rengali Agro-Logistics Center",
    status: "ACTIVE",
    coordinates: { x: 34, y: 35 },
    highlights: [
      "Silage & pelleted cattle feed production during dry summer months",
      "Inter-district transport links to western industrial hubs",
      "Active farmer incentive program with local dairy cooperatives",
    ],
  },
];

export function OdishaPilotSummary() {
  const [selectedId, setSelectedId] = useState<string>("cuttack");
  const selected = pilotDistricts.find((d) => d.id === selectedId) ?? pilotDistricts[0];

  return (
    <section className="space-y-6 border-t border-border pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <MapPin className="size-3.5" />
            <span>Statewide Pilot Tracking</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Odisha Regional Pilot Clusters
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Active residue diversion, bailing hubs, and buyer connections across high-production
            districts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Active Pilot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" /> Expanding Hub
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Side: Interactive Stylized Map of Odisha */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-secondary/30 to-muted/40 p-6 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Odisha State Pilot Map
            </span>
            <span className="text-xs font-semibold text-primary">4 Priority Hubs</span>
          </div>

          {/* SVG Map Canvas with Glowing Nodes */}
          <div className="relative my-4 aspect-[4/3] w-full max-w-md mx-auto">
            <svg
              viewBox="0 0 400 320"
              className="h-full w-full drop-shadow-sm select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized Odisha Border Outline */}
              <path
                d="M100 40 L160 30 L220 50 L280 40 L340 70 L350 110 L330 160 L310 210 L280 270 L240 290 L180 270 L130 240 L80 190 L60 130 L70 80 Z"
                className="fill-primary/5 stroke-primary/30 stroke-2"
                strokeDasharray="4 2"
              />
              <path
                d="M110 55 C 160 40, 240 55, 300 70 C 330 100, 310 160, 290 220 C 260 260, 200 270, 150 240 C 90 200, 70 140, 85 90 Z"
                className="fill-primary/10 stroke-primary/40 stroke-1.5"
              />

              {/* Coastal Bay of Bengal indication */}
              <path
                d="M290 220 Q 320 180 340 120"
                className="stroke-sky-500/40 stroke-2"
                strokeDasharray="2 4"
              />
              <text x="310" y="240" className="fill-sky-600/60 text-[10px] font-semibold italic">
                Bay of Bengal
              </text>

              {/* Connecting logistics lines between hubs */}
              <line
                x1={`${pilotDistricts[0].coordinates.x * 3.6}`}
                y1={`${pilotDistricts[0].coordinates.y * 3}`}
                x2={`${pilotDistricts[1].coordinates.x * 3.6}`}
                y2={`${pilotDistricts[1].coordinates.y * 3}`}
                className="stroke-emerald-500/40 stroke-1"
                strokeDasharray="3 3"
              />
              <line
                x1={`${pilotDistricts[0].coordinates.x * 3.6}`}
                y1={`${pilotDistricts[0].coordinates.y * 3}`}
                x2={`${pilotDistricts[2].coordinates.x * 3.6}`}
                y2={`${pilotDistricts[2].coordinates.y * 3}`}
                className="stroke-emerald-500/40 stroke-1"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Interactive Pins on Map */}
            {pilotDistricts.map((d) => {
              const isSelected = d.id === selectedId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedId(d.id)}
                  style={{
                    left: `${d.coordinates.x}%`,
                    top: `${d.coordinates.y}%`,
                  }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 transition-all focus:outline-none ${
                    isSelected ? "z-20 scale-125" : "z-10 hover:scale-110"
                  }`}
                  aria-label={`Select ${d.name} district pilot`}
                >
                  <span className="relative flex size-4 items-center justify-center">
                    {isSelected && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex size-3.5 rounded-full border-2 border-background shadow-md transition-colors ${
                        isSelected
                          ? "bg-primary"
                          : d.status === "EXPANDING"
                            ? "bg-amber-500"
                            : "bg-emerald-600"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-1 block whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-xs transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/95 text-foreground border border-border/80 group-hover:border-primary/50"
                    }`}
                  >
                    {d.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Select Buttons */}
          <div className="mt-2 flex flex-wrap gap-2">
            {pilotDistricts.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedId(d.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedId === d.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-background text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Selected District Status Details Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-7 sm:p-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {selected.name} District
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                      selected.status === "EXPANDING"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {selected.status} PILOT
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{selected.tagline}</p>
              </div>

              <div className="text-right">
                <span className="block text-2xl font-extrabold text-primary">
                  {selected.divertedTonnes} Tonnes
                </span>
                <span className="text-xs text-muted-foreground">Residue Diverted</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="size-3.5 text-primary" /> Active FPOs
                </span>
                <span className="mt-1 block text-lg font-bold text-foreground">
                  {selected.activeFPOs} Groups
                </span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Layers className="size-3.5 text-primary" /> Primary Biomass
                </span>
                <span className="mt-1 block truncate text-xs font-bold text-foreground" title={selected.primaryCrop}>
                  {selected.primaryCrop}
                </span>
              </div>
              <div className="col-span-2 rounded-2xl border border-border/70 bg-secondary/40 p-3.5 sm:col-span-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Factory className="size-3.5 text-primary" /> Main Reuse Destination
                </span>
                <span className="mt-1 block truncate text-xs font-bold text-foreground" title={selected.mainReuse}>
                  {selected.mainReuse}
                </span>
              </div>
            </div>

            {/* Key Field Operations & Highlights */}
            <div className="mt-6 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pilot Operations & Progress
              </h4>
              <ul className="space-y-2">
                {selected.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Primary Aggregation Hub: <strong>{selected.pickupHub}</strong>
            </span>
            <Button asChild variant="outline" size="sm" className="rounded-xl hover:border-primary">
              <Link to="/marketplace" search={{ location: selected.name }}>
                View {selected.name} Listings
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
