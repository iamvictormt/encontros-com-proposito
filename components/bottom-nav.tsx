"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, FolderOpen, Building2, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/events", label: "Início", icon: Home },
    { href: "/products", label: "Produtos", icon: ShoppingCart },
    { href: "/member-card", label: "Cartão", icon: CreditCard },
    { href: "/portfolio", label: "Portfólio", icon: FolderOpen },
    { href: "/account", label: "Conta", icon: User },
  ];

  // Don't show bottom nav on admin routes or auth pages
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-50 flex h-16 sm:h-20 items-center justify-between rounded-[2rem] glass-dark px-2 sm:px-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] lg:hidden border border-white/20 backdrop-blur-2xl">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 sm:gap-2 transition-all duration-300 relative py-1 sm:py-2 rounded-2xl",
              isActive ? "text-brand-orange" : "text-white/30 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(255,29,85,0.4)]")} />
            <span className={cn(
              "text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] transition-all",
              isActive ? "opacity-100" : "opacity-40"
            )}>
              {link.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 sm:bottom-0 left-1/2 -translate-x-1/2 w-4 sm:w-8 h-0.5 sm:h-1 bg-brand-orange rounded-full shadow-[0_0_15px_#FF1D55]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
