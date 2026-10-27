import { ArrowRight, Flame, Wind, Recycle, Sprout, HandCoins, Users, Leaf, Package, Link2 } from 'lucide-react';
import story from '@/assets/pollution-reuse-story.jpg';

export const mission = 'Our mission is to reduce environmental pollution by helping prevent the unnecessary burning and dumping of agricultural waste. We connect farmers who have leftover crop residues with buyers and businesses that can reuse these materials, turning agricultural waste into valuable resources.';

export function PollutionStory() {
  return <section className="space-y-4 border-t border-border pt-6">
    <h2 className="text-xl font-bold">A better alternative to burning</h2>
    <p className="text-sm text-muted-foreground">After harvesting, paddy straw, coconut husk and other residues may be left unused. Open burning releases smoke and particulate matter that can pollute the air and harm health.</p>
    <figure><img src={story} alt="Illustration showing leftover straw, open-burning smoke and collected straw reused around crops" width={1536} height={768} loading="lazy" className="aspect-[2/1] w-full rounded-md object-cover"/><figcaption className="mt-2 text-xs text-muted-foreground">Illustrative imagery — not evidence of Avashesh activity.</figcaption></figure>
    <ol className="grid gap-4 sm:grid-cols-3">{[
      {title:'Residues left unused',text:'Useful materials can be discarded when practical options are hard to access.',icon:Flame},
      {title:'Smoke and pollution',text:'Open burning can affect the air people breathe in nearby communities.',icon:Wind},
      {title:'Collect, reuse, create value',text:'Suitable reuse offers another path for agricultural resources.',icon:Recycle},
    ].map(({title,text,icon:Icon})=><li key={title} className="space-y-2"><Icon className="size-6 text-primary" aria-hidden="true"/><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{text}</p></li>)}</ol>
    <p className="border-l-4 border-primary pl-3 text-sm">Farmers need accessible, affordable and practical alternatives—not blame. Avashesh starts by making residues and potential reuse opportunities easier to discover.</p>
  </section>;
}

export function ReuseFlow() {
  return <section className="space-y-4 border-t border-border pt-6"><h2 className="text-xl font-bold">How Avashesh can help</h2><ol className="grid gap-4 sm:grid-cols-4">{[
    {title:'List the waste',text:'Farmers list available paddy straw, coconut husk and other crop residues.',icon:Package},
    {title:'Connect with buyers',text:'Buyers and reuse-focused businesses discover materials and send inquiries.',icon:Link2},
    {title:'Enable reuse',text:'Explore suitable composting, biomass, fibre products and locally feasible uses.',icon:Recycle},
    {title:'Reduce waste burning',text:'More accessible alternatives aim to reduce avoidable burning and pollution.',icon:Leaf},
  ].map(({title,text,icon:Icon},i)=><li key={title} className="space-y-2"><div className="flex items-center gap-2 text-primary"><Icon className="size-6" aria-hidden="true"/><span className="text-xs font-semibold">0{i+1}</span>{i<3&&<ArrowRight className="ml-auto hidden size-4 sm:block" aria-hidden="true"/>}</div><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{text}</p></li>)}</ol><p className="text-xs text-muted-foreground">Avashesh facilitates connections. An inquiry or seller-marked sold listing is not proof of collection, reuse or avoided burning.</p></section>;
}

export function EnvironmentalGoals() {
  return <section className="space-y-4 border-t border-border pt-6"><div><p className="text-xs font-semibold uppercase text-primary">Goals · not measured results</p><h2 className="mt-1 text-xl font-bold">Working towards cleaner air</h2></div><ul className="grid gap-4 sm:grid-cols-2">{[
    {icon:Flame,text:'Reduce agricultural residue burning.'},
    {icon:Wind,text:'Help reduce smoke and air pollution from open burning.'},
    {icon:Recycle,text:'Encourage circular use of agricultural resources.'},
    {icon:HandCoins,text:'Help farmers discover potential additional income from residues.'},
    {icon:Users,text:'Connect waste suppliers with suitable buyers.'},
    {icon:Sprout,text:'Support cleaner villages and sustainable agricultural practices.'},
  ].map(({icon:Icon,text})=><li key={text} className="flex gap-3 text-sm"><Icon className="size-5 shrink-0 text-primary" aria-hidden="true"/>{text}</li>)}</ul></section>;
}

export function MaterialOpportunities() {
  return <section className="space-y-4 border-t border-border pt-6"><h2 className="text-xl font-bold">Materials with reuse potential</h2><dl className="divide-y divide-border text-sm">{[
    ['Paddy straw & other crop residues','Potential composting, mulching, suitable biomass or bioenergy, and animal bedding where appropriate.'],
    ['Coconut husk & suitable coconut fibres','Potential coir, gardening materials and fibre-based products.'],
    ['Other local agricultural by-products','Potential composting, suitable biomass and eco-friendly products, depending on the material.'],
  ].map(([title,text])=><div key={title} className="grid gap-2 py-3 sm:grid-cols-2"><dt className="font-semibold">{title}</dt><dd className="text-muted-foreground">{text}</dd></div>)}</dl><p className="text-xs text-muted-foreground">The correct use depends on material quality, local facilities, buyer requirements and safety standards. Reuse ideas are general, rule-based guidance—not expert approval.</p></section>;
}

export function PollutionImpact() {
  return <section className="space-y-4 border-t border-border pt-6"><div><p className="text-xs font-semibold uppercase text-primary">Environmental impact · awaiting evidence</p><h2 className="mt-1 text-xl font-bold">Track activity, verify the outcome</h2></div><p className="text-sm text-muted-foreground">No verified pollution reduction is reported. Data will appear as activity is recorded and verified.</p><dl className="divide-y divide-border text-sm">{[
    ['Agricultural waste listed (kg / tonnes)','Activity reporting pending'],
    ['Waste exchanged or collected','Verified collection reporting pending'],
    ['Waste confirmed as reused','Reuse verification pending'],
    ['Estimated burning avoided','Documented source and alternative disposal needed'],
    ['Participating farmers and buyers','Participation reporting pending'],
  ].map(([label,status])=><div key={label} className="grid gap-1 py-3 sm:grid-cols-2"><dt className="font-medium">{label}</dt><dd className="text-muted-foreground">{status}</dd></div>)}</dl><p className="border-l-4 border-primary pl-3 text-sm">Listed or sold kilograms do not automatically equal burning avoided. An estimate needs confirmed reuse, a documented source and evidence of the likely alternative disposal method.</p><p className="text-xs text-muted-foreground">The existing local dashboard shows recorded waste and a labelled planning scenario using published emission factors. A saved reuse plan is not verified reuse or measured impact; sample records are not environmental evidence.</p></section>;
}
