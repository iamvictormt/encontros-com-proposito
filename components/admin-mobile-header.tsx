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
    <header className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] flex flex-col p-0 text-black">
            <SheetHeader className="p-6 border-b text-left">
              <SheetTitle>
                <Logo href="/admin" onClick={() => setIsOpen(false)} />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto py-6">
              <div className="flex flex-col px-6 space-y-1">
                {menuSections.map((section, sectionIdx) => (
                  <div
                    key={sectionIdx}
                    className={cn(
                      "py-2",
                      section.borderTop && "border-t border-gray-100 mt-4 pt-4",
                    )}
                  >
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-black transition-all uppercase italic tracking-tighter",
                              isActive
                                ? "text-primary bg-primary/5 shadow-sm"
                                : "text-gray-400 hover:text-black hover:bg-gray-50",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-6 h-6",
                                isActive ? "text-primary" : "text-gray-400",
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

            <div className="p-6 border-t bg-gray-50/50">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-4 px-3 py-3 rounded-lg text-base font-bold transition-colors text-muted-foreground hover:text-red-600 w-full cursor-pointer">
                    <LogOut className="w-6 h-6" />
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
