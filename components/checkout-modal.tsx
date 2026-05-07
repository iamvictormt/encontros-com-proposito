"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

let mpInitialized = false;

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
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
      
      if (!publicKey || publicKey === "INSIRA_SUA_CHAVE_PUBLICA_AQUI") {
        toast.error("Chave Pública do Mercado Pago não configurada no .env");
        setIsInitializing(false);
        return;
      }

      if (!mpInitialized) {
        initMercadoPago(publicKey, { locale: 'pt-BR' });
        mpInitialized = true;
      }

      // Pequeno delay para o brick montar corretamente no DOM
      const timer = setTimeout(() => setIsInitializing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const initialization = {
    amount: amount,
    payer: {
      email: user?.email || "",
    },
  };

  const customization = {
    visual: {
      style: {
        theme: "default",
        customVariables: {
          formPadding: "0px",
          baseColor: "#0A4742",
        }
      },
    },
    paymentMethods: {
      maxInstallments: 1,
    },
  };

  const onSubmit = async (formData: any) => {
    return new Promise<void>((resolve, reject) => {
      const cardTokenId = formData.token;
      if (!cardTokenId) {
        toast.error("Erro ao processar dados do cartão");
        reject();
        return;
      }

      fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType, cardTokenId }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok && data.id) {
            toast.success("Assinatura ativada com sucesso!");
            onSuccess();
            onClose();
            resolve();
          } else {
            toast.error(data.message || "Erro ao processar assinatura");
            reject();
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Erro na conexão com o servidor");
          reject();
        });
    });
  };

  const onError = async (error: any) => {
    console.error(error);
    if (error?.message) {
      toast.error("Verifique os dados informados e tente novamente.");
    }
  };

  const onReady = async () => {
    // Brick is ready
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-black text-brand-black uppercase tracking-tighter">
            Finalizar Assinatura
          </DialogTitle>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Pagamento Seguro via Mercado Pago
          </p>
        </DialogHeader>

        <div className="px-6 py-4 bg-brand-black/5 border-y border-brand-black/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Valor do Plano</span>
            <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">Recorrência Mensal</span>
          </div>
          <span className="text-2xl font-black text-brand-black tracking-tighter">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
          </span>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {!isInitializing && (
            <CardPayment
              initialization={initialization}
              customization={customization as any}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={onError}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
