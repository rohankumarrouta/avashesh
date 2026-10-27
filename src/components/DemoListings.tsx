import paddy from '@/assets/demo-paddy.jpg';
import coconut from '@/assets/demo-coconut.jpg';
import bagasse from '@/assets/demo-bagasse.jpg';
import husk from '@/assets/demo-husk.jpg';
import { MapPin } from 'lucide-react';

// SAMPLE ONLY: fictional demo listings with AI-generated illustrative images. Not real stock or sellers.
const demos = [
  { img: paddy, title: 'Paddy straw (bales)', qty: '2,000 kg', price: '₹2 / kg', area: 'Cuttack, Odisha' },
  { img: coconut, title: 'Coconut husk', qty: '800 kg', price: '₹3 / kg', area: 'Puri, Odisha' },
  { img: bagasse, title: 'Sugarcane bagasse', qty: '1,200 kg', price: '₹1.5 / kg', area: 'Bargarh, Odisha' },
  { img: husk, title: 'Rice husk (sacks)', qty: '500 kg', price: '₹4 / kg', area: 'Sambalpur, Odisha' },
];

export function DemoListings() {
  return (
    <section className="space-y-3 border-t border-border pt-6">
      <h2 className="text-xl font-semibold">Demo listings</h2>
      <p className="text-xs text-muted-foreground">SAMPLE — fictional examples to show how listings look. Images are AI-generated illustrations. These cannot be bought or contacted.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {demos.map(d => (
          <article key={d.title} className="overflow-hidden rounded-md border border-border bg-card">
            <div className="relative">
              <img src={d.img} alt={`AI-generated illustration of ${d.title.toLowerCase()}`} loading="lazy" width={992} height={672} className="aspect-[3/2] w-full object-cover" />
              <span className="absolute left-2 top-2 rounded bg-background/90 px-2 py-0.5 text-xs font-bold text-primary">SAMPLE</span>
            </div>
            <div className="space-y-1 p-4">
              <h3 className="font-semibold">{d.title}</h3>
              <p className="text-sm text-muted-foreground">{d.qty} · <span className="font-semibold text-foreground">{d.price}</span></p>
              <p className="flex items-center gap-1 text-sm"><MapPin className="size-4 text-primary" />{d.area}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
