"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface MemberCardProps {
  cardType?: "GREEN" | "PINK";
  name?: string;
  birthDate?: string;
  qrCodeToken?: string;
  cvv?: string;
}

export function MemberCardPage({
  cardType = "GREEN",
  name,
  birthDate,
  qrCodeToken,
  cvv = "000",
}: MemberCardProps) {
  const [shareUrl, setShareUrl] = useState(
    `https://meetoff.com.br/profile/${qrCodeToken || "MeetOff"}`,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/profile/${qrCodeToken || "MeetOff"}`);
    }
  }, [qrCodeToken]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}&color=ffffff&bgcolor=000000&qzone=1`;

  const isPink = cardType === "PINK";
  const frontBg = isPink ? "/cartao-rosa-frente.svg" : "/cartao-verde-frente.svg";
  const backBg = isPink ? "/cartao-rosa-verso.svg" : "/cartao-verde-verso.svg";

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Background Decorations */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 blur-[120px] rounded-full -z-10" />

        <div className="w-full max-w-2xl space-y-12 relative">
          <div className="text-center space-y-4">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Seu Acesso Exclusivo
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none">
              MeetOff <span className="text-brand-orange">Member</span> Card
            </h1>
            <p className="text-gray-500 font-medium max-w-md mx-auto text-sm">
              Seu passaporte digital para o ecossistema mais exclusivo de conexões e eventos premium.
            </p>
          </div>

          <div className="grid gap-12 lg:gap-16">
            {/* Front Card */}
            <div className="group perspective-1000">
              <div
                className="relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden transition-all duration-700 bg-cover bg-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] group-hover:scale-[1.02] group-hover:-rotate-1"
                style={{ backgroundImage: `url('${frontBg}')` }}
              >
                {/* Dynamic Data Overlay */}
                <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent">
                  <div className="flex justify-between items-end w-full">
                    <div className="space-y-1 mb-2 sm:mb-4">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Nome do Membro</p>
                      <h3 className="text-white text-lg sm:text-2xl font-black uppercase tracking-widest drop-shadow-lg">
                        {name || "Visitante Premium"}
                      </h3>
                    </div>

                    <div className="w-16 h-16 sm:w-24 sm:h-24 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                      <img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain mix-blend-screen brightness-125"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Card */}
            <div className="group perspective-1000">
              <div
                className="relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden transition-all duration-700 bg-cover bg-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] group-hover:scale-[1.02] group-hover:rotate-1"
                style={{ backgroundImage: `url('${backBg}')` }}
              >
                <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end bg-gradient-to-b from-black/40 to-transparent">
                  <div className="grid grid-cols-2 gap-8 items-end">
                    {/* Left Column - Meta Data */}
                    <div className="flex flex-col gap-2 font-mono text-white text-[10px] sm:text-xs font-bold leading-tight drop-shadow-md">
                      <div className="opacity-60">AUTH_SEQ: 1.6180339887</div>
                      <div className="opacity-60">ID_TOKEN: 11235813</div>
                      <div className="mt-2 tracking-[0.3em] text-sm sm:text-base">**** **** **** 2024</div>
                    </div>

                    {/* Right Column - Security & Info */}
                    <div className="flex flex-col justify-start items-start gap-6 text-white drop-shadow-md">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">
                          Cód. Segurança
                        </span>
                        <span className="font-mono text-sm sm:text-lg font-black tracking-widest">
                          {cvv}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">
                          Nascimento
                        </span>
                        <span className="font-mono text-sm sm:text-lg font-black tracking-widest">
                          {birthDate || "XX/XX/XXXX"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
             <Button className="h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-brand-green/20">
              Salvar na Apple Wallet
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px] px-8">
              Baixar PDF Oficial
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
