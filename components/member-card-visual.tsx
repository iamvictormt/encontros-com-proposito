"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";

interface MemberCardVisualProps {
  cardType?: "GREEN" | "PINK";
  name?: string;
  birthDate?: string;
  qrCodeToken?: string;
  cvv?: string;
}

export const MemberCardVisual = forwardRef<HTMLDivElement, MemberCardVisualProps>(({
  cardType = "GREEN",
  name,
  birthDate,
  qrCodeToken,
  cvv = "000",
}, ref) => {
  const isPink = cardType === "PINK";
  const frontBg = isPink ? "/cartao-rosa-frente.svg" : "/cartao-verde-frente.svg";
  const backBg = isPink ? "/cartao-rosa-verso.svg" : "/cartao-verde-verso.svg";
  
  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/profile/${qrCodeToken || "MeetOff"}`
    : `https://meetoff.com.br/profile/${qrCodeToken || "MeetOff"}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}&color=ffffff&bgcolor=000000&qzone=1`;

  return (
    <div ref={ref} className="grid gap-12 lg:gap-16 bg-transparent p-4 w-full max-w-2xl mx-auto">
      {/* Front Card */}
      <div className="group perspective-1000">
        <div
          className="relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden transition-all duration-700 bg-cover bg-center group-hover:scale-[1.02] group-hover:-rotate-1"
          style={{ backgroundImage: `url('${frontBg}')` }}
        >
          {/* Dynamic Data Overlay */}
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end">
            <div className="flex justify-between items-end w-full">
              <div className="space-y-1 mb-2 sm:mb-4">
                <p className="text-[8px] sm:text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Nome do Membro</p>
                <h3 className="text-white text-xs sm:text-2xl font-black uppercase tracking-widest drop-shadow-lg">
                  {name ? name.split(" ").slice(0, 2).join(" ") : "Visitante"}
                </h3>
              </div>

              <div className="w-16 h-16 sm:w-24 sm:h-24">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-12 h-12 sm:w-full sm:h-full object-contain mix-blend-screen mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Card */}
      <div className="group perspective-1000">
        <div
          className="relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden transition-all duration-700 bg-cover bg-center group-hover:scale-[1.02] group-hover:rotate-1"
          style={{ backgroundImage: `url('${backBg}')` }}
        >
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end">
            <div className="grid grid-cols-[1.5fr_1fr] gap-4 sm:gap-8 items-end">
              {/* Left Column - Meta Data */}
              <div className="flex flex-col gap-2 font-mono text-white text-[10px] sm:text-xs font-bold leading-tight drop-shadow-md">
                <div className="font-mono text-[10px] sm:text-lg font-black tracking-widest">1.6180339887</div>
                <div className="font-mono text-[10px] sm:text-lg font-black tracking-widest">11235813</div>
                <div className="font-mono text-[10px] sm:text-lg font-black tracking-widest">66 73 37 12 40 24 06 88</div>
                <div className="font-mono text-[10px] sm:text-lg font-black tracking-widest">1234</div>
              </div>

              {/* Right Column - Security & Info */}
              <div className="flex flex-col justify-start items-start gap-6 text-white drop-shadow-md">
                <div className="space-y-1">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-60 block">
                    Cód. Segurança
                  </span>
                  <span className="font-mono text-xs sm:text-lg font-black tracking-widest">
                    {cvv}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-60 block">
                    Nascimento
                  </span>
                  <span className="font-mono text-xs sm:text-lg font-black tracking-widest">
                    {birthDate || "XX/XX/XXXX"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MemberCardVisual.displayName = "MemberCardVisual";
