"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";

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
  const [isBrickReady, setIsBrickReady] = useState(false);
  const { user } = useAuth();

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  useEffect(() => {
    if (publicKey && isOpen) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsBrickReady(false);
    }
  }, [isOpen]);

  const formattedAmount = useMemo(
    () => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount),
    [amount],
  );

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      setIsProcessing(true);

      const deviceId = typeof window !== "undefined" ? (window as any).MP_DEVICE_SESSION_ID || null : null;

      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType,
          cardTokenId: paymentData.token,
          paymentMethodId: paymentData.payment_method_id,
          issuerId: paymentData.issuer_id,
          installments: paymentData.installments,
          payer: paymentData.payer,
          deviceId,
        }),
      });

      const data = await res.json();

      if (res.ok && (data.status === "active" || data.status === "pending")) {
        if (data.status === "pending") {
          toast.success("Pagamento em análise pelo Mercado Pago. A assinatura será ativada assim que o pagamento for confirmado.");
        } else {
          toast.success("Assinatura criada com sucesso.");
        }
        onSuccess();
        onClose();
        return;
      }

      toast.error(data.message || "Erro ao processar assinatura");
    } catch (err) {
      console.error(err);
      toast.error("Erro na conexao com o servidor");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96%] sm:max-w-[525px] max-h-[92vh] bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <div className="min-h-0 overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="text-center mb-6">
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
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-brand-black/[0.03] border border-brand-black/5 p-4">
              <LockKeyhole className="w-5 h-5 text-brand-green shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black">
                  Seus dados de cartão estão seguros
                </p>
                <p className="text-[10px] font-medium text-gray-500 mt-0.5">
                  Os dados do cartão são criptografados e enviados diretamente ao Mercado Pago.
                </p>
              </div>
            </div>

            <div className="relative mercado-pago-card-brick py-2">
              {(!isBrickReady || isProcessing) && (
                <div className="absolute inset-0 z-20 flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm">
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-green">
                    {isProcessing ? "Confirmando Assinatura..." : "Carregando checkout..."}
                  </p>
                </div>
              )}

              {publicKey ? (
                <CardPayment
                  initialization={{
                    amount,
                    payer: { email: user?.email || undefined },
                  }}
                  customization={{
                    paymentMethods: {
                      maxInstallments: 1,
                      types: { included: ["credit_card"] },
                    },
                    visual: {
                      hideFormTitle: true,
                      style: {
                        theme: "default",
                        customVariables: {
                          baseColor: "#00E08F",
                          borderRadiusMedium: "16px",
                          formBackgroundColor: "#FFFFFF",
                          inputBackgroundColor: "#FFFFFF",
                        },
                      },
                    },
                  }}
                  onReady={() => setIsBrickReady(true)}
                  onError={(error) => {
                    console.error("MP Brick error:", error);
                    toast.error("Não foi possível carregar o checkout.");
                  }}
                  onSubmit={handlePaymentSubmit}
                />
              ) : (
                <div className="rounded-2xl bg-brand-red/5 border border-brand-red/10 p-6 text-center">
                  <p className="text-xs font-bold text-brand-red uppercase tracking-widest">
                    Chave pública do Mercado Pago não configurada.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
