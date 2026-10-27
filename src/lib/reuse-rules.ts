/**
 * Rule-based reuse recommendation engine. No AI or machine learning.
 * Every score comes from the fixed rules below, and each match is returned
 * as a human-readable reason so users can see why an option is shown.
 */
import { wasteLabel, type PracticeId, type WasteTypeId } from "@/lib/waste";

export type Effort = "low" | "medium" | "high";
export type Scale = "small" | "medium" | "large";

export interface ReuseOption {
  id: string;
  title: string;
  wasteTypes: WasteTypeId[];
  summary: string;
  steps: string[];
  effort: Effort;
  /** Hard minimum below which the option is not practical. */
  minKg: number;
  /** Quantity scales this option suits best. */
  bestScales: Scale[];
  /** Can be done quickly, so it helps when the alternative is burning. */
  quick: boolean;
}

export const SCALE_LIMITS = { smallBelowKg: 200, largeFromKg: 2000 } as const;

export function scaleOf(kg: number): Scale {
  if (kg < SCALE_LIMITS.smallBelowKg) return "small";
  if (kg >= SCALE_LIMITS.largeFromKg) return "large";
  return "medium";
}

export const REUSE_OPTIONS: ReuseOption[] = [
  {
    id: "mulch", title: "Mulching",
    wasteTypes: ["paddy_straw", "coconut_husk", "sugarcane_bagasse", "groundnut_shells"],
    summary: "Spread as a layer on soil to hold moisture and reduce weeds.",
    steps: ["Chop or loosen the material", "Spread 5–10 cm around plants or on beds", "Top up as it breaks down"],
    effort: "low", minKg: 0, bestScales: ["small", "medium"], quick: true,
  },
  {
    id: "compost", title: "Composting",
    wasteTypes: ["paddy_straw", "sugarcane_bagasse", "groundnut_shells", "banana_pseudostem", "vegetable_waste"],
    summary: "Mix with cow dung or green waste and let it decompose into manure.",
    steps: ["Make a pit or heap", "Layer waste with dung/green matter", "Keep moist and turn every 2–3 weeks", "Use after 2–4 months"],
    effort: "medium", minKg: 0, bestScales: ["small", "medium", "large"], quick: false,
  },
  {
    id: "vermicompost", title: "Vermicomposting",
    wasteTypes: ["vegetable_waste", "banana_pseudostem", "paddy_straw"],
    summary: "Use earthworms to turn soft waste into vermicompost.",
    steps: ["Set up a shaded bed or tank", "Add partly decomposed waste and worms", "Keep moist", "Harvest in about 2 months"],
    effort: "medium", minKg: 20, bestScales: ["small", "medium"], quick: false,
  },
  {
    id: "mushroom", title: "Paddy straw mushroom growing",
    wasteTypes: ["paddy_straw"],
    summary: "Use straw bundles as the growing bed for paddy straw mushrooms.",
    steps: ["Soak straw bundles", "Arrange in beds and add spawn", "Keep humid and shaded", "Harvest in a few weeks"],
    effort: "medium", minKg: 50, bestScales: ["small", "medium"], quick: false,
  },
  {
    id: "fodder_bedding", title: "Cattle fodder or bedding",
    wasteTypes: ["paddy_straw", "groundnut_shells"],
    summary: "Use as dry fodder (with other feed) or as bedding in cattle sheds.",
    steps: ["Store dry and away from rain", "Chop before feeding", "Used bedding can go to compost"],
    effort: "low", minKg: 0, bestScales: ["small", "medium"], quick: true,
  },
  {
    id: "incorporate", title: "Mix into the soil",
    wasteTypes: ["paddy_straw", "sugarcane_bagasse"],
    summary: "Chop and plough the residue back into the field instead of burning it.",
    steps: ["Chop residue", "Plough or rotavate into soil", "Allow time to decompose before sowing"],
    effort: "medium", minKg: 0, bestScales: ["medium", "large"], quick: true,
  },
  {
    id: "coir", title: "Coir fibre products",
    wasteTypes: ["coconut_husk"],
    summary: "Husk can be processed into coir fibre for rope, mats and brushes.",
    steps: ["Collect and keep husk dry", "Find a coir unit or self-help group nearby", "Sell or process into fibre"],
    effort: "high", minKg: 100, bestScales: ["medium", "large"], quick: false,
  },
  {
    id: "cocopeat", title: "Cocopeat for gardening",
    wasteTypes: ["coconut_husk"],
    summary: "Ground husk pith makes cocopeat, a potting and seedling medium.",
    steps: ["Shred or grind husk", "Soak and wash", "Dry and use in pots or nursery trays"],
    effort: "medium", minKg: 0, bestScales: ["small", "medium"], quick: false,
  },
  {
    id: "banana_fibre", title: "Banana fibre extraction",
    wasteTypes: ["banana_pseudostem"],
    summary: "Fibre from banana stems can be used for ropes, crafts and handmade paper.",
    steps: ["Cut stems into strips", "Extract fibre by hand or machine", "Dry in shade"],
    effort: "high", minKg: 100, bestScales: ["medium", "large"], quick: false,
  },
  {
    id: "biogas", title: "Biogas feed",
    wasteTypes: ["vegetable_waste", "banana_pseudostem"],
    summary: "Soft wet waste can be added to a biogas plant along with dung.",
    steps: ["Chop into small pieces", "Mix with dung slurry", "Feed in small daily amounts"],
    effort: "medium", minKg: 10, bestScales: ["small", "medium"], quick: false,
  },
  {
    id: "briquettes", title: "Fuel briquettes",
    wasteTypes: ["groundnut_shells", "sugarcane_bagasse", "coconut_husk"],
    summary: "Dry shells and bagasse can be pressed into briquettes for cleaner fuel.",
    steps: ["Dry the material", "Find a briquetting unit", "Supply in bulk"],
    effort: "high", minKg: 500, bestScales: ["large"], quick: false,
  },
  {
    id: "biomass_supply", title: "Bulk biomass supply",
    wasteTypes: ["paddy_straw", "sugarcane_bagasse"],
    summary: "Large amounts may be baled and supplied to biomass or board units, if one exists nearby.",
    steps: ["Check if any unit nearby buys residue (we don't list any yet)", "Bale and store dry", "Arrange transport"],
    effort: "high", minKg: 2000, bestScales: ["large"], quick: false,
  },
];

