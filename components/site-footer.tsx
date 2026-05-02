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
    <footer className="bg-white border-t border-gray-100 px-4 py-12 lg:px-8 mt-20 pb-28 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-primary mb-2">MeetOff</h2>
            <p className="text-sm text-gray-500 max-w-xs">
              Conecte-se com propósito. Desligue o app, viva o encontro.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            <Link href="/events" className="hover:text-primary transition-colors">Eventos</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Produtos</Link>
            <Link href="/portfolio" className="hover:text-primary transition-colors">Portfólio</Link>
            <Link href="/partners" className="hover:text-primary transition-colors">Parcerias</Link>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition-all">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition-all">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {year} MeetOff. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600">Termos de Uso</a>
            <a href="#" className="hover:text-gray-600">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
