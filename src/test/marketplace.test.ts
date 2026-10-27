import { describe, expect, it } from "vitest";
import { addInquiry, addListing, deleteListing, filterListings, initialMarketplace, inquiryInputSchema, listingInputSchema, normalizePhone, parseMarketplace, pricePerKg, sellerLinks } from "@/lib/marketplace";

const input = { sellerName: "Test seller", contact: "+91 90000 00000", wasteType: "paddy_straw", quantity: 5, unit: "quintal", price: 250, location: "Cuttack", description: "Dry straw for demo testing", photo: "" };
const now = "2026-10-27T17:19:00.000Z";
const inquiry = { buyerName: "Test buyer", contact: "buyer@example.test", message: "Interested in the straw" };
function withListing() { return addListing(initialMarketplace("owner"), input, "listing-1", now); }

describe("Marketplace demo rules", () => {
  it("creates a listing with local ownership and normalized supplied contact", () => {
    const state = withListing(); const l = state.listings[0];
    expect(l).toMatchObject({ id: "listing-1", ownerId: "owner", contact: "+919000000000", isDemo: false, quantity: 5, price: 250 });
    if (!l) throw new Error("missing listing");
    expect(pricePerKg(l)).toBe(2.5);
  });
  it("rejects zero or excessive quantity", () => {
    expect(listingInputSchema.safeParse({ ...input, quantity: 0 }).success).toBe(false);
    expect(listingInputSchema.safeParse({ ...input, quantity: 10001 }).success).toBe(false);
    expect(listingInputSchema.safeParse({ ...input, quantity: 10000 }).success).toBe(true);
  });
  it("allows free material but rejects negative or non-finite asking prices", () => {
    expect(listingInputSchema.safeParse({ ...input, price: 0 }).success).toBe(true);
    expect(listingInputSchema.safeParse({ ...input, price: -1 }).success).toBe(false);
    expect(listingInputSchema.safeParse({ ...input, price: Infinity }).success).toBe(false);
  });
  it("requires supplied valid-format seller mobile number", () => {
    expect(normalizePhone("+91 90000-00000")).toBe("+919000000000");
    for (const contact of ["", "12345", "5000000000", "javascript:alert(1)"]) expect(listingInputSchema.safeParse({ ...input, contact }).success).toBe(false);
  });
  it("bounds seller inputs and disallows empty trimmed fields", () => {
    expect(listingInputSchema.safeParse({ ...input, sellerName: " " }).success).toBe(false);
    expect(listingInputSchema.safeParse({ ...input, location: "x".repeat(121) }).success).toBe(false);
    expect(listingInputSchema.safeParse({ ...input, description: "x".repeat(1001) }).success).toBe(false);
  });
  it("rejects SVG, remote and oversized image content", () => {
    for (const photo of ["data:image/svg+xml;base64,PHN2Zz4=", "https://example.test/image.jpg", "data:image/png;base64," + "a".repeat(700001)]) expect(listingInputSchema.safeParse({ ...input, photo }).success).toBe(false);
  });
  it("ships only clearly marked fictional samples without contact actions", () => {
    const state = initialMarketplace("owner");
    expect(state.listings).toHaveLength(3);
    for (const l of state.listings) { expect(l.isDemo).toBe(true); expect(l.contact).toBe(""); expect(sellerLinks(l)).toBeNull(); }
  });
  it("builds contact links only from supplied numbers and encodes the message", () => {
    const l = withListing().listings[0]; if (!l) throw new Error("missing listing");
    expect(sellerLinks(l)?.phone).toBe("tel:+919000000000");
    expect(sellerLinks(l)?.whatsapp).toContain("https://wa.me/919000000000?text=Hello%2C");
  });
  it("searches case-insensitively by type and description", () => {
    const listings = withListing().listings;
    expect(filterListings(listings, { search: "DEMO TESTING", wasteType: "", location: "", min: "", max: "" }).map((l) => l.id)).toEqual(["listing-1"]);
  });
  it("combines type, location and normalized price filters", () => {
    const listings = withListing().listings;
    expect(filterListings(listings, { search: "", wasteType: "paddy_straw", location: "CUTTACK", min: "2.5", max: "2.5" })).toHaveLength(2);
    expect(filterListings(listings, { search: "", wasteType: "coconut_husk", location: "Puri", min: "0", max: "2.5" })).toHaveLength(0);
  });
  it("returns no matches for invalid or reversed price ranges", () => {
    for (const min of ["-1", "abc", "4"]) expect(filterListings(withListing().listings, { search: "", wasteType: "", location: "", min, max: "3" })).toEqual([]);
  });
  it("saves inquiry to a particular listing and survives serialization", () => {
    const state = addInquiry(withListing(), "listing-1", inquiry, "inquiry-1", now);
    expect(state.inquiries[0]).toMatchObject({ ...inquiry, listingId: "listing-1", id: "inquiry-1" });
    expect(parseMarketplace(JSON.stringify(state))).toEqual(state);
  });
  it("rejects inquiries for deleted or absent listings", () => {
    expect(() => addInquiry(initialMarketplace("owner"), "absent", inquiry, "i", now)).toThrow("no longer available");
  });
  it("validates buyer contact, required message and limits", () => {
    expect(inquiryInputSchema.safeParse({ ...inquiry, contact: "9000000000" }).success).toBe(true);
    expect(inquiryInputSchema.safeParse({ ...inquiry, contact: "bad" }).success).toBe(false);
    expect(inquiryInputSchema.safeParse({ ...inquiry, message: " " }).success).toBe(false);
    expect(inquiryInputSchema.safeParse({ ...inquiry, message: "x".repeat(1001) }).success).toBe(false);
  });
  it("deletes only a browser-owned listing and cascades its inquiries", () => {
    const state = addInquiry(withListing(), "listing-1", inquiry, "i", now);
    const next = deleteListing(state, "listing-1");
    expect(next.listings.some((l) => l.id === "listing-1")).toBe(false);
    expect(next.inquiries).toEqual([]);
    expect(next.listings).toHaveLength(3);
    expect(() => deleteListing(state, "sample-paddy")).toThrow();
    expect(() => deleteListing({ ...state, ownerId: "different" }, "listing-1")).toThrow();
  });
  it("revalidates inputs at the mutation boundary", () => {
    expect(() => addListing(initialMarketplace("owner"), { ...input, contact: "invalid" }, "l", now)).toThrow();
    expect(() => addInquiry(withListing(), "listing-1", { ...inquiry, message: "" }, "i", now)).toThrow();
  });
  it("reports corrupt state and never reseeds an intentionally empty marketplace", () => {
    expect(parseMarketplace("bad-json")).toBeNull();
    expect(parseMarketplace(JSON.stringify({ version: 2 }))).toBeNull();
    const empty = { ...initialMarketplace("owner"), listings: [], inquiries: [] };
    expect(parseMarketplace(JSON.stringify(empty))?.listings).toEqual([]);
  });
});