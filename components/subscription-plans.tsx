"use client";

import { useState } from "react";
import { Check, Loader2, Heart, Building2, Crown, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ConfirmModal } from "@/components/modals/confirm-modal";

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
  const [isCancelling, setIsCancelling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, refreshAuth } = useAuth();

  const expiryDate = user?.subscriptionExpiry ? new Date(user.subscriptionExpiry) : new Date(0);
  const isSubscribed = user?.subscriptionStatus === 'active';
  const isCanceledButValid = user?.subscriptionStatus === 'canceled' && expiryDate > new Date();

  const handleSubscribe = async (planType: "USER" | "PARTNER") => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar.");
      return;
    }

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

  const executeCancel = async () => {
    setIsModalOpen(false);
    setIsCancelling(true);
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Assinatura cancelada com sucesso!");
        refreshAuth(); // Atualiza o estado do usuário no frontend
      } else {
        toast.error(data.message || "Erro ao cancelar assinatura");
      }
    } catch (error) {
      toast.error("Erro na conexão com o servidor");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isCanceledButValid) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="relative glass p-10 rounded-[3rem] border-gray-200 shadow-2xl flex flex-col bg-white/80 backdrop-blur-xl text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-3xl font-black text-brand-black uppercase tracking-tighter mb-4">
            Assinatura em Cancelamento
          </h3>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-10 leading-relaxed">
            Você cancelou a sua assinatura, mas ainda poderá usufruir dos benefícios até:
            <br />
            <span className="text-brand-red text-lg mt-2 block">
              {expiryDate.toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-center text-gray-400 text-xs font-bold uppercase">
              Você poderá assinar um novo plano apenas após esta data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="relative glass p-10 rounded-[3rem] border-brand-red/20 shadow-2xl flex flex-col bg-white/80 backdrop-blur-xl text-center">
          <div className="bg-brand-red/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-brand-red" />
          </div>
          <h3 className="text-3xl font-black text-brand-black uppercase tracking-tighter mb-4">
            Assinatura Ativa
          </h3>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-10 leading-relaxed">
            Você já é um membro exclusivo da nossa comunidade e tem acesso a todos os benefícios.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
            <div className="flex items-center gap-3 text-left mb-2">
              <AlertTriangle className="w-5 h-5 text-brand-orange" />
              <span className="font-bold text-brand-black uppercase text-xs tracking-wider">Gerenciar Assinatura</span>
            </div>
            <p className="text-left text-gray-400 text-xs mb-4">
              Ao cancelar, você continuará com acesso até o final do período pago, mas não haverá novas cobranças.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={isCancelling}
              variant="outline"
              className="w-full h-14 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold uppercase tracking-widest text-xs transition-all"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isCancelling ? "Cancelando..." : "Cancelar Assinatura"}
            </Button>
          </div>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={executeCancel}
          title="Cancelar Assinatura"
          description="Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso aos benefícios exclusivos após o fim do período."
          confirmText="Sim, Cancelar"
          cancelText="Não, Voltar"
          variant="destructive"
        />
      </div>
    );
  }

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
