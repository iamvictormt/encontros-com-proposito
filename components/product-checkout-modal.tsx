"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Copy, MapPin, Package, X } from "lucide-react";
import { toast } from "sonner";
import { Payment, initMercadoPago } from "@mercadopago/sdk-react";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBrickReady, setIsBrickReady] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [cepFetchedFields, setCepFetchedFields] = useState<string[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "PAYMENT">("DETAILS");
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeBase64: string } | null>(null);
  const [pixOrderId, setPixOrderId] = useState<string | null>(null);
  const pixPollingRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const isPhysical = product?.type !== "Digital";
  const originalAmount = Number(product?.price || 0);
  const amount = resolvePaymentAmount(originalAmount);
  const isTestMode = isPaymentTestMode();
  const payerEmail = resolvePayerEmail(user?.email || "");

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
      setCustomerName(user?.fullName || "");
      setAddress(emptyAddress);
      setCepFetchedFields([]);
      setStep("DETAILS");
      setPixData(null);
      setPixOrderId(null);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, user?.fullName]);

  // Polling to check PIX payment status
  useEffect(() => {
    if (!pixData || !pixOrderId) {
      if (pixPollingRef.current) {
        clearInterval(pixPollingRef.current);
        pixPollingRef.current = null;
      }
      return;
    }

    pixPollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/product-orders/status?orderId=${pixOrderId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.paymentStatus === "APPROVED") {
          clearInterval(pixPollingRef.current!);
          pixPollingRef.current = null;
          setPixData(null);
          setPixOrderId(null);
          toast.success("Pagamento PIX confirmado! Compra realizada com sucesso.");
          onSuccess?.();
          onClose();
        }
      } catch (err) {
        // Silently ignore polling errors
      }
    }, 4000);

    return () => {
      if (pixPollingRef.current) {
        clearInterval(pixPollingRef.current);
        pixPollingRef.current = null;
      }
    };
  }, [pixData, pixOrderId, onSuccess, onClose]);

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

  const handlePaymentSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    if (!validateCheckout()) {
      return;
    }

    try {
      setIsProcessing(true);
      const deviceId = typeof window !== "undefined" ? (window as any).MP_DEVICE_SESSION_ID || null : null;

      const response = await fetch("/api/product-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          selectedSize: selectedSize || null,
          customerName,
          address: isPhysical ? address : null,
          cardTokenId: formData.token || null,
          paymentMethodId: formData.payment_method_id,
          issuerId: formData.issuer_id || null,
          installments: formData.installments || 1,
          payer: formData.payer,
          deviceId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar compra");
      }

      if (data.pix) {
        setPixData(data.pix);
        setPixOrderId(data.order?.id || null);
        return;
      }

      toast.success("Compra realizada com sucesso!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Product checkout submit error:", error);
      toast.error(error.message || "Erro ao processar compra");
    } finally {
      setIsProcessing(false);
    }
  };

  const goToPayment = () => {
    if (!validateCheckout()) return;
    setStep("PAYMENT");
  };

  if (!product || !isOpen) return null;

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
                <div className="mx-auto w-11 h-11 bg-brand-red/10 rounded-xl flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-brand-red" />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter leading-none">
                  Checkout do Produto
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                  {summaryLabel}
                </p>
                <p className="text-lg sm:text-xl font-black tracking-tighter text-brand-red mt-1">
                  {formatBRL(amount)}
                </p>
              </div>

              {/* Step tabs */}
              <div className="mb-5 grid grid-cols-2 gap-1.5 rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setStep("DETAILS")}
                  disabled={isProcessing}
                  className={`h-9 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    step === "DETAILS"
                      ? "bg-white text-brand-black shadow-sm"
                      : "text-gray-400 hover:text-brand-black"
                  }`}
                >
                  1. Dados
                </button>
                <button
                  type="button"
                  onClick={goToPayment}
                  disabled={isProcessing}
                  className={`h-9 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    step === "PAYMENT"
                      ? "bg-brand-red text-white shadow-sm"
                      : "text-gray-400 hover:text-brand-black"
                  }`}
                >
                  2. Pagamento
                </button>
              </div>

              {/* Content */}
              {step === "DETAILS" ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Nome no pedido
                    </label>
                    <Input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Nome completo"
                      className="h-11 rounded-xl bg-white border-gray-200 text-sm font-medium px-4"
                    />
                  </div>

                  {isPhysical && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-green" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-black">
                          Endereço de entrega
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={address.cep}
                          onChange={(event) => handleCepChange(event.target.value)}
                          placeholder="CEP"
                          maxLength={9}
                          className="h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3"
                        />
                        <Input
                          value={address.state}
                          onChange={(event) => handleAddressChange("state", event.target.value)}
                          disabled={cepFetchedFields.includes("state")}
                          placeholder="Estado"
                          className="h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3 disabled:opacity-60"
                        />
                        <Input
                          value={address.city}
                          onChange={(event) => handleAddressChange("city", event.target.value)}
                          disabled={cepFetchedFields.includes("city")}
                          placeholder="Cidade"
                          className="h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3 disabled:opacity-60"
                        />
                        <Input
                          value={address.neighborhood}
                          onChange={(event) => handleAddressChange("neighborhood", event.target.value)}
                          disabled={cepFetchedFields.includes("neighborhood")}
                          placeholder="Bairro"
                          className="h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3 disabled:opacity-60"
                        />
                        <Input
                          value={address.street}
                          onChange={(event) => handleAddressChange("street", event.target.value)}
                          disabled={cepFetchedFields.includes("street")}
                          placeholder="Rua"
                          className="col-span-2 h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3 disabled:opacity-60"
                        />
                        <Input
                          value={address.number}
                          onChange={(event) => handleAddressChange("number", event.target.value)}
                          placeholder="Número"
                          className="h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3"
                        />
                        <Input
                          value={address.complement}
                          onChange={(event) => handleAddressChange("complement", event.target.value)}
                          placeholder="Complemento"
                          className="h-10 rounded-lg bg-white border-gray-200 text-xs font-medium px-3"
                        />
                      </div>
                      {isFetchingCep && (
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-green animate-pulse">
                          Buscando endereço...
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={goToPayment}
                    className="w-full h-12 rounded-xl bg-brand-red text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-red/20 hover:bg-brand-red/90 transition-all active:scale-[0.98]"
                  >
                    Continuar para pagamento
                  </button>
                </div>
              ) : pixData ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase tracking-tighter text-brand-black">
                      Pedido Reservado!
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed font-medium max-w-[260px] mx-auto">
                      Pague com Pix para confirmar a sua compra. O QR code expira em 30 minutos.
                    </p>
                  </div>

                  <div className="border-t border-dashed border-gray-200 my-3" />

                  {/* QR Code */}
                  <div className="mx-auto p-3 bg-white border border-gray-100 rounded-2xl w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex items-center justify-center shadow-md">
                    {pixData.qrCodeBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                        alt="PIX QR Code"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-red border-t-transparent" />
                    )}
                  </div>

                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.qrCode);
                      toast.success("Código PIX copiado!");
                    }}
                    className="w-full h-11 rounded-xl bg-brand-black text-white font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-brand-black/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Código Pix
                  </button>

                  {/* Status indicator */}
                  <div className="inline-flex items-center gap-1.5 text-[8px] text-brand-green font-black uppercase tracking-widest bg-brand-green/5 py-1.5 px-3 rounded-full border border-brand-green/10 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                    Após pagar, o pedido aprova na hora!
                  </div>
                </div>
              ) : (
                <div className="relative mercado-pago-card-brick">
                  {(!isBrickReady || isProcessing) && (
                    <div className="absolute inset-0 z-20 flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl bg-white/95 backdrop-blur-sm">
                      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-red border-t-transparent" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-red">
                        {isProcessing ? "Confirmando Pagamento..." : "Carregando checkout..."}
                      </p>
                    </div>
                  )}

                  {publicKey ? (
                    <Payment
                      initialization={{
                        amount,
                        payer: { email: payerEmail || undefined },
                      }}
                      customization={{
                        paymentMethods: {
                          creditCard: "all",
                          debitCard: "all",
                          bankTransfer: ["pix"],
                        },
                        visual: {
                          hideFormTitle: true,
                          style: {
                            theme: "default",
                            customVariables: {
                              baseColor: "#FF1D55",
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
