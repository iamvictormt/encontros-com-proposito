"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PieChart,
  Users,
  Settings,
  Building2,
  CalendarDays,
  PackageOpen,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const menuSections = [
  {
    items: [
      { icon: LayoutGrid, label: "Visão Geral", href: "/admin" },
      { icon: CalendarDays, label: "Eventos", href: "/admin/events" },
      { icon: Building2, label: "Locais & Empresas", href: "/admin/venues" },
      { icon: PackageOpen, label: "Marcas parceiras", href: "/admin/brands" },
      { icon: ShoppingCart, label: "Loja & Produtos", href: "/admin/products" },
      { icon: PieChart, label: "Relatórios", href: "/admin/reports" },
      { icon: Users, label: "Equipe & Cargos", href: "/admin/team" },
    ],
  },
  {
    items: [{ icon: Settings, label: "Configurações", href: "/admin/settings" }],
    borderTop: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-72 border-r glass flex-col h-screen sticky top-0 hidden lg:flex z-50">
      <div className="p-8">
        <Logo href="/admin" />
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col">
        <div className="h-px bg-brand-green/10 mb-6" />
        <div className="flex-1">
          {menuSections.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className={cn("py-2", section.borderTop && "border-t border-brand-green/10 mt-4")}
            >
              <div className="space-y-2 py-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                        isActive 
                          ? "bg-brand-green text-white shadow-lg shadow-brand-green/20" 
                          : "text-brand-black/60 hover:text-brand-green hover:bg-brand-green/5",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-brand-orange" : "text-brand-green/40 group-hover:text-brand-green",
                        )}
                      />
                      <span className="tracking-[0.1em]">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="py-4 border-t border-brand-green/10 mt-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 text-brand-red hover:bg-brand-red/5 w-full cursor-pointer">
                <LogOut className="w-5 h-5" />
                <span className="tracking-[0.1em]">Sair do Painel</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass border-brand-green/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter text-brand-black">Deseja realmente sair?</AlertDialogTitle>
                <AlertDialogDescription className="text-brand-black/60 font-medium">
                  Sua sessão será encerrada e você precisará fazer login novamente para acessar o
                  painel administrativo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-brand-green/10 font-bold uppercase tracking-widest text-[10px]">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={logout}
                  className="bg-brand-red hover:bg-brand-red/90 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-brand-red/20"
                >
                  Sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </nav>
    </aside>
  );
}
