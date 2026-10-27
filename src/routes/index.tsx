import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { Sprout, Tractor } from "lucide-react";
import { useAccount } from "@/hooks/use-account";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Avashesh — Waste Less. Create More." },
      { name: "description", content: "Record agricultural waste like paddy straw and coconut husk, and find practical ways to reuse it instead of burning it." },
      { property: "og:title", content: "Avashesh — Waste Less. Create More." },
      { property: "og:description", content: "A student project to help reuse agricultural waste in Odisha." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, role } = useAccount();
  const navigate = useNavigate();
  useEffect(() => { if (!user || !role) return; const next = window.sessionStorage.getItem("avashesh.auth-next"); if (!next) return; window.sessionStorage.removeItem("avashesh.auth-next"); if (next === "/marketplace/sell" && role === "farmer") void navigate({ to: "/marketplace/sell" }); else if (next.startsWith("/marketplace/") && next !== "/marketplace/sell") void navigate({ to: "/marketplace/$listingId", params: { listingId: next.split("/")[2] ?? "" } }); }, [user, role, navigate]);
  return (
    <Page>
      <img src={hero} alt="Paddy straw bales in a harvested field" width={1280} height={960} className="aspect-[16/9] w-full rounded-lg object-cover" />
      <div>
        <h1 className="text-3xl font-bold">Waste Less. Create More.</h1>
        <p className="mt-2 text-muted-foreground">
          Avashesh helps you record agricultural waste — like paddy straw and coconut husk — and see simple ways to reuse it instead of burning or throwing it away.
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Turn Agricultural Waste Into Opportunity</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="flex flex-col items-start gap-3 rounded-md border border-border bg-card p-5">
            <Sprout className="size-9 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">BUY AGRICULTURAL WASTE</h3>
            <p className="text-sm text-muted-foreground">Find agricultural waste and raw materials available from farmers.</p>
            <Button asChild className="mt-auto w-full"><Link to="/marketplace">Buy Waste</Link></Button>
          </article>
          <article className="flex flex-col items-start gap-3 rounded-md border border-primary bg-secondary p-5">
            <Tractor className="size-9 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">SELL AGRICULTURAL WASTE</h3>
            <p className="text-sm text-muted-foreground">List your paddy straw, coconut husk and other agricultural waste for buyers.</p>
            <Button asChild className="mt-auto w-full">{user ? <Link to="/marketplace/sell">Sell Waste</Link> : <Link to="/auth" search={{next:"/marketplace/sell",role:"farmer"}}>Sell Waste</Link>}</Button>
          </article>
        </div>
      </section>
      <div className="grid gap-2 sm:grid-cols-3">
        <Link to="/record" className="rounded-md bg-primary px-4 py-3 text-center font-semibold text-primary-foreground">Record waste</Link>
        <Link to="/reuse" className="rounded-md border border-border bg-card px-4 py-3 text-center font-semibold">Explore reuse ideas</Link>
        <Link to="/dashboard" className="rounded-md border border-border bg-card px-4 py-3 text-center font-semibold">View dashboard</Link>
        <Link to="/about" className="rounded-md border border-border bg-card px-4 py-3 text-center font-semibold sm:col-span-3">About the project</Link>
      </div>
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-semibold">How it works</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          <li>Enter the waste type, quantity and your district.</li>
          <li>See reuse options, ranked by simple rules (quantity and effort) — the reasons are shown for each.</li>
          <li>Pick a plan and track everything you recorded on the dashboard.</li>
        </ol>
      </section>
      <section className="rounded-lg border border-border bg-muted p-4 text-sm">
        <h2 className="font-semibold">The problem</h2>
        <p className="mt-1">
          Farmers produce a lot of paddy straw, coconut husk and other residue. Much of it is burned or left unused because people don't always know the options. We are starting with Odisha and want to improve the tool based on what farmers actually need. This is an early prototype: suggestions come from fixed rules, not AI, and we have not yet worked with any farmers, buyers or partner organisations.
        </p>
        <p className="mt-2 text-muted-foreground">Your records are saved only on this device (in your browser).</p>
      </section>
    </Page>
  );
}
