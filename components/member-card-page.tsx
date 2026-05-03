"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Loader2, Download } from "lucide-react";

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

  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const { domToPng } = await import("modern-screenshot");

      const imgData = await domToPng(cardRef.current, {
        scale: 3,
        backgroundColor: 'transparent',
        onCloneNode: (cloned) => {
          if (cloned instanceof HTMLElement) {
            // Add a clean gap between cards and remove container padding
            cloned.style.gap = '40px';
            cloned.style.padding = '0';
            
            const elements = cloned.getElementsByClassName('perspective-1000');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              el.style.perspective = 'none';
              // Remove shadows and scales that might bleed out
              const card = el.firstElementChild as HTMLElement;
              if (card) {
                card.style.boxShadow = 'none';
                card.style.transform = 'none';
                card.style.margin = '0';
              }
            }
          }
        }
      });

      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Cartao-MeetOff-${name?.replace(/\s+/g, "-") || "Membro"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none mt-4">
              Cartão <span className="text-brand-orange">Membro</span> MeetOff
            </h1>
            <p className="text-gray-500 font-medium max-w-md mx-auto text-sm">
              Seu passaporte digital para o ecossistema mais exclusivo de conexões e eventos premium.
            </p>
          </div>

          <div ref={cardRef} className="grid gap-12 lg:gap-16 bg-transparent p-4">
            {/* Front Card */}
            <div className="group perspective-1000">
              <div
                className="relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden transition-all duration-700 bg-cover bg-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] group-hover:scale-[1.02] group-hover:-rotate-1"
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
                className="relative w-full aspect-[1.58] rounded-[2.5rem] overflow-hidden transition-all duration-700 bg-cover bg-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] group-hover:scale-[1.02] group-hover:rotate-1"
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px] px-8 gap-2"
              onClick={handleDownloadImage}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando Imagem...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar Identidade Digital
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
