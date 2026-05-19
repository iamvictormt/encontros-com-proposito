"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, FolderOpen, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [showLabel, setShowLabel] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isLoggedIn, user } = useAuth();
  const hasPremiumAccess = !!user?.hasPremiumAccessory;

  useEffect(() => {
    setShowLabel(true);
    const timer = setTimeout(() => {
      setShowLabel(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the very top
      if (currentScrollY < 20) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Determine direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 10) {
        // Scrolling up - show (with a small threshold of 10px to avoid jitter)
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "/eventos", label: "Home", icon: Home },
    { href: "/produtos", label: "Produtos", icon: ShoppingCart },
    ...(isLoggedIn && user?.userCategory === "PREMIUM" && !hasPremiumAccess
      ? []
      : [{ href: "/cartao-membro", label: "Cartão", icon: CreditCard }]),
    { href: "/portfolio", label: "Portfólio", icon: FolderOpen },
    { href: "/conta", label: "Conta", icon: User },
  ];

  if (!isLoggedIn || pathname?.startsWith("/administracao") || pathname === "/entrar" || pathname === "/cadastro" || pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Trigger Area - detect touch/hover at bottom to reveal */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 h-4 z-[99] lg:hidden transition-opacity duration-300",
          isVisible ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
        )}
        onMouseEnter={() => setIsVisible(true)}
        onClick={() => setIsVisible(true)}
      />

      <div 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] lg:hidden w-fit max-w-[95vw] transition-all duration-500 ease-in-out",
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90"
        )}
      >
        <div className="relative group">
          {/* Futuristic Outer Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red/30 via-brand-orange/30 to-brand-red/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
          
          <nav className="relative flex items-center gap-1 p-1.5 rounded-full bg-black/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Background Layer for Scanlines and Effects (with overflow hidden) */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              {/* Subtle Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
            </div>
            
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center justify-center h-11 w-11 rounded-full transition-all duration-300",
                    isActive ? "text-white" : "text-white/40 hover:text-white/70"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-red to-brand-orange rounded-full shadow-[0_0_20px_rgba(255,29,85,0.5)] animate-in zoom-in duration-500" />
                  )}
                  
                  <Icon className={cn(
                    "relative z-10 h-5 w-5 transition-all duration-300", 
                    isActive ? "scale-110" : "scale-100"
                  )} />
                  
                  {isActive && showLabel && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-brand-black/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/20 shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-3 duration-500">
                      <span className="relative z-10">{link.label}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-brand-orange/10 rounded-lg" />
                    </span>
                  )}

                  {/* Hover indicator for tech feel */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-red opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

