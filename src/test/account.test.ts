import { describe, expect, it } from "vitest";
import { accountErrorMessage, credentialsSchema } from "@/lib/account";

describe("Account password errors", () => {
  it("explains breached passwords separately from length", () => {
    expect(accountErrorMessage({ code: "weak_password", reasons: ["pwned"] })).toContain("known data breach");
  });
  it("preserves the hosted length requirement", () => {
    expect(accountErrorMessage({ code: "weak_password", reasons: ["length"], message: "Password should be at least 14 characters." })).toContain("14 characters");
  });
  it("preserves the hosted character requirement", () => {
    expect(accountErrorMessage({ code: "weak_password", reasons: ["characters"], message: "Password must contain a digit." })).toContain("must contain a digit");
  });
  it("does not disguise other auth errors as weak passwords", () => {
    expect(accountErrorMessage({ code: "invalid_credentials", message: "Invalid login credentials" })).toBe("Invalid login credentials");
  });
  it("retains the existing eight-character validation without imposing suggested signup rules on login", () => {
    expect(credentialsSchema.safeParse({ email: "test@example.com", password: "12345678" }).success).toBe(true);
    expect(credentialsSchema.safeParse({ email: "test@example.com", password: "1234567" }).success).toBe(false);
  });
});