const EFFORT_POINTS: Record<Effort, number> = { low: 2, medium: 1, high: 0 };

export interface Recommendation {
  option: ReuseOption;
  score: number;
  reasons: string[];
}

export interface RecommendationResult {
  suitable: Recommendation[];
  notSuitable: { option: ReuseOption; reason: string }[];
  warning: string | null;
}

/**
 * Rules:
 * 1. Only options for the chosen waste type are considered.
 * 2. Quantity below an option's minimum → "not suitable now".
 * 3. +2 if the quantity scale matches the option's best scales.
 * 4. +2 for low effort, +1 for medium effort.
 * 5. +1 if the waste is usually burned and the option is quick.
 * Ties are sorted by title.
 */
export function recommend(wasteType: WasteTypeId, quantityKg: number, practice: PracticeId = "unsure"): RecommendationResult {
  const scale = scaleOf(quantityKg);
  const suitable: Recommendation[] = [];
  const notSuitable: RecommendationResult["notSuitable"] = [];

  for (const option of REUSE_OPTIONS) {
    if (!option.wasteTypes.includes(wasteType)) continue;
    if (quantityKg < option.minKg) {
      notSuitable.push({ option, reason: `Needs at least ${option.minKg.toLocaleString("en-IN")} kg.` });
      continue;
    }
    let score = 0;
    const reasons = [`Works with ${wasteLabel(wasteType).toLowerCase()}.`];
    if (option.bestScales.includes(scale)) {
      score += 2;
      reasons.push(`Suits a ${scale} quantity (${quantityKg.toLocaleString("en-IN")} kg).`);
    }
    score += EFFORT_POINTS[option.effort];
    reasons.push(`${option.effort[0]!.toUpperCase()}${option.effort.slice(1)} effort.`);
    if (practice === "burning" && option.quick) {
      score += 1;
      reasons.push("Quick to do, so it can replace burning before the next crop.");
    }
    suitable.push({ option, score, reasons });
  }

  suitable.sort((a, b) => b.score - a.score || a.option.title.localeCompare(b.option.title));
  const warning =
    practice === "burning"
      ? "Open burning causes smoke and air pollution and wastes nutrients. Try one of the options below instead."
      : null;
  return { suitable, notSuitable, warning };
}

export function optionById(id: string | null): ReuseOption | undefined {
  return id ? REUSE_OPTIONS.find((o) => o.id === id) : undefined;
}
