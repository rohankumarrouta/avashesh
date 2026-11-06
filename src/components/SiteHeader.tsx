import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { BrandLogo, BrandClarification } from "@/components/BrandLogo";
import {
  Home,
  ClipboardPlus,
  Recycle,
  ChartNoAxesCombined,
  Files,
  Info,
  ArrowUpRight,
  LogIn,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/record", label: "Record", icon: ClipboardPlus },
  { to: "/reuse", label: "Reuse", icon: Recycle },
  { to: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
  { to: "/records", label: "Records", icon: Files },
  { to: "/about", label: "About", icon: Info },
] as const;

export function SiteHeader() {
  const { user, role, logout } = useAccount();
  const [error, setError] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md transition-all">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto max-w-5xl px-4 pt-3.5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <Link
            to="/"
            aria-label="Avashesh home"
            className="min-w-0 transition-opacity hover:opacity-90"
          >
            <BrandLogo className="h-auto w-40 sm:w-48" />
          </Link>
          <div className="flex shrink-0 flex-col items-end gap-1.5 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
            {user ? (
              <>
                {role && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full shadow-xs hover:border-primary"
                  >
                    <Link to={role === "farmer" ? "/farmer" : "/buyer"}>
                      My account
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    void logout().catch(() => setError("Could not sign out. Try again."))
                  }
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full shadow-xs hover:border-primary hover:bg-primary/5"
              >
                <Link to="/auth" search={{ next: "", role: "buyer" }}>
                  <LogIn className="size-3.5" />
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <nav
          aria-label="Main navigation"
          className="-mx-4 mt-3 flex items-center gap-1.5 overflow-x-auto px-4 pb-2 text-sm sm:mx-0 sm:gap-2 sm:px-0"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground sm:text-sm"
              activeProps={{
                className:
                  "flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold shadow-xs",
              }}
            >
              <l.icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main
        id="main-content"
        className={`app-content mx-auto w-full flex-1 space-y-8 px-4 py-8 sm:px-8 sm:py-10 ${wide ? "max-w-5xl" : "max-w-3xl"}`}
      >
        {children}
      </main>
      <footer className="mt-auto border-t border-border bg-card/60 backdrop-blur-xs px-4 py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:px-8">
          <BrandClarification />
          <div className="space-y-2">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/marketplace" className="transition-colors hover:text-primary">
                Marketplace
              </Link>
              <Link to="/record" className="transition-colors hover:text-primary">
                Record waste
              </Link>
              <Link to="/dashboard" className="transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link to="/about" className="transition-colors hover:text-primary">
                About
              </Link>
            </nav>
            <p>Team Avashesh — student project. Waste Less. Create More.</p>
            <p>
              Contact: <a href="mailto:avashesh000@gmail.com" className="break-all underline underline-offset-4 transition-colors hover:text-primary">avashesh000@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SampleBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/30 border border-accent/60 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground tracking-wide">
      SAMPLE
    </span>
  );
}
