"use client";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { Download, Printer, QrCode, QrCodeIcon, Rss } from "lucide-react";

export function MemberCardPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-[24px] p-4 sm:p-8 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 px-2">
            Seu Cartão de Membro
          </h1>

          {/* Front Card */}
          <div className="relative w-full aspect-[1.58] rounded-[24px] overflow-hidden bg-[#26262E] p-6 sm:p-8 shadow-lg isolate flex flex-col justify-between border border-white/10">
            {/* Background Lines */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden select-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="white" strokeWidth="3.2">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M ${i * 16 - 100} -100 Q ${i * 15} 100 ${i * 15 - 150} 300 T ${i * 18 - 50} 800 T ${i * 15 - 100} 900`}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Top Section */}
            <div className="relative flex justify-end w-full mt-2">
              <div className="flex flex-col items-end">
                <div className="text-5xl font-bold text-[#D8B06A] tracking-tighter flex items-center pr-1">
                  <span className="font-black text-[#D8B06A]">FindB</span>
                </div>
                <div className="text-[10px] sm:text-xm text-[#D8B06A] font-light mt-1 tracking-wide">
                  Construindo relacionamentos saudáveis
                </div>
              </div>
            </div>

            {/* Middle text */}
            <div className="relative w-full mt-8 mb-6 flex items-center">
              <div className="mr-3 w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#D8B06A] border-b-[5px] border-b-transparent"></div>
              <div className="text-xl sm:text-2xl tracking-[0.16em] font-light text-[#D8B06A] uppercase leading-none">
                CUPIDO/ANFITRIÃO/AFILIADO
              </div>
            </div>

            {/* Bottom Section */}
            <div className="relative w-full mt-auto flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div className="font-mono text-[#D8B06A] tracking-widest text-[13px] sm:text-[15px] font-bold mt-1">
                  1.6180339887 11235813
                </div>
                <div className="flex flex-col items-end gap-2 pr-1">
                  <div className="font-mono text-[#D8B06A] tracking-widest text-[13px] sm:text-[15px] font-bold">
                    66 73 3 7 12 40 24 06 88
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-start leading-[1.1] text-[8px] sm:text-[9px] text-[#D8B06A] font-bold">
                      <span>DATA</span>
                      <span>NASCIMENTO</span>
                    </div>
                    <div className="flex items-center text-[#D8B06A] font-mono text-[13px] sm:text-[15px] font-bold">
                      <span className="text-[10px] mr-1.5">▶</span> 21/11/1993
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[#D8B06A] text-lg sm:text-xl font-normal relative -bottom-2">
                Thiago S. Santos / Mas.
              </div>
            </div>
          </div>

          {/* Back Card */}
          <div className="relative w-full aspect-[1.58] rounded-[24px] overflow-hidden bg-[#26262E] mt-6 shadow-lg isolate flex items-center justify-center p-5 sm:p-7 border border-white/10">
            {/* Background Lines */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden select-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="white" strokeWidth="3.2">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M ${i * 16 - 100} -100 Q ${i * 15} 100 ${i * 15 - 150} 300 T ${i * 18 - 50} 600 T ${i * 15 - 100} 900`}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Content Box */}
            <div className="relative z-10 w-[85%] max-w-[340px] rounded-[16px] border-[1.5px] border-[#D8B06A] p-4 flex gap-4 sm:gap-5 items-center">
              <div className="w-[84px] h-[84px] flex-shrink-0 flex items-center justify-center">
                {/* SVG representing a detailed QR code block */}
                <QrCodeIcon className="w-full h-full text-[#D8B06A]" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#D8B06A]/90 leading-tight font-light text-left pr-2 py-2">
                Obrigado por fazer parte do nosso universo! Aqui na FindB, acreditamos que cada
                relação é uma conquista e cada desafio nos torna mais fortes. Queremos estar sempre
                ao seu lado nessa jornada!
              </p>
            </div>

            {/* Bottom Right Logo */}
            <div className="absolute bottom-6 right-6 z-10">
              <div className="text-2xl sm:text-3xl font-bold text-[#D8B06A] tracking-tighter flex items-center">
                <span className="font-black text-[#D8B06A]">FindB</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 my-8"></div>

          {/* Ações Rápidas */}
          <div className="px-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-center text-gray-800 bg-white border-gray-200 hover:bg-gray-50 h-[52px] rounded-xl font-semibold shadow-sm transition-all hover:shadow-md"
              >
                <Download className="mr-3 h-5 w-5 text-gray-800" />
                Baixar versão digital
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center text-gray-800 bg-white border-gray-200 hover:bg-gray-50 h-[52px] rounded-xl font-semibold shadow-sm transition-all hover:shadow-md"
              >
                <Printer className="mr-3 h-5 w-5 text-gray-800" />
                Imprimir Cartão
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
