import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import type { ReactNode } from "react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Avashesh" },
      { name: "description", content: "Why we started Avashesh, what it does today and what we plan next." },
      { property: "og:title", content: "About — Avashesh" },
      { property: "og:description", content: "The idea, purpose and future plans of Avashesh." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Page>
      <h1 className="text-2xl font-bold">About Avashesh</h1>
      <p className="text-sm italic text-muted-foreground">Avashesh (अवशेष) means "residue". Waste Less. Create More.</p>
      <Section title="The idea">
        In many parts of India, farmers produce large amounts of paddy straw, coconut husk and other crop residue. A lot of it can be reused, but people don't always know the options, so it gets burned or left unused.
      </Section>
      <Section title="Purpose">
        Help people record the waste they have, understand practical ways to reuse it, and see waste as a useful resource. We are starting with Odisha.
      </Section>
      <Section title="What works today">
        <ul className="list-disc pl-5">
          <li>Recording waste type, quantity, district and current handling</li>
          <li>Reuse suggestions from a fixed set of rules (not AI) — each one shows why it was suggested</li>
          <li>A dashboard with totals and a breakdown by waste type</li>
          <li>Viewing, exporting and deleting records, saved on your device</li>
        </ul>
      </Section>
      <Section title="Future plans">
        <ul className="list-disc pl-5">
          <li>Talk to farmers and local groups in Odisha to check and improve the suggestions</li>
          <li>Odia language support</li>
          <li>Optional accounts so records can be shared and backed up</li>
          <li>A list of real local reuse units, only after we verify them</li>
        </ul>
      </Section>
      <Section title="Honest limits">
        This is a student prototype. We have not partnered with any organisation, and no real farmer data is included. Sample records are clearly marked SAMPLE. Emission figures on the dashboard are estimates from published factors, not measurements.
      </Section>
      <Link to="/record" className="block rounded-md bg-primary py-3 text-center font-semibold text-primary-foreground">Record waste</Link>
    </Page>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 text-sm">
      <h2 className="mb-1 font-semibold">{title}</h2>
      {children}
    </section>
  );
}
