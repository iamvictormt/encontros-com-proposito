import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function Logo({ className = "", href = "/", onClick }: LogoProps) {
  return (
    <Link href={href} onClick={onClick} className={`text-xl font-bold lg:text-2xl ${className}`}>
      <Image
        src={"/meet-off.png"}
        className="w-60 h-auto"
        width={240}
        height={80}
        alt="Logo meetoff"
      />
    </Link>
  );
}
