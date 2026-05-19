"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Loader2, PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PremiumOrdersList } from "@/components/premium-orders-table";
import { ConfirmModal } from "@/components/modals/confirm-modal";

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

const statusLabels: Record<string, string> = {
  PENDING: "Confirmado",
  SENT: "Em Trânsito",
  DELIVERED: "Concluído",
  READY_FOR_PICKUP: "Disponível",
  PICKED_UP: "Concluído (Retirado)",
  CANCELADO: "Cancelado",
};

export default function PremiumOrdersPage() {
  const [orders, setOrders] = useState<PremiumOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/premium-orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        toast.error(data.error || "Erro ao carregar pedidos");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const label = statusLabels[newStatus] || newStatus;
    setConfirmModal({
      isOpen: true,
      title: "Confirmar alteração",
      description: `Deseja realmente alterar o status deste pedido para "${label}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/premium-orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          if (res.ok) {
            toast.success(`Status atualizado para ${label}`);
            fetchData();
          } else {
            const data = await res.json();
            toast.error(data.error || "Erro ao atualizar status");
          }
        } catch (error) {
          toast.error("Erro de conexão");
        }
      },
      variant: newStatus === "CANCELADO" ? "destructive" : "default",
    });
  };

  const handlePrintLabel = (order: PremiumOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Etiqueta de Envio - ${order.user_name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .label { border: 2px solid #000; padding: 20px; max-width: 400px; border-radius: 10px; }
            .header { font-weight: bold; font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .field { margin-bottom: 10px; }
            .label-text { font-size: 10px; color: #666; text-transform: uppercase; }
            .value { font-size: 16px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">DESTINATÁRIO PREMIUM</div>
            <div class="field">
              <div class="label-text">Nome</div>
              <div class="value">${order.user_name}</div>
            </div>
            <div class="field">
              <div class="label-text">Endereço</div>
              <div class="value">${order.address_street}, ${order.address_number} ${order.address_complement ? '- ' + order.address_complement : ''}</div>
            </div>
            <div class="field">
              <div class="label-text">Bairro</div>
              <div class="value">${order.address_neighborhood}</div>
            </div>
            <div class="field">
              <div class="label-text">Cidade/UF</div>
              <div class="value">${order.address_city} - ${order.address_state}</div>
            </div>
            <div class="field">
              <div class="label-text">CEP</div>
              <div class="value">${order.address_cep}</div>
            </div>
            <div class="field" style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
              <div class="label-text">Item</div>
              <div class="value">${order.accessory_type} - ${order.accessory_model || "Padrão"}</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredOrders = orders
    .filter(o => 
      o.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address_cep?.includes(searchTerm) ||
      o.id.includes(searchTerm)
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8">
        <div className="space-y-1 sm:space-y-2">
          <span className="glass-dark px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            Logística Premium
          </span>
          <h2 className="text-xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-2 sm:mt-4">
            Pedidos <span className="text-brand-orange">Acessórios</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64 lg:w-80">
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
            <Input
              placeholder="Buscar pedidos..."
              className="pl-11 sm:pl-12 h-12 sm:h-14 bg-white border-brand-green/10 rounded-xl sm:rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full text-xs sm:text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 sm:h-14 px-4 sm:px-6 border-brand-black/10 bg-white rounded-xl sm:rounded-2xl text-brand-black font-black uppercase tracking-widest text-[8px] sm:text-[10px] hover:bg-brand-black hover:text-white transition-all flex-1 sm:flex-none gap-2 sm:gap-3"
                >
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-orange" />
                  <span>
                    {filterType === "recent" ? "Recentes" : "Antigas"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56 glass border-white/20 p-2 rounded-2xl shadow-2xl">
                <DropdownMenuItem 
                  onSelect={() => setFilterType("recent")}
                  className={cn(
                    "rounded-xl px-4 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                    filterType === "recent" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                  )}
                >
                  Mais Recentes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => setFilterType("old")}
                  className={cn(
                    "rounded-xl px-4 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                    filterType === "old" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                  )}
                >
                  Mais Antigas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 sm:py-24 grayscale opacity-30">
          <Loader2 className="animate-spin text-brand-black w-10 h-10 sm:w-12 sm:h-12" />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-12">
          <PremiumOrdersList 
            orders={paginatedOrders} 
            onUpdateStatus={updateStatus}
            onPrintLabel={handlePrintLabel}
          />

          {paginatedOrders.length === 0 && (
            <div className="text-center py-12 sm:py-24 glass rounded-[1.5rem] sm:rounded-[2.5rem] border-dashed border-brand-green/20">
              <PackageOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-brand-black/20" />
              <h3 className="text-lg sm:text-2xl font-black text-brand-black mb-1 sm:mb-2 uppercase tracking-tight">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm leading-relaxed px-4 font-medium">
                Não encontramos registros de pedidos de acessórios com esses critérios.
              </p>
            </div>
          )}

          <div className="pt-4 sm:pt-0">
            <AdminPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              itemName="pedidos"
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        variant={confirmModal.variant}
      />
    </div>
  );
}
