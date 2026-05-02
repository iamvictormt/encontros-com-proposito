"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter mb-2">
              Member <span className="text-primary">Card</span>
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
              Seu acesso exclusivo à plataforma
            </p>
          </div>

          <div className="space-y-8">
            {/* Front Card */}
            <div
              className={`relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 bg-cover bg-center ring-1 ring-black/5`}
              style={{ backgroundImage: `url('${frontBg}')` }}
            >
              {/* Dynamic Data Overlay */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/20 to-transparent">
                <div className="flex justify-between items-end w-full">
                  {/* Name for card */}
                  <div className="flex flex-col">
                    <div className="text-white text-lg sm:text-2xl font-black italic uppercase tracking-tighter drop-shadow-lg">
                      {name || "Visitante"}
                    </div>
                    <div className="text-white/60 text-[10px] uppercase font-black tracking-widest mt-1">
                      Membro Ativo
                    </div>
                  </div>

                  {/* White QR Code with Transparency effect */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20">
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-full h-full object-contain mix-blend-screen"
                      style={{ filter: "brightness(1.5)" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Card */}
            <div
              className={`relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 bg-cover bg-center ring-1 ring-black/5`}
              style={{ backgroundImage: `url('${backBg}')` }}
            >
              {/* Dynamic Data Overlay */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent">
                <div className="grid grid-cols-2 gap-8 items-end">
                  {/* Left Column - Numbers */}
                  <div className="flex flex-col gap-1 font-mono text-white text-[10px] sm:text-sm font-bold leading-tight drop-shadow-sm opacity-80">
                    <div>1.6180339887</div>
                    <div>11235813</div>
                    <div className="mt-1 tracking-wider">66 73 37 12 40 24 06 88</div>
                    <div className="mt-1">ID: {qrCodeToken?.substring(0, 8).toUpperCase()}</div>
                  </div>

                  {/* Right Column - CVV and DOB */}
                  <div className="flex flex-col justify-start items-start gap-6 text-white drop-shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                        Security
                      </span>
                      <span className="font-mono text-base font-black italic">
                        {cvv}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                        Birth Date
                      </span>
                      <span className="font-mono text-base font-black italic">
                        {birthDate || "--/--/----"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo de Cartão</span>
                <span className="text-xl font-black italic uppercase text-black">{isPink ? 'Pink Edition' : 'Green Standard'}</span>
             </div>
             <div className={`w-4 h-4 rounded-full ${isPink ? 'bg-pink-500' : 'bg-primary'} shadow-lg animate-pulse`} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
