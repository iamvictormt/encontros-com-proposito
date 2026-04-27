"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  cvv = "000"
}: MemberCardProps) {
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/profile/${qrCodeToken || 'MeetOff'}`
    : `https://meetoff.com.br/profile/${qrCodeToken || 'MeetOff'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}&color=ffffff&bgcolor=000000&qzone=1`;

  const isPink = cardType === "PINK";
  const frontBg = isPink ? '/cartao-rosa-frente.svg' : '/cartao-verde-frente.svg';
  const backBg = isPink ? '/cartao-rosa-verso.svg' : '/cartao-verde-verso.svg';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SiteHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[540px]">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Seu Cartão MeetOff
          </h1>

          {/* Front Card */}
          <div 
            className={`relative w-full aspect-[1.58] rounded-[32px] overflow-hidden transition-all duration-500 bg-cover bg-center`}
            style={{ backgroundImage: `url('${frontBg}')` }}
          >
            {/* Dynamic Data Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="flex justify-between items-end w-full">
                {/* Name for PINK card */}
                {isPink ? (
                  <div className="flex flex-col mb-2">
                    <div className="text-white text-sm sm:text-sm font-bold tracking-wide uppercase drop-shadow-sm">
                      {name || "Visitante"}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1" />
                )}

                {/* White QR Code with Transparency effect */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mr-8.5 mb-2 overflow-hidden">
                  <img 
                    src={qrUrl} 
                    alt="QR Code" 
                    className="w-full h-full object-contain mix-blend-screen"
                    style={{ filter: 'brightness(1.5)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Back Card */}
          <div 
            className={`relative w-full aspect-[1.58] rounded-[32px] overflow-hidden mt-8 transition-all duration-500 bg-cover bg-center`}
            style={{ backgroundImage: `url('${backBg}')` }}
          >
            {/* Dynamic Data Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end pb-12">
              <div className="grid grid-cols-2 gap-8 items-end">
                {/* Left Column - Numbers */}
                <div className="flex flex-col gap-1 font-mono text-white/90 text-sm font-bold leading-tight drop-shadow-sm">
                  <div>1.6180339887</div>
                  <div>11235813</div>
                  <div className="mt-1 tracking-wider">66 73 37 12 40 24 06 88</div>
                  <div className="mt-1">1234</div>
                </div>

                {/* Right Column - CVV and DOB */}
                <div className="flex flex-col justify-start items-start gap-4 text-white/80 drop-shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Código de segurança</span>
                    <span className="font-mono text-sm font-bold text-white">{cvv}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Data nascimento</span>
                    <span className="font-mono text-sm font-bold text-white">{birthDate || "--/--/----"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
