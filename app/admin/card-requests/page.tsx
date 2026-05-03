"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Loader2, CreditCard } from "lucide-react";
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
import { CardRequestContentTable } from "@/components/card-request-content-table";
import { MemberCardPreviewModal } from "@/components/modals/member-card-preview-modal";

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
  card_name: string;
  card_birth_date: string;
  card_qr_code_token: string;
  card_cvv: string;
}

export default function CardRequestsPage() {
  const [requests, setRequests] = useState<CardRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CardRequest | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/card-requests");
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      } else {
        toast.error(data.error || "Erro ao carregar solicitações");
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
    console.log("updateStatus called with:", id, newStatus);
    try {
      const res = await fetch(`/api/admin/card-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Status atualizado para ${newStatus}`);
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão");
    }
  };

  const handlePrintLabel = (request: CardRequest) => {
    console.log("handlePrintLabel called for:", request.full_name);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Etiqueta de Envio - ${request.full_name}</title>
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
            <div class="header">DESTINATÁRIO</div>
            <div class="field">
              <div class="label-text">Nome</div>
              <div class="value">${request.full_name}</div>
            </div>
            <div class="field">
              <div class="label-text">Endereço</div>
              <div class="value">${request.address}, ${request.number} ${request.complement ? '- ' + request.complement : ''}</div>
            </div>
            <div class="field">
              <div class="label-text">Bairro</div>
              <div class="value">${request.neighborhood}</div>
            </div>
            <div class="field">
              <div class="label-text">Cidade/UF</div>
              <div class="value">${request.city} - ${request.state}</div>
            </div>
            <div class="field">
              <div class="label-text">CEP</div>
              <div class="value">${request.cep}</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredRequests = requests
    .filter(r => 
      r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cep.includes(searchTerm)
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Gestão de Envios
          </span>
          <h2 className="text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
            Cartões <span className="text-brand-orange">Físicos</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
            <Input
              placeholder="Buscar solicitações..."
              className="pl-12 h-14 bg-white border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 px-6 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all flex-1 sm:flex-none gap-3"
                >
                  <Filter className="h-4 w-4 text-brand-orange" />
                  <span>
                    {filterType === "recent" ? "Recentes" : "Antigas"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-white/20 p-2 rounded-2xl">
                <DropdownMenuItem 
                  onSelect={() => setFilterType("recent")}
                  className={cn(
                    "rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                    filterType === "recent" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                  )}
                >
                  Mais Recentes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => setFilterType("old")}
                  className={cn(
                    "rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
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
        <div className="flex justify-center py-24 grayscale opacity-30">
          <Loader2 className="animate-spin text-brand-black w-12 h-12" />
        </div>
      ) : (
        <div className="space-y-12">
          <CardRequestContentTable 
            requests={paginatedRequests} 
            onView={(req) => { 
              setSelectedRequest(req); 
              setIsPreviewOpen(true); 
            }}
            onUpdateStatus={updateStatus}
            onPrintLabel={handlePrintLabel}
          />

          {paginatedRequests.length === 0 && (
            <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
              <div className="text-6xl mb-6 grayscale opacity-50">💳</div>
              <h3 className="text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                Nenhuma solicitação encontrada
              </h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed px-4 font-medium">
                Não encontramos registros com esses critérios de busca.
              </p>
            </div>
          )}

          <AdminPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRequests.length}
            itemsPerPage={itemsPerPage}
            itemName="solicitações"
          />
        </div>
      )}

      {isPreviewOpen && selectedRequest && (
        <MemberCardPreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          cardData={selectedRequest}
        />
      )}
    </div>
  );
}
