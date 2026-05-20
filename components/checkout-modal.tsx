"use client";

import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:p-4">
        <div className="relative w-full sm:max-w-[500px] max-h-[95dvh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-5 sm:p-7 pb-8">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="mx-auto w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-brand-green" />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter leading-none">
                  Checkout Seguro
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                  {planType === "USER" ? "MeetOff Usuários" : "MeetOff Parceiros"}
                </p>
                <p className="text-lg sm:text-xl font-black tracking-tighter text-brand-green mt-1">
                  {formattedAmount}
                  <span className="text-[10px] font-bold text-gray-400 ml-1">/mês</span>
                </p>
              </div>

              {/* Security notice */}
              <div className="mb-4 flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 p-3.5">
                <LockKeyhole className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-black">
                    Seus dados de cartão estão seguros
                  </p>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5 leading-relaxed">
                    Os dados são criptografados e enviados diretamente ao Mercado Pago.
                  </p>
                </div>
              </div>

              {/* Payment brick */}
              <div className="relative mercado-pago-card-brick">
                {(!isBrickReady || isProcessing) && (
                  <div className="absolute inset-0 z-20 flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl bg-white/95 backdrop-blur-sm">
                    <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-green">
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
                            borderRadiusMedium: "12px",
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
                  <div className="rounded-xl bg-brand-red/5 border border-brand-red/10 p-5 text-center">
                    <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest">
                      Chave pública do Mercado Pago não configurada.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
