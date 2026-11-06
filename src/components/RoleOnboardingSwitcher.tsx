import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import farmerAppImg from "@/assets/farmer-app.jpg";
import biomassYardImg from "@/assets/biomass-yard.jpg";
import {
  Sprout,
  ShoppingBasket,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Truck,
  Leaf,
  FileCheck2,
} from "lucide-react";

export function RoleOnboardingSwitcher() {
  const [roleTab, setRoleTab] = useState<"farmer" | "buyer">("farmer");
  const { user } = useAccount();

  return (
    <section className="space-y-5">
      {/* Segmented Switcher Controls */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-border bg-muted/60 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setRoleTab("farmer")}
            className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              roleTab === "farmer"
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sprout className={`size-4 ${roleTab === "farmer" ? "text-primary" : ""}`} />
            <span>For Farmers & FPOs</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleTab("buyer")}
            className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              roleTab === "buyer"
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBasket className={`size-4 ${roleTab === "buyer" ? "text-primary" : ""}`} />
            <span>For Buyers & Industries</span>
          </button>
        </div>
      </div>

      {/* Role Content Card */}
      {roleTab === "farmer" ? (
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-card via-secondary/20 to-card p-6 shadow-md sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Col: Step details & value */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Coins className="size-3.5" />
                <span>Earn ₹1,500 – ₹3,500 / acre from crop residue</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                  Clear stubble cleanly. List in 3 steps. Earn real value.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
                  Instead of burning valuable organic matter or risking environmental penalties,
                  connect directly with verified buyers who collect paddy straw, coconut husk, and
                  bagasse straight from your field.
                </p>
              </div>

              {/* 3 Step Flow */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Snap & List",
                    desc: "Take a photo of your field stubble or bales and note estimated quantity.",
                  },
                  {
                    step: "02",
                    title: "Direct Inquiries",
                    desc: "Receive inquiries from mushroom growers, coir mills, and bio-boilers.",
                  },
                  {
                    step: "03",
                    title: "Farmgate Pickup",
                    desc: "Buyer manages transport and pays directly at agreed rates.",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-xs"
                  >
                    <span className="text-xs font-extrabold text-primary">{s.step}</span>
                    <h4 className="mt-1 font-bold text-sm text-foreground">{s.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Rural Connectivity & Accessibility Badge */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                      <PhoneCall className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Rural Connectivity Guarantee
                        </span>
                        <span className="rounded-md bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                          Offline / 2G Ready
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-foreground/90">
                        No smartphone or internet? Dial <strong>*99#</strong> (USSD) or WhatsApp / SMS your pin code to <strong>+91 94390 12345</strong> for voice-assisted Odia listing.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <MessageCircle className="size-4" />
                    <span>WhatsApp Assisted</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                  {user ? (
                    <Link to="/farmer">
                      Farmer Dashboard
                      <ArrowRight />
                    </Link>
                  ) : (
                    <Link to="/auth" search={{ next: "/farmer", role: "farmer" }}>
                      Farmer Dashboard & Listing
                      <ArrowRight />
                    </Link>
                  )}
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl hover:border-primary">
                  <Link to="/record">Record waste on device</Link>
                </Button>
              </div>
            </div>

            {/* Right Col: High-trust imagery */}
            <div className="relative overflow-hidden rounded-3xl lg:col-span-5">
              <img
                src={farmerAppImg}
                alt="Farmer in agricultural field using mobile app outdoors in natural daylight"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md transition-transform duration-500 hover:scale-105"
                width={800}
                height={600}
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 p-3.5 backdrop-blur-md border border-border/60">
                <p className="text-xs font-bold text-foreground">
                  Farmer Krushna Rout · Cuttack District
                </p>
                <p className="text-[11px] text-muted-foreground">
                  "Listed 4 quintals of paddy straw on Avashesh; collected within 36 hours for mushroom beds."
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-card via-secondary/20 to-card p-6 shadow-md sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Col: Buyer Advantages */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                <ShieldCheck className="size-3.5" />
                <span>Verified Biomass Feedstock · Clean & Dry Stored</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                  Source clean biomass, compost, and coir raw materials at scale.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
                  Direct procurement from aggregated farmer producer organizations (FPOs) across
                  Cuttack, Puri, and Bargarh. Guaranteed zero middleman markups with verifiable
                  moisture and baling specifications.
                </p>
              </div>

              {/* 3 Buyer Advantages */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Truck,
                    title: "Direct Farmgate Sourcing",
                    desc: "Coordinate bulk pickups with regional transport hubs along NH16 & NH53.",
                  },
                  {
                    icon: Leaf,
                    title: "Standardized Quality",
                    desc: "Moisture-inspected straw bales, screened coconut husks, and clean bagasse.",
                  },
                  {
                    icon: FileCheck2,
                    title: "Scope 3 ESG Assurance",
                    desc: "Verifiable CO₂e avoidance certificates for corporate sustainability reporting.",
                  },
                ].map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.title}
                      className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-xs"
                    >
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <h4 className="mt-2.5 font-bold text-sm text-foreground">{b.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Target Industries */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Serving High-Volume Bio-Industries
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Mushroom Cultivation",
                    "Coir Geotextiles & Cocopeat",
                    "Bio-Coal Briquetting",
                    "Industrial Steam Boilers",
                    "Organic Vermicompost",
                    "Pulp & Packaging",
                  ].map((ind) => (
                    <span
                      key={ind}
                      className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-foreground border border-border/70"
                    >
                      <CheckCircle2 className="size-3 text-primary" />
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                  <Link to="/marketplace">
                    Browse available residue
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl hover:border-primary">
                  <Link to="/auth" search={{ role: "buyer" }}>Register as corporate buyer</Link>
                </Button>
              </div>
            </div>

            {/* Right Col: High-trust imagery */}
            <div className="relative overflow-hidden rounded-3xl lg:col-span-5">
              <img
                src={biomassYardImg}
                alt="Modern agricultural biomass aggregation and baling yard under clear daylight"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md transition-transform duration-500 hover:scale-105"
                width={800}
                height={600}
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 p-3.5 backdrop-blur-md border border-border/60">
                <p className="text-xs font-bold text-foreground">
                  Regional Biomass Aggregation Yard · Bargarh
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Over 500 tonnes of mechanized baled straw staged for commercial bio-energy dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

