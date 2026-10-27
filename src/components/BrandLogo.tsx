import logo from '@/assets/avashesh-official-logo.jpeg.asset.json';

export function BrandLogo({ className = '', decorative = false }: { className?: string; decorative?: boolean }) {
  return <img src={logo.url} width={546} height={176} alt={decorative ? '' : 'AVASHESH — official original logo'} aria-hidden={decorative ? true : undefined} className={`h-auto max-w-full object-contain ${className}`} />;
}

export function BrandClarification() {
  return <p className="text-xs leading-relaxed text-muted-foreground">The original logo includes “AI-Powered”. This MVP currently uses fixed, rule-based reuse suggestions; AI features are not implemented.</p>;
}