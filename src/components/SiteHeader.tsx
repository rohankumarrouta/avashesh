import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { BrandLogo, BrandClarification } from '@/components/BrandLogo';
import { Home, ClipboardPlus, Recycle, ChartNoAxesCombined, Files, Info, ArrowUpRight, LogIn } from 'lucide-react';

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
    <header className="border-b border-border bg-card">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between"><Link to="/" aria-label="Avashesh home" className="min-w-0">
          <BrandLogo className="h-auto w-44 sm:w-52" />
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-sm">{user ? <>
          {role && <Button asChild variant="outline" size="sm"><Link to={role === "farmer" ? "/farmer" : "/buyer"}>My account<ArrowUpRight /></Link></Button>}
          <Button variant="ghost" size="sm" onClick={() => void logout().catch(() => setError("Could not sign out. Try again."))}>Sign out</Button>
        </> : <Button asChild variant="outline" size="sm"><Link to="/auth" search={{ next: "", role: "buyer" }}><LogIn />Sign in</Link></Button>}</div></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <nav aria-label="Main navigation" className="-mx-4 mt-4 flex overflow-x-auto px-4 text-sm sm:mx-0 sm:gap-2 sm:px-0">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="flex min-h-12 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
              activeProps={{ className: "flex min-h-12 shrink-0 items-center gap-2 border-b-2 border-primary bg-secondary/50 px-3 font-semibold text-primary" }}
            >
              <l.icon className="size-4" aria-hidden="true" />{l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className={`app-content mx-auto space-y-6 px-4 py-8 sm:px-8 sm:py-10 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>{children}</main>
      <footer className="border-t border-border bg-card px-4 py-8 text-xs text-muted-foreground"><div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:px-8">
        <BrandClarification />
        <p>Team Avashesh — student project. Waste Less. Create More.</p>
      </div></footer>
    </div>
  );
}

export function SampleBadge() {
  return <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">SAMPLE</span>;
}
