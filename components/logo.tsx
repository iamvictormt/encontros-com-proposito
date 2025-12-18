import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className = '', href = '/' }: LogoProps) {
  return (
    <Link href={href} className={`text-xl font-bold lg:text-2xl ${className}`}>
      <Image src={'/meet-off.png'} className="w-60 h-auto" width={10} height={10} alt="Logo meetoff" />
    </Link>
  );
}
