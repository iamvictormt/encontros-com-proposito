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

  return (
    <header className="lg:hidden glass border-b border-white/10 px-6 h-24 sticky top-0 z-40 flex items-center justify-between">
      <Logo href="/admin" />
      
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-brand-black/5">
              <Menu className="h-6 w-6 text-brand-black" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] glass border-l border-white/20 flex flex-col p-0 text-brand-black">
            <SheetHeader className="p-8 border-b border-brand-green/5 text-left">
              <SheetTitle>
                <Logo href="/admin" onClick={() => setIsOpen(false)} />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto py-8">
              <div className="flex flex-col px-6 space-y-2">
                {menuSections.map((section, sectionIdx) => (
                  <div
                    key={sectionIdx}
                    className={cn(
                      "py-2",
                      section.borderTop && "border-t border-brand-green/5 mt-6 pt-6",
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
                              "flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                              isActive
                                ? "bg-brand-black text-white shadow-xl shadow-brand-black/20"
                                : "text-brand-black/50 hover:bg-brand-black/5 hover:text-brand-black",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-5 h-5",
                                isActive ? "text-brand-orange" : "text-brand-black/40",
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

            <div className="p-8 border-t border-brand-green/5 bg-brand-black/5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-4 px-5 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 text-brand-black/50 hover:bg-brand-red hover:text-white hover:shadow-xl hover:shadow-brand-red/20 w-full cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    <span>Sair do Painel</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deseja realmente sair?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sua sessão será encerrada e você precisará fazer login novamente para acessar
                      o painel administrativo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
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
    </header>
  );
}
