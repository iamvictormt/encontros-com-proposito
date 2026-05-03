"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  CalendarDays, 
  Building2, 
  PackageOpen, 
  ShoppingCart,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminBottomNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
    { href: "/admin/events", label: "Eventos", icon: CalendarDays },
    { href: "/admin/venues", label: "Locais", icon: Building2 },
    { href: "/admin/brands", label: "Marcas", icon: PackageOpen },
    { href: "/admin/products", label: "Loja", icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 flex h-16 items-center justify-between rounded-[2rem] glass-dark px-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] lg:hidden border border-white/20 backdrop-blur-2xl">
      {navLinks.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 relative py-1 rounded-2xl",
              isActive ? "text-brand-orange" : "text-white/30 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4 transition-all duration-500", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(255,29,85,0.4)]")} />
            <span className={cn(
              "text-[7px] font-black uppercase tracking-[0.15em] transition-all",
              isActive ? "opacity-100" : "opacity-40"
            )}>
              {link.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-orange rounded-full shadow-[0_0_15px_#FF1D55]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
