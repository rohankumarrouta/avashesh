import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { BrandLogo, BrandClarification } from '@/components/BrandLogo';

const links = [
  { to: "/", label: "Home" },
  { to: "/record", label: "Record" },
  { to: "/reuse", label: "Reuse" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/records", label: "Records" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const { user, role, logout } = useAccount();
  const [error, setError] = useState("");
  const isHome = useRouterState({ select: (s) => s.location.pathname === "/" });
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-3xl px-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between"><Link to="/" aria-label="Avashesh home" className="min-w-0">
          {isHome ? <BrandLogo className="h-9 w-auto sm:h-11" /> : <>
            <span className="block text-xl font-bold tracking-[0.18em] text-primary">AVASHESH</span>
            <span className="block text-[11px] text-muted-foreground">Waste Less. Create More.</span>
          </>}
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-sm">{user ? <>
          {role && <Link to={role === "farmer" ? "/farmer" : "/buyer"} className="text-primary underline">My account</Link>}
          <Button variant="ghost" size="sm" onClick={() => void logout().catch(() => setError("Could not sign out. Try again."))}>Sign out</Button>
        </> : <Link to="/auth" search={{ next: "", role: "buyer" }} className="text-primary underline">Sign in</Link>}</div></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <nav className="-mx-1 mt-1 flex flex-wrap text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="border-b-2 border-transparent px-1.5 py-2 text-muted-foreground"
              activeProps={{ className: "border-b-2 border-primary px-1.5 py-2 font-semibold text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-3xl space-y-3 border-t border-border px-4 py-6 text-xs text-muted-foreground">
        <BrandClarification />
        <p>Team Avashesh — student project. Waste Less. Create More.</p>
      </footer>
    </div>
  );
}

export function SampleBadge() {
  return <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">SAMPLE</span>;
}
