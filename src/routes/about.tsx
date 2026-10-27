import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/SiteHeader";
import type { ReactNode } from "react";
import { Button } from '@/components/ui/button';
import { mission, EnvironmentalGoals, MaterialOpportunities, PollutionImpact } from '@/components/MissionSections';
import { BrandClarification } from '@/components/BrandLogo';

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About — Avashesh" },
      { name: "description", content: "Avashesh's pollution-prevention mission, practical agricultural residue reuse opportunities and honest environmental goals." },
      { property: "og:title", content: "About — Avashesh" },
      { property: "og:description", content: "Preventing unnecessary residue burning through accessible alternatives, with goals clearly separated from verified outcomes." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Page>
      <BrandClarification />
      <h1 className="text-2xl font-bold">About Avashesh</h1>
      <p className="text-sm italic text-muted-foreground">Avashesh (अवशेष) means "residue". Waste Less. Create More.</p>
      <Section title="Our mission">
        {mission}
      </Section>
      <Section title="The problem we want to solve">
        Open burning of agricultural residues releases smoke and particulate matter that can contribute to air pollution and harm health. Some residues are discarded despite potential reuse. Farmers need accessible, affordable and practical alternatives. We aim to make materials easier to discover, exchange and reuse, starting with Odisha.
      </Section>
      <Section title="From residues to resources">
        Farmers can list paddy straw, coconut husk and other suitable agricultural by-products. Buyers discover these materials and contact sellers about potential reuse. Practical alternatives to burning may create additional income opportunities for farmers and keep resources in use within a circular economy. Suitability depends on material quality, local facilities and safety requirements. Our long-term goal is to contribute to cleaner air and less agricultural waste; these benefits have not yet been verified.
      </Section>
      <Section title="What works today">
        <ul className="list-disc pl-5">
          <li>Recording waste type, quantity, district and current handling</li>
          <li>Reuse suggestions from a fixed set of rules (not AI) — each one shows why it was suggested</li>
          <li>A dashboard with totals and a breakdown by waste type</li>
          <li>Viewing, exporting and deleting records, saved on your device</li>
          <li>Farmer and Buyer accounts, shared published listings and private inquiries</li>
          <li>Public district/state with full location shared only after a Buyer inquiry</li>
        </ul>
      </Section>
      <Section title="Future plans">
        <ul className="list-disc pl-5">
          <li>Talk to farmers and local groups in Odisha to check and improve the suggestions</li>
          <li>Odia language support</li>
          <li>Verified collection/reuse reporting and documented disposal alternatives</li>
          <li>A list of real local reuse units, only after we verify them</li>
        </ul>
      </Section>
      <Section title="Honest limits">
        This is a student prototype by Team Avashesh. No verified partnerships, transactions, pollution reductions or income gains are claimed. Fictional sample records are marked SAMPLE and are never presented as marketplace stock. Local dashboard emission figures are planning estimates from published factors, not measured or verified outcomes. AI identification, price appraisal, GPS logistics, QR tracking and multilingual support are not implemented.
      </Section>
      <EnvironmentalGoals/><MaterialOpportunities/><PollutionImpact/>
      <Button asChild><Link to="/record">Record waste</Link></Button>
    </Page>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-4 text-sm">
      <h2 className="mb-1 font-semibold">{title}</h2>
      {children}
    </section>
  );
}
