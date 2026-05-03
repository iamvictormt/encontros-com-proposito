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
import { cn } from "@/lib/utils";
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

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuth();

  return (
    <header className="lg:hidden glass border-b border-brand-green/5 px-6 py-4 sticky top-0 z-40 flex items-center justify-between shadow-sm backdrop-blur-md bg-white/70">
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-brand-green hover:bg-brand-green/5 rounded-xl">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] flex flex-col p-0 glass border-r border-brand-green/5 shadow-2xl">
            <SheetHeader className="p-8 border-b border-brand-green/5 text-left bg-brand-green/5">
              <SheetTitle>
                <Logo href="/admin" onClick={() => setIsOpen(false)} />
              </SheetTitle>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-1 w-6 bg-brand-orange rounded-full" />
                <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em]">
                  Painel Administrativo
                </span>
              </div>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto py-8">
              <div className="flex flex-col px-6 space-y-2">
                {menuSections.map((section, sectionIdx) => (
                  <div
                    key={sectionIdx}
                    className={cn(
                      "py-2",
                      section.borderTop && "border-t border-brand-green/5 mt-4 pt-4",
                    )}
                  >
                    <div className="space-y-2">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                              isActive
                                ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                                : "text-brand-black/60 hover:text-brand-green hover:bg-brand-green/5",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-brand-orange" : "text-brand-green/40",
                              )}
                            />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            <div className="p-8 border-t border-brand-green/5 bg-brand-red/5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 text-brand-red hover:bg-brand-red/10 w-full cursor-pointer group">
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Sair do Painel</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-brand-green/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter text-brand-black">Deseja realmente sair?</AlertDialogTitle>
                    <AlertDialogDescription className="text-brand-black/60 font-medium">
                      Sua sessão será encerrada e você precisará fazer login novamente para acessar
                      o painel administrativo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel className="rounded-xl border-brand-green/10 font-bold uppercase tracking-widest text-[10px]">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="bg-brand-red hover:bg-brand-red/90 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-brand-red/20 px-8"
                    >
                      Sair
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </SheetContent>
        </Sheet>
        <Logo href="/admin" />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-brand-black uppercase tracking-widest leading-none">Admin</p>
          <p className="text-[8px] font-bold text-brand-black/40 uppercase tracking-widest mt-1">Sessão Ativa</p>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-brand-green/10 p-0.5 overflow-hidden">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"} 
            alt="Admin" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
