"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Loader2, Download } from "lucide-react";
import { PhysicalCardRequestModal } from "./physical-card-request-modal";
import { MemberCardVisual } from "./member-card-visual";

interface MemberCardProps {
  cardId?: string;
  hasPhysicalRequest?: boolean;
  physicalRequestStatus?: string;
  cardType?: "GREEN" | "PINK";
  name?: string;
  birthDate?: string;
  qrCodeToken?: string;
  cvv?: string;
}

export function MemberCardPage({
  cardId,
  hasPhysicalRequest = false,
  physicalRequestStatus,
  cardType = "GREEN",
  name,
  birthDate,
  qrCodeToken,
  cvv = "000",
}: MemberCardProps) {
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'PENDENTE': return "Pendente de pagamento";
      case 'PAGO': return "Pago";
      case 'EM_PRODUCAO': return "Em produção";
      case 'ENVIADO': return "Em transporte";
      case 'ENTREGUE': return "Entregue";
      default: return status || "";
    }
  };

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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-x-clip">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 blur-[120px] rounded-full -z-10" />

        <div className="w-full max-w-2xl space-y-12 relative">
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-none mt-4">
              Cartão <span className="text-brand-orange">Membro</span> MeetOff
            </h1>
          </div>

          <MemberCardVisual 
            ref={cardRef}
            cardType={cardType}
            name={name}
            birthDate={birthDate}
            qrCodeToken={qrCodeToken}
            cvv={cvv}
          />

          <div className="flex flex-col items-center gap-6 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Button 
                variant="outline" 
                className="h-14 w-full sm:w-auto rounded-2xl border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px] px-8 gap-2"
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
                    Baixar Versão Digital
                  </>
                )}
              </Button>
              
              {cardId && (
                <PhysicalCardRequestModal 
                  cardId={cardId} 
                  alreadyRequested={hasPhysicalRequest} 
                />
              )}
            </div>

            {hasPhysicalRequest && physicalRequestStatus && (
              <div className="flex items-center gap-3 px-6 py-2.5 bg-brand-black/[0.03] rounded-full border border-brand-black/5 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-brand-orange animate-ping absolute inset-0" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange relative" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-brand-black/60">
                  Status do Cartão Físico: <span className="text-brand-black">{getStatusLabel(physicalRequestStatus)}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
