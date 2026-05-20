"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, MapPin, Package, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Payment, initMercadoPago } from "@mercadopago/sdk-react";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBrickReady, setIsBrickReady] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [cepFetchedFields, setCepFetchedFields] = useState<string[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "PAYMENT">("DETAILS");
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeBase64: string } | null>(null);
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

  const handlePaymentSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    if (!validateCheckout()) {
      return;
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

          // Payment details
          cardTokenId: formData.token || null,
          paymentMethodId: formData.payment_method_id,
          issuerId: formData.issuer_id || null,
          installments: formData.installments || 1,
          payer: formData.payer,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar compra");
      }

      if (data.pix) {
        setPixData(data.pix);
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

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96%] sm:max-w-[525px] max-h-[92vh] bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <div className="flex flex-col min-h-0 overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-brand-red" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter leading-none">
              Checkout do Produto
            </DialogTitle>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">
              {summaryLabel}
            </p>
            <p className="text-2xl font-black tracking-tighter text-brand-red mt-1">
              {formatBRL(amount)}
            </p>
          </DialogHeader>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-brand-black/[0.03] p-1">
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
          ) : pixData ? (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-brand-green animate-bounce" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-brand-black">
                Pedido Reservado!
              </h3>
              <p className="text-xs text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                Pague com Pix para confirmar a sua compra. O QR code expira em 30 minutos.
              </p>

              <div className="mx-auto p-4 bg-brand-black/[0.02] border border-brand-black/5 rounded-[2rem] w-[200px] h-[200px] flex items-center justify-center shadow-inner">
                {pixData.qrCodeBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                    alt="PIX QR Code"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                ) : (
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-red border-t-transparent" />
                )}
              </div>

              <div className="space-y-3 px-4">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.qrCode);
                    toast.success("Código PIX copiado!");
                  }}
                  className="w-full h-14 rounded-2xl bg-brand-black text-white font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-brand-black/90 transition-all active:scale-[0.98]"
                >
                  Copiar Código Pix
                </button>
                
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Após pagar, o pedido será aprovado automaticamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="relative mercado-pago-card-brick py-2">
                {(!isBrickReady || isProcessing) && (
                  <div className="absolute inset-0 z-20 flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-red border-t-transparent" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
