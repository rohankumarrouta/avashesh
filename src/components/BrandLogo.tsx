import logo from '@/assets/avashesh-leaf-logo.png';

export function BrandLogo({ className = '', decorative = false }: { className?: string; decorative?: boolean }) {
  return <img src={logo} width={1056} height={301} alt={decorative ? '' : 'AVASHESH — leaf and reuse arrow logo'} aria-hidden={decorative ? true : undefined} className={`max-w-full object-contain ${className}`} />;
}

export function BrandClarification() {
  return <p className="text-xs leading-relaxed text-muted-foreground">Waste Less. Create More. Reuse suggestions are rule-based, not AI.</p>;
}