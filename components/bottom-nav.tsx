"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, FolderOpen, Building2, CreditCard, User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/events", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: ShoppingCart },
    { href: "/member-card", label: "Card", icon: CreditCard },
    { href: "/portfolio", label: "Jobs", icon: FolderOpen },
    { href: "/account", label: "Me", icon: User },
  ];

  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] lg:hidden w-fit max-w-[95vw]">
      <nav className="flex items-center gap-1 p-2 rounded-full bg-brand-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-500",
                isActive ? "text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-red to-brand-orange rounded-full shadow-[0_0_15px_rgba(255,29,85,0.4)] animate-in zoom-in duration-300" />
              )}
              <Icon className={cn("relative z-10 h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
              
              {/* Tooltip-like label that appears only when active? Or just icons for maximum minimalism */}
              {isActive && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-black text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/10 shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
