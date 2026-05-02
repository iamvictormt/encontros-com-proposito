"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram } from "lucide-react";

export function SiteFooter() {
  const [year, setYear] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []);

  return (
    <footer className="bg-brand-black px-4 py-16 lg:px-20 mt-20 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green via-brand-red to-brand-orange" />
      
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        <div className="space-y-6">
          <div className="text-2xl font-black tracking-tighter">
            MEET<span className="text-brand-orange">OFF</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Conectando pessoas com propósito através de experiências exclusivas e produtos autorais.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-brand-orange/20 transition-colors text-white">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-brand-green/20 transition-colors text-white">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold">Explorar</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="/events" className="hover:text-brand-orange transition-colors">Eventos</a></li>
            <li><a href="/products" className="hover:text-brand-orange transition-colors">Produtos</a></li>
            <li><a href="/portfolio" className="hover:text-brand-orange transition-colors">Portfólio</a></li>
            <li><a href="/member-card" className="hover:text-brand-orange transition-colors">Cartão MeetOff</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold">Contato</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>contato@meetoff.com.br</li>
            <li>São Paulo, SP</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Copyright © {year} MEET OFF. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-xs text-gray-500 font-medium">
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Termos</a>
        </div>
      </div>
    </footer>
  );
}
