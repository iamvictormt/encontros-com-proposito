"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { formatBRL } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface ProductOrder {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: string;
  total_amount: string;
  selected_size: string | null;
  product_type: string | null;
  delivery_method: string;
  payment_status: string;
  fulfillment_status: string;
  address_city: string | null;
  address_state: string | null;
  created_at: string;
}

const paymentStatusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  APPROVED: { label: "Pago", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
  PENDING: { label: "Aguardando Pagamento", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  REJECTED: { label: "Recusado", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
  CANCELLED: { label: "Cancelado", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

const fulfillmentStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Processando", color: "text-gray-500" },
  PAID: { label: "Pago - Aguardando Envio", color: "text-amber-600" },
  SENT: { label: "Enviado", color: "text-blue-600" },
  DELIVERED: { label: "Entregue", color: "text-emerald-600" },
};

export default function OrdersHistoryPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/entrar");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;

    setIsOrdersLoading(true);
    fetch("/api/product-orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => setIsOrdersLoading(false));
  }, [user]);

  const getPaymentStatus = (status: string) => {
    return paymentStatusConfig[status] || paymentStatusConfig.PENDING;
  };

  const getFulfillmentStatus = (status: string) => {
    return fulfillmentStatusConfig[status] || fulfillmentStatusConfig.PENDING;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50/50 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/conta"
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors mb-4"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Minha Conta
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-brand-red" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
                  Meus Pedidos
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Histórico completo de compras
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isOrdersLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-400">
                Nenhum pedido encontrado
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Seus pedidos aparecerão aqui após a primeira compra.
              </p>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-red/90 transition-colors"
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const payment = getPaymentStatus(order.payment_status);
                const fulfillment = getFulfillmentStatus(order.fulfillment_status);
                const PaymentIcon = payment.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                          {order.product_image ? (
                            <Image
                              src={order.product_image}
                              alt={order.product_name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Order info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-brand-black truncate">
                                {order.product_name}
                              </h3>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                #{order.id.substring(0, 8).toUpperCase()} •{" "}
                                {new Date(order.created_at).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <span className="text-base sm:text-lg font-black text-brand-black whitespace-nowrap">
                              {formatBRL(order.total_amount)}
                            </span>
                          </div>

                          {/* Details row */}
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            {/* Payment status badge */}
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                payment.bg,
                                payment.color,
                              )}
                            >
                              <PaymentIcon className="w-3 h-3" />
                              {payment.label}
                            </span>

                            {/* Size */}
                            {order.selected_size && (
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                                Tam: {order.selected_size}
                              </span>
                            )}

                            {/* Quantity */}
                            {order.quantity > 1 && (
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                                Qtd: {order.quantity}
                              </span>
                            )}
                          </div>

                          {/* Fulfillment & delivery info */}
                          {order.payment_status === "APPROVED" && (
                            <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-gray-50">
                              <span className={cn("text-[9px] font-bold uppercase tracking-widest", fulfillment.color)}>
                                {fulfillment.label}
                              </span>

                              {order.delivery_method === "DELIVERY" && order.address_city && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-gray-400">
                                  <MapPin className="w-3 h-3" />
                                  {order.address_city}{order.address_state ? `, ${order.address_state}` : ""}
                                </span>
                              )}

                              {order.delivery_method === "DIGITAL" && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-gray-400">
                                  <Package className="w-3 h-3" />
                                  Digital
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
