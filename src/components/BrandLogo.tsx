export function BrandLogo({ className = '', decorative = false }: { className?: string; decorative?: boolean }) {
  return <span aria-hidden={decorative ? true : undefined} className={`block text-xl font-bold text-primary ${className}`}>Avashesh</span>;
}

export function BrandClarification() {
  return <p className="text-xs leading-relaxed text-muted-foreground">Waste Less. Create More. Reuse suggestions are rule-based, not AI.</p>;
}