"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  CalendarDays, 
  Building2, 
  PackageOpen, 
  ShoppingCart,
  MoreHorizontal,
  PieChart,
  Users,
  CreditCard,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "./logo";
import { useState } from "react";

export function AdminBottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navLinks = [
    { href: "/admin", label: "Início", icon: LayoutGrid, exact: true },
    { href: "/admin/events", label: "Eventos", icon: CalendarDays },
    { href: "/admin/venues", label: "Locais", icon: Building2 },
    { href: "/admin/brands", label: "Marcas", icon: PackageOpen },
    { href: "/admin/products", label: "Loja", icon: ShoppingCart },
  ];

  const moreLinks = [
    { href: "/admin/card-requests", label: "Cartões Físicos", icon: CreditCard },
    { href: "/admin/reports", label: "Relatórios", icon: PieChart },
    { href: "/admin/team", label: "Equipe", icon: Users },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <>
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

        {/* More Button Trigger */}
        <button 
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 relative py-1 rounded-2xl text-white/30 hover:text-white cursor-pointer group"
        >
          <MoreHorizontal className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-[7px] font-black uppercase tracking-[0.15em] opacity-40">Mais</span>
        </button>
      </nav>

      {/* More Options Sheet */}
      <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <SheetContent 
          side="bottom" 
          className="z-[100] bg-brand-black border-t border-white/10 rounded-t-[2.5rem] p-0 overflow-hidden text-white outline-none"
        >
          <SheetHeader className="p-8 border-b border-white/5">
            <SheetTitle className="text-white text-left font-black uppercase tracking-[0.3em] text-xs">
              Outras Opções
            </SheetTitle>
          </SheetHeader>
          <div className="p-6 grid grid-cols-2 gap-4 pb-12">
            {moreLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-6 rounded-3xl transition-all duration-300 border",
                    isActive 
                      ? "bg-white/10 border-brand-orange text-white shadow-xl shadow-brand-orange/10" 
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-6 w-6", isActive ? "text-brand-orange" : "text-white/40")} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
