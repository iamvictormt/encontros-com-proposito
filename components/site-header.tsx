"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import {
  LogOut,
  User,
  Home,
  FolderOpen,
  Building2,
  CreditCard,
  ShoppingCart,
  Crown,
  ChevronDown,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SiteHeader() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const hasPremiumAccess = !!user?.hasPremiumAccessory;

  const navLinks = [
    ...(isLoggedIn
      ? [
          { href: "/events", label: "Home", icon: Home },
          { href: "/products", label: "Produtos Autorais", icon: ShoppingCart },
          { href: "/portfolio", label: "Portfólio", icon: FolderOpen },
          { href: "/partners", label: "Empresas e Parcerias", icon: Building2 },
        ]
      : []),
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 lg:px-20 glass border-b border-white/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex h-20 items-center justify-between relative">
        <div className="flex-1 flex items-center">
          <Logo href="/events" />
        </div>

        <nav className="hidden items-center gap-10 lg:flex absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:text-brand-orange group",
                  isActive ? "text-brand-orange" : "text-brand-black/60",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-orange rounded-full transition-all duration-300 group-hover:w-full",
                    isActive && "w-full shadow-[0_0_8px_rgba(255,29,85,0.5)]",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 flex items-center justify-end gap-4">
          {isLoading ? (
            <div className="flex h-10 w-10 items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-brand-red border-r-transparent"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 pl-2 pr-1 h-12 hover:bg-black/5 rounded-2xl transition-all"
                  >
                    <div className="flex flex-col items-end hidden md:flex">
                      <span className="text-[11px] font-black uppercase tracking-wider text-brand-black">
                        {user?.fullName.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-brand-black/40">
                        {user?.userCategory || "Membro"}
                      </span>
                    </div>
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-brand-orange text-white text-xs font-black">
                        {user ? getInitials(user.fullName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={14} className="text-brand-black/30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-white/20 glass shadow-2xl">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight">{user?.fullName}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2 bg-black/5" />
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-brand-orange/10 focus:text-brand-orange cursor-pointer p-3 transition-colors">
                    <Link href="/account" className="flex items-center gap-3 w-full">
                      <User size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Minha Conta</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Links movidos da navbar principal */}
                  {(hasPremiumAccess || user?.userCategory !== "PREMIUM") && (
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-brand-orange/10 focus:text-brand-orange cursor-pointer p-3 transition-colors">
                      <Link href="/member-card" className="flex items-center gap-3 w-full">
                        <CreditCard size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Cartão MeetOff</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {!hasPremiumAccess && user?.userCategory !== "PREMIUM" && (
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-brand-orange/10 focus:text-brand-orange cursor-pointer p-3 transition-colors">
                      <Link href="/subscriptions" className="flex items-center gap-3 w-full">
                        <Crown size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Assinatura</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-brand-orange/10 focus:text-brand-orange cursor-pointer p-3 transition-colors">
                      <Link href="/admin" className="flex items-center gap-3 w-full">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Painel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-brand-orange/10 focus:text-brand-orange cursor-pointer p-3 transition-colors">
                    <Link href="/settings" className="flex items-center gap-3 w-full">
                      <Settings size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-black/5" />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="rounded-xl focus:bg-brand-red/10 focus:text-brand-red text-brand-red cursor-pointer p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full font-bold">
                      <LogOut size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Sair da Conta</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-black/60 hover:text-brand-orange transition-colors mr-4"
              >
                Entrar
              </Link>
              <Button
                asChild
                className="h-10 px-6 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand-green/20 hidden sm:flex transition-all active:scale-95"
              >
                <Link href="/signup">Criar Conta</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
