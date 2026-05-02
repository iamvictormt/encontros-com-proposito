"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Home, FolderOpen, Building2, CreditCard, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/events", label: "Home", icon: Home },
    { href: "/products", label: "Produtos Autorais", icon: ShoppingCart },
    { href: "/portfolio", label: "Portfólio", icon: FolderOpen },
    { href: "/partners", label: "Empresas e Parcerias", icon: Building2 },
    { href: "/member-card", label: "Cartão MeetOff", icon: CreditCard },
  ];

  return (
    <header className="bg-white px-4 py-4 lg:px-20 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between md:mt-0 md:mb-0 mt-8 mb-8">
        <div className="flex items-center gap-4">
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
