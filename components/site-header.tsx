"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { Menu, LogOut, User, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export function SiteHeader() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/events", label: "Home" },
    { href: "/products", label: "Produtos Autorais" },
    { href: "/portfolio", label: "Portfólio" },
    { href: "/partners", label: "Empresas e Parcerias" },
  ];

  return (
    <header className="bg-white px-4 py-4 lg:px-20 mb-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle>
                  <Logo href="/events" onClick={() => setIsOpen(false)} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col px-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center py-3 text-lg font-semibold text-black hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {user?.isAdmin && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-3 text-lg font-semibold text-secondary hover:text-secondary/80 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Painel Admin
                      </Link>
                    </div>
                  )}
                </nav>
              </div>

              <div className="p-6 border-t bg-gray-50/50">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-3">
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-5 w-5 text-black" />
                      <span className="font-medium text-black">Minha Conta</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button
                      className="bg-secondary hover:bg-secondary/90"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/signup">Cadastrar</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Logo href="/events" />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-black hover:text-black/80"
            >
              {link.label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link href="/admin" className="font-bold text-secondary hover:text-secondary/80">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex bg-transparent text-black hover:bg-gray-50 hover:text-black"
              >
                <Link href="/account">Minha Conta</Link>
              </Button>
              <Button
                onClick={() => logout()}
                className="bg-secondary hover:bg-secondary/90 hidden sm:inline-flex"
              >
                Sair
              </Button>
              {/* Only show logout on mobile inside the drawer, but keep the button for tablet/desktop */}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex bg-transparent text-black hover:bg-gray-50 hover:text-black"
              >
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-secondary hover:bg-secondary/90 hidden sm:inline-flex">
                <Link href="/signup">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
