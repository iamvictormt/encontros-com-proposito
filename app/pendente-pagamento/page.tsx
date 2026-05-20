"use client";

import { useEffect, useMemo, useState } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { AlertTriangle, CheckCircle2, CreditCard, Loader2, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { resolvePaymentAmount } from "@/lib/payments";

export default function PendentePagamentoPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isBrickReady, setIsBrickReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approved, setApproved] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  useEffect(() => {
    const fetchPendingOrder = async () => {
      try {
        const res = await fetch("/api/premium/pending-order");
        if (!res.ok) throw new Error("Erro ao carregar pedido");
        const data = await res.json();
        setOrder(data.order);
        setUserEmail(data.email || "");
        setUserId(data.userId);
      } catch (e) {
        toast.error("Não foi possível carregar seu pedido pendente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingOrder();
  }, []);

  const accessoryLabel = useMemo(() => {
    if (!order) return "Acessório Premium MeetOff";
    const type = order.accessory_type === "LENCOS" ? "Lenço" : "Gravata";
    return `${type} MeetOff${order.accessory_model ? ` — ${order.accessory_model}` : ""}`;
  }, [order]);

  const baseAmount = order?.accessory_type === "LENCOS" ? 199.0 : 249.0;
  const amount = resolvePaymentAmount(baseAmount);

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!order) return;
    setIsProcessing(true);
    try {
      const deviceId = typeof window !== "undefined" ? (window as any).MP_DEVICE_SESSION_ID || null : null;

      const response = await fetch("/api/premium/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          userId,
          cardTokenId: paymentData.token,
          paymentMethodId: paymentData.payment_method_id,
          issuerId: paymentData.issuer_id,
          installments: paymentData.installments,
          payer: paymentData.payer,
          deviceId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "APPROVED") {
        setApproved(true);
        toast.success("Pagamento aprovado! Bem-vindo ao MeetOff Premium!");
        // Short delay then redirect so the user sees the success state
        setTimeout(() => router.replace("/eventos"), 2500);
        return;
      }

      toast.error(
        data.message || "Pagamento recusado. Verifique os dados do cartão e tente novamente.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/entrar");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Logo className="h-8 mx-auto" />
          <div className="mt-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-brand-black leading-tight">
              Finalize sua<br />
              <span className="text-brand-red">Adesão Premium</span>
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-3 leading-relaxed max-w-sm mx-auto">
              Seu cadastro está criado, mas o pagamento do acessório precisa ser aprovado para liberar o acesso à plataforma.
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-brand-red opacity-40" />
          </div>
        ) : approved ? (
          <div className="bg-white rounded-[2rem] p-10 border border-brand-black/5 shadow-xl text-center space-y-4">
            <div className="w-20 h-20 bg-brand-green/10 rounded-[1.5rem] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-brand-green" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Aprovado!</h2>
            <p className="text-sm text-gray-500 font-medium">
              Redirecionando para a plataforma...
            </p>
            <Loader2 className="h-5 w-5 animate-spin text-brand-green mx-auto" />
          </div>
        ) : !order ? (
          <div className="bg-white rounded-[2rem] p-8 border border-brand-black/5 shadow-xl text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-brand-orange mx-auto" />
            <p className="font-black uppercase tracking-tight text-brand-black">
              Nenhum pedido pendente encontrado
            </p>
            <p className="text-sm text-gray-500">
              Se você acredita que isso é um erro, entre em contato com o suporte.
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-red hover:text-brand-red/80 transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-brand-black/5 shadow-xl overflow-hidden">
            {/* Order summary bar */}
            <div className="bg-brand-black text-white px-6 py-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-brand-orange uppercase tracking-[0.2em]">
                  Seu pedido
                </span>
                <p className="font-black uppercase tracking-tighter text-sm leading-tight">
                  {accessoryLabel}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black tracking-tighter text-brand-red">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)}
                </p>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">pagamento único</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-0 border-b border-brand-black/5">
              <div className="flex items-center gap-3 p-4 border-r border-brand-black/5">
                <CreditCard className="w-4 h-4 text-brand-green shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  Cartão tokenizado
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <LockKeyhole className="w-4 h-4 text-brand-green shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  Dados protegidos
                </span>
              </div>
            </div>

            {/* Payment brick */}
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-brand-black/[0.03] border border-brand-black/5 p-4">
                <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-black">
                    Checkout seguro — Mercado Pago
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 mt-0.5">
                    Seus dados de cartão nunca chegam ao servidor.
                  </p>
                </div>
              </div>

              <div className="relative mercado-pago-card-brick">
                {(!isBrickReady || isProcessing) && (
                  <div className="absolute inset-0 z-20 flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                      {isProcessing ? "Confirmando Pagamento..." : "Carregando checkout..."}
                    </p>
                  </div>
                )}

                {publicKey ? (
                  <CardPayment
                    key={`pending-${order.id}`}
                    initialization={{
                      amount,
                      payer: { email: userEmail || undefined },
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
        )}

        {/* Logout option */}
        {!approved && !isLoading && (
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-red transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair da conta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
