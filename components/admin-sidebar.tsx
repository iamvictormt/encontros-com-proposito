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
    <aside className="w-80 glass border-r border-white/20 flex-col h-[calc(100vh-2rem)] sticky top-4 left-4 m-4 rounded-[2.5rem] hidden lg:flex shadow-2xl z-50">
      <div className="p-10">
        <Logo href="/admin" />
      </div>

      <nav className="flex-1 overflow-y-auto px-8 pb-6 flex flex-col">
        <div className="flex-1">
          {menuSections.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className={cn("py-2", section.borderTop && "border-t border-brand-green/5 mt-6 pt-6")}
            >
              <div className="space-y-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                        isActive 
                          ? "bg-brand-black text-white shadow-xl shadow-brand-black/20" 
                          : "text-brand-black/50 hover:bg-brand-black/5 hover:text-brand-black",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                          isActive ? "text-brand-orange" : "text-brand-black/40",
                        )}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_#FF1D55]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-brand-green/5 mt-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 text-brand-black/50 hover:bg-brand-red hover:text-white hover:shadow-xl hover:shadow-brand-red/20 w-full cursor-pointer group">
                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <span>Sair do Painel</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deseja realmente sair?</AlertDialogTitle>
                <AlertDialogDescription>
                  Sua sessão será encerrada e você precisará fazer login novamente para acessar o
                  painel administrativo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white"
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
