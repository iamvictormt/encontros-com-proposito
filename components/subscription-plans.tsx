"use client";

import { useState } from "react";
import { Check, Loader2, Heart, Building2, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const USER_PLAN_FEATURES = [
  "Relacionamentos-Namoros-Encontros-Compromisso Sério",
  "Participar de diversos grupo de whatsapp",
  "Familias-Casais-Amizades",
  "Cartão de membro virtual",
  "Networking e Negócios",
  "Acesso à lista de eventos online e presenciais",
  "Parceiros de viagens-atividades",
  "Produtos autorais exclusivos",
];

const PARTNER_PLAN_FEATURES = [
  "Ponto de encontro",
  "Ponto de referência",
  "Administradores-de-comunidades-grupos-anfitriões-cupidos-afiliados",
  "Cartões físicos para identificação de membros nos eventos",
  "Empreendedor-empresários-influencers-criador de conteúdos",
  "Criar eventos-passeios-viagens-excursões etc.",
  "Placa de identificação para localização de membros",
  "Profissionais certificados",
];

export function SubscriptionPlans() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planType: "USER" | "PARTNER") => {
    setLoading(planType);
    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (response.ok && data.init_point) {
        window.location.href = data.init_point;
      } else {
        toast.error(data.message || "Erro ao iniciar assinatura");
      }
    } catch (error) {
      toast.error("Erro na conexão com o servidor");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 py-12">
      {/* User Plan */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-brand-orange rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass p-10 rounded-[3rem] border-white/40 shadow-2xl flex flex-col h-full bg-white/80 backdrop-blur-xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-brand-red/10 p-3 rounded-2xl">
                <Heart className="w-8 h-8 text-brand-red" />
              </div>
              <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em] bg-brand-red/5 px-3 py-1 rounded-full">
                Individual
              </span>
            </div>
            <h3 className="text-3xl font-black text-brand-black uppercase tracking-tighter">
              Usuários
            </h3>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              Mensalmente
            </p>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            {USER_PLAN_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 group/item">
                <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover/item:bg-brand-green/20">
                  <Check className="w-3 h-3 text-brand-green" strokeWidth={4} />
                </div>
                <span className="text-sm font-bold text-gray-600 leading-tight uppercase tracking-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="mb-6">
              <span className="text-4xl font-black text-brand-black tracking-tighter">
                R$ 170,30
              </span>
              <span className="text-gray-400 font-bold text-sm uppercase ml-2">/ mês</span>
            </div>
            <Button
              onClick={() => handleSubscribe("USER")}
              disabled={!!loading}
              className="w-full h-16 rounded-2xl bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-red/20 transition-all active:scale-[0.98]"
            >
              {loading === "USER" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Assinar Agora"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Partner Plan */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-green to-brand-orange rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass p-10 rounded-[3rem] border-white/40 shadow-2xl flex flex-col h-full bg-brand-black text-white">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-brand-green/20 p-3 rounded-2xl">
                <Building2 className="w-8 h-8 text-brand-green" />
              </div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] bg-brand-green/10 px-3 py-1 rounded-full">
                Business
              </span>
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
              Empresas <span className="text-brand-green">&</span> Parceiros
            </h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Mensalmente
            </p>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            {PARTNER_PLAN_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 group/item">
                <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover/item:bg-brand-green/40">
                  <Check className="w-3 h-3 text-brand-green" strokeWidth={4} />
                </div>
                <span className="text-sm font-bold text-gray-300 leading-tight uppercase tracking-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="mb-6">
              <span className="text-4xl font-black text-white tracking-tighter">
                R$ 232,70
              </span>
              <span className="text-gray-500 font-bold text-sm uppercase ml-2">/ mês</span>
            </div>
            <Button
              onClick={() => handleSubscribe("PARTNER")}
              disabled={!!loading}
              className="w-full h-16 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-green/20 transition-all active:scale-[0.98]"
            >
              {loading === "PARTNER" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Seja um Parceiro"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
