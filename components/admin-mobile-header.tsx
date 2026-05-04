"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { menuSections } from "./admin-sidebar";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { cn } from "@/lib/utils";

export function AdminMobileHeader() {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <header className="lg:hidden glass border-b border-white/10 px-6 h-24 sticky top-0 z-40 flex items-center justify-between">
      <Logo href="/admin" />
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="h-12 w-12 rounded-2xl bg-brand-black/5 flex items-center justify-center transition-all hover:bg-brand-red/10 group"
          title="Sair"
        >
          <LogOut className="h-5 w-5 text-brand-black/40 group-hover:text-brand-red transition-colors" />
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
    </header>
  );
} 
 
 