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
    <header className="sticky top-0 z-50 w-full px-4 lg:px-20 glass border-b border-white/10">
      <div className="mx-auto max-w-7xl flex h-24 items-center justify-between">
        <div className="flex items-center gap-12">
          <Logo href="/events" />
          
          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-orange",
                    isActive ? "text-brand-orange" : "text-brand-black/70"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-brand-orange rounded-full shadow-[0_0_8px_rgba(255,29,85,0.5)]" />
                  )}
                </Link>
              );
            })}
            {user?.isAdmin && (
              <Link 
                href="/admin" 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green hover:text-brand-green/80 transition-colors bg-brand-green/5 px-4 py-1.5 rounded-full"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex h-10 w-10 items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-brand-red border-r-transparent"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="hidden sm:flex items-center gap-3 group">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-orange transition-colors">Olá, {user?.name?.split(' ')[0]}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-black">Minha Conta</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-brand-green/10 border border-brand-green/10 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all">
                  <User size={18} />
                </div>
              </Link>
              <Button
                variant="ghost"
                onClick={() => logout()}
                className="h-10 w-10 rounded-xl hover:bg-brand-red/10 hover:text-brand-red transition-all hidden sm:flex items-center justify-center p-0"
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest text-brand-black hover:text-brand-orange transition-colors"
              >
                Login
              </Link>
              <Button 
                asChild 
                className="h-11 px-8 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-green/20 hidden sm:flex"
              >
                <Link href="/signup">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
