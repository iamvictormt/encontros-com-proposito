"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Package, Truck, CheckCircle, Clock, MapPin, Printer, User, Mail, Calendar, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PremiumOrder {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  accessory_type: string;
  accessory_model: string;
  delivery_method: string;
  address_cep: string;
  address_state: string;
  address_city: string;
  address_neighborhood: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  status: string;
  created_at: string;
}

interface PremiumOrdersListProps {
  orders: PremiumOrder[];
  onUpdateStatus: (id: string, status: string) => void;
  onPrintLabel: (order: PremiumOrder) => void;
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  PENDING: { label: "Confirmado", icon: Clock, color: "text-brand-orange", bg: "bg-brand-orange/10" },
  SENT: { label: "Em Trânsito", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
  DELIVERED: { label: "Concluído", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  READY_FOR_PICKUP: { label: "Disponível", icon: MapPin, color: "text-purple-600", bg: "bg-purple-50" },
  PICKED_UP: { label: "Concluído", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
  CANCELADO: { label: "Cancelado", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export function PremiumOrdersList({ orders, onUpdateStatus, onPrintLabel }: PremiumOrdersListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-6">
      {orders.map((order) => {
        const status = statusConfig[order.status] || statusConfig.PENDING;
        return (
          <div key={order.id} className="glass rounded-[1.5rem] sm:rounded-[2rem] border-white/20 shadow-lg p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 sm:p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl hover:bg-brand-black/5">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-brand-black/40" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass border-white/20 p-2 rounded-2xl shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-brand-black/5 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Mudar Status</span>
                  </div>
                  <DropdownMenuItem 
                    disabled={order.status === "PENDING"}
                    onSelect={() => onUpdateStatus(order.id, "PENDING")} 
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-black/5 cursor-pointer disabled:opacity-30"
                  >
                    Confirmado
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={order.status === "SENT"}
                    onSelect={() => onUpdateStatus(order.id, "SENT")} 
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-black/5 cursor-pointer disabled:opacity-30"
                  >
                    Em Trânsito
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={order.status === "DELIVERED"}
                    onSelect={() => onUpdateStatus(order.id, "DELIVERED")} 
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-black/5 cursor-pointer disabled:opacity-30"
                  >
                    Concluído
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={order.status === "READY_FOR_PICKUP"}
                    onSelect={() => onUpdateStatus(order.id, "READY_FOR_PICKUP")} 
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-black/5 cursor-pointer disabled:opacity-30"
                  >
                    Disponível p/ Retirada
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={order.status === "PICKED_UP"}
                    onSelect={() => onUpdateStatus(order.id, "PICKED_UP")} 
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-black/5 cursor-pointer disabled:opacity-30"
                  >
                    Concluído (Retirado)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={order.status === "CANCELADO"}
                    onSelect={() => onUpdateStatus(order.id, "CANCELADO")} 
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 text-red-600 cursor-pointer disabled:opacity-30"
                  >
                    Cancelar Pedido
                  </DropdownMenuItem>
                  <div className="my-2 border-t border-brand-black/5 pt-2">
                    <DropdownMenuItem onSelect={() => onPrintLabel(order)} className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-orange hover:bg-brand-orange/10 flex items-center gap-2 cursor-pointer">
                      <Printer className="w-4 h-4" />
                      Imprimir Etiqueta
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-black text-white flex items-center justify-center font-black shadow-lg shadow-brand-black/10 flex-shrink-0">
                  <User size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-black uppercase tracking-tight text-brand-black leading-tight text-sm sm:text-base truncate">
                    {order.user_name}
                  </h4>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="truncate">{order.user_email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 sm:pt-2">
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full flex-shrink-0",
                  status.bg,
                  status.color
                )}>
                  <status.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black text-brand-black/40 uppercase tracking-widest">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {format(new Date(order.created_at), "dd/MM/yy", { locale: ptBR })}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-brand-black/[0.02] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-brand-black/5">
              <div className="flex justify-between items-start gap-2 sm:gap-4">
                <div className="space-y-0.5">
                  <span className="text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest">Item</span>
                  <p className="text-[9px] sm:text-[10px] font-black text-brand-red uppercase tracking-tight">
                    {order.accessory_type}
                  </p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate max-w-[80px] sm:max-w-[120px]">
                    {order.accessory_model || "Padrão"}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest">Entrega</span>
                  <p className="text-[9px] sm:text-[10px] font-black text-brand-black uppercase tracking-tight">
                    {order.delivery_method === "RESIDENTIAL" ? "Domicílio" : "Retirada"}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-black/5">
                <span className="text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Destino</span>
                <p className="text-[9px] sm:text-[10px] font-bold text-brand-black/80 leading-relaxed uppercase tracking-tight">
                  {order.address_street}, {order.address_number}<br />
                  {order.address_city}/{order.address_state} • {order.address_cep}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-2">
              <span className="text-[8px] sm:text-[9px] font-black text-brand-orange uppercase tracking-widest">
                #{order.id.substring(0, 8).toUpperCase()}
              </span>
              <Button 
                onClick={() => onPrintLabel(order)}
                variant="ghost" 
                size="sm"
                className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-brand-orange/10 hover:text-brand-orange transition-all flex items-center gap-1.5 sm:gap-2"
              >
                <Printer className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden xs:inline">Etiqueta</span>
                <span className="inline xs:hidden">Etq</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
