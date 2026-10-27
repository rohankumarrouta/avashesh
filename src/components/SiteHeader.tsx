import { Link } from "@tanstack/react-router";

const links = [
  { to: "/listings", label: "Listings" },
  { to: "/post", label: "Post" },
  { to: "/impact", label: "Impact" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-semibold text-primary">
          Avashesh
        </Link>
        <nav className="flex gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
              activeProps={{ className: "rounded-full px-3 py-1.5 bg-secondary text-secondary-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PrototypeNotice() {
  return (
    <p className="rounded-lg bg-accent/40 px-3 py-2 text-xs text-accent-foreground">
      Prototype: sample listings are fictional. Your posts are saved only in this browser.
    </p>
  );
}
