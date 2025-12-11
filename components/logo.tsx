import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`text-xl font-bold lg:text-2xl ${className}`}>
      <span className="text-primary">Encontros</span> <span className="text-accent">Com</span>{' '}
      <span className="text-foreground">Proposito</span>
    </Link>
  );
}
