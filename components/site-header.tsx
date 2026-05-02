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
  const pathname = usePathname();

  const navLinks = [
    { href: "/events", label: "Home" },
    { href: "/products", label: "Produtos" },
    { href: "/portfolio", label: "Portfólio" },
    { href: "/partners", label: "Parcerias" },
    { href: "/member-card", label: "Cartão" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md px-4 py-3 lg:px-20 lg:py-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo href="/events" />

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary font-bold" : "text-gray-600"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user?.isAdmin && (
              <Link href="/admin" className="text-sm font-bold text-secondary hover:text-secondary/80">
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/account">Minha Conta</Link>
              </Button>
              <Button
                onClick={() => logout()}
                size="sm"
                variant="secondary"
                className="hidden sm:inline-flex"
              >
                Sair
              </Button>
              <Link href="/account" className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-primary">
                <User className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-600"
              >
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
