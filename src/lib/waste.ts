/** Core data model, validation and local storage for waste records. */

export const WASTE_TYPES = [
  { id: "paddy_straw", label: "Paddy straw", burnable: true },
  { id: "coconut_husk", label: "Coconut husk", burnable: true },
  { id: "sugarcane_bagasse", label: "Sugarcane bagasse / trash", burnable: true },
  { id: "groundnut_shells", label: "Groundnut shells", burnable: true },
  { id: "banana_pseudostem", label: "Banana stem (pseudostem)", burnable: false },
  { id: "vegetable_waste", label: "Vegetable / market waste", burnable: false },
] as const;
export type WasteTypeId = (typeof WASTE_TYPES)[number]["id"];

export const PRACTICES = [
  { id: "burning", label: "Usually burned" },
  { id: "left", label: "Left in the field" },
  { id: "dumped", label: "Dumped / thrown away" },
  { id: "reused", label: "Already reused" },
  { id: "unsure", label: "Not decided yet" },
] as const;
export type PracticeId = (typeof PRACTICES)[number]["id"];

export const ODISHA_DISTRICTS = [
  "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh",
  "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
  "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
  "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh",
] as const;

export type Unit = "kg" | "quintal" | "tonne";
export const UNIT_TO_KG: Record<Unit, number> = { kg: 1, quintal: 100, tonne: 1000 };

export interface WasteRecord {
  id: string;
  wasteType: WasteTypeId;
  quantityKg: number;
  district: string;
  date: string; // YYYY-MM-DD
  practice: PracticeId;
  plannedReuseId: string | null;
  notes: string;
  isDemo: boolean;
  createdAt: string;
}

export type RecordInput = Pick<WasteRecord, "wasteType" | "quantityKg" | "district" | "date" | "practice" | "notes">;

export const LIMITS = { maxKg: 1_000_000, maxNotes: 300 } as const;
export const STORAGE_KEY = "avashesh.records.v1";

export function wasteLabel(id: string): string {
  return WASTE_TYPES.find((w) => w.id === id)?.label ?? id;
}
export function practiceLabel(id: string): string {
  return PRACTICES.find((p) => p.id === id)?.label ?? id;
}
export function isBurnable(id: string): boolean {
  return WASTE_TYPES.find((w) => w.id === id)?.burnable ?? false;
}

export function toKg(amount: number, unit: Unit): number {
  return amount * UNIT_TO_KG[unit];
}

export function todayISO(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function validateRecord(input: Partial<RecordInput>, today = todayISO()): Record<string, string> {
  const e: Record<string, string> = {};
  if (!WASTE_TYPES.some((w) => w.id === input.wasteType)) e["wasteType"] = "Choose a waste type.";
  const q = input.quantityKg;
  if (typeof q !== "number" || !Number.isFinite(q) || q <= 0) e["quantityKg"] = "Enter a quantity greater than 0.";
  else if (q > LIMITS.maxKg) e["quantityKg"] = "That is more than 1,000 tonnes. Please check the amount.";
  if (!ODISHA_DISTRICTS.includes((input.district ?? "") as (typeof ODISHA_DISTRICTS)[number]))
    e["district"] = "Choose a district.";
  const d = input.date ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d))) e["date"] = "Enter a valid date.";
  else if (d > today) e["date"] = "Date cannot be in the future.";
  if (!PRACTICES.some((p) => p.id === input.practice)) e["practice"] = "Choose what usually happens to it.";
  if ((input.notes ?? "").length > LIMITS.maxNotes) e["notes"] = `Keep notes under ${LIMITS.maxNotes} characters.`;
  return e;
}

export function createRecord(input: RecordInput, now = new Date()): WasteRecord {
  return {
    ...input,
    notes: input.notes.trim(),
    id: `r-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    plannedReuseId: null,
    isDemo: false,
    createdAt: now.toISOString(),
  };
}

function isRecord(x: unknown): x is WasteRecord {
  if (!x || typeof x !== "object") return false;
  const r = x as WasteRecord;
  return (
    typeof r.id === "string" &&
    typeof r.createdAt === "string" &&
    (r.plannedReuseId === null || typeof r.plannedReuseId === "string") &&
    typeof r.notes === "string" &&
    Object.keys(validateRecord(r, "9999-12-31")).length === 0
  );
}

/** Parses stored JSON defensively; malformed entries are dropped. */
export function parseRecords(raw: string | null): WasteRecord[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(isRecord).map((r) => ({ ...r, isDemo: r.isDemo === true }));
  } catch {
    return [];
  }
}

export function loadRecords(): WasteRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return parseRecords(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Returns false if the browser blocks storage or it is full. */
export function saveRecords(records: WasteRecord[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}
