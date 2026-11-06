import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { marketField, formatPrice } from "@/components/MarketplaceShared";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import { updateCloudProfile } from "@/lib/marketplace.functions";
import { profileSchema } from "@/lib/account";
import { publicListingArea } from "@/lib/cloud-marketplace";
import { marketLabel } from "@/lib/marketplace";
import {
  User,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  Sprout,
  ShoppingBasket,
} from "lucide-react";

export function AccountDashboard({ expected }: { expected: "farmer" | "buyer" }) {
  const { user, role, profile, accountError } = useAccount(),
    client = useQueryClient(),
    saveProfile = useServerFn(updateCloudProfile);
  const [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false);

  const listings = useQuery({
    queryKey: ["own-listings", user?.id],
    enabled: !!user && role === "farmer",
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", user.id)
        .neq("status", "deleted")
        .order("created_at", { ascending: false });
      if (error) throw new Error("Could not load your listings.");
      return data;
    },
  });

  const inquiries = useQuery({
    queryKey: ["inquiries", user?.id],
    enabled: !!user && !!role,
    queryFn: async () => {
      let q = supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (role === "buyer" && user) q = q.eq("buyer_id", user.id);
      const { data, error } = await q;
      if (error) throw new Error("Could not load inquiries.");
      return data;
    },
  });

  async function action(fn: () => Promise<void>, text: string) {
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      await fn();
      setSuccess(text);
      await client.invalidateQueries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  async function update(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = profileSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) {
      setError(r.error.issues.map((i) => i.message).join(" "));
      return;
    }
    await action(async () => {
      await saveProfile({ data: r.data });
    }, "Profile updated successfully.");
  }

  if (accountError)
    return (
      <Page>
        <p role="alert" className="text-destructive font-semibold">{accountError.message}</p>
      </Page>
    );
  if (!role)
    return (
      <Page>
        <div className="animate-pulse space-y-4 rounded-3xl border border-border bg-card p-8">
          <div className="h-6 w-1/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </Page>
    );
  if (role !== expected)
    return (
      <Page>
        <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold">Role Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            This dashboard view is configured for {expected === "farmer" ? "Farmers" : "Buyers"}.
          </p>
          <Button asChild className="rounded-xl">
            <Link to={role === "farmer" ? "/farmer" : "/buyer"}>
              Open your {role === "farmer" ? "Farmer" : "Buyer"} dashboard
            </Link>
          </Button>
        </div>
      </Page>
    );

  const isFarmer = role === "farmer";

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary mb-1">
            {isFarmer ? <Sprout className="size-3.5" /> : <ShoppingBasket className="size-3.5" />}
            <span>{isFarmer ? "Farmer & Seller Portal" : "Corporate Buyer Portal"}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {isFarmer ? "Farmer Dashboard" : "Buyer Sourcing Dashboard"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Logged in as <strong>{profile?.display_name || user?.email}</strong> · Secure cloud management
          </p>
        </div>

        {isFarmer ? (
          <Button asChild size="lg" className="rounded-xl shadow-sm">
            <Link to="/marketplace/sell">
              <Plus className="size-4" />
              Post New Residue Listing
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="rounded-xl shadow-sm">
            <Link to="/marketplace">
              <ShoppingBasket className="size-4" />
              Browse Residue Stock
            </Link>
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Farmer Listings Section */}
      {isFarmer && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Your Residue Listings ({listings.data?.length ?? 0})
            </h2>
            <span className="text-xs text-muted-foreground">Farmgate availability</span>
          </div>

          {listings.isPending ? (
            <div className="animate-pulse space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-card border border-border" />
              ))}
            </div>
          ) : listings.error ? (
            <p role="alert" className="text-xs text-destructive">{listings.error.message}</p>
          ) : !listings.data?.length ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-3">
              <Sprout className="size-8 mx-auto text-muted-foreground" />
              <h3 className="font-bold text-foreground">No active listings posted yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Post your paddy straw, coconut husk or sugarcane bagasse so nearby bio-industries and mushroom growers can send inquiries.
              </p>
              <Button asChild size="sm" className="rounded-xl shadow-xs">
                <Link to="/marketplace/sell">Post your first listing</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {listings.data.map((l) => {
                const isPub = l.status === "published";
                const isDraft = l.status === "draft";
                return (
                  <div
                    key={l.id}
                    className="overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isPub
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : isDraft
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isPub ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                          <span className="capitalize">{l.status}</span>
                        </span>

                        <span className="text-xs font-bold text-foreground">
                          ₹{formatPrice(l.price)} / {l.unit}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-bold text-foreground tracking-tight">
                        {marketLabel(l.waste_type)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(l.quantity)} {l.unit} · {publicListingArea(l)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                      <Button asChild variant="outline" size="sm" className="rounded-xl text-xs flex-1">
                        <Link to="/marketplace/sell" search={{ edit: l.id }}>
                          <Edit className="size-3.5 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="rounded-xl text-xs flex-1">
                        <Link to="/marketplace/$listingId" params={{ listingId: l.id }}>
                          <ExternalLink className="size-3.5 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        className="rounded-xl text-xs text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          window.confirm("Archive/Delete this listing? It will no longer appear publicly.") &&
                          void action(async () => {
                            const { error } = await supabase
                              .from("listings")
                              .update({ status: "deleted" })
                              .eq("id", l.id)
                              .eq("seller_id", user?.id ?? "");
                            if (error) throw new Error("Could not delete listing.");
                          }, "Listing archived.")
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Inquiries Section */}
      <section className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {isFarmer ? "Received Buyer Inquiries" : "Your Procurement Inquiries"} ({inquiries.data?.length ?? 0})
          </h2>
          <span className="text-xs text-muted-foreground">Direct farmgate correspondence</span>
        </div>

        {inquiries.isPending ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-card border border-border" />
            ))}
          </div>
        ) : inquiries.error ? (
          <p role="alert" className="text-xs text-destructive">{inquiries.error.message}</p>
        ) : !inquiries.data?.length ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-2">
            <MessageSquare className="size-7 mx-auto text-muted-foreground" />
            <h3 className="font-semibold text-foreground">No inquiries received yet</h3>
            <p className="text-xs text-muted-foreground">
              {isFarmer
                ? "When buyers browse your listings and send an inquiry, their contact and pickup requests will appear here."
                : "You have not sent inquiries yet. Browse the marketplace to source agricultural residues."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.data.map((i) => (
              <div
                key={i.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <span className="font-bold text-sm text-foreground">{i.buyer_name}</span>
                    <span className="text-xs text-muted-foreground block">{i.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        i.status === "new"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                          : i.status === "read"
                            ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(i.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>

                {i.message && (
                  <p className="text-xs leading-relaxed text-foreground/90 bg-muted/40 p-3 rounded-xl border border-border/50">
                    "{i.message}"
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <Button asChild variant="link" size="sm" className="p-0 text-xs">
                    <Link to="/marketplace/$listingId" params={{ listingId: i.listing_id }}>
                      View related listing →
                    </Link>
                  </Button>

                  {isFarmer && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">Status:</span>
                      <select
                        aria-label="Inquiry status"
                        className="rounded-lg border border-input bg-card px-2 py-1 text-xs font-semibold"
                        value={i.status}
                        disabled={busy}
                        onChange={(e) =>
                          void action(async () => {
                            const { error } = await supabase
                              .from("inquiries")
                              .update({ status: e.target.value })
                              .eq("id", i.id);
                            if (error) throw new Error("Could not update inquiry.");
                          }, "Inquiry status updated.")
                        }
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="closed">Closed / Fulfilled</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Private Profile Form */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">Verified Profile Details</h2>
        </div>
        <form key={profile?.id} onSubmit={update} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Display Name / FPO Name
              <input
                name="display_name"
                aria-label="Display name"
                defaultValue={profile?.display_name}
                maxLength={100}
                className={`${marketField} rounded-xl`}
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Phone / WhatsApp
              <input
                name="contact"
                aria-label="Contact number"
                defaultValue={profile?.contact}
                maxLength={30}
                className={`${marketField} rounded-xl`}
              />
            </label>
          </div>
          <Button type="submit" disabled={busy} size="sm" className="rounded-xl shadow-xs">
            {busy ? "Saving…" : "Save profile changes"}
          </Button>
        </form>
      </section>
    </Page>
  );
}
