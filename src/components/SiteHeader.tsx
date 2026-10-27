import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/record", label: "Record" },
  { to: "/reuse", label: "Reuse" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-3xl px-4 pt-3">
        <Link to="/" className="text-lg font-bold text-primary">
          Avashesh
        </Link>
        <nav className="-mx-1 mt-1 flex text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="border-b-2 border-transparent px-2 py-2 text-muted-foreground"
              activeProps={{ className: "border-b-2 border-primary px-2 py-2 font-semibold text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-8 text-xs text-muted-foreground">
        Avashesh — student project. Waste Less. Create More.
      </footer>
    </div>
  );
}

export function DemoBadge() {
  return <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">DEMO</span>;
}
