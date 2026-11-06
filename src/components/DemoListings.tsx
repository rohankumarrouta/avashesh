import paddy from "@/assets/demo-paddy.jpg";
import coconut from "@/assets/demo-coconut.jpg";
import bagasse from "@/assets/demo-bagasse.jpg";
import husk from "@/assets/demo-husk.jpg";
import { MapPin, CheckCircle2, Clock, Truck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// SAMPLE ONLY: fictional demo listings with authentic daylight agricultural photography.
const demos = [
  {
    img: paddy,
    title: "Paddy Straw (Bales)",
    qty: "2,000 kg",
    price: "₹2.20 / kg",
    area: "Cuttack, Odisha",
    status: "Available",
    statusType: "available",
    pickup: "Free Farmgate Pickup",
    tags: ["Machine Baled", "Moisture < 14%"],
  },
  {
    img: coconut,
    title: "Sun-Dried Coconut Husk",
    qty: "800 kg",
    price: "₹3.50 / kg",
    area: "Puri, Odisha",
    status: "Inquiry Pending",
    statusType: "pending",
    pickup: "Commercial Delivery Available",
    tags: ["Defibered", "Coir Ready"],
  },
  {
    img: bagasse,
    title: "Sugarcane Bagasse Bales",
    qty: "1,200 kg",
    price: "₹1.80 / kg",
    area: "Bargarh, Odisha",
    status: "Available",
    statusType: "available",
    pickup: "Free Farmgate Pickup",
    tags: ["High Calorific", "Dry Stored"],
  },
  {
    img: husk,
    title: "Clean Rice Husk (Sacks)",
    qty: "500 kg",
    price: "₹4.00 / kg",
    area: "Sambalpur, Odisha",
    status: "Reserved",
    statusType: "reserved",
    pickup: "Farmgate Pickup",
    tags: ["Sack Packed", "Boiler Grade"],
  },
];

export function DemoListings() {
  return (
    <section className="space-y-4 border-t border-border pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Odisha Pilot Demonstration Listings
          </h2>
          <p className="text-xs text-muted-foreground">
            SAMPLE — Realistic representative listings showing how verified residues appear on the marketplace.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground border border-accent/40">
          <ShieldAlert className="size-3.5" /> Sample Reference Stock
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {demos.map((d) => {
          const isPending = d.statusType === "pending";
          const isReserved = d.statusType === "reserved";

          return (
            <article
              key={d.title}
              className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={d.img}
                    alt={`Photograph of ${d.title.toLowerCase()} in agricultural setting`}
                    loading="lazy"
                    width={992}
                    height={672}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Sample Tag */}
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-bold text-primary backdrop-blur-md shadow-xs border border-border/50">
                    SAMPLE
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md border shadow-xs ${isPending
                        ? "bg-amber-500/20 text-amber-200 border-amber-400/40"
                        : isReserved
                          ? "bg-sky-500/20 text-sky-200 border-sky-400/40"
                          : "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                      }`}
                  >
                    {isPending ? (
                      <Clock className="size-3" />
                    ) : isReserved ? (
                      <Truck className="size-3" />
                    ) : (
                      <CheckCircle2 className="size-3" />
                    )}
                    <span>{d.status}</span>
                  </span>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 rounded-xl bg-background/90 px-3 py-1.5 backdrop-blur-md shadow-md border border-border/60">
                    <span className="text-base font-extrabold text-foreground">{d.price}</span>
                  </div>
                </div>

                <div className="space-y-2.5 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-foreground tracking-tight">{d.title}</h3>
                    <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground shrink-0">
                      {d.qty}
                    </span>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span>{d.area}</span>
                    <span>·</span>
                    <span className="text-primary font-medium">{d.pickup}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {d.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button variant="outline" className="w-full rounded-xl" disabled>
                  Sample Item · Demo Only
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
