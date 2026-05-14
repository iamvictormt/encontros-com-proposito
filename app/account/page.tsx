"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, CreditCard, ArrowRight, Calendar, LogOut, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { ChangePasswordModal } from "@/components/modals/change-password-modal";
import { cn, formatName } from "@/lib/utils";
import { toast } from "sonner";
import { formatBRL } from "@/lib/utils/format";

export default function AccountPage() {
  const { user, isLoggedIn, isLoading, logout, refreshAuth } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [productOrders, setProductOrders] = useState<any[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [isProductOrdersLoading, setIsProductOrdersLoading] = useState(false);
  const [isModeUpdating, setIsModeUpdating] = useState(false);

  useEffect(() => {
    if (user?.userCategory === "PREMIUM") {
      setIsOrderLoading(true);
      fetch("/api/premium/my-order")
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
        })
        .finally(() => setIsOrderLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setIsProductOrdersLoading(true);
    fetch("/api/product-orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.orders)) setProductOrders(data.orders);
      })
      .catch((error) => {
        console.error("Error fetching product orders:", error);
      })
      .finally(() => setIsProductOrdersLoading(false));
  }, [user]);

  const getStatusInfo = (status: string) => {
    const config: Record<string, { label: string; icon: any; color: string; bg: string }> = {
      PENDING: { label: "Pendente", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
      SENT: { label: "Enviado", icon: ArrowRight, color: "text-blue-600", bg: "bg-blue-50" },
      DELIVERED: {
        label: "Entregue",
        icon: Shield,
        color: "text-brand-green",
        bg: "bg-brand-green/10",
      },
      READY_FOR_PICKUP: {
        label: "Pronto para Retirada",
        icon: MapPin,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      PICKED_UP: { label: "Retirado", icon: User, color: "text-gray-600", bg: "bg-gray-50" },
      CANCELADO: { label: "Cancelado", icon: LogOut, color: "text-red-600", bg: "bg-red-50" },
    };
    return config[status] || config.PENDING;
  };

  const getProductOrderStatusInfo = (status: string) => {
    const config: Record<string, { label: string; color: string; bg: string }> = {
      APPROVED: { label: "Pago", color: "text-brand-green", bg: "bg-brand-green/10" },
      PENDING: { label: "Pendente", color: "text-amber-600", bg: "bg-amber-50" },
      REJECTED: { label: "Recusado", color: "text-red-600", bg: "bg-red-50" },
      CANCELLED: { label: "Cancelado", color: "text-red-600", bg: "bg-red-50" },
    };
    return config[status] || config.PENDING;
  };

  const handleProfileModeChange = async (mode: "COMUM" | "PREMIUM") => {
    if (user?.userCategory === mode) return;

    setIsModeUpdating(true);
    try {
      const response = await fetch("/api/account/profile-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao alterar perfil");
      }

      await refreshAuth();
      toast.success(mode === "PREMIUM" ? "Perfil premium ativado" : "Perfil comum ativado");
    } catch (error: any) {
      console.error("Profile mode update error:", error);
      toast.error(error.message || "Erro ao alterar perfil");
    } finally {
      setIsModeUpdating(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      redirect("/login");
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="px-4 sm:px-8 py-10 sm:py-16 lg:px-20 relative">
        <main className="mx-auto max-w-7xl">
          <header className="mb-10 sm:mb-16 space-y-4 relative text-center sm:text-left">
            <span className="glass-dark px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              Dashboard Pessoal
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-brand-black uppercase tracking-tighter leading-tight mt-4">
              Minha <span className="text-brand-orange">Conta</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-xl text-sm sm:text-lg mx-auto sm:mx-0 text-pretty">
              Gerencie sua identidade digital e acesse seus benefícios exclusivos na MeetOff.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 relative">
            {/* Sidebar / Info */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <div className="glass p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/40 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-brand-green/10 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
                  <User className="w-8 h-8 sm:w-12 sm:h-12 text-brand-green" />
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-brand-orange rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
                <div className="space-y-1 relative">
                  <h2 className="font-black text-lg sm:text-2xl text-brand-black uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">
                    {user.fullName ? formatName(user.fullName) : "Membro MeetOff"}
                  </h2>
                </div>
                <div className="w-full pt-4 sm:pt-6 border-t border-brand-black/5 relative space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="w-full h-12 sm:h-14 rounded-xl border-brand-black/10 font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-brand-black hover:text-white transition-all"
                  >
                    Editar Perfil
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => logout()}
                    className="w-full h-12 sm:h-14 rounded-xl text-brand-red font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-brand-red/5 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} className="sm:w-4 sm:h-4" />
                    Sair da Conta
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-12">
              {user.userCategory === "PREMIUM" ? (
                <div
                  id="pedido"
                  className="glass p-5 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-white/40 shadow-2xl relative overflow-hidden group"
                >
                  <div className="space-y-6 sm:space-y-8 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1 sm:space-y-2">
                        <span className="text-[8px] sm:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                          Logística Premium
                        </span>
                        <h3 className="font-black text-xl sm:text-3xl text-brand-black uppercase tracking-tighter">
                          Seu Acessório Premium
                        </h3>
                      </div>
                      {order && (
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest",
                            getStatusInfo(order.status).bg,
                            getStatusInfo(order.status).color,
                          )}
                        >
                          {order.status === "SENT" ? (
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                          ) : (
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          {getStatusInfo(order.status).label}
                        </div>
                      )}
                    </div>

                    {isOrderLoading ? (
                      <div className="py-8 sm:py-12 flex justify-center grayscale opacity-30">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-solid border-brand-orange border-r-transparent"></div>
                      </div>
                    ) : order ? (
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 sm:gap-8 bg-brand-black/[0.02] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-black/5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Produto Solicitado
                            </span>
                            <p className="text-[8px] sm:text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                              {order.accessory_model || "Modelo Padrão"}
                            </p>
                          </div>
                          <div className="space-y-1 pt-3 sm:pt-4 border-t border-brand-black/5">
                            <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Forma de Entrega
                            </span>
                            <p className="text-xs sm:text-sm font-black text-brand-black uppercase tracking-tight">
                              {order.delivery_method === "RESIDENTIAL"
                                ? "Entrega em Domicílio"
                                : "Retirada no Local"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center sm:items-end text-center sm:text-right space-y-4 mt-2 sm:mt-0">
                          <div className="w-full sm:w-auto p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-brand-black/5 flex flex-col items-center sm:items-end">
                            <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Status Atual
                            </span>
                            <p
                              className={cn(
                                "text-xl sm:text-2xl font-black uppercase tracking-tighter",
                                getStatusInfo(order.status).color,
                              )}
                            >
                              {getStatusInfo(order.status).label}
                            </p>
                            <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium mt-1.5 sm:mt-2">
                              Solicitado em {new Date(order.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-brand-orange/5 p-8 sm:p-12 rounded-[2rem] border border-brand-orange/10 text-center space-y-6">
                        <div className="space-y-2">
                          <p className="text-sm sm:text-base font-black text-brand-black uppercase tracking-tight">
                            Acessório não solicitado
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-gray-500 px-4 max-w-sm mx-auto leading-relaxed">
                            Você ainda não solicitou seu acessório exclusivo{" "}
                            <span className="text-brand-orange font-bold">MeetOff Premium</span>.
                            Garanta o seu agora para viver a experiência completa!
                          </p>
                        </div>
                        <Button
                          asChild
                          className="h-12 sm:h-14 rounded-2xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest text-[10px] px-10 shadow-xl shadow-brand-orange/20"
                        >
                          <Link href="/premium-flow">Solicitar Meu Acessório</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Member Card Teaser - Only for Normal Users */
                <div className="glass p-5 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3.5rem] border-white/40 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 blur-[80px] -mr-32 -mt-32 rounded-full" />

                  <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center relative">
                    <div className="w-full max-w-[240px] sm:max-w-[280px] md:w-1/3 aspect-[1.58] bg-brand-black rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                      <div className="flex justify-between items-start">
                        <div className="w-7 h-5 sm:w-8 sm:h-6 bg-white/20 rounded-md" />
                        <CreditCard className="text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-brand-orange rounded-full" />
                        <p className="text-[7px] sm:text-[8px] font-mono text-white/40 uppercase tracking-widest">
                          Cartão MeetOff
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 sm:space-y-6 text-center md:text-left">
                      <div className="space-y-1 sm:space-y-2">
                        <h3 className="font-black text-xl sm:text-3xl text-brand-black uppercase tracking-tighter leading-tight">
                          Seu Acesso Premium
                        </h3>
                        <p className="text-xs sm:text-base text-gray-500 font-medium leading-relaxed">
                          Sua credencial digital MeetOff garante acesso antecipado a eventos e
                          benefícios exclusivos.
                        </p>
                      </div>
                      <Button
                        asChild
                        className="h-12 sm:h-14 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-[9px] sm:text-[10px] px-6 sm:px-8 shadow-xl shadow-brand-green/20 group w-full sm:w-auto"
                      >
                        <Link
                          href="/member-card"
                          className="flex items-center justify-center gap-2 sm:gap-3"
                        >
                          Acessar Cartão Digital
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {user.hasPremiumAccessory && (
                <div className="glass p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-white/40 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] sm:text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">
                        Modo de Navegacao
                      </span>
                      <h3 className="font-black text-lg sm:text-2xl text-brand-black uppercase tracking-tighter">
                        Perfil MeetOff
                      </h3>
                    </div>
                    <div className="inline-flex rounded-2xl bg-brand-black/5 p-1">
                      <Button
                        type="button"
                        disabled={isModeUpdating}
                        onClick={() => handleProfileModeChange("COMUM")}
                        className={cn(
                          "h-11 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest shadow-none",
                          user.userCategory === "COMUM"
                            ? "bg-brand-green text-white hover:bg-brand-green/90"
                            : "bg-transparent text-brand-black hover:bg-white",
                        )}
                      >
                        Usuario
                      </Button>
                      <Button
                        type="button"
                        disabled={isModeUpdating}
                        onClick={() => handleProfileModeChange("PREMIUM")}
                        className={cn(
                          "h-11 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest shadow-none",
                          user.userCategory === "PREMIUM"
                            ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                            : "bg-transparent text-brand-black hover:bg-white",
                        )}
                      >
                        Premium
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                    Seu acesso premium segue liberado em qualquer modo. Use o perfil comum para ver
                    a experiencia MeetOff aberta, ou volte ao premium para os eventos e areas
                    exclusivas.
                  </p>
                </div>
              )}

              <div className="glass p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/40 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] sm:text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">
                      Historico
                    </span>
                    <h3 className="font-black text-lg sm:text-2xl text-brand-black uppercase tracking-tighter">
                      Pedidos da Loja
                    </h3>
                  </div>
                </div>

                {isProductOrdersLoading ? (
                  <div className="py-8 flex justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-brand-red border-r-transparent"></div>
                  </div>
                ) : productOrders.length > 0 ? (
                  <div className="space-y-3">
                    {productOrders.slice(0, 5).map((productOrder) => {
                      const paymentStatus = getProductOrderStatusInfo(productOrder.payment_status);
                      return (
                        <div
                          key={productOrder.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-brand-black/[0.02] border border-brand-black/5 p-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-black uppercase tracking-tight text-brand-black truncate">
                                {productOrder.product_name}
                              </p>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                                #{productOrder.id.substring(0, 8).toUpperCase()} - {new Date(productOrder.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <span
                              className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                paymentStatus.bg,
                                paymentStatus.color,
                              )}
                            >
                              {paymentStatus.label}
                            </span>
                            <span className="text-sm font-black text-brand-black">
                              {formatBRL(productOrder.total_amount)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-brand-black/[0.02] border border-brand-black/5 p-8 text-center">
                    <p className="text-sm font-black text-brand-black uppercase tracking-tight">
                      Nenhum pedido de produto ainda
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-2">
                      Suas compras aprovadas e pendentes vao aparecer aqui.
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Data Grid */}
              <div className="glass p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/40 shadow-xl space-y-6 sm:space-y-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-1 w-8 sm:w-12 bg-brand-red rounded-full" />
                  <h3 className="font-black text-base sm:text-xl text-brand-black uppercase tracking-tight">
                    Dados de Segurança
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
                  <div className="flex items-center gap-4 sm:gap-6 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-black/5 flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shrink-0">
                      <Mail size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        E-mail Principal
                      </p>
                      <p className="text-brand-black font-black uppercase tracking-tight text-xs sm:text-base truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-black/5 flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shrink-0">
                      <Calendar size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Nascimento
                      </p>
                      <p className="text-brand-black font-black uppercase tracking-tight text-xs sm:text-base">
                        {user.birthDate
                          ? new Date(user.birthDate).toLocaleDateString("pt-BR")
                          : "---"}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="flex items-center gap-4 sm:gap-6 group cursor-pointer hover:translate-x-1 sm:hover:translate-x-2 transition-all md:col-span-2 lg:col-span-1"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all shrink-0">
                      <Shield size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Segurança
                      </p>
                      <p className="text-brand-black font-black uppercase tracking-tight text-xs sm:text-base">
                        Alterar Minha Senha
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-brand-black/20 group-hover:text-brand-orange group-hover:translate-x-2 transition-all hidden xs:block"
                    />
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-brand-black/5">
                  <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium italic leading-relaxed">
                    * Suas informações são protegidas por criptografia e nunca serão compartilhadas
                    sem seu consentimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <SiteFooter />
    </div>
  );
}
