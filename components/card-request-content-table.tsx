import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { Truck, Printer, Eye, MapPin, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CardRequest {
  id: string;
  user_id: string;
  card_id: string;
  full_name: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  status: string;
  amount: number;
  created_at: string;
  user_email: string;
  card_type: string;
}

export function CardRequestContentTable({ 
  requests = [], 
  onView,
  onUpdateStatus,
  onPrintLabel
}: { 
  requests?: CardRequest[],
  onView?: (request: CardRequest) => void,
  onUpdateStatus?: (id: string, status: string) => void,
  onPrintLabel?: (request: CardRequest) => void
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDENTE': return { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'PAGO': return { label: 'Pago / Preparar', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'EM_PRODUCAO': return { label: 'Em Produção', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
      case 'ENVIADO': return { label: 'Enviado', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'ENTREGUE': return { label: 'Entregue', color: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/20' };
      case 'CANCELADO': return { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      default: return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {requests.map((request, i) => {
        const status = getStatusConfig(request.status);
        return (
          <div
            key={i}
            className="group premium-card bg-white rounded-[2rem] border-none shadow-sm p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-brand-black/5"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="min-w-0">
                <h4 className="font-black text-brand-black text-lg uppercase tracking-tighter leading-tight mb-1 group-hover:text-brand-orange transition-colors truncate">
                  {request.full_name}
                </h4>
                <p className="text-[10px] text-gray-400 font-medium lowercase truncate">{request.user_email}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-black/5 flex items-center justify-center text-brand-black/40 flex-shrink-0">
                  <MapPin size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-black/30 leading-none mb-1">Endereço de Entrega</p>
                  <p className="text-[10px] font-bold text-brand-black leading-tight">
                    {request.address}, {request.number} {request.complement ? `- ${request.complement}` : ''}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {request.neighborhood} - {request.city}/{request.state}
                  </p>
                  <p className="text-[10px] text-brand-orange font-black mt-1">{request.cep}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-black/5 flex items-center justify-center text-brand-black/40">
                  <Truck size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-black/30 leading-none mb-1">Data da Solicitação</p>
                  <p className="text-[10px] font-bold text-brand-black">{new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-black/5 flex items-center justify-center text-brand-black/40">
                  <Truck size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-black/30 leading-none mb-1">Status</p>
                  {status.label}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-green/5 flex gap-2">
              <Button 
                onClick={() => {
                  console.log("Viewing card for", request.full_name);
                  onView?.(request);
                }} 
                className="flex-1 h-12 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all gap-2"
              >
                <Eye size={12} />
                Ver Cartão
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-12 h-12 border-brand-black/10 text-brand-black hover:bg-brand-black hover:text-white rounded-xl transition-all flex items-center justify-center p-0"
                  >
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl border-brand-black/5 shadow-2xl p-2 w-56">
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      onPrintLabel?.(request);
                    }}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 py-3"
                  >
                    Imprimir Etiqueta
                  </DropdownMenuItem>
                  <div className="h-px bg-brand-black/5 my-2" />
                  <DropdownMenuItem 
                    disabled={request.status === 'PAGO'}
                    onSelect={(e) => {
                      e.preventDefault();
                      onUpdateStatus?.(request.id, 'PAGO');
                    }}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 py-3 disabled:opacity-30"
                  >
                    Marcar como Pago
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={request.status === 'EM_PRODUCAO'}
                    onSelect={(e) => {
                      e.preventDefault();
                      onUpdateStatus?.(request.id, 'EM_PRODUCAO');
                    }}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 py-3 disabled:opacity-30"
                  >
                    Marcar como Em Produção
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={request.status === 'ENVIADO'}
                    onSelect={(e) => {
                      e.preventDefault();
                      onUpdateStatus?.(request.id, 'ENVIADO');
                    }}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 py-3 disabled:opacity-30"
                  >
                    Marcar como Enviado
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={request.status === 'ENTREGUE'}
                    onSelect={(e) => {
                      e.preventDefault();
                      onUpdateStatus?.(request.id, 'ENTREGUE');
                    }}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 py-3 disabled:opacity-30"
                  >
                    Marcar como Entregue
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    disabled={request.status === 'CANCELADO'}
                    onSelect={(e) => {
                      e.preventDefault();
                      onUpdateStatus?.(request.id, 'CANCELADO');
                    }}
                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 py-3 text-red-600 disabled:opacity-30"
                  >
                    Cancelar Solicitação
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
