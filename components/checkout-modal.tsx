"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

export function CheckoutModal({
  isOpen,
  onClose,
  planType,
  amount,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  planType: "USER" | "PARTNER";
  amount: number;
  onSuccess: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  const formattedAmount = useMemo(
    () => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount),
    [amount],
  );

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
        window.location.href = data.init_point;
        return;
      }

      if (res.ok && (data.status === "active" || data.status === "pending")) {
        toast.success("Assinatura criada com sucesso.");
        onSuccess();
        onClose();
        return;
      }

      toast.error(data.message || "Erro ao processar assinatura");
      throw new Error(data.message || "Subscription failed");
    } catch (err) {
      console.error(err);
      toast.error("Erro na conexao com o servidor");
      setIsProcessing(false);
      return;
    } finally {
      if (!isOpen) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96%] sm:max-w-[525px] max-h-[92vh] bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <div className="min-h-0 overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-brand-green" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter leading-none">
              Checkout Seguro
            </DialogTitle>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">
              {planType === "USER" ? "MeetOff Usuários" : "MeetOff Parceiros"}
            </p>
            <p className="text-2xl font-black tracking-tighter text-brand-green mt-1">
              {formattedAmount}
            </p>
          </DialogHeader>

          <div className="mt-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 py-6">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
                <div className="space-y-1 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-brand-green">
                    Conectando ao Checkout
                  </p>
                  <p className="text-xs font-medium text-gray-500 max-w-[200px] leading-relaxed">
                    Preparando ambiente seguro do Mercado Pago...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={processSubscription}
                  className="w-full h-14 rounded-2xl bg-brand-green text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-green/20 hover:bg-brand-green/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <LockKeyhole className="w-4 h-4" />
                  Pagar com Mercado Pago
                </button>
                
                <p className="text-center text-[10px] text-gray-400 mt-4 px-4">
                  Você será redirecionado para o ambiente seguro do Mercado Pago para concluir sua assinatura.
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
