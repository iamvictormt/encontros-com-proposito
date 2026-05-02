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
    <aside className="w-72 border-r bg-white flex-col h-screen sticky top-0 hidden lg:flex">
      <div className="p-8">
        <Logo href="/admin" />
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col">
        <div className="h-px bg-gray-100 mb-6" />
        <div className="flex-1">
          {menuSections.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className={cn("py-2", section.borderTop && "border-t border-gray-100 mt-4")}
            >
              <div className="space-y-4 py-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-bold transition-colors",
                        isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-6 h-6",
                          isActive ? "text-secondary" : "text-muted-foreground",
                        )}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="py-2 border-t border-gray-100 mt-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-muted-foreground hover:text-red-600 w-full cursor-pointer">
                <LogOut className="w-6 h-6" />
                <span className="tracking-tight">Sair</span>
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
