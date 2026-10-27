import { z } from "zod";
import { normalizePhone } from "@/lib/marketplace";
export const credentialsSchema = z.object({ email: z.string().trim().email().max(255), password: z.string().min(8, "Use at least 8 characters.").max(128) });
export const profileSchema = z.object({ display_name: z.string().trim().min(1).max(100), contact: z.string().trim().max(30).refine((v) => v === "" || normalizePhone(v) !== null, "Use a valid Indian mobile number.") });
export const signupSchema = credentialsSchema.merge(profileSchema).extend({ role: z.enum(["farmer", "buyer"]) });
export function safeNext(next: string): string { return next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") && !next.includes(":") ? next : ""; }