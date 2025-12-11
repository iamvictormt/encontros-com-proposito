import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className = '', href = '/' }: LogoProps) {
  return (
    <Link href={href} className={`text-xl font-bold lg:text-2xl ${className}`}>
      <span className="text-primary">Encontros</span> <span className="text-accent">Com</span>{' '}
      <span className="text-foreground">Proposito</span>
    </Link>
  );
}
