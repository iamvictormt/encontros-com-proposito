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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-100 bg-white px-4 pb-safe lg:hidden">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors relative",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {isActive && (
              <span className="absolute -top-3 w-8 h-1 bg-primary rounded-full" />
            )}
            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
