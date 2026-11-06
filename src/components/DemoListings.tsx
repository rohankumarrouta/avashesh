import paddy from "@/assets/demo-paddy.jpg";
import coconut from "@/assets/demo-coconut.jpg";
import bagasse from "@/assets/demo-bagasse.jpg";
import husk from "@/assets/demo-husk.jpg";
import { MapPin } from "lucide-react";

// SAMPLE ONLY: fictional demo listings with AI-generated illustrative images. Not real stock or sellers.
const demos = [
  {
    img: paddy,
    title: "Paddy straw (bales)",
    qty: "2,000 kg",
    price: "₹2 / kg",
    area: "Cuttack, Odisha",
  },
  { img: coconut, title: "Coconut husk", qty: "800 kg", price: "₹3 / kg", area: "Puri, Odisha" },
  {
    img: bagasse,
    title: "Sugarcane bagasse",
    qty: "1,200 kg",
    price: "₹1.5 / kg",
    area: "Bargarh, Odisha",
  },
  {
    img: husk,
    title: "Rice husk (sacks)",
    qty: "500 kg",
    price: "₹4 / kg",
    area: "Sambalpur, Odisha",
  },
];

export function DemoListings() {
  return (
    <section className="space-y-3 border-t border-border pt-6">
      <h2 className="text-xl font-semibold">Demo listings</h2>
      <p className="text-xs text-muted-foreground">
        SAMPLE — fictional examples to show how listings look. Images are AI-generated
        illustrations. These cannot be bought or contacted.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {demos.map((d) => (
          <article
            key={d.title}
            className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="relative">
              <img
                src={d.img}
                alt={`AI-generated illustration of ${d.title.toLowerCase()}`}
                loading="lazy"
                width={992}
                height={672}
                className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-bold text-primary backdrop-blur-md shadow-xs border border-border/50">
                SAMPLE
              </span>
            </div>
            <div className="space-y-1.5 p-4 sm:p-5">
              <h3 className="font-semibold text-foreground tracking-tight">{d.title}</h3>
              <p className="text-sm text-muted-foreground">
                {d.qty} · <span className="font-semibold text-foreground">{d.price}</span>
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary shrink-0" />
                {d.area}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
