"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { Menu, LogOut, User, LayoutDashboard, Home, Sparkles, FolderOpen, Building2, CreditCard, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/events", label: "Home", icon: Home },
    { href: "/products", label: "Produtos Autorais", icon: ShoppingCart },
    { href: "/portfolio", label: "Portfólio", icon: FolderOpen },
    { href: "/partners", label: "Empresas e Parcerias", icon: Building2 },
    { href: "/member-card", label: "Cartão MeetOff", icon: CreditCard },
  ];

  return (
    <header className="bg-white px-4 py-4 lg:px-20 mb-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] h-full flex flex-col p-0 bg-white border-r border-gray-100">
              <SheetHeader className="p-6 pt-12 border-b border-gray-100 text-center bg-white/50 items-center">
                <SheetTitle>
                  <Logo href="/events" onClick={() => setIsOpen(false)} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-6 px-4 bg-white">
                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-[#2B4B42]/10 to-[#c2395b]/10 text-[#2B4B42] font-bold shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#2B4B42]"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isActive ? "text-[#2B4B42]" : "text-gray-500")} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}

                  {user?.isAdmin && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200",
                          pathname === "/admin"
                            ? "bg-[#c2395b]/10 text-[#c2395b] font-bold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#c2395b]"
                        )}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Painel Admin
                      </Link>
                    </div>
                  )}
                </nav>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white backdrop-blur-sm mt-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#2B4B42] border-r-transparent"></div>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <div className="h-10 w-10 rounded-full bg-[#2B4B42]/10 flex items-center justify-center text-[#2B4B42] font-bold text-lg">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-bold text-sm">{user?.fullName || 'Usuário'}</span>
                        <span className="text-gray-500 text-xs truncate max-w-[180px]">{user?.email}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="rounded-xl border-gray-200 hover:bg-gray-50">
                        <Link href="/account" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Conta
                        </Link>
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-100 bg-red-50/50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="rounded-xl border-gray-200 hover:bg-gray-50">
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button
                      className="bg-[#2B4B42] hover:bg-[#2B4B42]/90 text-white rounded-xl"
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
          
          <div className="hidden lg:block">
            <Logo href="/events" />
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
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
