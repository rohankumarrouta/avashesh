import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ClipboardPlus,
  CheckCircle2,
  Recycle,
  Sparkles,
  ShoppingBasket,
  RotateCcw,
  Wind,
} from "lucide-react";
import { useRecords } from "@/hooks/use-records";
import { estimateAvoidedEmissions } from "@/lib/impact";
import {
  LIMITS,
  ODISHA_DISTRICTS,
  PRACTICES,
  todayISO,
  toKg,
  validateRecord,
  WASTE_TYPES,
  type PracticeId,
  type RecordInput,
  type Unit,
  type WasteTypeId,
  type WasteRecord,
} from "@/lib/waste";

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Record waste — Avashesh" },
      {
        name: "description",
        content: "Record the type and quantity of agricultural waste you have.",
      },
      { property: "og:title", content: "Record waste — Avashesh" },
      {
        property: "og:description",
        content: "Record agricultural waste and get reuse suggestions.",
      },
    ],
  }),
  component: RecordPage,
});

const field = "mt-1 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm shadow-xs";

function RecordPage() {
  const navigate = useNavigate();
  const { add } = useRecords();
  const [wasteType, setWasteType] = useState<WasteTypeId | "">("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [district, setDistrict] = useState("");
  const [date, setDate] = useState(todayISO());
  const [practice, setPractice] = useState<PracticeId | "">("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedRecord, setSavedRecord] = useState<WasteRecord | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = amount.trim() === "" ? NaN : Number(amount);
    const input = {
      wasteType,
      district,
      date,
      practice,
      notes,
      quantityKg: toKg(n, unit),
    } as RecordInput;
    const errs = validateRecord(input);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const rec = add(input);
    if (!rec) return setErrors({ form: "Could not save. Your browser may be blocking storage." });

    // Show celebratory success micro-interaction state
    setSavedRecord(rec);
  }

  function resetForm() {
    setSavedRecord(null);
    setWasteType("");
    setAmount("");
    setDistrict("");
    setDate(todayISO());
    setPractice("");
    setNotes("");
    setErrors({});
  }

  const err = (k: string) =>
    errors[k] && <p className="mt-1 text-xs font-semibold text-destructive">{errors[k]}</p>;

  // Celebratory Success Checkmark State
  if (savedRecord) {
    const impact = estimateAvoidedEmissions(savedRecord.quantityKg);
    const typeLabel =
      WASTE_TYPES.find((w) => w.id === savedRecord.wasteType)?.label ?? savedRecord.wasteType;
    const practiceLabel =
      PRACTICES.find((p) => p.id === savedRecord.practice)?.label ?? savedRecord.practice;

    return (
      <Page>
        <div className="mx-auto max-w-xl space-y-6 py-4 animate-in fade-in-50 zoom-in-95 duration-300">
          {/* Animated Success Header */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 text-center shadow-lg sm:p-8">
            <div className="relative mx-auto flex size-20 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-25" />
              <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                <CheckCircle2 className="size-10" />
              </div>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Harvest Residue Recorded!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your record is securely stored in this device's offline storage.
            </p>

            {/* Summary Details Card */}
            <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 p-5 text-left shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Material Logged
                </span>
                <span className="font-extrabold text-primary text-base">{typeLabel}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Quantity</span>
                  <span className="font-bold text-foreground">
                    {savedRecord.quantityKg.toLocaleString("en-IN")} kg
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">District</span>
                  <span className="font-bold text-foreground">{savedRecord.district}, Odisha</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Date Logged</span>
                  <span className="font-medium text-foreground">{savedRecord.date}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Usual Handling</span>
                  <span className="font-medium text-foreground">{practiceLabel}</span>
                </div>
              </div>

              {impact && (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-center gap-3">
                  <Wind className="size-5 text-emerald-600 shrink-0" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">
                      Potential Carbon Diversion:
                    </span>{" "}
                    Diverting this residue from burning avoids up to{" "}
                    <strong>{impact.totalCo2eKg.toLocaleString("en-IN")} kg CO₂e</strong>.
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-md">
                <Link to="/reuse" search={{ record: savedRecord.id }}>
                  <Recycle className="size-4" />
                  View Tailored Reuse Recommendations
                  <ArrowRight className="size-4 ml-auto" />
                </Link>
              </Button>

              <Button asChild variant="secondary" size="lg" className="rounded-xl">
                <Link to="/marketplace/sell">
                  <ShoppingBasket className="size-4" />
                  Post as Public Listing on Marketplace
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                Record Another Residue Lot
              </Button>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary shadow-xs">
          <ClipboardPlus className="size-5" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Record waste</h1>
          <p className="text-xs text-muted-foreground">
            Log farm residue on your device to discover reuse pathways and emissions avoidance.
          </p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 pt-2">
        <label className="block font-medium text-sm">
          Type of waste
          <select
            className={field}
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value as WasteTypeId)}
          >
            <option value="">Select crop residue…</option>
            {WASTE_TYPES.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
          {err("wasteType")}
        </label>

        <div>
          <span className="block font-medium text-sm">Quantity</span>
          <div className="flex gap-2">
            <input
              aria-label="Quantity"
              className={field}
              inputMode="decimal"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              aria-label="Unit"
              className={`${field} w-32`}
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
            >
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="tonne">tonne</option>
            </select>
          </div>
          {err("quantityKg")}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-medium text-sm">
            District (Odisha)
            <select
              className={field}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select Odisha district…</option>
              {ODISHA_DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {err("district")}
          </label>
          <label className="block font-medium text-sm">
            Date
            <input
              type="date"
              className={field}
              max={todayISO()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {err("date")}
          </label>
        </div>

        <fieldset>
          <legend className="font-medium text-sm">What usually happens to it?</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {PRACTICES.map((p) => (
              <label
                key={p.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-all ${
                  practice === p.id
                    ? "border-primary bg-secondary/80 font-semibold text-foreground shadow-xs"
                    : "border-border bg-card hover:border-primary/50 text-muted-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="practice"
                  checked={practice === p.id}
                  onChange={() => setPractice(p.id)}
                />
                {p.label}
              </label>
            ))}
          </div>
          {err("practice")}
        </fieldset>

        <label className="block font-medium text-sm">
          Notes (optional)
          <textarea
            className={field}
            rows={2}
            maxLength={LIMITS.maxNotes}
            placeholder="e.g. Dry baled straw, ready for immediate pickup..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {err("notes")}
        </label>

        <p className="text-xs text-muted-foreground">
          🔒 Offline privacy: Records stay strictly on this device and are never transmitted without your consent.
        </p>

        {err("form")}

        <Button type="submit" size="lg" className="w-full whitespace-normal rounded-xl shadow-md">
          <Sparkles className="size-4" />
          Save and see reuse options
          <ArrowRight />
        </Button>
      </form>
    </Page>
  );
}
