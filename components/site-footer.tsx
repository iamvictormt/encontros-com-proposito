"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  const [year, setYear] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []);

  return (
    <footer className="glass px-4 py-16 lg:px-20 mt-20 text-brand-black relative overflow-hidden border-t border-white/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
      
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center md:text-left">
        <div className="space-y-6 flex flex-col items-center md:items-start">
          <div className="text-2xl font-black tracking-tighter">
            MEET<span className="text-brand-red">OFF</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
            Conectando pessoas com propósito através de experiências exclusivas e produtos autorais.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-black/5 hover:bg-brand-red/10 transition-colors text-brand-black">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-black/5 hover:bg-brand-green/10 transition-colors text-brand-black">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-black uppercase tracking-widest text-[10px]">Explorar</h4>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li><a href="/events" className="hover:text-brand-red transition-colors">Eventos</a></li>
            <li><a href="/products" className="hover:text-brand-red transition-colors">Produtos</a></li>
            <li><a href="/portfolio" className="hover:text-brand-red transition-colors">Portfólio</a></li>
            <li><a href="/member-card" className="hover:text-brand-red transition-colors">Cartão MeetOff</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-black uppercase tracking-widest text-[10px]">Contato</h4>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li>contato@meetoff.com.br</li>
            <li>São Paulo, SP</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-brand-black/5 flex flex-col lg:flex-row items-center justify-between gap-8">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center lg:text-left">
          Copyright © {year} MEET OFF. Todos os direitos reservados.
        </p>
        <div className="flex gap-x-8 gap-y-4 text-[10px] text-gray-400 font-bold flex-wrap justify-center lg:justify-end">
          <Link href="/privacy" className="hover:text-brand-black transition-colors uppercase tracking-[0.2em]">Políticas e Termos</Link>
          <Link href="/consent" className="hover:text-brand-black transition-colors uppercase tracking-[0.2em]">Consentimento</Link>
          <Link href="/security" className="hover:text-brand-black transition-colors uppercase tracking-[0.2em]">Segurança</Link>
          <Link href="/faq" className="hover:text-brand-black transition-colors uppercase tracking-[0.2em]">FAQ</Link>
          <Link href="/cookies" className="hover:text-brand-black transition-colors uppercase tracking-[0.2em]">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
