"use client";

import { useEffect, useMemo, useState } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { CheckCircle2, CreditCard, MapPin, Package, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { isPaymentTestMode, resolvePayerEmail, resolvePaymentAmount } from "@/lib/payments";
import { formatBRL } from "@/lib/utils/format";

type ProductCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  selectedSize?: string;
  onSuccess?: () => void;
};

const emptyAddress = {
  cep: "",
  state: "",
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  complement: "",
};

export function ProductCheckoutModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  onSuccess,
}: ProductCheckoutModalProps) {
  const [isBrickReady, setIsBrickReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [cepFetchedFields, setCepFetchedFields] = useState<string[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "PAYMENT">("DETAILS");
  const { user } = useAuth();
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  const isPhysical = product?.type !== "Digital";
  const originalAmount = Number(product?.price || 0);
  const amount = resolvePaymentAmount(originalAmount);
  const isTestMode = isPaymentTestMode();
  const payerEmail = resolvePayerEmail(user?.email || "");

  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  useEffect(() => {
    if (isOpen) {
      setIsBrickReady(false);
      setIsProcessing(false);
      setCustomerName(user?.fullName || "");
      setAddress(emptyAddress);
      setCepFetchedFields([]);
      setStep("DETAILS");
    }
  }, [isOpen, user?.fullName]);

  const summaryLabel = useMemo(() => {
    if (!selectedSize) return product?.name || "Produto MeetOff";
    return `${product?.name || "Produto MeetOff"} - ${selectedSize}`;
  }, [product?.name, selectedSize]);

  const handleAddressChange = (field: keyof typeof emptyAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, "").slice(0, 8);
    const maskedCep = cleanCep.length > 5 ? `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}` : cleanCep;
    handleAddressChange("cep", maskedCep);

    if (cleanCep.length !== 8) {
      setCepFetchedFields([]);
      return;
    }

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          state: data.uf || prev.state,
          city: data.localidade || prev.city,
          neighborhood: data.bairro || prev.neighborhood,
          street: data.logradouro || prev.street,
        }));
        setCepFetchedFields([
          ...(data.uf ? ["state"] : []),
          ...(data.localidade ? ["city"] : []),
          ...(data.bairro ? ["neighborhood"] : []),
          ...(data.logradouro ? ["street"] : []),
        ]);
      }
    } catch (error) {
      console.error("CEP lookup error:", error);
    } finally {
      setIsFetchingCep(false);
    }
  };

  const validateCheckout = () => {
    if (!user) {
      toast.error("Voce precisa estar logado para comprar.");
      return false;
    }

    if (isPhysical && product?.size && !selectedSize) {
      toast.error("Escolha um tamanho antes de continuar.");
      return false;
    }

    if (!customerName.trim()) {
      toast.error("Informe o nome para o pedido.");
      return false;
    }

    if (isPhysical) {
      const missingAddress = !address.cep || !address.state || !address.city || !address.neighborhood || !address.street || !address.number;
      if (missingAddress) {
        toast.error("Preencha o endereco de entrega.");
        return false;
      }
    }

    return true;
  };

  const submitOrder = async (formData: any) => {
    if (!validateCheckout()) {
      throw new Error("Invalid checkout form");
    }

    try {
      setIsProcessing(true);
      const response = await fetch("/api/product-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          selectedSize: selectedSize || null,
          customerName,
          address: isPhysical ? address : null,
          cardTokenId: formData.token,
          paymentMethodId: formData.payment_method_id,
          issuerId: formData.issuer_id,
          installments: formData.installments,
          payer: formData.payer,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar compra");
      }

      if (data.order?.payment_status === "APPROVED") {
        toast.success("Compra aprovada! Pedido salvo no seu histórico.");
      } else {
        toast.success("Pedido criado! Aguardando confirmação do pagamento.");
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Product checkout submit error:", error);
      toast.error(error.message || "Erro ao processar compra");
      setIsProcessing(false);
      return;
    } finally {
      if (!isOpen) {
        setIsProcessing(false);
      }
    }
  };

  const goToPayment = () => {
    if (!validateCheckout()) return;
    setIsBrickReady(false);
    setStep("PAYMENT");
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96%] sm:max-w-[860px] max-h-[92vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-brand-black text-white p-6 sm:p-8 flex flex-col justify-between gap-8">
            <DialogHeader className="text-left">
              <div className="w-14 h-14 bg-brand-red/15 rounded-2xl flex items-center justify-center mb-5">
                <Package className="w-7 h-7 text-brand-red" />
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
                Checkout do Produto
              </DialogTitle>
              <p className="text-[11px] font-bold text-white/55 uppercase tracking-widest mt-3 leading-relaxed">
                Pagamento transparente com a mesma experiencia visual da MeetOff.
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-white/5 border border-white/10 p-5">
                <span className="text-[9px] font-black text-brand-red uppercase tracking-[0.2em]">
                  Pedido
                </span>
                <div className="mt-3 space-y-3">
                  <p className="text-lg font-black uppercase tracking-tighter leading-tight">
                    {summaryLabel}
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {isTestMode ? "Modo teste" : isPhysical ? "Entrega fisica" : "Produto digital"}
                    </p>
                    <p className="text-3xl font-black tracking-tighter text-brand-red">
                      {formatBRL(amount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-white/50">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <CreditCard className="w-5 h-5 text-brand-red mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    Cartao seguro
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <ShieldCheck className="w-5 h-5 text-brand-red mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    Historico salvo
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-5 sm:p-8 bg-white">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-brand-black/[0.03] p-1">
              <button
                type="button"
                onClick={() => setStep("DETAILS")}
                disabled={isProcessing}
                className={`h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  step === "DETAILS"
                    ? "bg-brand-black text-white shadow-lg"
                    : "text-gray-400 hover:text-brand-black"
                }`}
              >
                1. Dados
              </button>
              <button
                type="button"
                onClick={goToPayment}
                disabled={isProcessing}
                className={`h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  step === "PAYMENT"
                    ? "bg-brand-red text-white shadow-lg"
                    : "text-gray-400 hover:text-brand-black"
                }`}
              >
                2. Pagamento
              </button>
            </div>

            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-brand-black/5 bg-brand-black/[0.03] p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black">
                  {step === "DETAILS" ? "Dados do pedido" : "Pagamento no cartao"}
                </p>
                <p className="text-[11px] font-medium text-gray-500 mt-1">
                  {step === "DETAILS"
                    ? "Confira seus dados antes de abrir o pagamento."
                    : "Seus dados de cartao sao tokenizados pelo Mercado Pago."}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
            </div>

            {step === "DETAILS" ? (
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Nome no pedido
                    </label>
                    <Input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Nome completo"
                      className="h-14 rounded-2xl bg-white border-brand-black/10 text-sm font-bold px-5"
                    />
                  </div>

                  {isPhysical && (
                    <div className="rounded-2xl border border-brand-black/5 bg-brand-black/[0.02] p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-green" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-black">
                          Entrega
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          value={address.cep}
                          onChange={(event) => handleCepChange(event.target.value)}
                          placeholder="CEP"
                          maxLength={9}
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4"
                        />
                        <Input
                          value={address.state}
                          onChange={(event) => handleAddressChange("state", event.target.value)}
                          disabled={cepFetchedFields.includes("state")}
                          placeholder="Estado"
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4 disabled:opacity-60"
                        />
                        <Input
                          value={address.city}
                          onChange={(event) => handleAddressChange("city", event.target.value)}
                          disabled={cepFetchedFields.includes("city")}
                          placeholder="Cidade"
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4 disabled:opacity-60"
                        />
                        <Input
                          value={address.neighborhood}
                          onChange={(event) => handleAddressChange("neighborhood", event.target.value)}
                          disabled={cepFetchedFields.includes("neighborhood")}
                          placeholder="Bairro"
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4 disabled:opacity-60"
                        />
                        <Input
                          value={address.street}
                          onChange={(event) => handleAddressChange("street", event.target.value)}
                          disabled={cepFetchedFields.includes("street")}
                          placeholder="Rua"
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4 disabled:opacity-60"
                        />
                        <Input
                          value={address.number}
                          onChange={(event) => handleAddressChange("number", event.target.value)}
                          placeholder="Numero"
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4"
                        />
                        <Input
                          value={address.complement}
                          onChange={(event) => handleAddressChange("complement", event.target.value)}
                          placeholder="Complemento"
                          className="h-12 rounded-2xl bg-white border-brand-black/10 text-xs font-bold px-4 sm:col-span-2"
                        />
                      </div>
                      {isFetchingCep && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-green">
                          Buscando endereco...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={goToPayment}
                  className="w-full h-14 rounded-2xl bg-brand-red text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-red/20 hover:bg-brand-red/90 transition-all active:scale-[0.98]"
                >
                  Continuar para pagamento
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep("DETAILS")}
                  disabled={isProcessing}
                  className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors disabled:opacity-40"
                >
                  Voltar para dados do pedido
                </button>
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
                              Confirmando pagamento
                            </p>
                            <p className="text-[11px] font-medium text-gray-500">
                              Mantenha esta janela aberta.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    <CardPayment
                      key={`${product.id}-${amount}`}
                      locale="pt-BR"
                      initialization={{
                        amount,
                        payer: { email: payerEmail || undefined },
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
                      onSubmit={submitOrder}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
