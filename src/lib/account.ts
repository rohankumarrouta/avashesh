import { z } from "zod";
import { normalizePhone } from "@/lib/marketplace";
export const credentialsSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});
export const profileSchema = z.object({
  display_name: z.string().trim().min(1).max(100),
  contact: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || normalizePhone(v) !== null, "Use a valid Indian mobile number."),
});
export const signupSchema = credentialsSchema
  .merge(profileSchema)
  .extend({ role: z.enum(["farmer", "buyer"]) });
export function safeNext(next: string): string {
  return next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.includes("\\") &&
    !next.includes(":")
    ? next
    : "";
}

/** Keep the hosted password policy authoritative; explain its rejection reasons. */
export function accountErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) return "Could not complete request.";
  const details = error as { code?: string; message?: string; reasons?: string[] };
  if (details.code === "weak_password" || /weak password/i.test(details.message ?? "")) {
    const reasons = details.reasons ?? [];
    if (reasons.includes("pwned"))
      return "This password has appeared in a known data breach. Choose a different, unique password; adding a symbol to the same password may not help.";
    if (reasons.includes("length") || reasons.includes("characters"))
      return `Password not accepted: ${details.message ?? "Use a longer password with uppercase and lowercase letters, a number and a symbol."}`;
    return "This password was rejected by account security. Try a unique password with 12 or more characters, uppercase and lowercase letters, a number and a symbol. Avoid common passwords and your name or email.";
  }
  return details.message || "Could not complete request.";
}
