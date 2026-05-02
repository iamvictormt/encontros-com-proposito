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
    <nav className="fixed bottom-0 z-50 flex h-20 items-center justify-around rounded-t-xl border-t border-white/20 bg-white backdrop-blur-xl px-6 shadow-2xl shadow-black/10 lg:hidden">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative px-2",
              isActive ? "text-[#1A4B40] scale-110" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-500",
              isActive ? "bg-[#1A4B40]/5 shadow-inner" : ""
            )}>
              <Icon className={cn("h-6 w-6", isActive && "fill-[#1A4B40]/10")} />
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.1em]",
              isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            )}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
