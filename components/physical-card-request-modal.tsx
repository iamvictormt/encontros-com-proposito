"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, CreditCard, Truck, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface PhysicalCardRequestModalProps {
  cardId: string;
  alreadyRequested?: boolean;
}

export function PhysicalCardRequestModal({ cardId, alreadyRequested = false }: PhysicalCardRequestModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [formData, setFormData] = useState({
    fullName: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (user?.full_name) {
      setFormData((prev) => ({ ...prev, fullName: user.full_name }));
    }
  }, [user]);

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maskedCep = formatCEP(value);
    const rawCep = maskedCep.replace(/\D/g, "");
    
    setFormData({ ...formData, cep: maskedCep });

    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            cep: maskedCep,
            address: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
          toast.success("Endereço preenchido automaticamente!");
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/cards/request-physical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cardId }),
      });

      if (res.ok) {
        toast.success("Solicitação enviada com sucesso!");
        setIsOpen(false);
        setStep(1);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao solicitar cartão");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          disabled={alreadyRequested}
          className="h-14 w-full sm:w-auto rounded-2xl border-brand-black/10 bg-white hover:bg-brand-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px] px-8 gap-2 disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          {alreadyRequested ? "Cartão Físico Solicitado" : "Solicitar Cartão Físico"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="space-y-3 mb-6">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-brand-black flex items-center gap-2">
              {step === 1 ? (
                <>
                  <Truck className="w-6 h-6 text-brand-orange" />
                  Dados de Entrega
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6 text-brand-orange" />
                  Pagamento da Taxa
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-medium text-sm">
              {step === 1 
                ? "Informe para onde devemos enviar seu cartão físico personalizado." 
                : "Para emitir e enviar seu cartão físico, há uma taxa única de R$ 120,30."}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Seu nome completo"
                  className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-[10px] font-black uppercase tracking-widest text-gray-400">CEP</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
                    value={formData.cep}
                    onChange={handleCepChange}
                    maxLength={9}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Número</Label>
                  <Input
                    id="number"
                    placeholder="123"
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, Avenida, etc."
                  className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bairro</Label>
                  <Input
                    id="neighborhood"
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cidade</Label>
                  <Input
                    id="city"
                    className="h-12 rounded-xl border-brand-black/5 bg-gray-50 focus:bg-white transition-all"
                    value={formData.city}
                    readOnly
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.cep || !formData.address || !formData.number || !formData.fullName}
                className="w-full h-14 rounded-2xl bg-brand-black hover:bg-brand-black/90 text-white transition-all font-black uppercase tracking-widest text-[10px] mt-4"
              >
                Próximo Passo
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="bg-gray-50 p-6 rounded-3xl border border-brand-black/5 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-black/5 pb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Produto</span>
                  <span className="text-xs font-black text-brand-black uppercase">Cartão Físico MeetOff</span>
                </div>
                <div className="flex justify-between items-center border-b border-brand-black/5 pb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Envio</span>
                  <span className="text-xs font-black text-brand-green uppercase">Grátis (Brasil)</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-brand-black uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black text-brand-orange">R$ 120,30</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simular Pagamento e Solicitar"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full h-10 rounded-xl text-gray-400 hover:text-brand-black font-black uppercase tracking-widest text-[8px]"
                >
                  Voltar para Endereço
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
