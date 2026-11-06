import { describe, it, expect } from "vitest";
import { translate } from "@/lib/i18n";

describe("translate", () => {
  it("returns Hindi", () => expect(translate("SELL", "hi")).toBe("बेचें"));
  it("returns Odia", () => expect(translate("BUY", "or")).toBe("କିଣନ୍ତୁ"));
  it("keeps English", () => expect(translate("BUY", "en")).toBe("BUY"));
  it("falls back to English when missing", () =>
    expect(translate("Unknown text", "hi")).toBe("Unknown text"));
});
