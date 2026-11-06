import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Page } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { marketField } from "@/components/MarketplaceShared";
import { accountErrorMessage, credentialsSchema, signupSchema, safeNext } from "@/lib/account";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { BrandClarification } from "@/components/BrandLogo";
export const Route = createFileRoute("/auth")({
  validateSearch: zodValidator(
    z.object({
      next: fallback(z.string(), "").default(""),
      role: fallback(z.string(), "buyer").default("buyer"),
    }),
  ),
  head: () => ({
    meta: [
      { title: "Sign in or join — Avashesh" },
      { name: "description", content: "Join Avashesh as a Farmer or Buyer." },
      { property: "og:title", content: "Sign in or join — Avashesh" },
      {
        property: "og:description",
        content: "Farmer and Buyer accounts for agricultural waste listings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});
function Auth() {
  const { next, role: chosen } = Route.useSearch();
  const { user, role } = useAccount();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    if (user && role) {
      const target = safeNext(next || window.sessionStorage.getItem("avashesh.auth-next") || "");
      window.sessionStorage.removeItem("avashesh.auth-next");
      if (target === "/marketplace/sell" && role === "farmer")
        void navigate({ to: "/marketplace/sell" });
      else if (target.startsWith("/marketplace/") && target != "/marketplace/sell")
        void navigate({
          to: "/marketplace/$listingId",
          params: { listingId: target.split("/")[2] ?? "" },
        });
      else void navigate({ to: role === "farmer" ? "/farmer" : "/buyer" });
    }
  }, [user, role, next, navigate]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const input = Object.fromEntries(new FormData(e.currentTarget));
    const parsed =
      mode === "signup"
        ? signupSchema.safeParse(input)
        : mode === "reset"
          ? z.object({ email: z.string().trim().email().max(255) }).safeParse(input)
          : credentialsSchema.safeParse(input);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(" "));
      return;
    }
    if (safeNext(next)) window.sessionStorage.setItem("avashesh.auth-next", safeNext(next));
    setBusy(true);
    try {
      if (mode === "signup") {
        const v = signupSchema.parse(input);
        const { data, error } = await supabase.auth.signUp({
          email: v.email,
          password: v.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: v.display_name, contact: v.contact, role: v.role },
          },
        });
        if (error) throw error;
        if (!data.session)
          setMessage("Check your email to confirm your account, then sign in here.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(String(input["email"]), {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setMessage("If an account exists, a password reset email will be sent.");
      } else {
        const v = credentialsSchema.parse(input);
        const { error } = await supabase.auth.signInWithPassword(v);
        if (error) throw error;
      }
    } catch (e) {
      setError(accountErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page>
      <div className="mx-auto max-w-md space-y-6 py-3">
        <h1 className="text-3xl font-semibold">
          {mode === "signup"
            ? "Join Avashesh"
            : mode === "reset"
              ? "Reset your password"
              : "Sign in"}
        </h1>
        <BrandClarification />
        <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
          <Button
            aria-pressed={mode === "login"}
            variant={mode === "login" ? "default" : "ghost"}
            onClick={() => {
              setMode("login");
              setMessage("");
              setError("");
            }}
          >
            Log in
          </Button>
          <Button
            aria-pressed={mode === "signup"}
            variant={mode === "signup" ? "default" : "ghost"}
            onClick={() => {
              setMode("signup");
              setMessage("");
              setError("");
            }}
          >
            Sign up
          </Button>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <>
              <label className="block">
                Display name
                <input name="display_name" maxLength={100} className={marketField} />
              </label>
              <label className="block">
                Contact number (optional)
                <input name="contact" type="tel" maxLength={30} className={marketField} />
              </label>
              <label className="block">
                Account type
                <select
                  name="role"
                  defaultValue={chosen === "farmer" ? "farmer" : "buyer"}
                  className={marketField}
                >
                  <option value="farmer">Farmer / Seller</option>
                  <option value="buyer">Buyer</option>
                </select>
              </label>
            </>
          )}
          <label className="block">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              maxLength={255}
              className={marketField}
            />
          </label>
          {mode !== "reset" && (
            <div>
              <label htmlFor="auth-password" className="block">Password</label>
              <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={8}
                maxLength={128}
                aria-describedby={mode === "signup" ? "password-guidance" : undefined}
                className={`${marketField} pr-12`}
              />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((shown) => !shown)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {mode === "signup" && <p id="password-guidance" className="mt-2 text-xs text-muted-foreground">Use a unique password. We recommend 12+ characters with uppercase and lowercase letters, a number and a symbol. Common or breached passwords may be rejected, even when they are long.</p>}
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="text-sm text-primary">
              {message}
            </p>
          )}
          <Button disabled={busy} type="submit" className="w-full">
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "reset"
                  ? "Send reset email"
                  : "Sign in"}
          </Button>
        </form>
        <Button variant="link" onClick={() => setMode("reset")}>
          Forgot password?
        </Button>
        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          Your account name and contact are private. Publishing a listing makes its seller name and
          supplied phone number public. Email confirmation is required.
        </p>
      </div>
    </Page>
  );
}
