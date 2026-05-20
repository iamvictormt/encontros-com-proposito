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
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function AdminBottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    setShowLabel(true);
    const timer = setTimeout(() => {
      setShowLabel(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const navLinks = [
    { href: "/administracao", label: "Geral", icon: LayoutGrid, exact: true },
    { href: "/administracao/eventos", label: "Eventos", icon: CalendarDays },
    { href: "/administracao/locais", label: "Locais", icon: Building2 },
    { href: "/administracao/produtos", label: "Loja", icon: ShoppingCart },
  ];

  const moreLinks = [
    { href: "/administracao/marcas", label: "Marcas", icon: PackageOpen },
    { href: "/administracao/solicitacoes-cartao", label: "Cartões", icon: CreditCard },
    { href: "/administracao/pedidos-premium", label: "Pedidos", icon: PackageOpen },
    { href: "/administracao/verificacoes", label: "Verificações", icon: Users },
    { href: "/administracao/equipe", label: "Equipe", icon: Users },
    { href: "/administracao/relatorios", label: "Relatórios", icon: PieChart },
    { href: "/administracao/assinaturas", label: "Planos", icon: CreditCard },
    { href: "/administracao/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] lg:hidden w-fit max-w-[95vw]">
        <nav className="flex items-center gap-1 p-2 rounded-full bg-brand-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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
                  "relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-500",
                  isActive ? "text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-brand-green rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-in zoom-in duration-300" />
                )}
                <Icon className={cn("relative z-10 h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                
                {isActive && showLabel && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-black text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/10 shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}

          <button 
            onClick={() => setIsMoreOpen(true)}
            className="relative flex items-center justify-center h-12 w-12 rounded-full text-white/40 hover:text-white/60 transition-all"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </nav>
      </div>

      <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <SheetContent 
          side="bottom" 
          className="z-[101] bg-brand-black border-t border-white/10 rounded-t-[2.5rem] p-0 overflow-hidden text-white outline-none"
        >
          <SheetHeader className="p-8 border-b border-white/5">
            <SheetTitle className="text-white text-left font-black uppercase tracking-[0.3em] text-xs">
              Menu Administrativo
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
                      ? "bg-white/10 border-brand-green text-white shadow-xl shadow-brand-green/10" 
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-6 w-6", isActive ? "text-brand-green" : "text-white/40")} />
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
