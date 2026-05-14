"use client";

import { useEffect, useMemo, useState } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
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
  const [isBrickReady, setIsBrickReady] = useState(false);
  const { user } = useAuth();
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  useEffect(() => {
    if (isOpen) {
      setIsBrickReady(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const formattedAmount = useMemo(
    () => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount),
    [amount],
  );

  const processSubscription = async (cardTokenId: string) => {
    try {
      setIsProcessing(true);

      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType, cardTokenId }),
      });

      const data = await res.json();

      if (res.ok && data.status === "active") {
        toast.success("Assinatura ativada com sucesso!");
        onSuccess();
        onClose();
        return;
      }

      if (res.ok && data.init_point) {
        window.location.href = data.init_point;
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
      <DialogContent className="w-[96%] sm:max-w-[720px] max-h-[92vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="bg-brand-black text-white p-6 sm:p-8 flex flex-col justify-between gap-8">
            <DialogHeader className="text-left">
              <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-7 h-7 text-brand-green" />
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
                Checkout Transparente
              </DialogTitle>
              <p className="text-[11px] font-bold text-white/55 uppercase tracking-widest mt-3 leading-relaxed">
                Complete sua assinatura sem sair da experiencia MeetOff.
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-white/5 border border-white/10 p-5">
                <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em]">
                  Plano selecionado
                </span>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-lg font-black uppercase tracking-tighter leading-none">
                      {planType === "USER" ? "MeetOff Usuarios" : "MeetOff Parceiros"}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-2">
                      Renovacao mensal
                    </p>
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-brand-green">
                    {formattedAmount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-white/50">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <CreditCard className="w-5 h-5 text-brand-green mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    Cartao tokenizado
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <LockKeyhole className="w-5 h-5 text-brand-green mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    Dados protegidos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-5 sm:p-8 bg-white">
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-brand-black/5 bg-brand-black/[0.03] p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black">
                  Pagamento no cartao
                </p>
                <p className="text-[11px] font-medium text-gray-500 mt-1">
                  O Mercado Pago valida os dados em ambiente seguro.
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
            </div>

            {!publicKey ? (
              <div className="rounded-2xl bg-brand-red/5 border border-brand-red/10 p-5 text-center">
                <p className="text-xs font-bold text-brand-red uppercase tracking-widest">
                  Chave publica do Mercado Pago nao configurada.
                </p>
              </div>
            ) : (
              <div className="relative mercado-pago-card-brick">
                {(!isBrickReady || isProcessing) && (
                  <div className="absolute inset-0 z-20 flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
                    {isProcessing && (
                      <div className="space-y-1 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                          Confirmando assinatura
                        </p>
                        <p className="text-[11px] font-medium text-gray-500">
                          Mantenha esta janela aberta.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <CardPayment
                  key={`${planType}-${amount}`}
                  locale="pt-BR"
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
                          baseColor: "#FF1D55",
                          borderRadiusMedium: "16px",
                          formBackgroundColor: "#FFFFFF",
                          inputBackgroundColor: "#FFFFFF",
                        },
                      },
                    },
                  }}
                  onReady={() => setIsBrickReady(true)}
                  onError={(error) => {
                    console.error("Mercado Pago Brick error:", error);
                    toast.error("Nao foi possivel carregar o checkout.");
                  }}
                  onSubmit={async (formData) => {
                    await processSubscription(formData.token);
                  }}
                />
              </div>
            )}

            {isProcessing && (
              <p className="text-center text-[10px] font-black text-brand-red uppercase tracking-widest mt-4">
                Confirmando sua assinatura...
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
