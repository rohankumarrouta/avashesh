import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Page } from "@/components/SiteHeader";
import { useRecords } from "@/hooks/use-records";
import { LIMITS, ODISHA_DISTRICTS, PRACTICES, todayISO, toKg, validateRecord, WASTE_TYPES, type PracticeId, type RecordInput, type Unit, type WasteTypeId } from "@/lib/waste";

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Record waste — Avashesh" },
      { name: "description", content: "Record the type and quantity of agricultural waste you have." },
      { property: "og:title", content: "Record waste — Avashesh" },
      { property: "og:description", content: "Record agricultural waste and get reuse suggestions." },
    ],
  }),
  component: RecordPage,
});

const field = "mt-1 w-full rounded-md border border-input bg-card px-3 py-2.5";

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

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = amount.trim() === "" ? NaN : Number(amount);
    const input = { wasteType, district, date, practice, notes, quantityKg: toKg(n, unit) } as RecordInput;
    const errs = validateRecord(input);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const rec = add(input);
    if (!rec) return setErrors({ form: "Could not save. Your browser may be blocking storage." });
    navigate({ to: "/reuse", search: { record: rec.id } });
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-destructive">{errors[k]}</p>;

  return (
    <Page>
      <h1 className="text-2xl font-bold">Record waste</h1>
      <form onSubmit={submit} noValidate className="space-y-4">
        <label className="block font-medium">Type of waste
          <select className={field} value={wasteType} onChange={(e) => setWasteType(e.target.value as WasteTypeId)}>
            <option value="">Select…</option>
            {WASTE_TYPES.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>{err("wasteType")}
        </label>
        <div>
          <span className="block font-medium">Quantity</span>
          <div className="flex gap-2">
            <input aria-label="Quantity" className={field} inputMode="decimal" placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <select aria-label="Unit" className={`${field} w-32`} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="kg">kg</option><option value="quintal">quintal</option><option value="tonne">tonne</option>
            </select>
          </div>{err("quantityKg")}
        </div>
        <label className="block font-medium">District (Odisha)
          <select className={field} value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="">Select…</option>
            {ODISHA_DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>{err("district")}
        </label>
        <label className="block font-medium">Date
          <input type="date" className={field} max={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />{err("date")}
        </label>
        <fieldset>
          <legend className="font-medium">What usually happens to it?</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {PRACTICES.map((p) => (
              <label key={p.id} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${practice === p.id ? "border-primary bg-secondary" : "border-border bg-card"}`}>
                <input type="radio" name="practice" checked={practice === p.id} onChange={() => setPractice(p.id)} />{p.label}
              </label>
            ))}
          </div>{err("practice")}
        </fieldset>
        <label className="block font-medium">Notes (optional)
          <textarea className={field} rows={2} maxLength={LIMITS.maxNotes} value={notes} onChange={(e) => setNotes(e.target.value)} />
          {err("notes")}
        </label>
        <p className="text-xs text-muted-foreground">Please don't enter your phone number or address. Saved only on this device.</p>
        {err("form")}
        <button type="submit" className="w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground">Save and see reuse options</button>
      </form>
    </Page>
  );
}
