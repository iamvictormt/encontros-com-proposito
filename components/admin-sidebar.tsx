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
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useState } from "react";

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
      { icon: CreditCard, label: "Cartões Físicos", href: "/admin/card-requests" },
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 text-brand-black/50 hover:bg-brand-red hover:text-white hover:shadow-xl hover:shadow-brand-red/20 w-full cursor-pointer group"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span>Sair do Painel</span>
          </button>

          <ConfirmModal 
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={logout}
            title="Deseja realmente sair?"
            description="Sua sessão será encerrada e você precisará fazer login novamente para acessar o painel administrativo."
            confirmText="Sair do Painel"
            cancelText="Voltar"
            variant="destructive"
          />
        </div>
      </nav>
    </aside>
  );
}
