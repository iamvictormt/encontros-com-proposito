"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import { MemberCardVisual } from "@/components/member-card-visual";
import { toast } from "sonner";

interface MemberCardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    card_type: string;
    card_name: string;
    card_birth_date: string;
    card_qr_code_token: string;
    card_cvv: string;
    full_name: string;
  };
}

export function MemberCardPreviewModal({ isOpen, onClose, cardData }: MemberCardPreviewModalProps) {
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
            cloned.style.gap = '40px';
            cloned.style.padding = '0';
            
            const elements = cloned.getElementsByClassName('perspective-1000');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              el.style.perspective = 'none';
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
      link.download = `Cartao-MeetOff-${cardData.card_name?.replace(/\s+/g, "-") || "Membro"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Imagem gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar imagem");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!cardRef.current) return;
    const cards = cardRef.current.querySelectorAll('.perspective-1000');
    if (cards.length < 2) return;

    setIsGenerating(true);
    toast.info("Preparando impressão (2 páginas)...");

    try {
      const { domToPng } = await import("modern-screenshot");

      const screenshotOptions = {
        scale: 3,
        backgroundColor: 'transparent',
        onCloneNode: (cloned: Node) => {
          if (cloned instanceof HTMLElement) {
            cloned.style.perspective = 'none';
            const card = cloned.firstElementChild as HTMLElement;
            if (card) {
              card.style.boxShadow = 'none';
              card.style.transform = 'none';
              card.style.margin = '0';
            }
          }
        }
      };

      const frontImg = await domToPng(cards[0] as HTMLElement, screenshotOptions);
      const backImg = await domToPng(cards[1] as HTMLElement, screenshotOptions);

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Cartão - ${cardData.card_name}</title>
              <style>
                body { margin: 0; padding: 0; background: white; }
                .page { 
                  height: 100vh; 
                  display: flex; 
                  flex-direction: column;
                  justify-content: center; 
                  align-items: center; 
                  page-break-after: always; 
                }
                .page:last-child { page-break-after: avoid; }
                img { width: 18cm; height: auto; }
                @page { margin: 0; size: A4 portrait; }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <div class="page"><img src="${frontImg}" /></div>
              <div class="page"><img src="${backImg}" /></div>
              <script>
                window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 1000);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error("Erro ao preparar impressão:", error);
      toast.error("Erro ao preparar impressão");
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedBirthDate = cardData.card_birth_date 
    ? new Date(cardData.card_birth_date).toLocaleDateString('pt-BR') 
    : "XX/XX/XXXX";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white rounded-[2.5rem] border-none shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-8">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-brand-black">
              Visualização do <span className="text-brand-orange">Cartão</span>
            </DialogTitle>
            <div className="flex gap-2 print:hidden">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-brand-black/5 hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[9px] gap-2 h-10 px-4"
                onClick={handlePrint}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Printer size={14} />
                )}
                Imprimir
              </Button>
              <Button
                size="sm"
                className="rounded-xl bg-brand-green hover:bg-brand-green/90 text-white transition-all font-black uppercase tracking-widest text-[9px] gap-2 h-10 px-4 shadow-lg shadow-brand-green/10"
                onClick={handleDownloadImage}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Salvar PNG
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-gray-50/50 rounded-[2rem] p-4 sm:p-8 border border-brand-black/5">
          <MemberCardVisual 
            ref={cardRef}
            cardType={cardData.card_type as any}
            name={cardData.card_name}
            birthDate={formattedBirthDate}
            qrCodeToken={cardData.card_qr_code_token}
            cvv={cardData.card_cvv}
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40">
          <p>Membro: {cardData.full_name}</p>
          <p>ID do Cartão: {cardData.card_qr_code_token}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
