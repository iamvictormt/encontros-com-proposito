"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, ArrowRight, CreditCard, QrCode } from "lucide-react";

export function CheckoutModal({
  isOpen,
  onClose,
  planType,
  amount,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  planType: "USER" | "PARTNER";
  amount: number;
  onSuccess: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const processSubscription = async () => {
    try {
      setIsProcessing(true);
      
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.init_point) {
        // Redirecionar para o ambiente seguro do Mercado Pago
        window.location.href = data.init_point;
      } else {
        toast.error(data.message || "Erro ao processar assinatura");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro na conexão com o servidor");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95%] sm:max-w-[450px] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <DialogHeader className="p-6 sm:p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-brand-green" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-brand-black uppercase tracking-tighter">
            Assinatura Segura
          </DialogTitle>
          <p className="text-[12px] font-medium text-gray-500 mt-2">
            Você será redirecionado para o ambiente seguro do Mercado Pago para escolher a sua forma de pagamento.
          </p>
        </DialogHeader>

        <div className="px-6 sm:px-8 py-6 bg-brand-black/5 border-y border-brand-black/5 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
              Plano Selecionado
            </span>
            <span className="text-sm font-bold text-brand-black">
              {planType === "USER" ? "MeetOff Usuários" : "MeetOff Parceiros"}
            </span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-brand-green uppercase tracking-widest leading-none mb-1">
              Mensal
            </span>
            <span className="text-xl sm:text-2xl font-black text-brand-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
            </span>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center gap-4 mb-6 text-gray-400">
            <div className="flex items-center gap-2">
               <CreditCard className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-wider">Cartão</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
               <QrCode className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-wider">Pix</span>
            </div>
          </div>

          <button 
            onClick={processSubscription}
            disabled={isProcessing}
            className="w-full bg-[#009EE3] text-white font-bold h-14 rounded-[20px] flex items-center justify-center gap-2 hover:bg-[#0089C5] transition-colors disabled:opacity-70 shadow-lg shadow-[#009EE3]/20"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Ir para o Pagamento <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest font-semibold">
            Processado de forma 100% segura pelo Mercado Pago
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
